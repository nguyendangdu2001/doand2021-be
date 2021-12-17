import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { AuthenticatedGuard } from './common/guards/authenticated';
import { UsersModule } from './users/users.module';
import { MessagesModule } from './messages/messages.module';
import { ChatRoomsModule } from './chat-rooms/chat-rooms.module';
import { FriendsModule } from './friends/friends.module';
import { RelationModule } from './relation/relation.module';
import { FriendInvitationsModule } from './friend-invitations/friend-invitations.module';
import { AppGateway } from './app.gateway';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
        useNewUrlParser: true,
        useUnifiedTopology: true,
        // useCreateIndex: true,
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      envFilePath: ['.env.development.local', '.env.development'],
      isGlobal: true,
    }),
    UsersModule,
    AuthModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'distClient'),
    }),
    MessagesModule,
    ChatRoomsModule,
    FriendsModule,
    RelationModule,
    FriendInvitationsModule,
    {
      ...JwtModule.register({
        secret: 'fsdxfsdfdsf',
      }),
      global: true,
    },
  ],
  controllers: [],
  providers: [{ provide: APP_GUARD, useClass: AuthenticatedGuard }, AppGateway],
})
export class AppModule {}
