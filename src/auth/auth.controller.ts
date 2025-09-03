import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

interface UserDto {
  email: string;
  password: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('log-in')
  logIn() {
    return 'logIn';
  }

  @Get('user')
  getUser() {
    return this.authService.getUser();
  }

  @Post('sign-up')
  signUp(@Body() user: UserDto) {
    return this.authService.signUp(user.email, user.password);
  }
}
