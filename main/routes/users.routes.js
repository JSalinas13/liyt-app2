import express from 'express';
import bcrypt from 'bcrypt';
import { usersDB } from '../initDB.js';
import CryptoJS from 'crypto-js';

import 'dotenv/config';
const router = express.Router();


const SECRET = process.env.SECRET;

// Ruta solo para desarrollo: mostrar todos los usuarios
router.get('/api/dev/db-dump', async (req, res) => {
    try {
        const all = await db.find({});
        res.json(all);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Ruta de prueba
router.get('/api/ping', (req, res) => {
    res.send({ message: 'pong' });
});

// Borrar un documento por ID
router.delete('/api/users/:id', async (req, res) => {
    try {
        const numRemoved = await db.remove({ _id: req.params.id });
        res.json({ removed: numRemoved });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Obtener todos los documentos
router.get('/api/users', async (req, res) => {
    try {
        const items = await db.find({});
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/', async (req, res) => {
    const users = await usersDB.find({});
    res.json(users);
});

router.post('/', async (req, res) => {
    const { user, password } = req.body;

    const encryptedUser = CryptoJS.AES.encrypt(user, SECRET).toString();
    const encryptedPassword = CryptoJS.AES.encrypt(password, SECRET).toString();

    const existing = await usersDB.findOne({ user: encryptedUser });
    if (existing) return res.status(200).json({ error: 'Usuario ya existe' });

    const newUser = await usersDB.insert({ user: encryptedUser, password: encryptedPassword });
    res.status(201).json({ message: 'Usuario creado', user: newUser });
});


router.post('/login', async (req, res) => {
    const { user, password } = req.body;

    try {
        const users = await usersDB.find({});

        let currentUser = null;

        for (const u of users) {
            const decryptedUser = CryptoJS.AES.decrypt(u.user, SECRET).toString(CryptoJS.enc.Utf8);
            if (decryptedUser === user) {
                currentUser = u;
                break;
            }
        }

        if (!currentUser) {
            return res.status(200).json({ error: 'Usuario no encontrado' });
        }

        const decryptedPassword = CryptoJS.AES.decrypt(currentUser.password, SECRET).toString(CryptoJS.enc.Utf8);

        if (decryptedPassword !== password) {
            return res.status(200).json({ error: 'Contraseña incorrecta' });
        }

        // Retornar usuario y _id
        res.json({
            success: true,
            message: 'Login exitoso',
            user: {
                user: user,
                _id: currentUser._id
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
