


import { DataTypes } from 'sequelize';
import sequelize from 'sequelize';
import {
  Column,
  Table,
  Model,
  BeforeCreate,
  BeforeUpdate,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  HasMany,
} from 'sequelize-typescript';
import { Fiscal } from 'src/fiscal/entities';

@Table({
  tableName: 'uso-cfdi',
  updatedAt: true,
  createdAt: true,
  paranoid: true,
  deletedAt: 'deletedAt',
})
export class UsoCfdi extends Model<UsoCfdi> {
  @Column({
    primaryKey: true,
    type: DataTypes.STRING,
    unique: true,
  })
  cUsoCFDI: string;

  @CreatedAt
  @Column({
    type: DataTypes.DATE,
    defaultValue: sequelize.literal('NOW()'),
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
  description: string;

  @Column({
    defaultValue: true,
    type: DataTypes.BOOLEAN, 
  })
  fisica: boolean;

  @Column({
    defaultValue: true,
    type: DataTypes.BOOLEAN, 
  })
  moral: boolean;


  @BeforeCreate
  static cleanData(usoCfdi: UsoCfdi) {
    usoCfdi.description = usoCfdi.description.trim();
  }

  @BeforeUpdate
  static updateCleanData(usoCfdi: UsoCfdi) {
    this.cleanData(usoCfdi);
  }

  @HasMany(() => Fiscal, { 
    foreignKey: 'cUsoCFDI',
    as: 'fiscalUsoCfdi',
  })
  fiscalUsoCfdi: Fiscal[];
}  
