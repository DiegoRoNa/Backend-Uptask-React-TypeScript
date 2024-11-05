import { Table, Column, Model, DataType, ForeignKey, BelongsTo, Default, HasMany, BeforeDestroy } from "sequelize-typescript"
import Project, { IProject } from "./Project.model"
import TaskStatusHistory from "./TaskStatusHistory.model"
import Note from "./Note.model"

// diccionar de estatus de una tarea
const taskStatus = {
    PENDING: 'pending',
    ON_HOLD: 'onHold',
    IN_PROGRESS: 'inProgress',
    UNDER_REVIEW: 'underReview',
    COMPLETED: 'completed'
} as const

// type del status
export type TaskStatus = typeof taskStatus[keyof typeof taskStatus]

// type del modelo heredando de Document
export interface ITask extends Model {
    id?: number
    name: string
    description: string
    projectId: IProject['id']
    status: TaskStatus
}

// Nombre de la tabla
@Table({
    tableName: 'task'
})

// Modelo
class Task extends Model implements ITask {
    // Columnas de la tabla
    @Column({ type: DataType.STRING(100), allowNull: false })
    declare name: string

    @Column({ type: DataType.STRING(100), allowNull: false })
    declare description: string
    
    @Default(taskStatus.PENDING)
    @Column({ type: DataType.STRING(20) })
    declare status: TaskStatus

    // llavea foránea hacia el id del proyecto
    @ForeignKey(() => Project)
    @Column({ type: DataType.INTEGER })
    declare projectId: number

    // llavea foránea hacia el id del usuario que modifico el estatus
    // @ForeignKey(() => User)
    // @Column({ type: DataType.INTEGER })
    // declare completedBy: number

    // Relacion: uno a uno: El estatus de la tarea puede ser cambiada por un usuario
    // @BelongsTo(() => User)
    // userCompletedBy: User

    // Relacion: uno a uno: Una tarea le pertenece a un proyecto
    @BelongsTo(() => Project)
    project: Project

    // Relacion: uno a muchos: Una tarea puede tener muchos estatus
    @HasMany(() => TaskStatusHistory)
    historyStatus: TaskStatusHistory[]

    // Relacion: uno a muchos: Una tarea puede tener muchas notas
    @HasMany(() => Note)
    notes: Note[]

    // hooks
    // elminar notas de una tarea
    @BeforeDestroy
    static async deleteNotes(task: Task) {
        await Note.destroy({
            where: { taskId: task.id }
        })
    }
}



export default Task
