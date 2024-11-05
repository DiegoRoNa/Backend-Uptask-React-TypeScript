import jwt from 'jsonwebtoken'

type UserPayload = {
    id: number
}

export const generateJWT = (payload: UserPayload) => {

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '180d' // 6 meses
    })

    return token
}