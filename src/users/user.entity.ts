import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { Report } from '../reports/report.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];

  @AfterInsert()
  logInsert() {
    console.log(`Inserted with Id ${this.id}`);
  }

  @AfterUpdate()
  logUpdate() {
    console.log(`Updated with Id ${this.id}`);
  }

  @AfterRemove()
  logRemove() {
    console.log(`Removed with Id ${this.id}`);
  }
}
