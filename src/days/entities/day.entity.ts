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
  tableName: 'days',
})
export class Day extends Model<Day> {
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
  })
  updatedAt: Date;

  @Column({
    unique: true,
    type: DataTypes.TEXT,
    allowNull: true,
  })
  day: string;

  @ForeignKey(() => Users)
  @Column({
    type: DataTypes.UUID,
  })
  updatedBy: string;

  @BelongsTo(() => Users, { foreignKey: 'updatedBy', as: 'updatedDayBy' })
  updatedDayBy: Users;

  @Column({
    defaultValue: true,
  })
  isActive: boolean;
  
  @HasMany(() => ClassSchedule, {
    foreignKey: 'day',
    as: 'classScheduleDay',
    onDelete: 'CASCADE',
  })
  classScheduleDay: ClassSchedule[];

  @BeforeCreate
  static cleanData(day: Day) {
    day.day = day.day.trim()
      ? day.day.trim()
      : '';
  }

  @BeforeUpdate
  static updateCleanData(day: Day) {
    this.cleanData(day);
  }
}
