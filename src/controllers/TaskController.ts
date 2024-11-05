import type { Request, Response } from "express"
import colors from "colors"
import Task from "../models/Task.model"
import Project from "../models/Project.model"
import User from "../models/User.model"
import TaskStatusHistory from "../models/TaskStatusHistory.model"
import Note from "../models/Note.model"

export class TaskController {
    /**
     * Método para obtener las tareas de un proyecto
    * @param request Peticion
    * @param respoonse Respuesta
    */
    static getProjectTasks = async (request: Request, response: Response) => {
        
        try {
            const tasks = await Task.findAll({
                include: [
                    {
                        model: Project,
                        required: true, // Esto asegura que se realice un INNER JOIN
                    }
                ],
                where: { projectId: request.project.id } // el project ya viene desde el middleware project
            })

            response.json(tasks)
        } catch (error) {
            console.log(colors.bgRed.white.bold(error.message))
            response.status(500).json({error: 'No fue posible obtener las tareas'})
        }
    }

    /**
     * Método para obtener todos los proyectos
     * @param request Peticion
     * @param respoonse Respuesta
     */
    static createTask = async (request: Request, response: Response) => {
        
        try {
            const task = new Task(request.body)
            task.projectId = request.project.id // el project ya viene desde el middleware project
            await task.save()

            response.send('Tarea nueva guardarda correctamente')
        } catch (error) {
            console.log(colors.bgRed.white.bold(error.message))
            response.status(500).json({error: 'No fue posible crear la tarea'})
        }
    }

    /**
     * Método para obtener una tarea por su ID
     * @param request Peticion
     * @param respoonse Respuesta
     */
    static getTaskById = async (request: Request, response: Response) => {
        
        try {
            const task = await Task.findByPk(request.task.id, {
                include: [
                    {
                        model: TaskStatusHistory,
                        include: [
                            {
                                model: User,
                                attributes: ['id', 'name', 'email']
                            }
                        ], // Incluimos el usuario que realizó cada cambio
                        attributes: ['id', 'status'],
                        order: [['createdAt', 'ASC']]
                    },
                    {
                        model: Note,
                        include: [
                            {
                                model: User,
                                attributes: ['id', 'name', 'email']
                            }
                        ],
                        order: [['createdAt', 'ASC']]
                    }
                ]
            })
            response.json(task)

        } catch (error) {
            console.log(colors.bgRed.white.bold(error.message))
            response.status(500).json({error: 'No fue posible obtenr la información de la tarea'})
        }
    }

    /**
     * Método para actualizar una tarea por ID
     * @param request Peticion
     * @param respoonse Respuesta
     */
    static updateTask = async (request: Request, response: Response) => {
        
        try {
            // array de promesas
            await Promise.allSettled([request.task.update(request.body), request.task.save()])

            response.send('Tarea actualizada')

        } catch (error) {
            console.log(colors.bgRed.white.bold(error.message))
            response.status(500).json({error: 'No fue posible actualizar la tarea'})
        }
    }

    /**
     * Método para eliminar una tarea por ID
     * @param request Peticion
     * @param respoonse Respuesta
     */
    static deleteTask = async (request: Request, response: Response) => {
        
        try {

            await request.task.destroy()
            response.send('Tarea eliminada')

        } catch (error) {
            console.log(colors.bgRed.white.bold(error.message))
            response.status(500).json({error: 'No fue posible eliminar la tarea'})
        }
    }

    /**
     * Método para actualizar el estatus de una tarea
     * @param request Peticion
     * @param respoonse Respuesta
     */
    static updateStatus = async (request: Request, response: Response) => {
        
        try {
            
            request.task.status = request.body.status // status actual

            // historial del usuario que actualiza el estatus de la tarea
            const history = new TaskStatusHistory()
            history.taskId = request.task.id
            history.userId = request.user.id
            history.status = request.body.status

            const saveData = [
                request.task.update(request.body),
                request.task.save(),
                history.save()
            ]

            // array de promesas
            await Promise.allSettled(saveData)

            response.send('Estatus de la tarea actualizado')

        } catch (error) {
            console.log(colors.bgRed.white.bold(error.message))
            response.status(500).json({error: 'No fue posible modificar el estatus'})
        }
    }
}