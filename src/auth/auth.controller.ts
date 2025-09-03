import { Controller, Get } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  @Get('log-in')
  logIn() {
    return 'logIn';
  }

  @Get('sign-up')
  signUp() {
    return [];
  }
}
