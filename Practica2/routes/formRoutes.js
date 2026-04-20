import express from "express";

import {
    mostrarFormulario,
    registrarUsuario,
    mostrarLogin,
    iniciarSesion,
    mostrarBienvenida,
    mostrarRecuperar,
    verificarUsuario,
    validarRespuesta,
    cambiarPassword
} from "../controllers/formControllers.js";

const router = express.Router();

// =====================
// RUTA PRINCIPAL
// =====================
router.get("/", (req, res) => {
    res.redirect("/login");
});

// =====================
// REGISTRO
// =====================
router.get("/registro", mostrarFormulario);
router.post("/registro", registrarUsuario);

// =====================
// LOGIN
// =====================
router.get("/login", mostrarLogin);
router.post("/login", iniciarSesion);

// =====================
// BIENVENIDA
// =====================
router.get("/bienvenida", mostrarBienvenida);

// =====================
// RECUPERAR
// =====================
router.get("/recuperar", mostrarRecuperar);
router.post("/recuperar/verificar", verificarUsuario);
router.post("/recuperar/respuesta", validarRespuesta);
router.post("/recuperar/password", cambiarPassword);

export default router;