import { Router } from 'express';
import { registro, login, verificarRecuperacion, confirmarRecuperacion } from '../controllers/authControllers.js';
import { getUsuarios, editUsuario, eliminarUsuario } from '../controllers/usersController.js';
import { verifyToken } from '../middlewares/verifyToken.js';
import { validateId } from '../middlewares/validateID.js';

const router = Router();

router.post('/registro', registro);
router.post('/login', login);
router.post('/recuperar/verificar', verificarRecuperacion);
router.post('/recuperar/confirmar', confirmarRecuperacion);

router.get('/usuarios', verifyToken, getUsuarios);
router.put('/usuarios/:id', verifyToken, validateId, editUsuario);
router.delete('/usuarios/:id', verifyToken, validateId, eliminarUsuario);

export default router;