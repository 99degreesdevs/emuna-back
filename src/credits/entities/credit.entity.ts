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
  HasMany,
} from "sequelize-typescript";

import sequelize from "sequelize";
import { Users } from "src/users/entities";
import { ProductsCat } from "src/products-cat/entities";
import { Order } from "src/orders/entities";
import { ClassScheduleTransaction } from "src/class-schedule-transaction/entities";

@Table({
  tableName: "credit",
  paranoid: true,
  deletedAt: "deletedAt",
})
export class Credit extends Model<Credit> {
  @Column({
    primaryKey: true,
    type: sequelize.UUID,
    defaultValue: sequelize.UUIDV4,
  })
  credit: string;

  @ForeignKey(() => Users)
  @Column({
    type: DataTypes.UUID,
  })
  userId: string;

  @ForeignKey(() => Order)
  @Column({
    type: DataTypes.UUID,
    allowNull: false,
  })
  orderId: string;

  @ForeignKey(() => ProductsCat)
  @Column({
    type: DataTypes.INTEGER,
    allowNull: false,
  })
  category: number;

  @Column({
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  })
  isActive: boolean;

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
    as: "creditUser",
  })
  creditUser: Users;
 
  @BelongsTo(() => ProductsCat, {
    foreignKey: "category",
    as: "creditCategoryProduct",
  })
  creditCategoryProduct: ProductsCat;

  @BelongsTo(() => Order, {
    foreignKey: "orderId",
    as: "creditOrder",
  })
  creditOrder: Order; 

  @HasMany(() => ClassScheduleTransaction, {
    foreignKey: "creditId",
    as: "classScheduleTransactionCredit",
  })
  classScheduleTransactionCredit: ClassScheduleTransaction[];  
}
