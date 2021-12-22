import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { AuthService } from './auth.service';
// import { FacebookStrategy } from './strategy/FacebookToken.strategy';
// import { SessionSerializer } from './session.serializer';
import { GoogleStrategy } from './strategy/GoogleToken.strategy';
import { JwtModule } from '@nestjs/jwt';
// import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
// import { AuthResolver } from './auth.resolver';
import { JwtStrategy } from './strategy/Jwt.strategy';
import { LocalStrategy } from './strategy/Local.strategy';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    UsersModule,
    PassportModule.register({}),
    // JwtModule.register({ secret: 'fsdxfsdfdsf' }),
  ],
  providers: [AuthService, GoogleStrategy, JwtStrategy, LocalStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
