import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { JwtPayload } from '../interfaces';
import { Users } from 'src/users/entities';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject('USERS_REPOSITORY')
    private readonly usersRepository: typeof Users,

    configService: ConfigService,
  ) {
    super({
      secretOrKey: configService.get('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate( payload: JwtPayload ): Promise<Users> {
    const { userId } = payload; 
    const user = await this.usersRepository.findByPk(userId, {
      attributes: { exclude: ['password', 'deletedAt'] },
    }); 

    if (!user) throw new UnauthorizedException('Token not valid');

/*     if (!user.deletedAt)
      throw new UnauthorizedException(
        'El usuario esta inactivo y/o a sido eliminado, hable con el administrador.',
      ); */

    return user;
  }
}
