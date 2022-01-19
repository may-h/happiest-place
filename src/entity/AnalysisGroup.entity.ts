import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    Unique
} from "typeorm";
import {Image} from "./Image.entity";
import {User} from "./User.entity";

@Entity()
export class AnalysisGroup extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    owner: number;

    @CreateDateColumn()
    regDate;
}