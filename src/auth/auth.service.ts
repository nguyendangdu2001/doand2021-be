import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
// import { Profile } from 'passport-facebook-token';
import { UsersService } from 'src/users/users.service';
import { RegisterInput } from './dto/register.input';
import { GoogleProfile } from './interface/GoogleProfile.interface';
import { hash, compare } from 'bcrypt';
import { Request } from 'express';
import { WsException } from '@nestjs/websockets';
@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private readonly jwt: JwtService,
  ) {}

  // async validateFacebookUser(profile: Profile) {
  //   try {
  //     const user = await this.userService.findOrCreateFacebookUser(profile);
  //     return user;
  //   } catch (error) {
  //     throw new UnauthorizedException();
  //   }
  // }
  async validate(userId: string) {
    try {
      console.log('validate');

      const user = await this.userService.findOneById(userId);
      if (!user) throw new UnauthorizedException();
      return user;
    } catch (error) {
      return null;
    }
  }
  async validateGoogleUser(googleId: string, profile: GoogleProfile) {
    try {
      console.log('validate');

      const user = await this.userService.findOrCreateGoogleUser(
        googleId,
        profile,
      );
      return user;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
  async validateNormalUser(userName: string, password: string) {
    const user = await this.userService.findByUserName(userName);
    if (!user) throw new BadRequestException();
    const passwordCheck = await compare(password, user.password);
    if (!passwordCheck)
      throw new NotAcceptableException('Username or Password not correct');
    return user;
  }
  async validateWsUser(token: string) {
    const data = this.jwt.verify<{ userId: string }>(token);
    console.log(data);

    if (!data) throw new WsException('UnAuthorized');
    try {
      return await this.validate(data?.userId);
    } catch (error) {
      throw new WsException('UnAuthorized');
    }
  }
  async register(req: Request, registerInput: RegisterInput) {
    const checkExist = await this.userService.findOne({
      userName: registerInput.userName,
    });
    if (checkExist) throw new Error('Username exist');
    const user = await this.userService.create({
      ...registerInput,
      password: await hash(registerInput.password, 'ssdfsaafd'),
    });
    const signed = this.jwt.sign({ userId: user.id });
    console.log(signed);

    req.session.eventBuzzjwt = signed;
    return { ...user.toObject(), token: signed, id: user.id };
  }
}
