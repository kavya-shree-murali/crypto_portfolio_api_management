const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
});

const transactionSchema = new mongoose.Schema({
    type: { type: String, enum: ['buy', 'sell'], required: true },
    symbol: { type: String, required: true },
    amount: { type: Number, required: true },
    priceAtTransaction: { type: Number, required: true },
    last_updated_at: { type: Number },
    usd_24h_change: { type: Number },
    usd_market_cap: { type: Number },
    usd_24h_vol: { type: Number },
    timestamp: { type: Date, default: Date.now }
});

const Transaction = mongoose.model('Transaction', transactionSchema);
const User = mongoose.model('User', userSchema);

module.exports = {
    User,
    Transaction
}