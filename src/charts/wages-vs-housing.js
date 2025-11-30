import { fetchFredSeries } from '../data/fred.js';

export async function initWageHousingChart({
  canvasId = 'wageHousingChart',
  sectionId = 'wageHousing',
  fredApiKey,            // kept for compatibility with callers that pass a value like 'PROXY'
  incomeSeriesId,
  priceSeriesId,
} = {}) {
  if (!incomeSeriesId || !priceSeriesId) throw new Error('Provide incomeSeriesId and priceSeriesId');

  // ensure the target section exists and register GSAP plugins early
  const sectionEl = document.getElementById(sectionId);
  if (!sectionEl) throw new Error(`Section element #${sectionId} not found`);
  gsap.registerPlugin(ScrollTrigger);

  // fetch both series 
  const [incomeObs, priceObs] = await Promise.all([
    fetchFredSeries(incomeSeriesId),
    fetchFredSeries(priceSeriesId)
  ]);

  // Use the series observations as-is for Chart.js.
  // Chart.js accepts data points as { x: <date>, y: <value> } with a time x axis,
  // DON'T normalize/insert nulls, keep the original observations.
  const incomeData = incomeObs.map(o => ({ x: o.date, y: o.value }));
  const priceData = priceObs.map(o => ({ x: o.date, y: o.value }));

  // build a labels array only for logging / optional use (doesn't change datasets)
  const labels = Array.from(new Set([
    ...incomeObs.map(o => o.date),
    ...priceObs.map(o => o.date)
  ])).sort();

  // lightweight stats helper for debugging
  const stats = arr => {
    const nums = arr.map(p => p.y).filter(v => v != null);
    return { count: nums.length, min: nums.length ? Math.min(...nums) : null, max: nums.length ? Math.max(...nums) : null };
  };



  console.log('incomeData stats', stats(incomeData));
  console.log('priceData stats', stats(priceData));
  console.log('labels length', labels.length);
  console.log(incomeData);
  console.log(priceData);
  
  const ctx = document.getElementById(canvasId).getContext('2d');

  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Median Household Income',
          data: incomeData,
          borderColor: 'rgba(0, 119, 255, 1)',
          backgroundColor: 'rgba(0,0,0,0)',
          borderWidth: 2,
          pointRadius: 0,
          tension: 0.3,
          // no dash for now
          borderDash: [],
          borderDashOffset: 0
        },
        {
          label: 'Median Sales Price of Houses Sold',
          data: priceData,
          borderColor: 'rgba(255, 40, 40, 0.95)',
          backgroundColor: 'rgba(255,212,98,0.04)',
          borderWidth: 2,
          pointRadius: 0,
          tension: 0.3,
          borderDash: [],
          borderDashOffset: 0,
          yAxisID: 'y1'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: 'black' } },
        tooltip: { mode: 'index', intersect: false }
      },
      scales: {
        x: { grid: { color: 'rgba(255,255,255,0.08)' }, ticks: { color: 'black' } },
        y: {
          type: 'linear',
          position: 'left',
          grid: { color: 'rgba(255,255,255,0.08)' },
          ticks: { color: 'rgba(0, 119, 255, 1)', callback: v => v ? v.toLocaleString() : v }
        },
        y1: {
          type: 'linear',
          position: 'right',
          grid: { display: false },
          ticks: { color: 'rgba(255, 40, 40, 0.95)', callback: v => v ? v.toLocaleString() : v }
        }
      },
      interaction: { mode: 'index', intersect: false }
    }
  });

  chart.update();

  // Simple scroll-driven fade-in for the chart canvas so we can verify both lines render
  const canvasEl = document.getElementById(canvasId);
  canvasEl.style.opacity = 0;
  gsap.to(canvasEl, {
    opacity: 1,
    duration: 1,
    ease: 'power1.out',
    scrollTrigger: {
      trigger: sectionEl,
      start: 'top center',
      end: '+=200',
      scrub: true,
      pin: false
    }
  });

  return chart;
}