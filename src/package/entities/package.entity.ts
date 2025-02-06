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
} from "sequelize-typescript";

import sequelize from "sequelize";
import { Users } from "src/users/entities";
import { Product } from "src/products/entities";
import { ProductsCat } from "src/products-cat/entities";

@Table({
  tableName: "package",
  paranoid: true,
  deletedAt: "deletedAt",
})
export class Package extends Model<Package> {
  @ForeignKey(() => Product)
  @Column({
    primaryKey: true,
    type: DataTypes.UUID,
  })
  sku: string;

  @BelongsTo(() => Product, {
    foreignKey: "sku",
    as: "packageProductSku",
  })
  packageProductSku: Product;

  @ForeignKey(() => ProductsCat)
  @Column({
    primaryKey: true,
    type: DataTypes.INTEGER,
  })
  category: number;

  @BelongsTo(() => ProductsCat, {
    foreignKey: "category",
    as: "packageProductCat",
  })
  packageProductCat: ProductsCat;

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
    type: DataTypes.INTEGER,
    allowNull: true,
  })
  amount: number;

  @ForeignKey(() => Users)
  @Column({
    type: DataTypes.UUID,
  })
  updatedBy: string;

  @BelongsTo(() => Users, { foreignKey: "updatedBy", as: "updatedPackageBy" })
  updatedPackageBy: Users;

  @Column({
    defaultValue: true,
  })
  isActive: boolean;
}
