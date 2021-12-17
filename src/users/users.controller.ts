import {
  Controller,
  Get,
  // Post,
  // Body,
  // Put,
  Param,
  // Delete,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from './users.service';
// import { AddCartItemDto } from './dto/add-cart-item.dto';
// import { DeleteCartItemDto } from './dto/delete-cart-item.dto';
// import { BuyCourseDto } from './dto/buy-course.dto';
import { User } from 'src/common/decorators';
import { User as UserEntity } from './entities/user.entity';
// import { BillsService } from 'src/server/bills/bills.service';
// import { CoursesService } from 'src/server/courses/courses.service';
// import { CourseProgressesService } from 'src/server/course-progresses/course-progresses.service';
// import { NoticficationsService } from 'src/server/noticfications/noticfications.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService, // private readonly billsService: BillsService, // private readonly coursesService: CoursesService, // private readonly courseProgressesService: CourseProgressesService, // private readonly noticficationsService: NoticficationsService,
  ) {}

  // @Post()
  // create(@Body() createUserDto: CreateUserDto) {
  //   return this.usersService.create(createUserDto);
  // }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }
  @Get('/profile')
  getGlobalyProfile(@User() user: UserEntity) {
    if (user) return user;
    throw new UnauthorizedException();
  }
  @Get('/id/:id')
  async findOne(@Param('id') id: string) {
    return await this.usersService.findOneById(id);
  }

  // @Put(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(+id, updateUserDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.usersService.remove(+id);
  // }

  // @Get('noticfications')
  // async findNoticfication(@User() user: UserEntity) {
  //   return await this.noticficationsService.findByUserId(user.id);
  // }
}
