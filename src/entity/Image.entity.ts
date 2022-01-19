import {BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Unique} from "typeorm";
import {AnalysisGroup} from './AnalysisGroup.entity';

@Entity()
@Unique(['filename'])
export class Image extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    filename: string;

    @Column()
    orgFilename: string;

    @Column()
    lat: number;

    @Column()
    lng: number;

    @Column()
    url: string;

    @Column()
    avgHappinessRate: number;

    // @ManyToOne(type => AnalysisGroup, analysisGroup => analysisGroup.id)
    @Column('int')
    analysisGrpId: AnalysisGroup;

    @CreateDateColumn()
    regDate;

}