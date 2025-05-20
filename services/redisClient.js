const redis = require('redis');
const client = redis.createClient({
    url: 'redis://127.0.0.1:6379'
});

client.connect().catch(console.error);

async function getCache(key) {
    return await client.get(key);
}

async function setCache(key, value, ttl = 60) {
    await client.set(key, value, { EX: ttl });
}

module.exports = { getCache, setCache };
