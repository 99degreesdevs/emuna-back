import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateUserDto,
  UpdateUserDto,
  PageOptionsDto,
  PageMetaDto,
} from './dto';
import { Users } from './entities';
import * as bcrypt from 'bcrypt';
import { Transaction } from 'sequelize';
import { Fiscal } from 'src/fiscal/entities';
import { CreateClientDto } from './dto/create-client.dto';

@Injectable()
export class UsersService {
  private readonly usersLogger = new Logger('Users Service');
  constructor(
    @Inject('USERS_REPOSITORY')
    private readonly userRepository: typeof Users,

    @Inject('FISCAL_REPOSITORY')
    private readonly fiscalDatumRepository: typeof Fiscal,

  ) { }

  async create(createUserDto: CreateUserDto) {

    const { password, email, RFC = "", ...userData } = createUserDto;

    await this.checkIfEmailExists(email);
    await this.checkIfRFCExists(RFC);

    const transaction: Transaction = await this.userRepository.sequelize.transaction();
    try {

      const hashedPassword = bcrypt.hashSync(password, 10);
      const user = await this.userRepository
        .create({
          ...createUserDto,
          password: hashedPassword,
        }, { transaction, });

      if (!user) {
        throw new BadRequestException('No se pudo crear el usuario');
      }


      const fiscalData = await this.fiscalDatumRepository.create({
        ...createUserDto,
        userId: user.userId
      }, { transaction });

      await transaction.commit();

      const { roles, avatar, ...restUser } = user.dataValues;
      const { createdAt, updatedAt, deletedAt, userId, id, ...restFiscalData } = fiscalData.dataValues;

      return {
        message: `Se creó el usuario exitosamente`,
        user: {
          ...restUser,
          ...restFiscalData
        }
      };
    } catch (error) {
      await transaction.rollback();
      this.handleError(error);
    }

  }

  private async checkIfEmailExists(email: string) {
    const existingEmail = await this.userRepository.findOne({ where: { email } });
    if (existingEmail) {
      throw new BadRequestException(`La dirección de correo electrónico ${email} ya está registrada`);
    }
  }

  private async checkIfRFCExists(RFC: string) {
    const existingRFC = await this.fiscalDatumRepository.findOne({ where: { RFC } });
    if (existingRFC) {
      throw new BadRequestException(`El RFC ${RFC} ya está registrado, por favor verifique sus datos`);
    }
  }

  async findAll() {
    try {
      const { rows, count } = await this.userRepository.findAndCountAll({
        attributes: { exclude: ['password', 'deletedAt'] },
      });

      if (count === 0) {
        throw new NotFoundException('Actualmente no hay registros de usuarios disponibles. Por favor, intente nuevamente más tarde.');
      }

      return {
        message: `Se han cargado exitosamente ${count} usuarios.`,
        users: rows,
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  async findAllPage(pageOptionsDto: PageOptionsDto) {
    try {

      const itemCount = await this.userRepository.count();
      const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

      const users = await this.userRepository.findAll({
        offset: (pageOptionsDto.page - 1) * pageOptionsDto.take,
        limit: pageOptionsDto.take,
        order: [['createdAt', pageOptionsDto.order]],
        attributes: { exclude: ['password', 'deletedAt'] },
      });

      if (users.length === 0) {
        throw new NotFoundException('Actualmente no hay registros de usuarios disponibles. Por favor, intente nuevamente más tarde.');
      }

      return {
        message: 'ok',
        users,
        meta: pageMetaDto,
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  async findOne(userId: string) {
    try {
      const user = await this.userRepository.findByPk(userId, {
        attributes: { exclude: ['password', 'deletedAt'] },
        include: [{
          model: Fiscal,
          foreignKey: 'userId',
          as: 'fiscalUsers',
          attributes: { exclude: ['userId', 'deletedAt'] }
        }]
      });

      if (!user) {
        throw new NotFoundException(`El usuario con el ID ${userId} no se encuentra registrado.`);
      }

      const { fiscalUsers, ...restUser } = user.dataValues;
      const { id, ...restData } = fiscalUsers[0]?.dataValues ? fiscalUsers[0].dataValues : { id: null };

      return {
        user: {
          message: `Usuario con el ID ${userId} cargado exitosamente`,
          ...restUser,
          ...restData
        }
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  async update(userId: string, updateUserDto: UpdateUserDto) {

    try {
      const user = await this.userRepository.findByPk(userId);

      if (!user) {
        throw new NotFoundException(`El usuario con el ID ${userId} no se encuentra registrado.`);
      }

      const { email, ...updateUserDtoRest } = updateUserDto;

      const userUpdate = await this.userRepository.update(
        { ...updateUserDtoRest },
        { where: { userId }, returning: true, individualHooks: true }
      );

      const fiscalDataUpdate = await this.fiscalDatumRepository.update(
        { ...updateUserDtoRest },
        { where: { userId }, returning: true, individualHooks: true }
      );

      const { roles, avatar, ...restUser } = userUpdate[1][0].dataValues;
      const { createdAt, updatedAt, deletedAt, id, ...restFiscalData } = fiscalDataUpdate[1][0]?.dataValues || { id: null };

      return {
        message: `El usuario asociado al ID ${userId} ha sido actualizado con éxito.`,
        user: { ...restUser, ...restFiscalData }
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  async remove(userId: string) {
    try {
      const user = await this.userRepository.findByPk(userId);
      if (!user) {
        throw new NotFoundException(`El usuario con el id ${userId} no existe.`);
      }

      await this.userRepository.destroy({
        where: { userId },
        individualHooks: true,
        cascade: true
      });

      return {
        message: `Se eliminó correctamente el usuario con el id ${userId}`,
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  async createClient(createClientDto: CreateClientDto) {
    const { password, email, ...userData } = createClientDto;

    await this.checkIfEmailExists(email);

    try {
      const hashedPassword = bcrypt.hashSync(password, 10);
      const user = await this.userRepository.create({
        ...createClientDto,
        password: hashedPassword
      });

      if (!user) {
        throw new BadRequestException('No se pudo crear la cuenta');
      }

      const { roles, avatar, password: _, ...restUser } = user.dataValues;

      return {
        message: `Cuenta creada exitosamente`,
        user: restUser
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  private handleError(error: any) {
    if (error?.parent?.code === '23503') {
      throw new BadRequestException('Error en los datos proporcionados', error?.parent?.detail);
    } else if (error.status === 404) {
      throw new NotFoundException(error.message);
    } else if (error.status === 400) {
      throw new BadRequestException(error.message);
    } else {
      console.log(error)
      this.usersLogger.error('Error:', error.message, error.stack);
      throw new InternalServerErrorException('Consulte al administrador');
    }
  }
}
