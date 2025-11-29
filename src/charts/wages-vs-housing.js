import { fetchFredSeries } from '../data/fred.js';

export async function initWageHousingChart({
  canvasId = 'wageHousingChart',
  sectionId = 'wageHousing',
  fredApiKey,
  incomeSeriesId,
  priceSeriesId,
  start = '',
  end = ''
} = {}) {
  if (!fredApiKey) throw new Error('Provide fredApiKey');
  if (!incomeSeriesId || !priceSeriesId) throw new Error('Provide series IDs');

  // make the chart container sticky and pin while animating
  const sectionEl = document.getElementById(sectionId);
  if (!sectionEl) throw new Error(`Section element #${sectionId} not found`);
  gsap.registerPlugin(ScrollTrigger);

  // fetch both series
  const [incomeObs, priceObs] = await Promise.all([
    fetchFredSeries(incomeSeriesId, fredApiKey, start, end),
    fetchFredSeries(priceSeriesId, fredApiKey, start, end)
  ]);

  // quick debug logs
  console.log('incomeObs count:', incomeObs.length, incomeObs.slice(0,3));
  console.log('priceObs count:', priceObs.length, priceObs.slice(0,3));

  // build date union and map values
  const dates = Array.from(new Set([...incomeObs, ...priceObs].map(o => o.date))).sort();
  const incomeMap = new Map(incomeObs.map(o => [o.date, o.value]));
  const priceMap = new Map(priceObs.map(o => [o.date, o.value]));

  const labels = dates;
  const incomeData = dates.map(d => incomeMap.get(d) ?? null);
  const priceData = dates.map(d => priceMap.get(d) ?? null);

  const stats = arr => {
    const nums = arr.filter(v => v != null);
    return { count: nums.length, min: nums.length ? Math.min(...nums) : null, max: nums.length ? Math.max(...nums) : null };
  };
  console.log('incomeData stats', stats(incomeData));
  console.log('priceData stats', stats(priceData));
  console.log('labels length', labels.length);

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
          // no dash for now — simpler and more robust for debugging
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
        legend: { labels: { color: 'white' } },
        tooltip: { mode: 'index', intersect: false }
      },
      scales: {
        x: { grid: { color: 'rgba(255,255,255,0.08)' }, ticks: { color: 'white' } },
        y: {
          type: 'linear',
          position: 'left',
          grid: { color: 'rgba(255,255,255,0.08)' },
          ticks: { color: 'white', callback: v => v ? v.toLocaleString() : v }
        },
        y1: {
          type: 'linear',
          position: 'right',
          grid: { display: false },
          ticks: { color: 'rgba(255,212,98,0.9)', callback: v => v ? v.toLocaleString() : v }
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
    duration: 2,
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