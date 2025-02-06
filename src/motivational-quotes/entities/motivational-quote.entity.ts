
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
import { Users } from 'src/users/entities'; 

@Table({
    tableName: 'motivational-quotes',
    paranoid: true,
    deletedAt: 'deletedAt',
})
export class MotivationalQuote extends Model<MotivationalQuote> {
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
        type: DataTypes.DATE,
        defaultValue: sequelize.literal('NOW()'),
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
    quote: string;

    @ForeignKey(() => Users)
    @Column({
      type: DataTypes.UUID,
      allowNull: false,
    })
    createdBy: string;
  
    @BelongsTo(() => Users, {
      foreignKey: 'createdBy',
      as: 'quoteCreatedBy',
    })
    quoteCreatedBy: Users;


    @ForeignKey(() => Users)
    @Column({
      type: DataTypes.UUID, 
    })
    updatedBy: string;
  
    @BelongsTo(() => Users, {
      foreignKey: 'updatedBy',
      as: 'quoteUpdatedBy',
    })
    quoteUpdatedBy: Users;

    @Column({
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    })
    isNotificated: boolean;

    @BeforeCreate
    static cleanData(motivationalQuote: MotivationalQuote) {
        motivationalQuote.title = motivationalQuote.title.trim();
        motivationalQuote.quote = motivationalQuote.quote.trim(); 
    }

    @AfterUpdate
    static removeParams(motivationalQuote: MotivationalQuote) { 
      delete motivationalQuote.dataValues.deletedAt;
    }
  
    @BeforeUpdate
    static updateCleanData(motivationalQuote: MotivationalQuote) {
        this.cleanData(motivationalQuote);
    }
}
