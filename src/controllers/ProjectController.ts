import type { Request, Response } from "express"
import Project from "../models/Project.model"
import colors from "colors"
import Task from "../models/Task.model"
import { Op } from "sequelize"
import User from "../models/User.model"

export class ProjectController {

    /**
     * Método para obtener todos los proyectos
     * @param request Peticion
     * @param respoonse Respuesta
     */
    static getAllProjects = async (request: Request, response: Response) => {
        try {
            // obtener proyectos del usuario autenticado
            const projects = await Project.findAll({
                include: [{
                    model: User, // Incluimos el modelo User a través de la relación definida
                    required: false,
                    attributes: ['id'],
                    through: { attributes: [] }  // No queremos datos de la tabla intermedia ProjectUser
                }],
                where: {
                    [Op.or]: [
                        { manager: request.user.id }, // Primera condición: manager es el usuario actual
                        { '$`team`.id$': request.user.id } // Segunda condición: el usuario es parte del proyecto
                        // usamos "team.id", ya que así se llama la relacion en el modelo Project
                    ]
                },
                group: ['Project.id'], // Agrupamos por id del proyecto, usamos "Project.id", por el alias del Modelo Project, aunque la tabla se llame project en minuscula
                order: [
                    ['projectName', 'ASC'], // Ordenamos por nombre del proyecto
                ]
            })

            response.json(projects)
        } catch (error) {
            console.log(colors.bgRed.white.bold(error.message))
            response.status(500).json({error: 'No fue posible obtener los proyectos'})
        }
    }

    /**
     * Método para crear un proyecto
     * @param request Peticion
     * @param respoonse Respuesta
     */
    static createProject = async (request: Request, response: Response) => {
        // instanciar modelo
        const project = new Project(request.body)

        // asignar manager al proyecto
        project.manager = request.user.id

        // guardar en la BD
        try {
            await project.save()
            response.send('Proyecto nuevo guardardo correctamente')
        } catch (error) {
            console.log(colors.bgRed.white.bold(error.message))
            response.status(500).json({error: 'No fue posible crear el proyecto'})
        }
    }

    /**
     * Método para obtener un proyecto por ID
     * @param request Peticion
     * @param respoonse Respuesta
     */
     static getProjectById = async (request: Request, response: Response) => {

        try {
            const { id } = request.params
            const project = await Project.findByPk(id, 
                {
                    include: [
                        {
                            model: Task,
                            required: false
                        },
                        {
                            model: User,
                            required: false,
                            attributes: ['id'],
                            through: { attributes: [] }
                        }
                    ]
                }
            )

            if (!project) {
                const error = new Error('Proyecto no encontrado')
                response.status(404).json({error: error.message})
                return
            }

            // verificar que el proyecto pertenezca al usuario autenticado o sea colaborador
            const userCollaborator = project.dataValues.team.find(project => project.id === request.user.id)
            
            if (project.manager !== request.user.id && !userCollaborator) {
                const error = new Error('Acción no válida')
                response.status(404).json({error: error.message})
                return
            }
            
            response.json(project)

        } catch (error) {
            console.log(colors.bgRed.white.bold(error.message))
            response.status(500).json({error: 'No fue posible obtener la información del proyecto'})
        }
    }

    /**
     * Método para actualizar un proyecto pro ID
     * @param request Peticion
     * @param respoonse Respuesta
     */
    static updateProject = async (request: Request, response: Response) => {

        try {
            // con update, evitamos ese reemplazo de PUT y actualiza sin afectar los demas datos del obj
            // array de promesas
            await Promise.allSettled([request.project.update(request.body), request.project.save()])
            response.send('Proyecto actualizado')

        } catch (error) {
            console.log(colors.bgRed.white.bold(error.message))
            response.status(500).json({error: 'No fue posible actualizar el proyecto'})
        }
    }

    /**
     * Método para eliminar un proyecto pro ID
     * @param request Peticion
     * @param respoonse Respuesta
     */
    static deleteProject = async (request: Request, response: Response) => {

        try {
            await request.project.destroy()
            response.send('Proyecto eliminado')

        } catch (error) {
            console.log(colors.bgRed.white.bold(error.message))
            response.status(500).json({error: 'No fue posible eliminar el proyecto'})
        }
    }
}