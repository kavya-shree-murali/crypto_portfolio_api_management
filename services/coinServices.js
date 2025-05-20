const axios = require('axios');
const { getCache, setCache } = require('./redisClient');

async function fetchCryptoPrice(symbol = 'bitcoin', currency = 'usd') {
    const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price`, {
        params: {
            ids: symbol,
            vs_currencies: currency,
            include_market_cap: true,
            include_24hr_vol: true,
            include_24hr_change: true,
            include_last_updated_at: true,
            "x-cg-demo-api-key": process.env.x_cg_pro_api_key
        }
    });

    const data = response?.data;

    if (!data[symbol] || data[symbol][currency] === undefined) {
        throw new Error(`Price data not available for ${symbol} in ${currency}`);
    }

    return { price: data[symbol][currency], data: data[symbol] };
}

async function getCachedPrice(symbol, currency = 'usd') {
    const cacheKey = `${symbol}-${currency}`;
    const cached = await getCache(cacheKey);

    if (cached) return JSON.parse(cached);

    const price = await fetchCryptoPrice(symbol, currency);
    await setCache(cacheKey, JSON.stringify(price.price));
    console.log(price, 'price');

    return price;
}


module.exports = { fetchCryptoPrice, getCachedPrice };
