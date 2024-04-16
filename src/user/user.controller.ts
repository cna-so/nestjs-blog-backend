import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthUserDto } from './dto/auth-user.dto';

@Controller('auth')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  create(@Body() createUserBody: AuthUserDto) {
    return this.userService.create(createUserBody);
  }

  @Post('login')
  login(@Body() loginUserBody: AuthUserDto) {
    return this.userService.login(loginUserBody);
  }
}
