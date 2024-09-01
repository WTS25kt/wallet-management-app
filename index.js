
const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
const port = 3000;

// PostgreSQLの設定
const pool = new Pool({
    user: 'your_user',
    host: 'localhost',
    database: 'your_database',
    password: 'your_password',
    port: 5432,
});

app.use(bodyParser.json());

// 財布情報取得
app.get('/api/wallets', async (req, res) => {
    const result = await pool.query('SELECT * FROM wallets');
    res.json(result.rows);
});

// 取引履歴取得
app.get('/api/transactions', async (req, res) => {
    const result = await pool.query('SELECT * FROM transactions ORDER BY date DESC');
    res.json(result.rows);
});

// 新しい取引登録
app.post('/api/transactions', async (req, res) => {
    const { fromWallet, toWallet, amount } = req.body;
    const date = new Date();
    await pool.query('INSERT INTO transactions (from_wallet, to_wallet, amount, date) VALUES ($1, $2, $3, $4)', [fromWallet, toWallet, amount, date]);
    res.sendStatus(201);
});

app.listen(port, () => {
    console.log(`サーバーがポート${port}で起動しました`);
});

