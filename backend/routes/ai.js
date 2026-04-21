import express from 'express';
import OpenAI from 'openai';
import auth from '../middleware/auth.js';
import User from '../models/User.js';
import Asset from '../models/Asset.js';
import Beneficiary from '../models/Beneficiary.js';

const router = express.Router();

const isGemini = !!process.env.GEMINI_API_KEY;
const openai = new OpenAI({ 
  apiKey: process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY,
  baseURL: isGemini ? 'https://generativelanguage.googleapis.com/v1beta/openai/' : 'https://api.openai.com/v1'
});

router.post('/generate-letter', auth, async (req, res) => {
  try {
    const { beneficiaryId, tone = 'heartfelt', personalMessage } = req.body;
    const user = await User.findById(req.userId);
    const beneficiary = await Beneficiary.findById(beneficiaryId);
    const assets = await Asset.find({ userId: req.userId });
    
    const totalWorth = assets.reduce((s, a) => s + a.value, 0);
    const inheritance = (totalWorth * beneficiary.allocationPercent) / 100;

    const prompt = `You are writing a heartfelt, personal "last letter" from ${user.name} to their ${beneficiary.relationship}, ${beneficiary.name}.

Context:
- Total estate value: ₹${totalWorth.toLocaleString('en-IN')}
- ${beneficiary.name} will inherit ${beneficiary.allocationPercent}% (≈₹${inheritance.toLocaleString('en-IN')})
- Assets include: ${assets.map(a => `${a.name} (${a.type})`).join(', ')}
- Personal message from sender: "${personalMessage || 'None provided'}"
- Tone: ${tone}

Write a 300-400 word letter that:
1. Opens with genuine emotion, not clinical language
2. Explains WHY certain assets are being passed down (the story behind them)
3. Gives life/financial wisdom specific to this relationship
4. Provides practical guidance on what to do with the inheritance
5. Closes with love and hope for their future

Write as if this will actually be read after the sender is gone. Make it beautiful, real, and deeply personal.`;

    let letter = '';
    try {
      const completion = await openai.chat.completions.create({
        model: isGemini ? 'gemini-2.5-flash' : 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.8,
      });
      letter = completion.choices[0].message.content;
    } catch (openaiErr) {
      console.log('OpenAI failed or missing key, using fallback template.');
      const fmtMoney = (n) => `₹${(n / 100000).toFixed(1)} lakhs`;
      const assetList = assets.map(a => `${a.name} (${a.type.replace('_', ' ')})`).join(', ');
      
      letter = `My Dearest ${beneficiary.name},

If you're reading this, know that every moment we shared was a gift I never took for granted. As your ${user.name}, I want you to know how much you mean to me.

I'm leaving you ${beneficiary.allocationPercent}% of everything I built — approximately ${fmtMoney(inheritance)}. Every rupee has a story, a late night, a difficult decision that was made thinking of you.

Our assets include ${assetList}. Each one was chosen with purpose to secure our family's future.

${personalMessage ? `Something I always wanted to tell you: ${personalMessage}` : ''}

My practical advice: don't rush any financial decisions for at least a year. Consult ${user.executorEmail ? `our executor at ${user.executorEmail}` : 'a trusted financial advisor'} before making major moves.

With all my love, forever,
${user.name}`;
    }

    await Beneficiary.findByIdAndUpdate(beneficiaryId, { aiLetter: letter });
    
    res.json({ letter });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.post('/tax-advice', auth, async (req, res) => {
  try {
    const assets = await Asset.find({ userId: req.userId });
    const totalWorth = assets.reduce((s, a) => s + a.value, 0);
    
    const prompt = `I have the following assets (total ₹${totalWorth.toLocaleString('en-IN')}):
${assets.map(a => `- ${a.name} (${a.type}): ₹${a.value.toLocaleString('en-IN')}`).join('\n')}

Give me 3 specific, actionable tax optimization strategies for inheritance/estate planning in India. 
Format each as:
**Strategy:** [name]
**Action:** [what to do]
**Savings:** [estimated ₹ savings]

Keep it concise and practical.`;

    const completion = await openai.chat.completions.create({
      model: isGemini ? 'gemini-2.5-flash' : 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
    });

    res.json({ advice: completion.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
