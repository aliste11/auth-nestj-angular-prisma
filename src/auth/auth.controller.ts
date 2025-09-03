import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

interface UserDto {
  email: string;
  password: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('log-in')
  async logIn(@Body() user: UserDto) {
    return await this.authService.logIn(user.email, user.password);
  }

  @Get('user')
  getUser() {
    return this.authService.getUser();
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('sign-up')
  signUp(@Body() user: UserDto) {
    return this.authService.signUp(user.email, user.password);
  }
}
