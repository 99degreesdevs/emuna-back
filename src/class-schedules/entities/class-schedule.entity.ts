import { DataTypes } from "sequelize";
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
  DeletedAt,
  HasMany,
  PrimaryKey,
} from "sequelize-typescript";

import sequelize from "sequelize";
import { Users } from "src/users/entities";
import { Day } from "src/days/entities";
import { ClassScheduleCat } from "src/class-schedule-cat/entities";

import * as moment from "moment";
import { Expose } from "class-transformer";
import { ClassScheduleTransaction } from "src/class-schedule-transaction/entities";

@Table({
  tableName: "class-schedule",
  paranoid: true,
  deletedAt: "deletedAt",
})
export class ClassSchedule extends Model<ClassSchedule> {
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER,
  })
  classId: number;

  @CreatedAt
  @Column({
    type: DataTypes.DATE,
    defaultValue: sequelize.literal("NOW()"),
  })
  createdAt: Date;

  @UpdatedAt
  @Column({
    type: DataTypes.DATE,
    defaultValue: sequelize.literal("NOW()"),
  })
  updatedAt: Date;

  @DeletedAt
  @Column({
    type: DataTypes.DATE,
  })
  deletedAt: Date;

  @CreatedAt
  @Column({
    type: DataTypes.DATE,
    defaultValue: sequelize.literal("NOW()"),
  })
  classDateStart: Date;

  @CreatedAt
  @Column({
    type: DataTypes.DATE,
    defaultValue: sequelize.literal("NOW()"),
  })
  classDateEnd: Date;

  @ForeignKey(() => Day)
  @Column({
    type: DataTypes.INTEGER,
  })
  day: number;

  @Column({
    type: DataTypes.FLOAT,
    allowNull: true,
    defaultValue: 1,
  })
  duration: number;
 
  @ForeignKey(() => ClassScheduleCat)
  @Column({
    type: DataTypes.INTEGER,
    allowNull: false,
  })
  category: number;

  @BelongsTo(() => ClassScheduleCat, {
    foreignKey: "category",
    as: "classScheduleCategory",
  })
  classScheduleCategory: ClassScheduleCat;

  @Column({
    type: DataTypes.TEXT,
    allowNull: false,
  })
  class: string;

  @Column({
    type: DataTypes.TEXT,
    defaultValue: "",
  })
  description: string;


  @Column({
    type: DataTypes.TEXT,
  })
  link: string;

  @BelongsTo(() => Day, {
    foreignKey: "day",
    as: "classScheduleDay",
  })
  classScheduleDay: Day;

  @Column({
    type: DataTypes.TIME,
    defaultValue: "09:00:00",
  })
  scheduleStart: string;

  @Column({
    type: DataTypes.TIME,
    defaultValue: "10:00:00",
  })
  scheduleEnd: string;

  @Column({
    type: DataTypes.TEXT,
    defaultValue: "",
  })
  teacher: string;

  @Column({
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 10,
  })
  places: number;

  @Column({
    type: DataTypes.INTEGER,
    defaultValue: 10,
  })
  availablePlaces: number;

  @ForeignKey(() => Users)
  @Column({
    type: DataTypes.UUID,
    allowNull: false,
  })
  createdBy: string;

  @BelongsTo(() => Users, {
    foreignKey: "createdBy",
    as: "createdClassBy",
  })
  createdClassBy: Users;

  @ForeignKey(() => Users)
  @Column({
    type: DataTypes.UUID,
  })
  updatedBy: string;

  @BelongsTo(() => Users, {
    foreignKey: "updatedBy",
    as: "updatedClassBy",
  })
  updatedClassBy: Users;

  @Column({
    defaultValue: true,
  })
  isActive: boolean;

  @HasMany(() => ClassScheduleTransaction, {
    foreignKey: "classId",
    as: "classTransactionClass",
  })
  classTransactionClass: ClassScheduleTransaction[];

  @BeforeCreate
  static cleanData(classSchedule: ClassSchedule) {
    classSchedule.class = classSchedule.class ? classSchedule.class.trim() : "";
    classSchedule.link = classSchedule.link ? classSchedule.link.trim() : "";
    classSchedule.description = classSchedule.description
      ? classSchedule.description.trim()
      : "";
    classSchedule.teacher = classSchedule.teacher
      ? classSchedule.teacher.trim()
      : "";
    classSchedule.scheduleStart = ClassSchedule.getHours(
      classSchedule.classDateStart
    );
    classSchedule.scheduleEnd = ClassSchedule.getHours(
      classSchedule.classDateEnd
    );

    classSchedule.duration = ClassSchedule.getDuration(
      classSchedule.classDateStart,
      classSchedule.classDateEnd
    );

    classSchedule.day = ClassSchedule.getDayId(classSchedule.classDateStart);

    classSchedule.availablePlaces = classSchedule.places;

    
  }

  @BeforeUpdate
  static updateCleanData(classSchedule: ClassSchedule) {
    this.cleanData(classSchedule);
  }

  @Expose({ name: "dayName" })
  get dayName(): string {
    return ClassSchedule.daysOfWeek.find((d) => d.id === this.day).spanishName;
  }

  static getHours(classDate: Date): string {
    const date = moment(classDate);
    const formattedTime = date.format("HH:mm:ss");
    return formattedTime;
  }

  static getDuration(start: Date, end: Date): number {
    const duration = moment.duration(moment(end).diff(moment(start)));
    return duration.asHours();
  }

  static getDayId(classDate: Date): number {
    const date = moment(classDate);
    const dayOfWeek = date.format("dddd");
    return ClassSchedule.daysOfWeek.find(
      (d) => d.name === dayOfWeek.toLowerCase().trim()
    ).id;
  }

  static daysOfWeek = [
    { id: 1, name: "monday", spanishName: "lunes" },
    { id: 2, name: "tuesday", spanishName: "martes" },
    { id: 3, name: "wednesday", spanishName: "miércoles" },
    { id: 4, name: "thursday", spanishName: "jueves" },
    { id: 5, name: "friday", spanishName: "viernes" },
    { id: 6, name: "saturday", spanishName: "sábado" },
    { id: 7, name: "sunday", spanishName: "domingo" },
  ];
}
