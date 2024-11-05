import type { Request, Response, NextFunction } from "express"
import Task, { ITask } from "../models/Task.model"

/**
 * Agregar a "request", el atributo "task", con un interface, ya que este, permite agregar nuevos
 * atributos al request que ya existe de Express
*/
declare global {
    namespace Express {
        interface Request {
            task: ITask
        }
    }
}

/**
 * Middleware para validar si un proyecto existe
 */
export async function TaskExists(request : Request, response : Response, next : NextFunction) {
    try {
        const { taskId } = request.params

        const task = await Task.findByPk(taskId)

        if (!task) {
            const error = new Error('Tarea no encontrada')
            response.status(404).json({error: error.message})
            return
        }

        // pasar el task por el request
        request.task = task

        next()
    } catch (error) {
        response.status(500).json({error: 'Ocurrió un error inesperado'})
    }
}

/**
 * Middleware para validar si una tarea existe
 */
export async function TaskBelongsToProject(request : Request, response : Response, next : NextFunction) {
    // validar que la tarea pertenezca al proyecto
    if (request.task.projectId !== request.project.id) {
        const error = new Error('Acción no válida')
        response.status(400).json({error: error.message})
        return
    }

    next()
}

/**
 * Middleware para validar si el usuario autenticado es el manager
 */
export async function hasAuthorization(request : Request, response : Response, next : NextFunction) {
    if (request.user.id !== request.project.manager) {
        const error = new Error('Acción no válida')
        response.status(400).json({error: error.message})
        return
    }

    next()
}