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
import { ProductsCat } from "src/products-cat/entities";
import { ProductCat } from "../interfaces/products-category.enum";
import { Expose } from "class-transformer";
import { Package } from "src/package/entities";
import { Shipment } from "src/shipments/entities";

@Table({
  tableName: "products",
  paranoid: true,
  deletedAt: "deletedAt",
})
export class Product extends Model<Product> {
  @Column({
    primaryKey: true,
    type: sequelize.UUID,
    defaultValue: sequelize.UUIDV4,
  })
  sku: string;

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
  product: string;

  // @Column({
  //   type: DataTypes.STRING,
  //   allowNull: false,
  //   defaultValue: "producto",
  //   validate: {
  //     isIn: {
  //       args: [["producto", "servicio"]],
  //       msg: 'Type must be either "product" or "service"',
  //     },
  //   },
  // })
  // type: string;

  @ForeignKey(() => Users)
  @Column({
    type: DataTypes.UUID,
    allowNull: false,
  })
  createdBy: string;

  @BelongsTo(() => Users, {
    foreignKey: "createdBy",
    as: "productCreatedBy",
  })
  productCreatedBy: Users;

  @Column({
    type: DataTypes.TEXT,
  })
  description: string;

  @Column({
    type: DataTypes.TEXT, 
  })
  details: string;

  @Column({
    type: DataTypes.STRING,
  })
  link: string;

  @Column({
    type: DataTypes.INTEGER,
    defaultValue: 10,
  })
  stockQuantity: number;

  @Column({
    type: DataTypes.STRING,
    defaultValue: 0,
  })
  price: string;

  @Column({
    type: DataTypes.INTEGER,
    defaultValue: 0,
  })
  discount: number;

  @ForeignKey(() => ProductsCat)
  @Column({
    type: DataTypes.INTEGER,
    allowNull: false,
  })
  category: number;

  @BelongsTo(() => ProductsCat, {
    foreignKey: "category",
    as: "categoryProduct",
  })
  categoryProduct: ProductsCat;

  @ForeignKey(() => Users)
  @Column({
    type: DataTypes.UUID,
  })
  updatedBy: string;

  @BelongsTo(() => Users, {
    foreignKey: "updatedBy",
    as: "productUpdatedBy",
  })
  productUpdatedBy: Users;

  @HasMany(() => Package, {
    foreignKey: "sku",
    as: "packageProductSku",
  })
  packageProductSku: Package[];

  @HasMany(() => Shipment, {
    foreignKey: "sku",
    as: "shipmentSku",
  })
  shipmentSku: Shipment[];

  @BeforeCreate
  static cleanData(product: Product) {
    product.product = product.product.trim();
    product.product = product.product.trim();
    product.description = product.description ? product.description.trim() : "";
    product.details = product.details ? product.details.trim() : "";
    product.link = product.link ? product.link.trim() : "";
    product.stockQuantity =
      product.category === ProductCat.PRODUCT ? product.stockQuantity : 0;
  }

  @AfterUpdate
  static removeParams(product: Product) {
    delete product.dataValues.deletedAt;
  }

  @BeforeUpdate
  static updateCleanData(product: Product) {
    this.cleanData(product);
  }

  @Expose({ name: "discountAmount" })
  get discountAmount(): string {
    const price = parseFloat(this.price);
    const discount = parseFloat(this.discount.toString());

    if (price > 0) {
      return ((discount * price) / 100).toFixed(2).toString();
    }

    return "0";
  }
}
