

export async function initUnemploymentChart({
  canvasId,
  sectionId,
  fredApiKey,            // kept for compatibility with callers that pass a value like 'PROXY'
  collegeSeries,
  overallSeries,
} = {}) {
  

  const ctx = document.getElementById(canvasId).getContext('2d');

  let delayed = false;
  
  Chart.defaults.font.family = "'Lora', serif";
  Chart.defaults.font.color = 'white';

  const collegeData = collegeSeries;
  const overallData = overallSeries;
  


  const chart = new Chart(ctx, {
        type: 'line',
        data: {
          datasets: [
            {
              label: 'Unemployment Rate for College Graduates Age 20–24',
              data: collegeData,
              borderColor: 'rgba(0, 119, 255, 1)',
              backgroundColor: 'rgba(0,0,0,0)',
              borderWidth: 2,
              pointRadius: 0,
              tension: 0.9,
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
                    text: ' Rate of Unemployment (%)',
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