import {
  ConflictException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersRepository } from './users.repository';
import { EditUserDto } from './dto/edit-user.dto';
import AuthCreadentialsDto from 'src/auth/dto/auth-credentials.dto';
import { User } from './user.entity';
import { CommonMessage } from 'src/common/constants/messages.constants';
import * as bcrypt from 'bcrypt';
import UserRespondDto from './dto/user-response.dto';
import UsersResponseDto from './dto/users-response.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersRepository)
    private readonly usersRepository: UsersRepository,
  ) {}

  /**
   * Get all users.
   */
  async get(): Promise<UsersResponseDto> {
    const users = await this.usersRepository.find();
    return { users };
  }

  /**
   * Get an User by ID.
   * @param id User ID.
   */
  async getById(id: string): Promise<UserRespondDto> {
    const user = await this.usersRepository.findOne(id);
    return user;
  }

  /**
   * Get an user by email.
   * @param email User email.
   */
  async getByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOne({ email });
    if (!user) {
      return null;
    }
    return user;
  }

  /**
   * Update an user by ID.
   * @param id User ID.
   * @param editUserDto EditUserDto.
   */
  async update(id: string, editUserDto: EditUserDto): Promise<UserRespondDto> {
    const { email, password } = editUserDto;
    const existUser = await this.usersRepository.findOne(id);
    if (!existUser) {
      throw new NotFoundException(CommonMessage.NOT_FOUND_BY_ID);
    }
    existUser.email = email ? email : existUser.email;

    if (password) {
      // If edit password, hash this password and save.
      const salt = await bcrypt.genSalt();
      const hashPassword = await bcrypt.hash(password, salt);
      existUser.salt = salt;
      existUser.password = hashPassword;
    }
    await existUser.save();
    return existUser;
  }

  /**
   * Create a new user.
   * @param authCredentialsDto AuthCredentialsDto.
   */
  async create(authCredentialsDto: AuthCreadentialsDto): Promise<void> {
    const { email, password } = authCredentialsDto;

    // Create new user and save.
    const newUser = this.usersRepository.create();
    newUser.email = email;

    if (password) {
      // Hash password.
      const salt = await bcrypt.genSalt();
      const hashPassword = await bcrypt.hash(password, salt);
      newUser.salt = salt;
      newUser.password = hashPassword;
    } else {
      newUser.salt = null;
      newUser.password = null;
    }

    try {
      await newUser.save();
    } catch (error) {
      if (error.code === '23505') {
        // Duplicate email.
        throw new ConflictException(`Email ${CommonMessage.ALREADY_EXIST}`);
      }
      throw new InternalServerErrorException(error);
    }
  }
}
