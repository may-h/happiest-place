import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Analysis } from './Analysis.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class User extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  nickname: string;

  @ApiProperty()
  @CreateDateColumn()
  regDate: Date;

  @ApiProperty()
  @OneToMany(() => Analysis, (analysis) => analysis.user)
  analysisList: Analysis[];

  @ApiProperty()
  @Column({ default: true })
  isActive: boolean;
}
