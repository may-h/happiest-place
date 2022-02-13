import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany, OneToOne,
    PrimaryGeneratedColumn,
    Unique
} from "typeorm";
import {Image} from "./Image.entity";
import {User} from "./User.entity";
import {JoinTable} from "typeorm/browser";

@Entity()
export class Analysis extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.analysisList, {onDelete: 'CASCADE'})
    user: User;

    @OneToMany(() => Image, image => image.analysis)
    imageList: Image[]

    @CreateDateColumn()
    regDate;
}