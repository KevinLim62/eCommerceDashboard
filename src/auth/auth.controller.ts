import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UsePipes,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ZodValidationPipe } from 'src/utils/validationPipe';
import { UserSignInDto, userSignInSchema } from './dto/auth.schema';
import { Public } from 'src/utils/middlewares';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('signIn')
  @UsePipes(new ZodValidationPipe(userSignInSchema))
  signIn(@Body() UsersignInDto: UserSignInDto) {
    return this.authService.signIn(UsersignInDto.email, UsersignInDto.password);
  }
}
