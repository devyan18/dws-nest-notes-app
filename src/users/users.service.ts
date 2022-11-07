import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';
import { hash, compare } from 'bcrypt';
@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto) {
    const { password } = createUserDto;

    const hashedPassword = await hash(password, 10);

    const userWithHashedPassoword = {
      ...createUserDto,
      password: hashedPassword,
    };

    const createdUser = await this.userModel.create(userWithHashedPassoword);

    return createdUser;
  }

  async findAll() {
    return this.userModel.find().exec();
  }

  async findOne(userId: string) {
    return this.userModel.findOne({ _id: userId }).exec();
  }

  async update(userId: string, updateUserDto: UpdateUserDto) {
    return this.userModel.updateOne({ _id: userId }, updateUserDto).exec();
  }

  async remove(userId: string) {
    return this.userModel.deleteOne({ _id: userId }).exec();
  }

  async findCredentials(email: string, password: string) {
    const user = await this.userModel.findOne({ email }).exec();

    if (!user) {
      throw new HttpException('INVALID_CREDENTIALS', HttpStatus.UNAUTHORIZED);
    }

    const isPasswordValid = await this.comparePassword(password, user.password);

    if (!isPasswordValid) {
      throw new HttpException('INVALID_CREDENTIALS', HttpStatus.UNAUTHORIZED);
    }

    return user;
  }

  async hashPassword(password: string) {
    return hash(password, 10);
  }

  async comparePassword(password: string, hashedPassword: string) {
    return compare(password, hashedPassword);
  }
}
