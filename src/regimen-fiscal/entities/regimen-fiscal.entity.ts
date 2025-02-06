

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
  tableName: 'regimen-fiscal',
  updatedAt: true,
  createdAt: true,
  paranoid: true,
  deletedAt: 'deletedAt',
})
export class RegimenFiscal extends Model<RegimenFiscal> {
  @Column({
    primaryKey: true,
    type: DataTypes.INTEGER,
    unique: true,
  })
  cRF: Number;

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
  static cleanData(regimenFiscal: RegimenFiscal) {
    regimenFiscal.description = regimenFiscal.description.trim();
  }

  @BeforeUpdate
  static updateCleanData(regimenFiscal: RegimenFiscal) {
    this.cleanData(regimenFiscal);
  }

  @HasMany(() => Fiscal, { 
    foreignKey: 'cRF',
    as: 'fiscalRegimenFiscal',
  })
  fiscalRegimenFiscal: Fiscal[];
}  
