import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { User, UserEntity } from './entities/user.entity';
import { DeleteResult, Repository } from 'typeorm';
import { CreateUserDto, UpdateUserDto } from './dto/user.schema';
import { sendEmail } from 'src/utils/resend';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  async createUser(user: CreateUserDto) {
    const existingUser = await this.retrieveUserByEmail(user.email);

    if (existingUser) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    const User = await this.usersRepository.save(user);
    await sendEmail({
      receiverEmail: User.email,
      subject: 'Email Verification',
      userId: User.id.toString(),
    });
    return User;
  }

  async retrieveAllUsers(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async retrieveUserById(id: number): Promise<User> {
    return this.usersRepository.findOne({
      where: {
        id: id,
      },
    });
  }

  async retrieveUserByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({
      where: {
        email: email,
      },
    });
  }

  async updateUserStatusById(id: number): Promise<User> {
    await this.usersRepository.update(id, {
      isActive: true,
    });
    return this.retrieveUserById(id);
  }

  async updateUserById(id: number, user: UpdateUserDto): Promise<User> {
    await this.usersRepository.update(id, user);
    return this.retrieveUserById(id);
  }

  async deleteUserById(id: number): Promise<DeleteResult> {
    return this.usersRepository.delete(id);
  }
}
