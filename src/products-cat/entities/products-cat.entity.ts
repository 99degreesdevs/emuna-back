import { DataTypes } from "sequelize";
import {
  Column,
  Table,
  Model,
  BeforeCreate,
  BeforeUpdate,
  CreatedAt,
  UpdatedAt,
  HasMany,
  DeletedAt,
} from "sequelize-typescript";

import sequelize from "sequelize";
import { Product } from "src/products/entities";
import { Package } from "src/package/entities";
import { Credit } from "src/credits/entities";

@Table({
  tableName: "products-cat",
  paranoid: true,
  deletedAt: "deletedAt",
})
export class ProductsCat extends Model<ProductsCat> {
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER,
  })
  id: number;

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
  @Column({
    type: DataTypes.STRING,
    allowNull: false,
  })
  category: string;

  @Column({
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  })
  isPhysical: boolean;

  @Column({
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  })
  requiresInventory: boolean;

  @Column({
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  })
  requiresShipping: boolean;

  @Column({
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  })
  canBePartOfPackage: boolean;

  @Column({
    type: DataTypes.TEXT,
    allowNull: true,
  })
  description: string;

  @Column({
    defaultValue: true,
  })
  isActive: boolean;

  @HasMany(() => Product, {
    foreignKey: "category",
    as: "categoryProduct",
  })
  categoryProduct: Product[];

  @HasMany(() => Package, {
    foreignKey: "category",
    as: "packageProductCat",
  })
  packageProductCat: Package[]; 

  @HasMany(() => Credit, {
    foreignKey: "category",
    as: "creditCategoryProduct",
  })
  creditCategoryProduct: Credit[];  

  @BeforeCreate
  static cleanData(productsCat: ProductsCat) {
    productsCat.category = productsCat.category
      ? productsCat.category.trim().toLowerCase()
      : "";

    productsCat.description = productsCat.description
      ? productsCat.description.trim()
      : "";
  }

  @BeforeUpdate
  static updateCleanData(productsCat: ProductsCat) {
    this.cleanData(productsCat);
  }
}
