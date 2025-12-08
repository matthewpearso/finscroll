import { initWageHousingChart } from "./charts/wages-vs-housing.js";

//(async () => {
  
  
  async function fetchData(url) {
    //(async () => {
    let data = await fetch(url);
    let json = await data.json();
    //console.log(json);
    return json;
    //
  }


  async function getSeries(seriesId) {
    let response = await fetchData(`src/data/fred_response_${seriesId}.json`);
    let data = [];
    let labels = new Set();
    for (let i = 0; i < response.observations.length; i++) {
      data.push({
        x: response.observations[i].date,
        y: Number(response.observations[i].value),
      });
      labels.add(response.observations[i].date);
    }
    return [data, labels];
  }

  let [data_MSPUS, labels_MSPUS] = await getSeries("MSPUS");
  let [data_MEHOINUSA672N, labels_MEHOINUSA672N] = await getSeries("MEHOINUSA672N");
  console.log(data_MSPUS);

  try{
  // The proxy uses the key from the server's .env.
  const FRED_API_KEY = "PROXY";
  
  const MEDIAN_HOUSEHOLD_INCOME_SERIES = "MEHOINUSA672N";
  const MEDIAN_SALES_PRICE_SERIES = "MSPUS";

  //document.addEventListener("DOMContentLoaded", async () => {
    
    const section1 = document.getElementById("wageHousing");
    if (!section1) throw new Error(`Section element #${sectionId} not found`);
    gsap.registerPlugin(ScrollTrigger);
    let chartInitialized = false;

    ScrollTrigger.create({
      trigger: section1,
      start: "top 80%", // trigger when section is 80% into viewport
      pin: true,
      start: "top top+=60vh",
      end: "+=1800",
      onEnter: () => {
        if (chartInitialized) return;
        chartInitialized = true;
        
        console.log(data_MEHOINUSA672N);

        try {
          initWageHousingChart({
            fredApiKey: FRED_API_KEY,
            incomeData: data_MEHOINUSA672N,
            priceData: data_MSPUS,
            labels: labels_MSPUS,
            canvasId: "wageHousingChart",
            sectionId: "wageHousing",
          });
        } catch (err) {
          console.error("Chart init error", err);
          console.error("Error message:", err?.message);
          console.error("Stack:", err?.stack);
          if (
            err?.message?.includes("Proxy FRED request failed") ||
            err?.message?.includes("Unexpected FRED response")
          ) {
            console.error(
              "Hint: ensure the dev proxy is running (node src/server.js) and .env contains FRED_API_KEY"
            );
          }
        }

        // Fade-in animation
        const canvasEl = document.getElementById("wageHousingChart");
        canvasEl.style.opacity = 0;
        gsap.to(canvasEl, {
          opacity: 1,
          duration: 1,
          ease: "power1.out",
        });
      },
    });

    const section2 = document.getElementById("unemploymentRates");
    if (!section2) throw new Error(`Section element #${sectionId} not found`);

    ScrollTrigger.create({
      trigger: section2,
      start: "top 80%", // trigger when section is 80% into viewport
      pin: true,
      start: "top top+=40vh",
      end: "+=2500",
      onEnter: () => {
        if (chartInitialized) return;
        chartInitialized = true;

        try {
          initUnemploymentChart({
            fredApiKey: FRED_API_KEY,
            collegeSeriesId: "CGBD2024",
            overallSeriesId: "UNRATE",
            canvasId: "unemploymentChart",
            sectionId: "unemploymentRates",
          });
        } catch (err) {
          console.error("Chart init error", err);
          console.error("Error message:", err?.message);
          console.error("Stack:", err?.stack);
          if (
            err?.message?.includes("Proxy FRED request failed") ||
            err?.message?.includes("Unexpected FRED response")
          ) {
            console.error(
              "Hint: ensure the dev proxy is running (node src/server.js) and .env contains FRED_API_KEY"
            );
          }
        }

        // Fade-in animation
        const canvasEl = document.getElementById("unemploymentChart");
        canvasEl.style.opacity = 0;
        gsap.to(canvasEl, {
          opacity: 1,
          duration: 1,
          ease: "power1.out",
        });
      },
    });

    const section3 = document.getElementById("mortgageBurden");
    if (!section3) throw new Error(`Section element #${sectionId} not found`);

    ScrollTrigger.create({
      trigger: section3,
      start: "top 80%", // trigger when section is 80% into viewport
      pin: true,
      start: "top top+=40vh",
      end: "+=2500",
      onEnter: () => {
        if (chartInitialized) return;
        chartInitialized = true;
      },
    });
  //});
}catch(err){
  console.error("Main init error", err);
}
//})();
