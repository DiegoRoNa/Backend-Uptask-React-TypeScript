import type { Request, Response } from "express"
import colors from "colors"
import Note, { INote } from "../models/Note.model"

type NoteParams = {
    noteId: number
}

export class NoteController {
    static createNote = async (request: Request<{}, {}, INote>, response: Response) => {
        
        const { content } = request.body
        
        try {
            const note = new Note()
            note.content = content
            note.createdBy = request.user.id
            note.taskId = request.task.id

            await note.save()

            response.send('Nota nueva guardarda correctamente')
        } catch (error) {
            console.log(colors.bgRed.white.bold(error.message))
            response.status(500).json({error: 'No fue posible crear la nota'})
        }
    }

    static getTaskNotes = async (request: Request, response: Response) => {
        try {
            const notes = await Note.findAll({
                where: { taskId: request.task.id },
                order: [
                    ['createdAt', 'ASC']
                ]
            }) 
            response.json(notes)
        } catch (error) {
            console.log(colors.bgRed.white.bold(error.message))
            response.status(500).json({error: 'No fue posible obtener las notas'})
        }
    }

    static deleteNote = async (request: Request<NoteParams>, response: Response) => {
        
        const { noteId } = request.params
        
        try {
            const note = await Note.findByPk(noteId)

            if (!note) {
                const error = new Error('Nota no encontrada')
                response.status(404).json({error: error.message})
                return
            }
            
            // verificar que el proyecto pertenezca al usuario autenticado
            if (note.createdBy !== request.user.id) {
                const error = new Error('Acción no válida')
                response.status(401).json({error: error.message})
                return
            }

            await note.destroy()
            response.send('Nota eliminada')

        } catch (error) {
            console.log(colors.bgRed.white.bold(error.message))
            response.status(500).json({error: 'No fue posible eliminar la nota'})
        }
    }
}