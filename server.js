require('dotenv').config();
const express = require('express');
const axios = require('axios');
const redis = require('redis');

const app = express();
const PORT = 3000;
const GNEWS_API_URL = 'https://gnews.io/api/v4/search';
const GNEWS_API_KEY = process.env.GNEWS_API_KEY;

const redisClient = redis.createClient({
  socket: {
    host: '127.0.0.1',
    port: 6379
  }
});

redisClient.connect();

app.use(express.json());

app.get('/articles', async (req, res) => {
  const limit = req.query.limit || 10;
  const cacheKey = `articles_${limit}`;

  try {
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      return res.json(JSON.parse(cachedData));
    }

    const { data } = await axios.get(`${GNEWS_API_URL}?q=breaking&max=${limit}&apikey=${GNEWS_API_KEY}`);
    await redisClient.set(cacheKey, JSON.stringify(data), { EX: 600 }); // Cache for 10 minutes

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
});

app.get('/articles/search', async (req, res) => {
  const { query } = req.query;
  if (!query) return res.status(400).json({ error: 'Query parameter is required' });

  const cacheKey = `search_${query}`;

  try {
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      return res.json(JSON.parse(cachedData));
    }

    const { data } = await axios.get(`${GNEWS_API_URL}?q=${query}&apikey=${GNEWS_API_KEY}`);
    await redisClient.set(cacheKey, JSON.stringify(data), { EX: 600 });

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to search articles' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
