import {
  createParamDecorator,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';

export const OriginRequestProtected = createParamDecorator(
  (data: any, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const origins = ['APP', 'WEB'];

    const { params } = req;

    if (!origins.includes(params.origin.toUpperCase()))
      throw new BadRequestException('La fuente de la solicitud no es válida.');
    return params.origin;
  },
);
