// filepath: /Users/matthewpearson/Desktop/Davidson Classes/Critical Web Design/sign-of-the-times/src/server.js
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
const FRED_KEY = process.env.FRED_API_KEY;
if (!FRED_KEY) {
  console.error('Set FRED_API_KEY in .env');
  process.exit(1);
}

import fs from 'fs';

app.get('/api/fred/series/observations', async (req, res) => {
  try {
    const params = new URLSearchParams({
      api_key: FRED_KEY,
      file_type: 'json',
      ...req.query
    });
    const url = `https://api.stlouisfed.org/fred/series/observations?${params.toString()}&api_key=${FRED_KEY}&file_type=json`;
    const r = await fetch(url); 
    const json = await r.json();
    
    console.log(params.toString());
    fs.writeFileSync(`fred_response_${params.series_id}.json`, JSON.stringify(json, null, 2));
    res.json(json);
  } catch (err) {
    console.error('proxy error', err);
    res.status(500).json({ error: 'proxy error' });
  }
});

// serve project root so index.html is available
app.use(express.static('.'));

app.listen(PORT, () => console.log(`Dev proxy running on http://localhost:${PORT}`));