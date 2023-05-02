import { NotFoundException } from '@nestjs/common';
import { CommonMessage } from 'src/common/constants/messages.constants';
import { EntityRepository, Repository } from 'typeorm';
import { User } from './user.entity';

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  async findOneById(id: string): Promise<User> {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException(CommonMessage.NOT_FOUND_BY_ID);
    }
    return user;
  }
}
