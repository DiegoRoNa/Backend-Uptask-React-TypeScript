import type { Request, Response } from "express"
import User from "../models/User.model"
import ProjectUser from "../models/ProjectUser.mode"
import Project from "../models/Project.model"

export class TeamMemberController {
    static findMemberByEmail = async (request: Request, response: Response) => {
        const { email } = request.body

        // buscar usuario
        const user = await User.findOne({ 
            where: { email },
            attributes: ['id', 'name', 'email']
        })

        if (!user) {
            const error = new Error('Usuario no encontrado')
            response.status(404).json({error: error.message})
            return
        }

        response.json(user)
    }

    static getProjectTeam = async (request: Request, response: Response) => {
        const project = await Project.findByPk(request.project.id, {
            include: [{
                model: User,
                required: false,
                attributes: ['id', 'name', 'email'], 
                through: { attributes: [] }  // No queremos datos de la tabla intermedia
            }],
            attributes: []
        })
 
        response.json(project)
    }

    static addMemberById = async (request: Request, response: Response) => {
        const { id } = request.body

        // buscar usuario
        const user = await User.findByPk(id, { 
            attributes: ['id']
        })

        if (!user) {
            const error = new Error('Usuario no encontrado')
            response.status(404).json({error: error.message})
            return
        }

        // validar que el usuario no esté agregado al proyecto
        const projectUserExists = await ProjectUser.findOne({
            where: { projectId: request.project.id, userId: user.id }
        })
        
        if (projectUserExists) {
            const error = new Error('El usuario ya se encuentra en el proyecto')
            response.status(409).json({error: error.message})
            return
        }

        // Asignar un usuario a un proyecto
        await request.project.$add('team', user)

        response.send('Usuario agregado al proyecto correctamente')
    }

    static removeMemberById = async (request: Request, response: Response) => {
        const { userId } = request.params

        // validar que el usuario no esté agregado al proyecto
        const projectUser = await ProjectUser.findOne({
            where: { projectId: request.project.id, userId: userId }
        })

        // validar que el usuario no esté agregado al proyecto
        if (!projectUser) {
            const error = new Error('El usuario no se encuentra en el proyecto')
            response.status(409).json({error: error.message})
            return
        }

        await projectUser.destroy()

        response.send('Usuario eliminado del proyecto')
    }
}
