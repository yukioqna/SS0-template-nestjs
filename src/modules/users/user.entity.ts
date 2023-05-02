import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  BaseEntity,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer/decorators';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'example@gmail.com', description: 'Email of user' })
  @Column({ name: 'email', unique: true })
  email: string;

  @ApiProperty({ example: 'Admin123@', description: 'Password of user' })
  @Exclude()
  @Column({ name: 'password', nullable: true })
  password: string;

  @Exclude()
  @Column({ name: 'salt', nullable: true })
  salt: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  async validatePassword(password: string): Promise<boolean> {
    const hashPassword = await bcrypt.compare(password, this.password);
    return hashPassword;
  }
}
