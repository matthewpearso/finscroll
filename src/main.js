import { initWageHousingChart } from './charts/wages-vs-housing.js';

// The proxy uses the key from the server's .env.
const FRED_API_KEY = 'PROXY';

const MEDIAN_HOUSEHOLD_INCOME_SERIES = 'MEHOINUSA672N';
const MEDIAN_SALES_PRICE_SERIES = 'MSPUS';

document.addEventListener('DOMContentLoaded', async () => {
  
  const section1 = document.getElementById('wageHousing');
  if (!section1) throw new Error(`Section element #${sectionId} not found`);
  gsap.registerPlugin(ScrollTrigger);
  
  let chartInitialized = false;

  ScrollTrigger.create({
    trigger: section1,
    start: 'top 80%', // trigger when section is 80% into viewport
    pin: true,
    start: 'top top+=60vh',
    end: '+=2500',
    onEnter: () => {
      if (chartInitialized) return;
      chartInitialized = true;
      
      try {
        initWageHousingChart({
          fredApiKey: FRED_API_KEY,
          incomeSeriesId: 'MEHOINUSA672N',
          priceSeriesId: 'MSPUS',
          canvasId: 'wageHousingChart',
          sectionId: 'wageHousing'

        });
      } catch (err) {
        console.error('Chart init error', err);
        console.error('Error message:', err?.message);
        console.error('Stack:', err?.stack);
        if (err?.message?.includes('Proxy FRED request failed') || err?.message?.includes('Unexpected FRED response')) {
          console.error('Hint: ensure the dev proxy is running (node src/server.js) and .env contains FRED_API_KEY');
        }
      }

      // Fade-in animation
      const canvasEl = document.getElementById('wageHousingChart');
      canvasEl.style.opacity = 0;
      gsap.to(canvasEl, {
        opacity: 1,
        duration: 1,
        ease: 'power1.out'
      });

    }});
});
