import { DataTypes } from 'sequelize';
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
} from 'sequelize-typescript';

import sequelize from 'sequelize'; 
import { Users } from 'src/users/entities'; 

@Table({
  tableName: "multimedia",
  paranoid: true,
  deletedAt: "deletedAt",
})
export class Multimedia extends Model<Multimedia> {
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
  })
  updatedAt: Date;

  @DeletedAt
  @Column({
    type: DataTypes.DATE,
  })
  deletedAt: Date;

  @Column({
    type: DataTypes.DATE,
    defaultValue: sequelize.literal("NOW()"),
  })
  publicationDate: Date;

  @Column({
    type: DataTypes.STRING,
    allowNull: false,
  })
  title: string;

  @Column({
    type: DataTypes.STRING,
    allowNull: false,
  })
  medio: string;

  @Column({
    type: DataTypes.STRING,
    allowNull: false,
  })
  link: string;

  @Column({
    type: DataTypes.TIME,
    defaultValue: "00:00:00",
  })
  duration: string;

  @ForeignKey(() => Users)
  @Column({
    type: DataTypes.UUID,
    allowNull: false,
  })
  createdBy: string;

  @BelongsTo(() => Users, {
    foreignKey: "createdBy",
    as: "multimediaCreatedBy",
  })
  multimediaCreatedBy: Users;

  @ForeignKey(() => Users)
  @Column({
    type: DataTypes.UUID,
  })
  updatedBy: string;

  @BelongsTo(() => Users, {
    foreignKey: "updatedBy",
    as: "multimediaUpdatedBy",
  })
  multimediaUpdatedBy: Users;

  @BeforeCreate
  static cleanData(multmedia: Multimedia) {
    multmedia.title = multmedia.title.trim();
    multmedia.medio = multmedia.medio.trim().toLowerCase();
    multmedia.link = multmedia.link.trim();
  }

  @AfterUpdate
  static removeParams(multmedia: Multimedia) {
    delete multmedia.dataValues.deletedAt;
  }

  @BeforeUpdate
  static updateCleanData(multmedia: Multimedia) {
    this.cleanData(multmedia);
  }
}
