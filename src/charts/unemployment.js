

export async function initUnemploymentChart({
  canvasId,
  sectionId,
  fredApiKey,            // kept for compatibility with callers that pass a value like 'PROXY'
  collegeSeriesId,
  overallSeriesId,
} = {}) {
  if (!collegeSeriesId || !overallSeriesId) throw new Error('Provide collegeSeriesId and overallSeriesId');


  // fetch both series 
  const [collegeObs, overallObs] = await Promise.all([
    fetchFredSeries(collegeSeriesId),
    fetchFredSeries(overallSeriesId)
  ]);

  console.log(collegeObs)

  // Use the series observations as-is for Chart.js.
  // Chart.js accepts data points as { x: <date>, y: <value> } with a time x axis,
  // DON'T normalize/insert nulls, keep the original observations.
  const collegeData = collegeObs.map(o => ({ x: o.date, y: o.value }));
  const overallData = overallObs.map(o => ({ x: o.date, y: o.value }));

  // build a labels array only for logging / optional use (doesn't change datasets)
  const labels = Array.from(new Set([
    ...collegeObs.map(o => o.date),
    ...overallObs.map(o => o.date)
  ])).sort();

  // stats helper for debugging
  const stats = arr => {
    const nums = arr.map(p => p.y).filter(v => v != null);
    return { count: nums.length, min: nums.length ? Math.min(...nums) : null, max: nums.length ? Math.max(...nums) : null };
  };



  

  const ctx = document.getElementById(canvasId).getContext('2d');

  let delayed = false;
  
  Chart.defaults.font.family = "'Lora', serif";
  Chart.defaults.font.color = 'white';


  const chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              label: 'College Graduates Unemployment Rate',
              data: collegeData,
              borderColor: 'rgba(0, 119, 255, 1)',
              backgroundColor: 'rgba(0,0,0,0)',
              borderWidth: 2,
              pointRadius: 0,
              tension: 0,
              borderDash: [],
              borderDashOffset: 0
            },
            {
              label: 'Overall Unemployment Rate',
              data: overallData,
              borderColor: 'rgba(255, 40, 40, 0.95)',
              backgroundColor: 'rgba(255,212,98,0.04)',
              borderWidth: 2,
              pointRadius: 0,
              tension: 0.5,
              borderDash: [],
              borderDashOffset: 0
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          
          animation: {
            duration: 1500,
            easing: 'easeOutQuart',
            onComplete: () => {
              delayed = true;
            },
            delay: (context) => {
              let delay = 0;
              if (context.type === 'data' && context.mode === 'default' && !delayed) {
                const di = typeof context.dataIndex === 'number' ? context.dataIndex : 0;
                const ds = typeof context.datasetIndex === 'number' ? context.datasetIndex : 0;
                delay = di * 5 + ds * 100;
              }
              return delay;
            }
          },
          
          plugins: {
            legend: { labels: { color: 'white' } },
            tooltip: { mode: 'point', intersect: false }
          },
          scales: {
            x: { grid: { color: 'rgba(255, 255, 255, 0)' }, 
                 ticks: { color: 'rgba(255, 255, 255, 1)' }, 
                 type: 'time', 
                 time: {displayFormats: {year: 'yyyy' } },
                 title: {
                    display: true,
                    text: 'Year',
                    color: 'rgba(255, 255, 255, 1)',
                    font: { size: 20}
                 }},
            y: {
              type: 'linear',
              position: 'left',
              grid: { color: 'rgba(255, 255, 255, 0)' },
              ticks: { color: 'rgba(255, 255, 255, 1)', callback: v => v ? v.toLocaleString() : v },
              title: {
                    display: true,
                    text: ' $ (USD)',
                    color: 'rgba(255, 255, 255, 1)',
                    font: { size: 20},
                    padding: {bottom: 15}
                    
                 }
            }
          },
          interaction: { mode: 'index', intersect: false }
        }
      });

      chart.update();

      

  return chart; //chart initializes on scroll
}