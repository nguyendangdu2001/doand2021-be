// import { UseGuards } from '@nestjs/common';
// import {
//   Args,
//   Context,
//   Field,
//   Mutation,
//   ObjectType,
//   Resolver,
//   GqlContextType,
//   OmitType,
// } from '@nestjs/graphql';
// import { JwtService } from '@nestjs/jwt';
// import { Public, User } from 'src/common/decorators';
// import { GoogleGuard } from 'src/common/guards';
// import { LocalGuard } from 'src/common/guards/local';
// import { User as UserEntity } from 'src/users/entities/user.entity';
// import { UsersService } from 'src/users/users.service';
// import { AuthService } from './auth.service';
// import { LoginInput } from './dto/login.input';
// import { RegisterInput } from './dto/register.input';

// @ObjectType()
// class LoginReturn extends OmitType(UserEntity, ['password']) {
//   @Field()
//   token: string;
// }

// @Resolver(() => UserEntity)
// export class AuthResolver {
//   constructor(
//     private readonly usersService: UsersService,
//     private readonly jwt: JwtService,
//     private readonly authService: AuthService,
//   ) {}

//   @Public()
//   @Mutation(() => LoginReturn, { name: 'loginGoogle' })
//   @UseGuards(GoogleGuard)
//   loginWithGoogle(
//     @Args({ name: 'id_token' }) _id_token: string,
//     @User() user: UserEntity,
//   ) {
//     return { ...user, id: user?._id };
//   }

//   @Public()
//   @Mutation(() => LoginReturn)
//   @UseGuards(LocalGuard)
//   login(
//     @Args({ name: 'loginInput' }) _loginInput: LoginInput,
//     @User() user: UserEntity,
//   ) {
//     return { ...user, id: user?._id };
//   }

//   @Public()
//   @Mutation(() => LoginReturn)
//   async register(
//     @Args({ name: 'registerInput' }) registerInput: RegisterInput,
//     @Context() context: any,
//   ) {
//     const user = await this.authService.register(context.req, registerInput);
//     return user;
//   }
// }
