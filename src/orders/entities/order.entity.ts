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
  AfterUpdate,
  HasMany,
} from "sequelize-typescript";

import sequelize from "sequelize";
import { Users } from "src/users/entities";
import { OrderStatus } from "../interfaces/orders_status.enum";
import { Products } from "../interfaces/products.interface";
import { Address } from "src/address/entities";
import { Credit } from "src/credits/entities";
import { Shipment } from "src/shipments/entities";

@Table({
  tableName: "orders",
  paranoid: true,
  deletedAt: "deletedAt",
})
export class Order extends Model<Order> {
  @Column({
    primaryKey: true,
    type: sequelize.UUID,
    defaultValue: sequelize.UUIDV4,
  })
  order: string;

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

  @ForeignKey(() => Address)
  @Column({
    type: DataTypes.INTEGER,
    allowNull: false,
  })
  addressId: number;

  @Column({
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  })
  amount: number;

  @Column({
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 1,
  })
  subtotal: string;

  @Column({
    type: DataTypes.STRING,
    defaultValue: 0,
  })
  discount: string;

  @Column({
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 1,
  })
  total: string;

  @Column({
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  })
  requiresShipping: boolean;

  @Column({
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  })
  isFinished: boolean;

  @Column({
    type: DataTypes.JSON,
    allowNull: false,
  })
  products: Products[];

  @ForeignKey(() => Users)
  @Column({
    type: DataTypes.UUID,
    allowNull: false,
  })
  buyerUser: string;

  @BelongsTo(() => Users, {
    foreignKey: "buyerUser",
    as: "buyerOrder",
  })
  buyerOrder: Users;

  @BelongsTo(() => Address, {
    foreignKey: "addressId",
    as: "orderAddress",
  })
  orderAddress: Address;

  @HasMany(() => Credit, {
    foreignKey: "orderId",
    as: "creditOrder", 
  })
  creditOrder: Credit[];

  @HasMany(() => Shipment, {
    foreignKey: "orderId",
    as: "shipmentOrder",
  })
  shipmentOrder: Shipment[];

  @Column({
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: OrderStatus.PENDIENTE,
    validate: {
      isIn: {
        args: [
          [OrderStatus.CANCELADO, OrderStatus.PENDIENTE, OrderStatus.PAGADO, OrderStatus.EN_PROCESO, OrderStatus.ENVIADO, OrderStatus.ENTREGADO, OrderStatus.NO_PAGADO],
        ],
        msg: `Status must be one of the following: ${Object.values(OrderStatus).join(", ")}`,
      },
    },
  })
  status: OrderStatus;

  @BeforeCreate
  static cleanData(order: Order) {
    order.amount =
      order.products.reduce((acc, product) => acc + product.amount, 0) || 5;

    order.subtotal = order.products
      .reduce(
        (acc, product) => acc + product.amount * parseFloat(product.price),
        0
      )
      .toFixed(2);

    order.discount = order.products
      .reduce(
        (acc, product) => acc + product.amount * parseFloat(product.discount),
        0
      )
      .toFixed(2);

    order.total = (parseFloat(order.subtotal) - parseFloat(order.discount))
      .toFixed(2)
      .toString();
    order.status = order.status || OrderStatus.PENDIENTE;
  }

  @AfterUpdate
  static removeParams(order: Order) {
    delete order.dataValues.deletedAt;
  }

  @BeforeUpdate
  static updateCleanData(order: Order) {
    this.cleanData(order);
  }
}


