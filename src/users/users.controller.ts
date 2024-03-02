import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UsePipes,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  CreateUserDto,
  UpdateUserDto,
  createUserSchema,
  updateUserSchema,
} from './dto/user.schema';
import { ZodValidationPipe } from 'src/utils/validationPipe';
import { User } from './entities/user.entity';
import { DeleteResult } from 'typeorm';
import { Public } from 'src/utils/middlewares';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createUserSchema))
  async createUser(@Body() user: CreateUserDto) {
    return this.userService.createUser(user);
  }

  @Public()
  @Get()
  async retrieveAllUsers(): Promise<User[]> {
    return this.userService.retrieveAllUsers();
  }

  @Get(':id')
  async retrieveUserById(@Param('id') id: string): Promise<User> {
    return this.userService.retrieveUserById(+id);
  }

  @Put(':id')
  @UsePipes(new ZodValidationPipe(updateUserSchema))
  async updateUserById(
    @Param('id') id: string,
    @Body() user: UpdateUserDto,
  ): Promise<User> {
    return this.userService.updateUserById(+id, user);
  }

  @Delete(':id')
  async deleteUserById(@Param('id') id: string): Promise<DeleteResult> {
    return this.userService.deleteUserById(+id);
  }
}
