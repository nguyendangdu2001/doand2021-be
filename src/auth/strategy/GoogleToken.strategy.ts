import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import GoogleIdTokenStrategy from 'passport-google-id-token';
import { AuthService } from '../auth.service';
import { GoogleProfile } from '../interface/GoogleProfile.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class GoogleStrategy extends PassportStrategy(
  GoogleIdTokenStrategy as any,
  'google-id-token',
) {
  constructor(
    private authService: AuthService,
    private readonly jwt: JwtService,
  ) {
    super({
      clientID:
        '273628985067-j8hb4td82dvf1cj2sjc0hsjijlp92kla.apps.googleusercontent.com',
      clientSecret: '6Z9wtbCHi9xDcH_y1irhV6v0',
      passReqToCallback: true,
    });
  }
  async validate(
    req,
    profile: GoogleProfile,
    googleId: string,
    done: (error: any, user?: any, info?: any) => void,
  ) {
    try {
      console.log('in google', profile, req.res.cookie);
      const user = await this.authService.validateGoogleUser(googleId, profile);
      console.log(req.session.eventBuzzjwt);
      const signed = this.jwt.sign({ userId: user.id });
      console.log(signed);

      req.session.eventBuzzjwt = signed;
      done(null, { ...user.toObject(), token: signed });
    } catch (error) {
      done(error);
    }
  }
}
