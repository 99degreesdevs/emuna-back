import {
    createParamDecorator,
    ExecutionContext,
    BadRequestException,
  } from '@nestjs/common';
  
  export const ProcessProtected = createParamDecorator(
    (data: any, ctx: ExecutionContext) => {
      const req = ctx.switchToHttp().getRequest();
      const process = ['REGISTER', 'RECOVER','UPDATE', 'CHANGE'];
  
      const { params } = req;
  
      if (!process.includes(params.process.toUpperCase()))
        throw new BadRequestException('El parámetro de proceso ingresado es inválido.');
      return params.process;
    },
  );
  