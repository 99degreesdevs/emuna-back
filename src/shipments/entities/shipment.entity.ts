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
import { Order } from "src/orders/entities";
import { ShipmentStatus } from "../interfaces/status-shipment.enum";
import { Product } from "src/products/entities";

@Table({
  tableName: "shipment",
  paranoid: true,
  deletedAt: "deletedAt",
})
export class Shipment extends Model<Shipment> { 

  @ForeignKey(() => Users)
  @PrimaryKey
  @Column({
    type: DataTypes.UUID,
    allowNull: false,
  })
  userId: string;

  @ForeignKey(() => Order)
  @PrimaryKey
  @Column({
    type: DataTypes.UUID,
    allowNull: false,
  })
  orderId: string;

  @ForeignKey(() => Product)
  @PrimaryKey
  @Column({
    type: DataTypes.UUID,
    allowNull: false,
  })
  sku: string;

  @Column({
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  })
  amount: number;

  @Column({
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  })
  isOk: boolean;

  @Column({
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: ShipmentStatus.PENDIENTE,
    validate: {
      isIn: {
        args: [
          [
            ShipmentStatus.CANCELADO,
            ShipmentStatus.PENDIENTE,
            ShipmentStatus.CONFIRMADO,
            ShipmentStatus.PROCESO,
            ShipmentStatus.ENVIADO,
            ShipmentStatus.ENTREGADO,
          ],
        ],
        msg: `Status must be one of the following: ${Object.values(ShipmentStatus).join(", ")}`,
      },
    },
  })
  status: ShipmentStatus;

  @Column({
    type: DataTypes.STRING,
  })
  tracking?: string;

  @Column({
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  })
  isFinished: boolean;

  @CreatedAt
  @Column({
    type: DataTypes.DATE,
    defaultValue: sequelize.literal("NOW()"),
  })
  createdAt: Date;

  @UpdatedAt
  @Column({
    type: DataTypes.DATE,
    defaultValue: null,
  })
  updatedAt: Date;

  @DeletedAt
  @Column({
    type: DataTypes.DATE,
  })
  deletedAt: Date;

  @BelongsTo(() => Users, {
    foreignKey: "userId",
    as: "shipmentUser",
  })
  shipmentUser: Users;

  @BelongsTo(() => Order, {
    foreignKey: "orderId",
    as: "shipmentOrder",
  })
  shipmentOrder: Order;

  @BelongsTo(() => Product, {
    foreignKey: "sku",
    as: "shipmentSku",
  })
  shipmentSku: Product; 
}
