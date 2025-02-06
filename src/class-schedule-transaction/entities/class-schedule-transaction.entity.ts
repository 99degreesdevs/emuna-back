import { DataTypes } from "sequelize";
import {
  Column,
  Table,
  Model,
  CreatedAt,
  UpdatedAt,
  ForeignKey,
  BelongsTo,
  DeletedAt,
  PrimaryKey,
} from "sequelize-typescript";

import sequelize from "sequelize";
import { Users } from "src/users/entities"; 
import { ClassSchedule } from "src/class-schedules/entities";
import { Credit } from "src/credits/entities";
import { ClassTransactionStatus } from "../interfaces/statusClassTransaction.enum";

@Table({
  tableName: "class-schedule-transaction",
  paranoid: true,
  deletedAt: "deletedAt",
})
export class ClassScheduleTransaction extends Model<ClassScheduleTransaction> {

  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER,
  })
  transactionId: number;

  @ForeignKey(() => Credit) 
  @Column({ 
    type: DataTypes.UUID,
    allowNull: false,
  }) 
  creditId: string;

  @ForeignKey(() => Users) 
  @Column({ 
    type: DataTypes.UUID,
    allowNull: false,
  })
  userId: string;

  @ForeignKey(() => ClassSchedule) 
  @Column({ 
    type: DataTypes.INTEGER,
    allowNull: false,
  })
  classId: number; 
  @Column({ 
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  })
  isActive: boolean;

  @Column({
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: ClassTransactionStatus.RESERVED,
    validate: {
      isIn: {
        args: [
          [
            ClassTransactionStatus.RESERVED,
            ClassTransactionStatus.COMPLETED,
            ClassTransactionStatus.CANCELED, 
          ],
        ],
        msg: `Status must be one of the following: ${Object.values(ClassTransactionStatus).join(", ")}`,
      },
    },
  })
  status: ClassTransactionStatus;

  @CreatedAt
  @Column({
    type: DataTypes.DATE,
    defaultValue: sequelize.literal("NOW()"),
  })
  createdAt: Date;

  @UpdatedAt
  @Column({
    type: DataTypes.DATE,
  })
  updatedAt: Date;

  @DeletedAt
  @Column({
    type: DataTypes.DATE,
  })
  deletedAt: Date;

  @BelongsTo(() => Users, {
    foreignKey: "userId",
    as: "classScheduleTransactionUser",
  })
  classScheduleTransactionUser: Users;
 
  @BelongsTo(() => Credit, {
    foreignKey: "creditId",
    as: "classScheduleTransactionCredit",
  })
  classScheduleTransactionCredit: Credit; 
 
  @BelongsTo(() => ClassSchedule, {
    foreignKey: "classId",  
    as: "classTransactionClass",
  })
  classTransactionClass: ClassSchedule;

  
}
