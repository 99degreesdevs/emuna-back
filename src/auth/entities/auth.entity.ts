import { DataTypes } from 'sequelize';
import { Column, Table, Model, UpdatedAt, DeletedAt, CreatedAt, BeforeCreate, BeforeFind, BeforeUpdate } from 'sequelize-typescript';
import sequelize from 'sequelize';
import { v4 as uuid } from 'uuid';
import * as moment from 'moment';
@Table({
  tableName: 'auth',
  updatedAt: true,
  createdAt: false,
  paranoid: true,
  deletedAt: 'deletedAt',
})
export class Auth extends Model<Auth> {
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER,
  })
  id: number;

  @CreatedAt
  @Column({
    type: DataTypes.DATE,
    defaultValue: sequelize.literal('NOW()'),
  })
  createdAt: Date;

  @UpdatedAt
  @Column({
    type: DataTypes.DATE,
    defaultValue: sequelize.literal('NOW()'),
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
    type: DataTypes.DATE,
  })
  expiration: Date;

  @Column({ defaultValue: '' })
  data: string;

  @Column({ defaultValue: 'xxx' })
  hash: string;

  @Column({ defaultValue: 'xxxx' })
  code: string;

  @Column({ defaultValue: 'OPEN' })
  status: string;

  @Column({ defaultValue: '' })
  origin: string;

  @Column({ defaultValue: '' })
  process: string;

  @BeforeCreate
  static cleanData(auth: Auth) {
    auth.email = auth.email.trim();
    auth.hash = uuid(); 
    auth.code = `${Math.floor(1000 + Math.random() * 9000)}`
    auth.origin = auth.origin.toUpperCase();
    auth.process = auth.process.toUpperCase().trim(); 
    auth.expiration = moment(new Date()).add(1, 'day').toDate()
  }

  @BeforeUpdate
  static setExpiration( auth: Auth ){
    this.cleanData(auth)
  }



 
}
