import { readFile, writeFile } from 'fs/promises';
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FILE_PATH = path.join(__dirname, "../data/", "users.json");

export const readUsers = async () => {
  try {
    const data = await readFile(FILE_PATH, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
};

export const writeUser = async (newUser) => {
  try {
    const data = await readFile(FILE_PATH, 'utf-8');
    const users = JSON.parse(data);

    users.push(newUser);

    await writeFile(FILE_PATH, JSON.stringify(users, null, 2));
    return users;
  } catch (error) {
    console.error('Error registrando usuario:', error);
    return null;
  }
};

export const findUserByEmail = async (email) => {
  const users = await readUsers();
  return users.find(
    (u) => u.correo.toLowerCase() === email.toLowerCase()
  ) || null;
};

export const existsUser = async (email) =>
  !!(await findUserByEmail(email));

console.log("EXPORTS OK");