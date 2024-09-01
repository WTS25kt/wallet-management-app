
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WalletApp = () => {
    const [wallets, setWallets] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [newTransaction, setNewTransaction] = useState({
        fromWallet: '',
        toWallet: '',
        amount: 0
    });

    useEffect(() => {
        fetchWallets();
        fetchTransactions();
    }, []);

    const fetchWallets = async () => {
        const response = await axios.get('/api/wallets');
        setWallets(response.data);
    };

    const fetchTransactions = async () => {
        const response = await axios.get('/api/transactions');
        setTransactions(response.data);
    };

    const handleTransactionChange = (e) => {
        setNewTransaction({
            ...newTransaction,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await axios.post('/api/transactions', newTransaction);
        fetchWallets();
        fetchTransactions();
    };

    return (
        <div>
            <h1>財布管理アプリ</h1>
            <h2>財布の残高</h2>
            <ul>
                {wallets.map(wallet => (
                    <li key={wallet.id}>{wallet.name}: {wallet.balance}円</li>
                ))}
            </ul>
            <h2>取引登録</h2>
            <form onSubmit={handleSubmit}>
                <input type='text' name='fromWallet' placeholder='出金元の財布' onChange={handleTransactionChange} />
                <input type='text' name='toWallet' placeholder='入金先の財布' onChange={handleTransactionChange} />
                <input type='number' name='amount' placeholder='金額' onChange={handleTransactionChange} />
                <button type='submit'>登録</button>
            </form>
            <h2>取引履歴</h2>
            <ul>
                {transactions.map(transaction => (
                    <li key={transaction.id}>{transaction.date}: {transaction.amount}円</li>
                ))}
            </ul>
        </div>
    );
};

export default WalletApp;

