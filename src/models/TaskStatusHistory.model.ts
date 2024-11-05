import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from "sequelize-typescript"
import Task, { ITask, TaskStatus } from "./Task.model"
import User, { IUser } from "./User.model"

export interface ITaskStatusHistory extends Model {
    taskId: ITask['id']
    userId: IUser['id']
    status: TaskStatus
}

// Nombre de la tabla
@Table({
    tableName: 'taskStatusHistory'
})

// Modelo
class TaskStatusHistory extends Model implements ITaskStatusHistory {
    @ForeignKey(() => Task)
    @Column({ type: DataType.INTEGER })
    declare taskId: number

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER })
    declare userId: number

    @Column({ type: DataType.STRING(20) })
    declare status: TaskStatus

    @BelongsTo(() => Task)
    task: Task

    @BelongsTo(() => User)
    user: User
}

export default TaskStatusHistory
