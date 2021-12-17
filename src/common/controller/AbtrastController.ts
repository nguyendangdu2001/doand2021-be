import { Body, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { AbstractService } from '../service/AbtrastService';

function BaseController<T extends AbstractService<S, V>, S, V>(name: string) {
  abstract class AbtrastController {
    private service: T;
    constructor(service: T) {
      this.service = service;
    }
  }
}
export abstract class AbtrastController<T extends AbstractService<S, V>, S, V> {
  private service: T;
  constructor(service: T) {
    this.service = service;
  }
  @Post()
  create(@Body() createUserDto: S) {
    return this.service.create(createUserDto);
  }
  @Get()
  findAll() {
    return this.service.findAll();
  }
  @Get('/:id')
  async findOne(@Param('id') id: string) {
    return await this.service.findOneById(id);
  }
  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: S) {
    return this.service.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
