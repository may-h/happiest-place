import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Image } from '../../image/entities/Image.entity';
import { User } from '../../user/entities/User.entity';

@Entity()
export class Analysis extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  userId: number;

  @ManyToOne(() => User, (user) => user.analysisList, { onDelete: 'CASCADE' })
  user: User;

  @Column({ nullable: true })
  memo: string;

  @OneToMany(() => Image, (image) => image.analysis)
  imageList: Image[];

  @CreateDateColumn()
  regDate;
}
