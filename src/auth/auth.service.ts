import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findCredentials(username, password);
    return user;
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.usersService.findCredentials(
      loginUserDto.email,
      loginUserDto.password,
    );

    if (!user) {
      return null;
    }

    const payload = { _id: user._id };
    return {
      Authorization: this.jwtService.sign(payload),
    };
  }

  async register(registerUserDto: RegisterUserDto) {
    const user = await this.usersService.create(registerUserDto);

    const payload = { _id: user._id };
    return {
      Authorization: this.jwtService.sign(payload),
    };
  }
}
