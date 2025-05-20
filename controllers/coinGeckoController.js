const { Transaction } = require('../models/userModel');
const { getCachedPrice } = require('../services/coinServices');

async function calculateSummary(transactions, getCurrentPrice) {
  const summary = {};

  for (const tx of transactions) {
    const symbol = tx.symbol;
    if (!summary[symbol]) summary[symbol] = { amount: 0, currentValue: 0 };

    summary[symbol].amount += tx.type === 'buy' ? tx.amount : -tx.amount;
  }

  for (const symbol in summary) {
    const currentPrice = await getCurrentPrice(symbol);
    console.log(currentPrice, 'currentPrice');
    summary[symbol].currentValue = summary[symbol].amount * currentPrice;
  }

  return summary;
}

const buyCrypto = async (req, res) => {
  const { symbol, amount } = req.body;
  const price = await getCachedPrice(symbol);

  const tx = new Transaction({ type: 'buy', symbol, amount, priceAtTransaction: price.price, usd_market_cap: price.data?.usd_market_cap, usd_24h_vol: price?.data.usd_24h_vol, usd_24h_change: price?.data.usd_24h_change, last_updated_at: price?.data.last_updated_at });
  await tx.save();
  res.json(tx);
};

const sellCrypto = async (req, res) => {
  const { symbol, amount } = req.body;
  const price = await getCachedPrice(symbol);

  const tx = new Transaction({ type: 'sell', symbol, amount, priceAtTransaction: price.price, usd_market_cap: price?.data.usd_market_cap, usd_24h_vol: price?.data.usd_24h_vol, usd_24h_change: price?.data.usd_24h_change, last_updated_at: price?.data.last_updated_at });
  await tx.save();
  res.json(tx);
};

const getPortfolio = async (req, res) => {
  const transactions = await Transaction.find();
  const summary = await calculateSummary(transactions, getCachedPrice);
  res.json(summary);
};


module.exports = { calculateSummary, buyCrypto, sellCrypto, getPortfolio };

