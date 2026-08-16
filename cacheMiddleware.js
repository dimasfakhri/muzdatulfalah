const cache = require('../services/cache');

const cacheMiddleware = (duration) => (req, res, next) => {
  if (req.method !== 'GET') return next();
  const key = req.originalUrl;
  const cached = cache.get(key);
  if (cached) {
    return res.json(cached);
  }
  // Tangkap output json
  const originalJson = res.json.bind(res);
  res.json = (body) => {
    cache.set(key, body, duration);
    originalJson(body);
  };
  next();
};

module.exports = cacheMiddleware;