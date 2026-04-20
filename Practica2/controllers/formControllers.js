import path from "path";
import { fileURLToPath } from "url";

import {
    procesarFormulario,
    procesarLogin,
    obtenerPregunta,
    validarRespuesta as validarRespuestaService,
    cambiarPassword as cambiarPasswordService
} from "../services/formService.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// =====================
// REGISTRO
// =====================
export const mostrarFormulario = (req, res) => {
    res.sendFile(path.join(__dirname, "../public/html/formVIJS.html"));
};

export const registrarUsuario = async (req, res) => {
    try {
        const resultado = await procesarFormulario(req.body);

        res.json({
            ok: true,
            data: resultado
        });

    } catch (error) {
        res.status(400).json({
            ok: false,
            mensaje: error.message
        });
    }
};

// =====================
// LOGIN
// =====================
export const mostrarLogin = (req, res) => {
    res.sendFile(path.join(__dirname, "../public/html/loginVIJS.html"));
};

export const iniciarSesion = async (req, res) => {
    try {
        const usuario = await procesarLogin(req.body);

        res.redirect(`/bienvenida?nombre=${usuario.nombre}`);

    } catch (error) {
        res.status(400).json({
            ok: false,
            mensaje: error.message
        });
    }
};

// =====================
// BIENVENIDA
// =====================
export const mostrarBienvenida = (req, res) => {
    res.sendFile(path.join(__dirname, "../public/html/bienvenida.html"));
};

// =====================
// RECUPERACIÓN
// =====================
export const mostrarRecuperar = (req, res) => {
    res.sendFile(path.join(__dirname, "../public/html/recuperar.html"));
};

// ETAPA 1
export const verificarUsuario = async (req, res) => {
    try {
        const resultado = await obtenerPregunta(req.body);
        res.json(resultado);

    } catch (error) {
        res.status(400).json({
            mensaje: error.message
        });
    }
};

// ETAPA 2
export const validarRespuesta = async (req, res) => {
    try {
        const resultado = await validarRespuestaService(req.body);
        res.json(resultado);

    } catch (error) {
        res.status(400).json({
            mensaje: error.message
        });
    }
};

// ETAPA 3
export const cambiarPassword = async (req, res) => {
    try {
        const resultado = await cambiarPasswordService(req.body);
        res.json(resultado);

    } catch (error) {
        res.status(400).json({
            mensaje: error.message
        });
    }
};