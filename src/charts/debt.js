export async function initDebtChart({
  canvasId,
  sectionId,
  fredApiKey,           
  studentDebt, // SLOAS
  creditCardDebt, // REVOLSL
  carDebt, // MVLOAS
  mortgageDebt, // HHMSDODNS
} = {}) {
  

  const ctx = document.getElementById(canvasId).getContext('2d');

  let delayed = false;
  
  Chart.defaults.font.family = "'Lora', serif";
  Chart.defaults.font.color = 'white';

  
  console.log(studentDebt);
  console.log(creditCardDebt);
  console.log(carDebt);
  console.log(mortgageDebt);

  const chart = new Chart(ctx, {
        type: 'line',
        data: {
          datasets: [
            {
              label: 'Credit Card Debt',
              data: creditCardDebt,
              borderColor: 'rgba(238, 255, 88, 0.95)',
              backgroundColor: 'rgba(238, 255, 88, 0.2)',
              borderWidth: 2,
              pointRadius: 0,
              tension: 0.5,
              borderDash: [],
              borderDashOffset: 0,
              fill: {
                target: 'origin',
                above: 'rgba(238, 255, 88, 0.2)',
              }
            },
            {
              label: 'Car Loan Debt',
              data: carDebt,
              borderColor: 'rgba(255, 153, 74, 0.95)',
              backgroundColor: 'rgba(255, 153, 74, 0.2)',
              borderWidth: 2,
              pointRadius: 0,
              tension: 0.8,
              borderDash: [],
              borderDashOffset: 0,
              fill: {
                target: 'origin',
                above: 'rgba(255, 153, 74, 0.2)',
              }
            },
            {
              label: 'Student Loan Debt',
              data: studentDebt,
              borderColor: 'rgba(0, 119, 255, 1)',
              backgroundColor: 'rgba(0, 119, 255, 0.2)',
              borderWidth: 2,
              pointRadius: 0,
              tension: 0.5,
              borderDash: [],
              borderDashOffset: 0,
              fill: {
                target: 'origin',
                above: 'rgba(0, 119, 255, 0.2)',
              }
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
                    text: ' Millions of $ (USD)',
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