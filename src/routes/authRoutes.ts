import { Router } from "express"
import { AuthController } from "../controllers/AuthController"
import { body, param } from "express-validator"
import { handleInputErrors } from "../middleware/validation"
import { authenticate } from "../middleware/auth"

const router = Router()

// Routes for auth
router.post('/create-account', 
    body('name').notEmpty().withMessage('El nombre no puede ir vacío'),
    body('password').isLength({min: 8}).withMessage('La contraseña es muy corta, mínimo 8 caracteres'),
    body('password_confirmation').custom((value, {req}) => {
        if (value !== req.body.password) {
            throw new Error('Las contraseñas no son iguales')
        }
        return true
    }),
    body('email').isEmail().withMessage('El email no es válido'),
    handleInputErrors,
    AuthController.createAccount
)

router.post('/confirm-account',
    body('token').notEmpty().withMessage('El token no puede ir vacío'),
    handleInputErrors,    
    AuthController.confirmAccount
)

router.post('/login',
    body('email').isEmail().withMessage('El correo es obligatorio'),
    body('password').notEmpty().withMessage('La contraseña es obligatoria'),
    handleInputErrors,    
    AuthController.login
)

router.post('/request-code',
    body('email').isEmail().withMessage('El correo es obligatorio'),
    handleInputErrors,    
    AuthController.requestConfirmationCode
)

router.post('/forgot-password',
    body('email').isEmail().withMessage('El correo es obligatorio'),
    handleInputErrors,    
    AuthController.forgotPassword
)

router.post('/validate-token',
    body('token').notEmpty().withMessage('El token no puede ir vacío'),
    handleInputErrors,    
    AuthController.validateToken
)

router.post('/update-password/:token',
    param('token').isNumeric().withMessage('Token no válido'),
    body('password').isLength({min: 8}).withMessage('La contraseña es muy corta, mínimo 8 caracteres'),
    body('password_confirmation').custom((value, {req}) => {
        if (value !== req.body.password) {
            throw new Error('Las contraseñas no son iguales')
        }
        return true
    }),
    handleInputErrors,    
    AuthController.updatePasswordWithToken
)

router.get('/user', authenticate, AuthController.user)

// Routes for Profile
router.put('/profile', 
    authenticate, 
    body('name').notEmpty().withMessage('El nombre no puede ir vacío'),
    body('email').isEmail().withMessage('El correo no es válido'),
    handleInputErrors,    
    AuthController.updateProfile
)

router.post('/update-password', 
    authenticate, 
    body('current_password').notEmpty().withMessage('La contraseña actual, no puede ir vacía'),
    body('password').isLength({min: 8}).withMessage('La contraseña es muy corta, mínimo 8 caracteres'),
    body('password_confirmation').custom((value, {req}) => {
        if (value !== req.body.password) {
            throw new Error('Las contraseñas nuevas no son iguales')
        }
        return true
    }),
    handleInputErrors,    
    AuthController.updateCurrentUserPassword
)

router.post('/check-password', 
    authenticate, 
    body('password').notEmpty().withMessage('La contraseña no puede ir vacía'),
    handleInputErrors,    
    AuthController.checkPassword
)

export default router
