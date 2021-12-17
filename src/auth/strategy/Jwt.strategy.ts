import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        (req) => {
          let token = null;
          if (req && req.cookies) {
            token = req.cookies['eventbuzz-jwt'] || req.session.eventBuzzjwt;
          }
          return token;
        },
      ]),
      secretOrKey: 'fsdxfsdfdsf',
    });
  }
  async validate(payload: { userId: string }) {
    return await this.authService.validate(payload.userId);
  }
}
