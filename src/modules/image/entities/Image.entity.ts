import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Analysis } from '../../../entity/Analysis.entity';

@Entity()
export class Image extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  filename: string;

  @Column()
  orgFilename: string;

  @Column({ type: 'varchar', nullable: true })
  lat: number;

  @Column({ type: 'varchar', nullable: true })
  lng: number;

  @Column()
  url: string;

  @Column({ type: 'varchar', nullable: true })
  avgHappinessRate: number;

  @Column({ nullable: true })
  analysisId: number;

  @ManyToOne((type) => Analysis, (analysis) => analysis.imageList, { onDelete: 'CASCADE' })
  analysis: Analysis;

  @CreateDateColumn()
  regDate;
}
