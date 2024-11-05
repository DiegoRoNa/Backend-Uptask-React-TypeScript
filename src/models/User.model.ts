import { Table, Column, Model, DataType, Default, IsLowercase, HasMany, BelongsToMany } from "sequelize-typescript"
import Project from "./Project.model"
import ProjectUser from "./ProjectUser.mode"
import TaskStatusHistory from "./TaskStatusHistory.model"
import Note from "./Note.model"

export interface IUser extends Model {
    id?: number
    email: string
    password: string
    name: string
    confirmed: boolean
}

// Nombre de la tabla
@Table({
    tableName: 'user'
})

// Modelo
class User extends Model implements IUser {
    // Columnas de la tabla
    @IsLowercase
    @Column({ type: DataType.STRING(100), allowNull: false })
    declare email: string

    @Column({ type: DataType.STRING(100), allowNull: false })
    declare password: string

    @Column({ type: DataType.STRING(100), allowNull: false })
    declare name: string

    @Default(false)
    @Column({ type: DataType.BOOLEAN })
    declare confirmed: boolean

    // Relacion: Uno a muchos: Un usuario puede modificar muchas tareas
    // @HasMany(() => Task)
    // tasks: Task[]

    // Relacion: muchos a muchos: Un usuario puede estar en muchos proyectos
    @BelongsToMany(() => Project, () => ProjectUser)
    projects: Project[]

    // Relacion: uno a muchos: Un usuario puede crear muchos estatus en muchas tareas
    @HasMany(() => TaskStatusHistory)
    historyStatus: TaskStatusHistory[]

    // Relacion: uno a muchos: Un usuario puede crear muchas notas
    @HasMany(() => Note)
    notes: Note[]
}

export default User
