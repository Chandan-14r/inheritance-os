import express from 'express';
import Beneficiary from '../models/Beneficiary.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, async (req, res) => {
  const list = await Beneficiary.find({ userId: req.userId });
  res.json(list);
});

router.post('/', auth, async (req, res) => {
  const b = await Beneficiary.create({ ...req.body, userId: req.userId });
  res.json(b);
});

router.put('/:id', auth, async (req, res) => {
  const b = await Beneficiary.findOneAndUpdate(
    { _id: req.params.id, userId: req.userId },
    req.body, { new: true }
  );
  res.json(b);
});

router.delete('/:id', auth, async (req, res) => {
  await Beneficiary.findOneAndDelete({ _id: req.params.id, userId: req.userId });
  res.json({ success: true });
});

export default router;
