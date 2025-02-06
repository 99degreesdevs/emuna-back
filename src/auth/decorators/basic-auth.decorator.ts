import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
export const BasicAuthProtected = createParamDecorator(
  (data: any, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const { rawHeaders } = req;
    const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
    const [username, password] = Buffer.from(b64auth, 'base64')
      .toString()
      .split(':');
    if (
      `${process.env.ADMIN_USER}` !== username.trim() &&
      `${process.env.ADMIN_PASSWORD}` == password.trim()
    ) {
      throw new UnauthorizedException(
        'The provided authorization credentials are incorrect. Please verify your credentials and try again.',
      );
    }
    return true;
  },
);
