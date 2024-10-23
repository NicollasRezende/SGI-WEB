const express = require('express');
const router = express.Router();
const pool = require('../db');

router.post('/add', async (req, res) => {
    const { name, description, quantity, price, location } = req.body;
    try {
        const newProduct = await pool.query(
            'INSERT INTO products (name, description, quantity, price, location) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [name, description, quantity, price, location]
        );
        res.json(newProduct.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json('Erro ao adicionar produto');
    }
});

router.delete('/remove/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            'DELETE FROM products WHERE id = $1 RETURNING *',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Produto não encontrado' });
        }

        res.json({
            message: 'Produto removido com sucesso',
            product: result.rows[0],
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json('Erro ao remover o produto');
    }
});

router.get('/all', async (req, res) => {
    try {
        const allProducts = await pool.query('SELECT * FROM products');
        res.json(allProducts.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json('Erro ao buscar os produtos');
    }
});

router.put('/update/:id', async (req, res) => {
    const { id } = req.params;
    const { name, description, quantity, price, location } = req.body;
    try {
        const updateProduct = await pool.query(
            'UPDATE products SET name = $1, description = $2, quantity = $3, price = $4, location = $5 WHERE id = $6 RETURNING *',
            [name, description, quantity, price, location, id]
        );

        if (updateProduct.rows.length === 0) {
            return res.status(404).json({ message: 'Produto não encontrado' });
        }

        res.json(updateProduct.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json('Erro ao atualizar produto');
    }
});

module.exports = router;
