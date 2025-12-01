import { initWageHousingChart } from './charts/wages-vs-housing.js';

// The proxy uses the key from the server's .env.
const FRED_API_KEY = 'PROXY';

const MEDIAN_HOUSEHOLD_INCOME_SERIES = 'MEHOINUSA672N';
const MEDIAN_SALES_PRICE_SERIES = 'MSPUS';

document.addEventListener('DOMContentLoaded', async () => {
  try {
    await initWageHousingChart({
      fredApiKey: FRED_API_KEY,
      incomeSeriesId: MEDIAN_HOUSEHOLD_INCOME_SERIES,
      priceSeriesId: MEDIAN_SALES_PRICE_SERIES,
      start: '1984-01-01'
    });
  } catch (err) {
    console.error('Chart init error', err);
    console.error('Error message:', err?.message);
    console.error('Stack:', err?.stack);
    if (err?.message?.includes('Proxy FRED request failed') || err?.message?.includes('Unexpected FRED response')) {
      console.error('Hint: ensure the dev proxy is running (node src/server.js) and .env contains FRED_API_KEY');
    }
  }
});
