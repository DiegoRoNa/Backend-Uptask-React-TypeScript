import { Table, Column, Model, DataType, ForeignKey } from "sequelize-typescript";
import Project, { IProject } from "./Project.model";
import User, { IUser } from "./User.model";

export interface IProjectUser extends Model {
    projectId: IProject['id']
    userId: IUser['id']
}

// Nombre de la tabla
@Table({
    tableName: 'projectUser'
})

// Modelo
class ProjectUser extends Model implements IProjectUser {
    @ForeignKey(() => Project)
    @Column({ type: DataType.INTEGER })
    declare projectId: number
  
    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER })
    declare userId: number
}

export default ProjectUser
