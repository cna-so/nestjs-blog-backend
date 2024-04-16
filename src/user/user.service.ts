import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthUserDto } from './dto/auth-user.dto';
import {
  ComparePasswordWithHash,
  GenerateHashPassword,
} from '../lib/PasswordManager';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create({ email, password }: AuthUserDto) {
    if (await this.findUser(email)) {
      return new HttpException(
        'user with this email already exist',
        HttpStatus.BAD_REQUEST,
      );
    }
    const hash = await GenerateHashPassword(password);
    const generatedUser = this.userRepository.create({
      email,
      password: hash,
    });
    await this.userRepository.save(generatedUser);
    return { response: 'user successfully created' };
  }

  async login({ email, password }: AuthUserDto) {
    const user = await this.findUser(email);
    if (!user) {
      return new HttpException(
        'user with this email not already exist',
        HttpStatus.NOT_FOUND,
      );
    }

    const isPasswordMatch = await ComparePasswordWithHash(
      password,
      user.password,
    );
    if (!isPasswordMatch) {
      return new HttpException('password is not match', HttpStatus.BAD_REQUEST);
    }
    return { email: user.email, created_at: user.createdAt, id: user.id };
  }

  async findUser(email: string) {
    return await this.userRepository.findOne({ where: { email } });
  }
}
