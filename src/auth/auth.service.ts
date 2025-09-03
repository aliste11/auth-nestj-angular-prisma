import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { encrytp } from 'src/libs/bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService
  ) { }
  async getUser() {
    return await this.prismaService.user.findMany();
  }

  async logIn(email: string, password: string) {
    try {
      // si es que existe el correo
      const user = await this.prismaService.user.findUnique({
        where: {
          email,
        },
      });

      if (!user) {
        throw new BadRequestException('credenciales invalidas');
      }

      const isPasswordMatch = await compare(password, user.password);
      if (!isPasswordMatch) {
        throw new BadRequestException('credenciales invalidas');
      }
      const { password: _, ...userWhithoutPassword } = user;

      const payload = {
        ...userWhithoutPassword,
      };
      const access_token = await this.jwtService.signAsync(payload);
      return { access_token };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new InternalServerErrorException('Error al iniciar sesion');
      }
    }
  }

  async signUp(email: string, password: string) {
    try {
      const userFound = await this.prismaService.user.findUnique({
        where: {
          email,
        },
      });

      if (userFound) throw new BadRequestException('el usuario ya existe');

      const hashedPassword = await encrytp(password);

      const newUser = await this.prismaService.user.create({
        data: {
          email,
          password: hashedPassword,
        },
      });
      const { password: _, ...userWhithoutPassword } = newUser;
      const payload = { ...userWhithoutPassword };
      const access_token = await this.jwtService.signAsync(payload);
      return { access_token };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new Error(error);
    }
  }
}
