import {
  Controller,
  Get,
  Post,
  Body,
  Patch, 
  HttpCode,
  UnauthorizedException,
  Headers,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {  LoginAuthDto, RecoverAuthDto, CodeAuthDto, PasswordAuthDto } from './dto';  
import { ApiOperation, ApiResponse, ApiTags, ApiHeader, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { OriginRequestProtected } from './decorators/origin-request.decorator';
import { ProcessProtected } from './decorators/process.decorator';

@Controller('auth')
@ApiTags('Auth') 
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {}

  @Post('login') 
  @HttpCode(200)
  @ApiOperation({ summary: 'Login', description: 'Authenticate the user and return a JWT token.' })
  @ApiResponse({
    status: 200,
    description: 'Login successful. Returns a JWT token.',
    schema: {
      example: {
        "message": "Se inicio sesión correctamente",
        "userId": "9076eeb6-a891-4a13-81ed-cac848f1d6c4",
        "email": "cuenta@correo.com",
        "fullName": "Otilio Betancur",
        "roles": [
          "user",
          "admin",
          "master"
        ],
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkfXVCJ9.eyJ1c2VySWQiOiI5MDc2ZWViNi1hODkxLTRhMTMtODFlZC1jYWM4NDhmMWQ2YzQiLCJpYXQiOjE3MjQ1OTkyMjgsImV4cCI6MTcyNDYyODAyOH0.7qUFYhrwGFjPIRwDZGRqFO1Q_-9s7QUv332o36vu0c8"
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request: Invalid input data.',
    schema: {
      example: {
        statusCode: 400,
        message: 'Invalid login credentials',
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized: Authentication failed.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error: An unexpected error occurred.',
  })
  login(@Body() loginAuthDto: LoginAuthDto) {
    return this.authService.login(loginAuthDto);
  }

  @Get('check-status') 
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Check Status', description: 'Verify the validity of the current token and the status of the user session.' }) 
  @ApiResponse({
    status: 200,
    description: 'Token is valid and the user session is active.',
    schema: {
      example: {
        "response": {
          "message": "Sesión vigente.",
          "userId": "9076eeb6-a891-4a13-81ed-cac848f1d6c4",
          "email": "cuenta@correo.com",
          "fullName": "Otilio Betancur",
          "roles": [
            "user",
            "admin",
            "master"
          ]
        },
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXKCJ9.eyJ1c2VySWQiOiI5MDc2ZWViNi1hODkxLTRhMTMtODFlZC1jYWM4NDhmMWQ2YzQiLCJpYXQiOjE3MjQxMDQzNDQsImV4cCI6MTcyNDEzMzE0NH0.Abdb8VYsTiHkd4WszLAXDMmlX8nRHbohICQOOTAcQP4"
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request: Invalid token or request format.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized: Token is required or invalid.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error: An unexpected error occurred.',
  })
  checkStatus(@Headers('authorization') authorization: string) {
    if (!authorization) {
      throw new UnauthorizedException('Token is required');
    }
    const bearerToken = authorization.split(' ')[1]; 
    return this.authService.checkStatus(bearerToken);
  }

  @Post('recovery/:origin') 
  @HttpCode(200)
  @ApiOperation({
    summary: 'Account Recovery',
    description: 'Initiate the account recovery process. This requires the recovery email or phone number, and the origin of the request.',
  })
  @ApiParam({
    name: 'origin',
    description: 'The origin of the recovery request (e.g., email, phone).',
    example: 'email',
  })
  @ApiResponse({
    status: 200,
    description: 'Recovery process initiated. A recovery code is sent to the user.',
    schema: {
      example: {
        "message": "¡El código ingresado ha sido validado exitosamente!",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJoYXNoIjoiMmYwM2VjMzAtODg0MC00ZDk2LTgzYTYtMWQ0MjQ1Yzg4ZGY1IiwiaWQiOjEyLCJpYXQiOjE3MjQxMTQ2NjcsImV4cCI6MTcyNDE0MzQ2N30.IiQAcn6ki-Y59c6a0N7TQ_I9HbFwdwG4LQ0Kb1ksxpk"
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request: Invalid DTO or origin.',
    schema: {
      example: {
        statusCode: 400,
        message: 'Invalid recovery request',
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error: An unexpected error occurred.',
  })
  recovery(
    @Body() recoverAuthDto: RecoverAuthDto,
    @OriginRequestProtected() origin: string,
  ) {
    return this.authService.recoveryOPT(recoverAuthDto, origin);
  }

  @Post('recovery/resend/:origin')
  @HttpCode(200) 
  @ApiHeader({ name: 'x-api-key', description: 'API key required for resending the recovery code.' })
  @ApiOperation({
    summary: 'Resend Validation Code',
    description: 'Resend the validation code to the user based on the origin and provided API key.',
  })
  @ApiParam({
    name: 'origin',
    description: 'The origin from which the code should be resent (e.g., email, phone).',
    example: 'email',
  })
  @ApiHeader({
    name: 'x-api-key',
    description: 'API key required for resending the validation code.',
  })
  @ApiResponse({
    status: 200,
    description: 'Validation code resent successfully.',
    schema: {
      example: {
        "message": "Se ha reenviado el código de validación a su correo electrónico."
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request: Invalid API key or origin.',
    schema: {
      example: {
        statusCode: 400,
        message: 'Invalid API key or origin',
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error: An unexpected error occurred.',
  })
  postSendCode( 
    @OriginRequestProtected() origin: string,
    @Headers() headers: any,
  ) {
    const token = headers['x-api-key']; 
    return this.authService.resendHash(origin, token);
  }

  @Post('validation/:process')
  @HttpCode(200) 
  @ApiHeader({ name: 'x-api-key', description: 'API key required for code validation.' })
  @ApiOperation({
    summary: 'Code Validation',
    description: 'Validate the recovery code using the provided process type and API key.',
  })
  @ApiParam({
    name: 'process',
    description: 'The process type for validation (e.g., email, phone).',
    example: 'email',
  })
  @ApiHeader({
    name: 'x-api-key',
    description: 'API key required for code validation.',
  })
  @ApiResponse({
    status: 200,
    description: 'Code validated successfully.',
    schema: {
      example: {
        "message": "¡El código ingresado ha sido validado exitosamente!",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJoYXNoIjoiMmYwM2VjMzAtODg0MC00ZDk2LTgzYTYtMWQ0MjQ1Yzg4ZGY1IiwiaWQiOjEyLCJpYXQiOjE3MjQxMTQ2NjcsImV4cCI6MTcyNDE0MzQ2N30.IiQAcn6ki-Y59c6a0N7TQ_I9HbFwdwG4LQ0Kb1ksxpk"
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request: Invalid code, API key, or process type.',
    schema: {
      example: {
        statusCode: 400,
        message: 'Invalid code or process type',
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error: An unexpected error occurred.',
  })
  postHashValidation( 
    @Body() codeAuthDto: CodeAuthDto, 
    @ProcessProtected() process: string,
    @Headers() headers: any,
  ) {
    const token = headers['x-api-key']; 
    return this.authService.hashValidation(codeAuthDto, process, token);
  }

  @Patch('password/:process') 
  @ApiHeader({ name: 'x-api-key', description: 'API key required for updating the password.' })
  @ApiOperation({
    summary: 'Update Password',
    description: 'Update the user\'s password using the provided process type and API key.',
  })
  @ApiParam({
    name: 'process',
    description: 'The process type for password update (e.g., email, phone).',
    example: 'email',
  })
  @ApiHeader({
    name: 'x-api-key',
    description: 'API key required for updating the password.',
  })
  @ApiResponse({
    status: 200,
    description: 'Password updated successfully.',
    schema: {
      example: {
        "message": "¡La contraseña ha sido actualizada exitosamente!"
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request: Invalid API key, password, or process type.',
    schema: {
      example: {
        statusCode: 400,
        message: 'Invalid password or process type',
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error: An unexpected error occurred.',
  })
  postUpdatePassword( 
    @Body() passwordAuthDto: PasswordAuthDto, 
    @ProcessProtected() process: string,
    @Headers() headers: any,
  ) {
    const token = headers['x-api-key'];  
    return this.authService.updatePassword(passwordAuthDto, process, token);
  }
}
