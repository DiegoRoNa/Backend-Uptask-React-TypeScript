import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from "sequelize-typescript"
import User, { IUser } from "./User.model"
import Task, { ITask } from "./Task.model"

// type del modelo heredando de Document
export interface INote extends Model {
    id?: number
    content: string
    createdBy: IUser['id']
    taskId: ITask['id']
}

// Nombre de la tabla
@Table({
    tableName: 'Note'
})

// Modelo
class Note extends Model implements INote {
    // Columnas de la tabla
    @Column({ type: DataType.STRING(200) })
    declare content: string

    // llavea foránea hacia el id del usuario
    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER })
    declare createdBy: number

    // llavea foránea hacia el id de la tarea
    @ForeignKey(() => Task)
    @Column({ type: DataType.INTEGER })
    declare taskId: number

    // Relacion: uno a uno: Una nota le pertenece a un usuario
    @BelongsTo(() => User)
    user: User

    // Relacion: uno a uno: Una nota le pertenece a una tarea
    @BelongsTo(() => Task)
    task: Task
}

export default Note
