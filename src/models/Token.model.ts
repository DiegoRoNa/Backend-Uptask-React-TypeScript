import { Table, Column, Model, DataType, NotNull } from "sequelize-typescript"

export interface IToken extends Model {
    id?: number
    token: string
    user: number
    createdAt: Date
    expiredAt: Date
}

// Nombre de la tabla
@Table({
    tableName: 'token'
})

// Modelo
class token extends Model implements IToken {
    // Columnas de la tabla
    @NotNull
    @Column({ type: DataType.STRING(6), allowNull: false })
    declare token: string

    @NotNull
    @Column({ type: DataType.INTEGER, allowNull: false })
    declare user: number

    @NotNull
    @Column({ type: DataType.DATE, allowNull: false })
    declare createdAt: Date

    @NotNull
    @Column({ type: DataType.DATE, allowNull: false })
    declare expiredAt: Date
}

export default token
