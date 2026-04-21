import express from 'express';
import Asset from '../models/Asset.js';
import auth from '../middleware/auth.js';
import YahooFinance from 'yahoo-finance2';

const router = express.Router();
const yahooFinance = new YahooFinance();

router.get('/', auth, async (req, res) => {
  const assets = await Asset.find({ userId: req.userId });
  res.json(assets);
});

router.post('/', auth, async (req, res) => {
  const asset = await Asset.create({ ...req.body, userId: req.userId });
  res.json(asset);
});

router.put('/:id', auth, async (req, res) => {
  const asset = await Asset.findOneAndUpdate(
    { _id: req.params.id, userId: req.userId },
    req.body, { new: true }
  );
  res.json(asset);
});

router.delete('/:id', auth, async (req, res) => {
  await Asset.findOneAndDelete({ _id: req.params.id, userId: req.userId });
  res.json({ success: true });
});

router.get('/summary', auth, async (req, res) => {
  const assets = await Asset.find({ userId: req.userId });
  const totalWorth = assets.reduce((sum, a) => sum + (a.value || 0), 0);
  const byType = {};
  assets.forEach(a => {
    byType[a.type] = (byType[a.type] || 0) + (a.value || 0);
  });
  // Indian estate tax estimate (simplified)
  const estimatedTax = totalWorth > 10000000 ? totalWorth * 0.30 : 0;
  res.json({ totalWorth, byType, estimatedTax, count: assets.length });
});

router.post('/sync-market', auth, async (req, res) => {
  try {
    const assets = await Asset.find({ userId: req.userId });
    let updatedCount = 0;
    
    for (const asset of assets) {
      if (asset.ticker && asset.quantity) {
        try {
          const quote = await yahooFinance.quote(asset.ticker);
          const currentPrice = quote.regularMarketPrice;
          if (currentPrice) {
            asset.value = currentPrice * asset.quantity;
            await asset.save();
            updatedCount++;
          }
        } catch (e) {
          console.error(`Failed to sync ticker ${asset.ticker}:`, e.message);
        }
      }
    }
    res.json({ success: true, updatedCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
