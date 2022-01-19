import {BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Unique} from "typeorm";

@Entity()
@Unique(['nickname'])
export class User extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nickname: string;

    @CreateDateColumn()
    regDate: Date;

    @Column({default: true})
    isActive: boolean;
}