import { DataTypes } from "sequelize";
import sequelize from "sequelize";
import {
  Column,
  Table,
  Model,
  BeforeCreate,
  BeforeUpdate,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  AfterCreate,
  BeforeDestroy,
  AfterUpdate,
  HasMany,
} from "sequelize-typescript";
import { Address } from "src/address/entities";
import { ClassScheduleTransaction } from "src/class-schedule-transaction/entities/class-schedule-transaction.entity";
import { ClassSchedule } from "src/class-schedules/entities/class-schedule.entity";
import { Credit } from "src/credits/entities/credit.entity";
import { Day } from "src/days/entities/day.entity";
import { Fiscal } from "src/fiscal/entities/index";
import { MotivationalQuote } from "src/motivational-quotes/entities";
import { Multimedia } from "src/multimedia/entities";
import { Order } from "src/orders/entities";
import { Package } from "src/package/entities";
import { Product } from "src/products/entities";
import { Shipment } from "src/shipments/entities";

@Table({
  tableName: "users",
  paranoid: true,
  deletedAt: "deletedAt",
})
export class Users extends Model<Users> {
  @Column({
    primaryKey: true,
    type: sequelize.UUID,
    defaultValue: sequelize.UUIDV4,
  })
  userId: string;

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

  @Column({
    type: DataTypes.STRING,
    allowNull: false,
  })
  email: string;

  @Column({
    defaultValue: "",
    type: DataTypes.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataTypes.DATE,
    allowNull: false,
  })
  born: string;

  @Column({
    type: DataTypes.STRING,
    allowNull: false,
  })
  phone: number;

  @Column({
    allowNull: false,
    type: DataTypes.STRING,
  })
  password: string;

  @Column({
    type: DataTypes.STRING,
    defaultValue: "",
  })
  avatar: string;

  @Column({
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: ["user"],
  })
  roles: string[];

  @BeforeCreate
  static cleanData(user: Users) {
    user.password = user.password.trim();
    user.email = user.email.toLowerCase().trim();
    user.avatar = user.avatar ? user.avatar.trim() : "";
    user.name = user.name ? user.name.toLowerCase().trim() : "";
  }

  @AfterCreate
  static deletePassword(user: Users) {
    delete user.dataValues.password;
    delete user.dataValues.updatedAt;
    delete user.dataValues.deletedAt;
  }

  @BeforeUpdate
  static updateCleanData(user: Users) {
    this.cleanData(user);
  }

  @AfterUpdate
  static removeParams(user: Users) {
    delete user.dataValues.password;
    delete user.dataValues.deletedAt;
  }

  @BeforeDestroy
  static destroyCascadeSession(intance, options) {}

  //Realtions:

  @HasMany(() => Fiscal, {
    foreignKey: "userId",
    as: "fiscalUsers",
    onDelete: "CASCADE",
  })
  fiscalUsers: Fiscal[];

  @HasMany(() => MotivationalQuote, {
    foreignKey: "createdBy",
    as: "quoteCreatedBy",
    onDelete: "CASCADE",
  })
  quoteCreatedBy: MotivationalQuote[];

  @HasMany(() => MotivationalQuote, {
    foreignKey: "updatedBy",
    as: "quoteUpdatedBy",
  })
  quoteUpdatedBy: MotivationalQuote[];

  @HasMany(() => Day, {
    foreignKey: "updatedBy",
    as: "updatedDayBy",
  })
  updatedDayBy: Day[];

  @HasMany(() => ClassSchedule, {
    foreignKey: "createdBy",
    as: "createdClassBy",
    onDelete: "CASCADE",
  })
  createdClassBy: ClassSchedule[];

  @HasMany(() => ClassSchedule, {
    foreignKey: "updatedBy",
    as: "updatedClassBy",
  })
  updatedClassBy: ClassSchedule[];

  @HasMany(() => Multimedia, {
    foreignKey: "createdBy",
    as: "multimediaCreatedBy",
    onDelete: "CASCADE",
  })
  multimediaCreatedBy: Multimedia[];

  @HasMany(() => Multimedia, {
    foreignKey: "updatedBy",
    as: "multimediaUpdatedBy",
  })
  multimediaUpdatedBy: Multimedia[];

  @HasMany(() => Product, {
    foreignKey: "createdBy",
    as: "productCreatedBy",
    onDelete: "CASCADE",
  })
  productCreatedBy: Product[];

  @HasMany(() => Product, {
    foreignKey: "updatedBy",
    as: "productUpdatedBy",
  })
  productUpdatedBy: Product[];

  @HasMany(() => Order, {
    foreignKey: "buyerUser",
    as: "buyerOrder",
  })
  buyerOrder: Order[];

  @HasMany(() => Package, {
    foreignKey: "updatedBy",
    as: "updatedPackageBy",
  })
  updatedPackageBy: Package[];

  @HasMany(() => Address, {
    foreignKey: "userId",
    as: "userIdAddress",
  })
  userIdAddr: Address[];

  @HasMany(() => Address, {
    foreignKey: "createdBy",
    as: "createdUserAddressBy",
  })
  createdUserAddressBy: Address[];

  @HasMany(() => Address, {
    foreignKey: "updatedBy",
    as: "updatedUserAddressBy",
  })
  updatedUserAddressBy: Address[];

  @HasMany(() => Credit, { foreignKey: "userId", as: "creditUser" })
  creditUser: Credit[];

  @HasMany(() => Shipment, { foreignKey: "userId", as: "shipmentUser" })
  shipmentUser: Shipment[];

  @HasMany(() => ClassScheduleTransaction, {
    foreignKey: "userId",
    as: "classScheduleTransactionUser",
  })
  classScheduleTransactionUser: ClassScheduleTransaction[]; 
}
