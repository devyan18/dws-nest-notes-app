import { IsEmail, IsNotEmpty, Length } from 'class-validator';
import { User } from '../schemas/user.schema';

export class CreateUserDto extends User {
  @IsNotEmpty()
  @Length(4, 20)
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Length(6, 20)
  password: string;
}
