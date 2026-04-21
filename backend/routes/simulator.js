import express from 'express';
import auth from '../middleware/auth.js';
import Asset from '../models/Asset.js';

const router = express.Router();

// Monte Carlo wealth simulator
router.post('/monte-carlo', auth, async (req, res) => {
  const { years = 30, expectedReturn = 0.08, volatility = 0.15, simulations = 1000 } = req.body;
  
  const assets = await Asset.find({ userId: req.userId });
  const initial = assets.reduce((s, a) => s + a.value, 0);
  
  const results = [];
  for (let i = 0; i < simulations; i++) {
    let value = initial;
    const path = [value];
    for (let y = 0; y < years; y++) {
      const randomReturn = expectedReturn + volatility * (Math.random() * 2 - 1);
      value = value * (1 + randomReturn);
      path.push(value);
    }
    results.push(path);
  }
  
  // Percentiles at each year
  const percentiles = [];
  for (let y = 0; y <= years; y++) {
    const valuesAtYear = results.map(r => r[y]).sort((a, b) => a - b);
    percentiles.push({
      year: y,
      p10: valuesAtYear[Math.floor(simulations * 0.1)],
      p50: valuesAtYear[Math.floor(simulations * 0.5)],
      p90: valuesAtYear[Math.floor(simulations * 0.9)],
    });
  }
  
  res.json({ initial, percentiles, finalMedian: percentiles[years].p50 });
});

export default router;
