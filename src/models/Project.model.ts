import { Table, Column, Model, DataType, HasMany, ForeignKey, BelongsToMany, BeforeDestroy } from "sequelize-typescript"
import Task from "./Task.model"
import User from "./User.model"
import ProjectUser from "./ProjectUser.mode"
import Note from "./Note.model"

export interface IProject extends Model {
    id?: number
    projectName: string
    clientName: string
    description: string
    manager: number
}

// Nombre de la tabla
@Table({
    tableName: 'project'
})

// Modelo
class Project extends Model implements IProject {
    // Columnas de la tabla
    @Column({ type: DataType.STRING(100), allowNull: false })
    declare projectName: string

    @Column({ type: DataType.STRING(100), allowNull: false })
    declare clientName: string

    @Column({ type: DataType.STRING(100), allowNull: false })
    declare description: string

    // Relacion: Uno a muchos: Un proyecto puede tener muchas tareas
    @HasMany(() => Task)
    tasks: Task[]

    // llavea foránea hacia el id del usuario
    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER })
    declare manager: number

    // Relacion: uno a uno: Un proyecto le pertenece a un usuario manager
    // @BelongsTo(() => User)
    // user: User

    // Relacion: muchos a muchos: Un proyecto puede tener muchos usuarios colaborando
    @BelongsToMany(() => User, () => ProjectUser)
    team: User[]

    // hooks
    // elminar tareas de un proyecto
    @BeforeDestroy
    static async deleteNotes(project: Project) {

        // obtener las tareas y eliminar sus notas
        const tasks = await Task.findAll({ where: {projectId: project.id} })
        for (const task of tasks) {
            await Note.destroy({ where: {taskId: task.id} })
        }

        await Task.destroy({
            where: { projectId: project.id }
        })
    }
}

export default Project
