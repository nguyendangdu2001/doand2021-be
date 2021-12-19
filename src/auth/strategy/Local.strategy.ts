import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly jwt: JwtService,
  ) {
    super({ passReqToCallback: true });
  }
  async validate(req, userName: string, password: string, done) {
    try {
      const user = await this.authService.validateNormalUser(
        userName,
        password,
      );
      const signed = this.jwt.sign({ userId: user.id });

      req.session.eventBuzzjwt = signed;
      done(null, { ...user.toObject(), token: signed });
    } catch (error) {
      done(error);
    }
  }
}
