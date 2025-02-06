
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
    ForeignKey,
    BelongsTo,
    AfterUpdate,
} from 'sequelize-typescript';
import { RegimenFiscal } from 'src/regimen-fiscal/entities';
import { Users } from 'src/users/entities';
import { UsoCfdi } from 'src/uso-cfdi/entities';

@Table({
    tableName: 'fiscal',
    paranoid: true,
    deletedAt: 'deletedAt',
})
export class Fiscal extends Model<Fiscal> {
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
    address: string;

    @Column({
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    })
    invoice: boolean;

    @Column({
        type: DataTypes.STRING,
        allowNull: false,
        // unique: true,
    })
    RFC: string;

    @Column({
        type: DataTypes.STRING,
        allowNull: false,
    })
    razonSocial: string;

    @ForeignKey(() => Users)
    @Column({
        primaryKey: true,
        type: DataTypes.UUID,
        allowNull: false,
    })
    userId: string;

    @BelongsTo(() => Users, {
        foreignKey: 'userId',
        as: 'fiscalUsers',
    })
    fiscalUsers: Users;

    @ForeignKey(() => RegimenFiscal)
    @Column({
        primaryKey: true,
        type: DataTypes.INTEGER,
    })
    cRF: number;

    @BelongsTo(() => RegimenFiscal, {
        foreignKey: 'cRF',
        as: 'fiscalRegimenFiscal',
    })
    fiscalRegimenFiscal: RegimenFiscal;

    @ForeignKey(() => UsoCfdi)
    @Column({
        primaryKey: true,
        type: DataTypes.STRING,
    })
    cUsoCFDI: string;

    @BelongsTo(() => UsoCfdi, {
        foreignKey: 'cUsoCFDI',
        as: 'fiscalUsoCfdi',
    })
    fiscalUsoCfdi: UsoCfdi;

    @BeforeCreate
    static cleanData(fiscal: Fiscal) {
        fiscal.address = fiscal.address.trim();
        fiscal.razonSocial = fiscal.razonSocial.trim();
        fiscal.cUsoCFDI = fiscal.cUsoCFDI.trim();
        fiscal.RFC = fiscal.RFC.trim();
    }

    @AfterUpdate
    static removeParams(fiscal: Fiscal) { 
      delete fiscal.dataValues.deletedAt;
    }
  

    @BeforeUpdate
    static updateCleanData(fiscal: Fiscal) {
        this.cleanData(fiscal);
    }
}
