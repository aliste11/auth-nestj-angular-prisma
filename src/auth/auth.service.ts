import { BadRequestException, Injectable } from '@nestjs/common';
import { encrytp } from 'src/libs/bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}
  async getUser() {
    return await this.prismaService.user.findMany();
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
      return userWhithoutPassword;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new Error(error);
    }
  }
}
