// import {
//   Resolver,
//   Query,
//   Mutation,
//   Args,
//   ResolveField,
//   Parent,
// } from '@nestjs/graphql';
// import { UsersService } from './users.service';
// import { User } from './entities/user.entity';
// import { CreateUserInput } from './dto/create-user.input';
// import { UpdateUserInput } from './dto/update-user.input';
// import ConnectionArgs from 'src/connection.args';
// import { UsersResponse } from './users.response';
// import { connectionFromArraySlice } from 'graphql-relay';
// import { UseGuards } from '@nestjs/common';
// import { AuthenticatedGuard } from 'src/common/guards/authenticated';
// import { User as UserParam } from 'src/common/decorators';
// @Resolver(() => User)
// export class UsersResolver {
//   constructor(private readonly usersService: UsersService) {}

//   @Mutation(() => User)
//   createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
//     return this.usersService.create(createUserInput);
//   }

//   @Query(() => User)
//   me(@UserParam() user: User) {
//     return user;
//   }

//   @UseGuards(AuthenticatedGuard)
//   @Query(() => UsersResponse, { name: 'users' })
//   async findAll(@Args() args: ConnectionArgs) {
//     const { limit, offset } = args.pagingParams();
//     const [user, count] = await this.usersService.findAll(limit, offset);
//     const page = connectionFromArraySlice(user, args, {
//       arrayLength: count,
//       sliceStart: offset || 0,
//     });
//     return { page, pageData: { count, limit, offset } };
//   }

//   @Query(() => User, { name: 'user' })
//   findOne(@Args('id') id: string) {
//     return this.usersService.findOneById(id);
//   }

//   @Mutation(() => User)
//   updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
//     return this.usersService.update(updateUserInput.id, updateUserInput);
//   }

//   @Mutation(() => User)
//   removeUser(@Args('id') id: string) {
//     return this.usersService.remove(id);
//   }

//   // @Mutation(() => User)
//   // googleLogin(@Args('id') id: string) {
//   //   return this.usersService.remove(id);
//   // }
// }
