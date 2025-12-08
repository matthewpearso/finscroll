import fetch from 'node-fetch';
import fs from 'fs';

const FRED_KEY = process.env.FRED_API_KEY;
if (!FRED_KEY) {
  console.error('Set FRED_API_KEY in .env');
  process.exit(1);
}

const seriesId = '';
const response = await fetch(`https://api.stlouisfed.org/fred/series/observations?series_id=${seriedId}&api_key=${FRED_KEY}&file_type=json`);
const data = await response.json();

fs.writeFileSync(`src/data/fred_response_${seriesId}.json`, JSON.stringify(data));

console.log(data);