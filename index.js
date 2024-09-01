
const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3000;

// PostgreSQLの接続設定
const pool = new Pool({
    user: 'your_user',          // Renderで提供されたユーザー名
    host: 'your_host',          // Renderで提供されたホスト
    database: 'your_database',  // Renderで提供されたデータベース名
    password: 'your_password',  // Renderで提供されたパスワード
    port: 5432,                 // デフォルトのPostgreSQLポート
});

app.use(express.json());

// 財布情報取得
app.get('/api/wallets', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM wallets');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'データベースから財布情報を取得できませんでした' });
    }
});

// 取引履歴取得
app.get('/api/transactions', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM transactions ORDER BY date DESC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'データベースから取引履歴を取得できませんでした' });
    }
});

// 新しい取引登録
app.post('/api/transactions', async (req, res) => {
    const { fromWallet, toWallet, amount } = req.body;
    const date = new Date();
    try {
        await pool.query('INSERT INTO transactions (from_wallet, to_wallet, amount, date) VALUES ($1, $2, $3, $4)', [fromWallet, toWallet, amount, date]);
        res.sendStatus(201);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: '取引を登録できませんでした' });
    }
});

app.listen(port, () => {
    console.log(`サーバーがポート${port}で起動しました`);
});

