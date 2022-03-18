import { Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './entities/User.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dtos/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>, // DB와의 연결 정의
  ) {}

  async createUser(userDto: CreateUserDto) {
    let existUser = await this.getUserByNickname(userDto.nickname);
    if (existUser) {
      throw new NotAcceptableException('User with provided nickname already exist');
    }
    const { password, ...rest } = await this.userRepository.save(userDto);
    return rest;
  }

  async getAllUsers() {
    return this.userRepository.find();
  }

  async getUserById(id: number) {
    return this.userRepository.findOne(id);
  }

  async getUserByNickname(nickname: string) {
    return await this.userRepository.findOne({ nickname });
  }

  async updateUser(id, dto: UpdateUserDto) {
    const user = await this.getUserById(id);
    if (!user) {
      throw new NotFoundException(`Not Found User ID [${id}]`);
    }

    return await this.userRepository.update(id, dto);
  }

  async deleteUser(id: number) {
    const user = await this.userRepository.findOne({ id });
    if (user) {
      console.log(user);
      await this.userRepository.remove(user);
      return `success`;
    }

    return 'fail';
  }

  async findById(id: number) {
    return await this.userRepository.findOne(id);
  }
}
