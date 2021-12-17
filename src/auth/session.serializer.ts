// import { PassportSerializer } from '@nestjs/passport';
// import { Injectable } from '@nestjs/common';
// import { UsersService } from 'src/server/users/users.service';
// import { User } from 'src/server/users/entities/user.entity';

// @Injectable()
// export class SessionSerializer extends PassportSerializer {
//   constructor(private readonly userService: UsersService) {
//     super();
//   }

//   serializeUser(
//     user: User,
//     done: (err: Error | null, user: string) => void,
//   ): void {
//     console.log('serialize', user);

//     done(null, user._id);
//   }

//   async deserializeUser(
//     id: string,
//     done: (err: Error | null, payload?: User) => void,
//   ) {
//     try {
//       const user = await this.userService.findOneById(id);
//       console.log('deserialize', user);
//       done(null, user);
//     } catch (error) {
//       done(error);
//     }
//   }
// }
