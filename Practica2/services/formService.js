import bcrypt from "bcrypt";
import {
    writeUser,
    findUserByEmail,
    existsUser,
    readUsers
} from "./services.js";

const SALT_ROUNDS = 10;


// REGISTRO

export const procesarFormulario = async (datos) => {
    const { nombre, password, pregunta, respuesta, correo } = datos;

    if (!nombre || !correo || !password || !pregunta || !respuesta) {
        throw new Error("Todos los campos son obligatorios");
    }

    if (await existsUser(correo)) {
        throw new Error("El usuario ya existe");
    }

    // HASH
    const hashPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const hashRespuesta = await bcrypt.hash(respuesta, SALT_ROUNDS);

    const nuevoUsuario = {
        nombre,
        correo,
        contrasena: hashPassword,
        preguntarc: pregunta,
        respuestarc: hashRespuesta
    };

    await writeUser(nuevoUsuario);

    return { nombre, correo };
};

// =====================
// LOGIN
// =====================
export const procesarLogin = async (datos) => {
    const { correo, password } = datos;

    const usuario = await findUserByEmail(correo);

    if (!usuario) {
        throw new Error("Usuario no existe");
    }

    // COMPARAR HASH
    const coincide = await bcrypt.compare(password, usuario.contrasena);

    if (!coincide) {
        throw new Error("Contraseña incorrecta");
    }

    return usuario;
};
// =====================
// RECUPERACIÓN
// =====================

// ETAPA 1
export const obtenerPregunta = async (datos) => {
    const { correo } = datos;

    const usuario = await findUserByEmail(correo);

    if (!usuario) {
        throw new Error("Usuario no existe");
    }

    return {
        pregunta: usuario.preguntarc
    };
};

// ETAPA 2
export const validarRespuesta = async (datos) => {
    const { correo, respuesta } = datos;

    const usuario = await findUserByEmail(correo);

    if (!usuario) {
        throw new Error("Usuario no existe");
    }

    const coincide = await bcrypt.compare(respuesta, usuario.respuestarc);

    if (!coincide) {
        throw new Error("Respuesta incorrecta");
    }

    return { mensaje: "Respuesta correcta" };
};

// ETAPA 3
export const cambiarPassword = async (datos) => {
    const { correo, nuevaPassword } = datos;

    const users = await readUsers();

    const index = users.findIndex(
        u => u.correo.toLowerCase() === correo.toLowerCase()
    );

    if (index === -1) {
        throw new Error("Usuario no existe");
    }

    const hash = await bcrypt.hash(nuevaPassword, SALT_ROUNDS);

    users[index].contrasena = hash;

    const { writeFile } = await import('fs/promises');
    const path = await import('path');
    const { fileURLToPath } = await import('url');

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const FILE_PATH = path.join(__dirname, "../data/", "users.json");

    await writeFile(FILE_PATH, JSON.stringify(users, null, 2));

    return { mensaje: "Contraseña actualizada" };
};