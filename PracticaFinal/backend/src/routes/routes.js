import { Router } from 'express';
import { registro, login } from '../controllers/authControllers.js';
import { getUsuarios, editUsuario, eliminarUsuario } from '../controllers/usersController.js';
import { verifyToken } from '../middlewares/verifyToken.js';
import { validateId } from '../middlewares/validateID.js';

router.put('/usuarios/:id', verifyToken, validateId, editUsuario);
router.delete('/usuarios/:id', verifyToken, validateId, eliminarUsuario);

const router = Router();

router.post('/registro', registro);
router.post('/login', login);
router.get('/usuarios', verifyToken, getUsuarios);


router.get('/usuarios', verifyToken, getUsuarios);
router.put('/usuarios/:id', verifyToken, editUsuario);
router.delete('/usuarios/:id', verifyToken, eliminarUsuario);

export default router;