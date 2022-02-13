import {BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, Unique} from "typeorm";
import {Analysis} from "./Analysis.entity";

@Entity()
export class User extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nickname: string;

    @CreateDateColumn()
    regDate: Date;

    @OneToMany(() => Analysis, analysis =>  analysis.user)
    analysisList: Analysis[]

    @Column({default: true})
    isActive: boolean;
}