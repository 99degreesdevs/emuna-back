import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginAuthDto } from './dto/login.dto';
import { Users } from 'src/users/entities';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RecoverAuthDto } from './dto/recover-auth.dto';
import { Auth } from './entities';
import { ConfigService } from '@nestjs/config';
import { MailService } from 'src/mail/mail.service';
import { CodeAuthDto, PasswordAuthDto } from './dto';
import { CreateAuthDto } from './dto/create-auth.dto';
const { Op } = require('sequelize');
@Injectable()
export class AuthService {
  constructor(
    @Inject('USERS_REPOSITORY')
    private readonly usersRepository: typeof Users,

    @Inject('AUTH_REPOSITORY')
    private readonly authRepository: typeof Auth,

    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailservice: MailService,
  ) { }

  async login(loginAuthDto: LoginAuthDto) {

    const { password, email } = loginAuthDto;

    const user = await this.usersRepository.findOne({
      where: { email },
      attributes: ['email', 'password', 'userId', 'roles', 'name'],
    });

    if (!user || !bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException(
        'Lo sentimos, el password y/o email proporcionados son incorrectos. ',
      );

    const token = this.jwtService.sign({ userId: user.userId });


    return {
      message: 'Se inicio sesión correctamente',
      userId: user.userId,
      email: user.email,
      fullName: user.name,
      roles: user.roles,
      token
    };
  } 

  async checkStatus(token: string) {
    try {

      const { userId } = await this.jwtService.verify(token);

      const user = await this.usersRepository.findOne({
        where: { userId },
        attributes: ['email', 'password', 'userId', 'roles', 'name',],
      });

      if (!user) {
        throw new NotFoundException('Usuario no encontrado.');
      }

      return {
        message: 'Sesión vigente.',
        userId: user.userId,
        email: user.email,
        fullName: user.name,
        roles: user.roles,
        token: this.jwtService.sign({ userId }),
      };

    } catch (error) {
      throw new BadRequestException(
        'Lo sentimos, el token de autenticación proporcionado no es válido o está vacio',
      );
    }
  }

  async recoveryOPT(recoveryAuthDto: RecoverAuthDto, origin: string) {

    const { email } = recoveryAuthDto;

    const user = await this.usersRepository.findOne({
      where: { email },
    });

    if (!user)
      throw new NotFoundException(
        `Lo sentimos, el correo electrónico ingresado no está registrado en nuestro sistema. `,
      );

    await this.authRepository
      .findOne({
        where: {
          email,
          process: 'RECOVER',
          status: 'OPEN',
          expiration: { [Op.gt]: new Date() },
        },
      })
      .then((resp) => {
        if (resp) {
          this.authRepository
            .update({ status: 'CANCEL' }, { where: { id: resp.id } })
            .then(() => {
              this.authRepository.destroy({
                where: { id: resp.id },
                individualHooks: true,
              });
            });
        }
      })
      .catch((err) => this.errorEvent(err));

    return await this.authRepository
      .create({ email, origin, process: 'RECOVER' })
      .then((resp) => {
        const token = this.jwtService.sign({ hash: resp.hash, id: resp.id });
        const link =
          origin.toUpperCase().trim() === 'WEB'
            ? `${this.configService.get<string>('HOST')}/#/auth/verification?token-recover=${token}&code=${resp.code}`
            : undefined;

        this.mailservice.recoverPassword(
          email,
          link,
          resp.code,
          origin.toUpperCase().trim(),
        );

        return {
          message: `Se envió un código de validación a la cuenta ${email}.`,
          email,
          token,
        };
      })
      .catch((err) => this.errorEvent(err));
  }

  async resendHash(origin: string, token: string) {

    if (!token)
      throw new BadRequestException(
        'Lo sentimos, el token de autenticación (X-API-Token) proporcionado está vacío.',
      );

    try {

      const { id } = await this.jwtService.verify(token);

      return await this.authRepository
        .findOne({
          where: {
            id,
            status: 'OPEN',
            expiration: { [Op.gt]: new Date() },
          },
        })
        .then((resp) => {
          if (!resp)
            throw new BadRequestException(
              'La solicitud para la recuperación de contraseña a caducado, intente de nuevo.',
            );

          const { email, code } = resp;

          const link =
            origin.toUpperCase().trim() === 'WEB'
              ? `${process.env.HOST}/#/auth/verification?token-recover=${token}&code=${code}`
              : undefined;

          this.mailservice.recoverPassword(
            email,
            link,
            code,
            origin.toUpperCase().trim(),
          );

          return {
            message: `Se ha reenviado el código de validación a su correo electrónico.`,
          };
        });

    } catch (error) {
      throw new BadRequestException(
        'Lo sentimos, el token de autenticación (X-API-Token) proporcionado no es válido',
      );
    }
  }

  async hashValidation(
    codeAuthDto: CodeAuthDto,
    process: string,
    token: string,
  ) {
    try {


      const code = codeAuthDto.code;
      const { hash, id } = await this.jwtService.verify(token);



      switch (process.toUpperCase()) {
        case 'RECOVER':
          return await this.authRepository
            .findOne({
              where: {
                hash,
                id,
                status: 'OPEN',
                process: process.toUpperCase(),
                expiration: { [Op.gt]: new Date() },
              },
            })
            .then(async (resp) => {
              if (!resp)
                throw new UnauthorizedException(
                  'Lo sentimos, el token de autenticación (X-API-KEY) proporcionado no es válido o el código ya ha sido validado.',
                );
              if (code !== resp.code)
                throw new BadRequestException(
                  `El código de validación ingresado es incorrecto. Por favor, asegúrese de ingresar  el código correctamente y vuelva a intentarlo.`,
                );
              return await this.authRepository
                .update(
                  { ...resp, status: 'VALIDATED' },
                  {
                    where: { id: resp.id },
                    returning: true,
                    individualHooks: true,
                  },
                )
                .then((respUpdate) => {
                  return {
                    message: `¡El código ingresado ha sido validado exitosamente!`,
                    token: this.jwtService.sign({
                      hash: respUpdate[1][0].dataValues.hash,
                      id: resp.id,
                    }),
                  };
                }).catch((err) => this.errorEvent(err));
            });

          break;

        default:
          throw new BadRequestException('Invalid process type.');
          break;
      }

    } catch (error) {
      throw new UnauthorizedException(
        'Lo sentimos, el token de autenticación (X-API-KEY) proporcionado no es válido o está vacio',
      );
    }
  }

  async updatePassword(passwordAuthDto: PasswordAuthDto, process: string, token: string) {

    try {  
      await this.jwtService.verify(token);
    } catch (error) {
      console.log(  error);
      throw new UnauthorizedException(
        'Lo sentimos, el token de autenticación (X-API-KEY) proporcionado no es válido o está vacio.',
      );
    }

    const { password } = passwordAuthDto;
    const { hash, id } = await this.jwtService.verify(token);

    switch (process.toUpperCase()) {
      case 'UPDATE': 
        return await this.authRepository.findOne({
          where: {
            hash,
            id,
            status: 'VALIDATED',
            expiration: { [Op.gt]: new Date() },
          },
        }).then(async (resp) => {  
          if (!resp)
            throw new UnauthorizedException(
              'Lo sentimos, el token de autenticación (X-API-KEY) proporcionado no es válido.',
            );

          return await this.usersRepository.findOne({
            where: { email: resp.email }
          }).then(async (user) => {
            if (
              user &&
              bcrypt.compareSync(password, user.password)
            )
              throw new BadRequestException(
                `La contraseña debe ser diferente a la anterior. Por favor, elija una nueva contraseña que no haya sido utilizada anteriormente.`,
              );

            await this.usersRepository.update(
              { password: bcrypt.hashSync(password, 10) },
              { where: { userId: user.userId }, individualHooks: true },
            );

            await this.authRepository.update(
              {
                ...resp,
                status: 'CLOSE',
              },
              { where: { id: resp.id } }
            ).then(() => {
              this.authRepository.destroy({ where: { id: resp.id } });
            })

            await this.mailservice.updatedPassword(resp.email);

            return { message: '¡La contraseña ha sido actualizada exitosamente!' }

          })
        })

        break;

      default:
        throw new BadRequestException('Invalid process type.');
        break;
    }




  }

  errorEvent(err) {
    console.log(err);
    throw new InternalServerErrorException('Consulte al administrador');
  }
}
