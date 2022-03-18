import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Analysis } from '../../analysis/entities/Analysis.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength } from 'class-validator';

@Entity()
export class User extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  nickname: string;

  @Column()
  password: string;

  @ApiProperty()
  @CreateDateColumn()
  regDate: Date;

  @ApiProperty()
  @OneToMany(() => Analysis, (analysis) => analysis.user, { cascade: true })
  analysisList: Analysis[];

  @ApiProperty()
  @Column({ default: true })
  isActive: boolean;
}
