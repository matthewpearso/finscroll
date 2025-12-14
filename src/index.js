import fetch from 'node-fetch';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();
const FRED_KEY = process.env.FRED_API_KEY;
if (!FRED_KEY) {
  console.error('Set FRED_API_KEY in .env');
  process.exit(1);
}
console.log('FRED_API_KEY', FRED_KEY);

const seriesId = 'MVLOAS';
const response = await fetch(`https://api.stlouisfed.org/fred/series/observations?series_id=${seriesId}&api_key=${FRED_KEY}&file_type=json&observation_start=1985-01-01&observation_end=2024-10-01`);
const data = await response.json();

fs.writeFileSync(`data/fred_response_${seriesId}.json`, JSON.stringify(data));

console.log(data);