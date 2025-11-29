// filepath: /Users/matthewpearson/Desktop/Davidson Classes/Critical Web Design/sign-of-the-times/src/main.js
import { initWageHousingChart } from './charts/wages-vs-housing.js';

// The proxy uses the key from the server's .env.
const FRED_API_KEY = 'PROXY';

// Replace these placeholders with the actual FRED series IDs you want to use.
const MEDIAN_HOUSEHOLD_INCOME_SERIES = 'MEHOINUSA672N';
const MEDIAN_SALES_PRICE_SERIES = 'MSPUS';

document.addEventListener('DOMContentLoaded', async () => {
  try {
    await initWageHousingChart({
      fredApiKey: FRED_API_KEY,
      incomeSeriesId: MEDIAN_HOUSEHOLD_INCOME_SERIES,
      priceSeriesId: MEDIAN_SALES_PRICE_SERIES,
      start: '1970-01-01'
    });
  } catch (err) {
    console.error('Chart init error', err);
  }
});
