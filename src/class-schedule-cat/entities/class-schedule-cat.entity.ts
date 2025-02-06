
import { DataTypes,  } from 'sequelize';
import {
  Column,
  Table,
  Model,
  BeforeCreate,
  BeforeUpdate,
  CreatedAt,
  UpdatedAt,
  ForeignKey,
  BelongsTo, 
  HasMany
} from 'sequelize-typescript';

import sequelize from 'sequelize'; 
import { Users } from 'src/users/entities';
import { ClassSchedule } from 'src/class-schedules/entities/class-schedule.entity';

@Table({
  tableName: 'class-schedule-cat',
})
export class ClassScheduleCat extends Model<ClassScheduleCat> {
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER,
  })
  id: number;

  @CreatedAt
  @Column({
    type: DataTypes.DATE,
    defaultValue: sequelize.literal('NOW()'),
  })
  createdAt: Date;

  @UpdatedAt
  @Column({
    type: DataTypes.DATE,
    defaultValue: sequelize.literal('NOW()'),
  })3
  updatedAt: Date;

  @Column({
    unique: true,
    type: DataTypes.TEXT,
    allowNull: true,
  })
  category: string;

  @Column({
    type: DataTypes.TEXT,
  })
  description: string;
 

  @Column({
    defaultValue: true,
  })
  isActive: boolean;

  @Column({
    type: DataTypes.TEXT,
  })
  link: string;
  
  @HasMany(() => ClassSchedule, {
    foreignKey: 'category',
    as: 'classScheduleCategory',
    onDelete: 'CASCADE',
  })
  classScheduleCategory: ClassSchedule[];
 

  @BeforeCreate
  static cleanData(classScheduleCat: ClassScheduleCat) {
    classScheduleCat.category = classScheduleCat.category.trim()
      ? classScheduleCat.category.trim()
      : '';
  }

  @BeforeUpdate
  static updateCleanData(classScheduleCat: ClassScheduleCat) {
    this.cleanData(classScheduleCat);
  }
}
