import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { Public, User } from 'src/common/decorators';
import { GoogleGuard } from 'src/common/guards';
import { LocalGuard } from 'src/common/guards/local';
import { User as UserEntity } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { LoginInput } from './dto/login.input';
import { RegisterInput } from './dto/register.input';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UsersService,
    private readonly jwt: JwtService,
    private readonly authService: AuthService,
  ) {}

  @HttpCode(204)
  @Post('/logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    req.session = null;
    req.logout();
    res.clearCookie('nest-server-cookie');
    res.send('');
  }

  //   @Public()
  //   @UseGuards(FacebookGuard)
  //   @Post('/facebook')
  //   async facebookLogin(@User() user: UserEntity) {
  //     return user;
  //   }
  @Public()
  @Post('/local')
  @UseGuards(LocalGuard)
  login(@Body() _loginInput: LoginInput, @User() user: UserEntity) {
    return { user };
  }

  @Public()
  @UseGuards(GoogleGuard)
  @Post('/google-login')
  async googleLogin(@User() user: UserEntity) {
    return { user };
  }
  @Public()
  @Post('/register')
  async register(@Body() registerInput: RegisterInput, @Req() req: Request) {
    const user = await this.authService.register(req, registerInput);
    return user;
  }
}
