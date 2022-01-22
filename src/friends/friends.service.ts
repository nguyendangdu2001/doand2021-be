import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UsersService } from 'src/users/users.service';
import { CreateFriendDto } from './dto/create-friend.dto';
import { UpdateFriendDto } from './dto/update-friend.dto';
import { Friend, FriendDocument } from './entities/friend.entity';

@Injectable()
export class FriendsService {
  constructor(
    @InjectModel(Friend.name)
    private readonly friendModel: Model<FriendDocument>,
    private readonly userService: UsersService,
  ) {}
  async create(createFriendDto: CreateFriendDto) {
    return await this.friendModel.create(createFriendDto);
  }
  async findStranger(userId: string) {
    const friend = await this.friendModel.find(
      {
        users: new Types.ObjectId(userId),
      },
      { users: 1 },
    );
    console.log(userId, friend);

    const friendIds = friend?.map(({ users }) =>
      users?.find((value) => value.toString() !== userId),
    );
    console.log(friendIds);

    return await this.userService.find({
      $and: [{ _id: { $nin: friendIds } }, { _id: { $ne: userId } }],
    });
  }
  async findAllByUserId(userId: string) {
    return await this.friendModel
      .find({ users: new Types.ObjectId(userId) })
      .populate({
        path: 'users',
        match: { _id: { $ne: new Types.ObjectId(userId) } },
      });
  }

  findOne(id: number) {
    return `This action returns a #${id} friend`;
  }

  update(id: number, updateFriendDto: UpdateFriendDto) {
    return `This action updates a #${id} friend`;
  }

  async remove(id: string) {
    return await this.friendModel.findByIdAndDelete(id);
  }
}
