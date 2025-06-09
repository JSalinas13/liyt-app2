// server.js
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import { usersDB } from './initDB.js';
import usersRoutes from './routes/users.routes.js';
import CryptoJS from 'crypto-js';

import 'dotenv/config';
import e from 'express';

const app = express();
// 🔐 Habilita CORS
app.use(cors({
    origin: 'http://localhost:5173', // la URL de tu app React
}));


app.use(express.json());


//RUTAS
app.use('/api/users', usersRoutes);

const SECRET = process.env.SECRET;


// Iniciar servidor
export const startServer = () => {
    app.listen(3001, async () => {
        console.log('Servidor interno corriendo en http://localhost:3001');
        // Crear usuario por defecto si no existe
        const defaultUser = 'admin';
        const defaultPassword = 'admin123';

        try {

            const users = await usersDB.find({});

            let userExists = false;

            for (const user of users) {
                const decryptedUser = CryptoJS.AES.decrypt(user.user, SECRET).toString(CryptoJS.enc.Utf8);
                if (decryptedUser === defaultUser) {
                    userExists = true;
                    break;
                }
            }
            if (userExists) {
                console.log(`Usuario por defecto '${defaultUser}' ya existe.`);
                return;
            } else {
                const encryptedUser = CryptoJS.AES.encrypt(defaultUser, SECRET).toString();
                const encryptedPassword = CryptoJS.AES.encrypt(defaultPassword, SECRET).toString();

                await usersDB.insert({ user: encryptedUser, password: encryptedPassword });
                console.log(`Usuario por defecto '${defaultUser}' creado.`);

            }
        } catch (error) {
            console.error('Error al verificar o crear el usuario por defecto:', error.message);
        }
    });

};
