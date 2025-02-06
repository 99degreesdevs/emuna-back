import { DataTypes, Optional } from "sequelize";
import {
  Column,
  Table,
  Model,
  BeforeCreate,
  BeforeUpdate,
  BelongsTo,
  ForeignKey,
  CreatedAt,
  UpdatedAt,
  HasMany,
  DeletedAt,
} from "sequelize-typescript";

import sequelize from "sequelize";
import { Users } from "src/users/entities"; 
import { Order } from "src/orders/entities";
 

@Table({
  tableName: "address",
  paranoid: true,
  deletedAt: "deletedAt",
})
export class Address extends Model<
Address
> {
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER,
  })
  id: number;

  @ForeignKey(() => Users)
  @Column({
    type: sequelize.UUID,
    allowNull: false,
  })
  userId: string;

  @ForeignKey(() => Users)
  @Column({
    type: DataTypes.UUID,
    allowNull: false,
  })
  createdBy: string;

  @ForeignKey(() => Users)
  @Column({
    type: DataTypes.UUID,
  })
  updatedBy: string;

  @Column({
    type: DataTypes.STRING,
    allowNull: false,
  })
  street: string;

  @Column({
    type: DataTypes.STRING,
    allowNull: false,
  })
  externalNumber: string;

  @Column({
    type: DataTypes.STRING,
    allowNull: true,
  })
  internalNumber: string;

  @Column({
    type: DataTypes.STRING,
    allowNull: false,
  })
  postalCode: string;

  @Column({
    type: DataTypes.STRING,
    allowNull: true,
  })
  propertyType: string;

  @Column({
    type: DataTypes.TEXT,
    allowNull: true,
  })
  notes: string;

  @Column({
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  })
  isDefault: boolean;
  @UpdatedAt
  @Column({
    type: DataTypes.DATE,
    defaultValue: sequelize.literal("NOW()"),
  })
  createdAt: Date;
  @UpdatedAt
  @Column({
    type: DataTypes.DATE,
    allowNull: true,
  })
  updatedAt: Date;
  @DeletedAt
  @Column({
    type: DataTypes.DATE,
    allowNull: true,
  })
  deletedAt: Date;

  @BelongsTo(() => Users, { foreignKey: "userId", as: "userIdAddress" })
  userIdAddress: Users;

  @BelongsTo(() => Users, {
    foreignKey: "createdBy",
    as: "createdUserAddressBy",
  })
  createdUserAddressBy: Users;

  @BelongsTo(() => Users, {
    foreignKey: "updatedBy",
    as: "updatedUserAddressBy",
  })
  updatedUserAddressBy: Users;

  
  @HasMany(() => Order, {
    foreignKey: "addressId",
    as: "orderAddress",
  })
  orderAddress: Order[];

  @BeforeCreate
  static cleanData(address: Address) {
    address.externalNumber = address.externalNumber
      ? address.externalNumber.trim()
      : "";
    address.internalNumber = address.internalNumber
      ? address.internalNumber.trim()
      : "";
    address.street = address.street.trim();
    address.propertyType = address.propertyType
      ? address.propertyType.trim()
      : "";
    address.notes = address.notes ? address.notes.trim() : "";
  }

  @BeforeUpdate
  static updateCleanData(address: Address) {
    this.cleanData(address);
  }
}
