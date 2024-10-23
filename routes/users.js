const express = require('express');
const router = express.Router();
const pool = require('../db');

router.post('/add', async (req, res) => {
    const { username, password, user_type } = req.body;
    try {
        const newUser = await pool.query(
            'INSERT INTO users (username, password, user_type) VALUES ($1, $2, $3) RETURNING *',
            [username, password, user_type]
        );
        res.json(newUser.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json('Erro ao adicionar usuário');
    }
});

router.delete('/remove/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            'DELETE FROM users WHERE id = $1 RETURNING *',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        res.json({
            message: 'Usuário removido com sucesso',
            user: result.rows[0],
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json('Erro ao remover o usuário');
    }
});

router.get('/all', async (req, res) => {
    try {
        const allUsers = await pool.query('SELECT * FROM users');
        res.json(allUsers.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json('Erro ao buscar os usuários');
    }
});

module.exports = router;

router.put('/update/:id', async (req, res) => {
    const { id } = req.params;
    const { username, password, user_type } = req.body;
    try {
        const updateUser = await pool.query(
            'UPDATE users SET username = $1, password = $2, user_type = $3 WHERE id = $4 RETURNING *',
            [username, password, user_type, id]
        );
        res.json(updateUser.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json('Erro ao atualizar usuário');
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const result = await pool.query(
            'SELECT * FROM users WHERE username = $1 AND password = $2',
            [username, password]
        );

        if (result.rows.length > 0) {
            return res.status(200).json({ message: 'Login bem-sucedido!' });
        } else {
            return res
                .status(401)
                .json({ message: 'Usuário ou senha incorretos.' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erro no servidor.' });
    }
});

router.get('/id/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const user = await pool.query('SELECT * FROM users WHERE id = $1', [
            id,
        ]);
        if (user.rows.length === 0) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }
        res.json(user.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json('Erro ao buscar o usuário');
    }
});

module.exports = router;
