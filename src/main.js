import { initWageHousingChart } from "./charts/wages-vs-housing.js";
import { initUnemploymentChart } from "./charts/unemployment.js";

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
let [data_MEHOINUSA672N, labels_MEHOINUSA672N] = await getSeries(
  "MEHOINUSA672N"
);
console.log(data_MSPUS);

let [data_UNRATE, labels_UNRATE] = await getSeries("UNRATE");
let [data_CGBD2024, labels_CGBD2024] = await getSeries("CGBD2024");

try {
  // The proxy uses the key from the server's .env.
  const FRED_API_KEY = "PROXY";

  const MEDIAN_HOUSEHOLD_INCOME_SERIES = "MEHOINUSA672N";
  const MEDIAN_SALES_PRICE_SERIES = "MSPUS";

  //document.addEventListener("DOMContentLoaded", async () => {

  const wageHousing = document.getElementById("wageHousing");
  if (!wageHousing) throw new Error(`Section element #${sectionId} not found`);
  gsap.registerPlugin(ScrollTrigger);
  let wageHousingInitialized = false;

  ScrollTrigger.create({
    trigger: wageHousing,
    start: "top 80%", // trigger when section is 80% into viewport
    pin: true,
    start: "top top+=30px",
    end: "+=1000",
    onEnter: () => {
      if (wageHousingInitialized) return;
      wageHousingInitialized = true;

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
      }

      // Fade-in animation for chart
      const canvasEl = document.getElementById("wageHousingChart");
      canvasEl.style.opacity = 0;
      gsap.to(canvasEl, {
        opacity: 1,
        duration: 1,
        ease: "power1.out",
      });

      // Fade-in animation for overlay text
      const overlay = wageHousing.querySelector(".chart-overlay");
      gsap.set(overlay, { opacity: 0, y: 300 }); // Ensure it's hidden initially
      gsap.to(overlay, {
        opacity: 1,
        duration: 1,
        ease: "power1.out",
      });
    },
  });

  // Overlay scroll animation
  gsap.set(wageHousing.querySelector(".chart-overlay"), { y: 2000 }); // Start position below initial position
  gsap.to(wageHousing.querySelector(".chart-overlay"), {
    y: 180, // Adjust to control how far the text scrolls up
    ease: "circle",
    scrollTrigger: {
      trigger: wageHousing,
      start: "top 50%", // when the top of the trigger hits the bottom of the viewport
      end: "+=1200",
      scrub: true,
    },
  });

  const unemploymentRates = document.getElementById("unemploymentRates");
  if (!unemploymentRates)
    throw new Error(`Section element #${sectionId} not found`);

  let unemploymentInitialized = false;

  ScrollTrigger.create({
    trigger: unemploymentRates,
    start: "top 80%", // trigger when section is 80% into viewport
    pin: true,
    start: "top top+=30px",
    end: "+=1800",
    anticipatePin: 0.5,
    onEnter: () => {
      if (unemploymentInitialized) return;
      unemploymentInitialized = true;

      try {
        initUnemploymentChart({
          fredApiKey: FRED_API_KEY,
          collegeSeries: data_CGBD2024,
          overallSeries: data_UNRATE,
          canvasId: "unemploymentChart",
          sectionId: "unemploymentRates",
        });
      } catch (err) {
        console.error("Chart init error", err);
        console.error("Error message:", err?.message);
        console.error("Stack:", err?.stack);
      }

      // Fade-in animation
      const canvasEl = document.getElementById("unemploymentChart");
      canvasEl.style.opacity = 0;
      gsap.to(canvasEl, {
        opacity: 1,
        duration: 1,
        ease: "power1.out",
      });

      // Fade-in animation for overlay text
      const overlay = unemploymentRates.querySelector(".chart-overlay");
      gsap.set(overlay, { opacity: 0, y: 300 }); // Ensure it's hidden initially
      gsap.to(overlay, {
        opacity: 1,
        duration: 1,
        ease: "power1.out",
      });
    },
  });

  // Overlay scroll animation
  gsap.set(unemploymentRates.querySelector(".chart-overlay"), { y: 2000 }); // Start position below initial position
  gsap.to(unemploymentRates.querySelector(".chart-overlay"), {
    y: 180, // Adjust to control how far the text scrolls up
    ease: "circle",
    scrollTrigger: {
      trigger: unemploymentRates,
      start: "top 50%", // when the top of the trigger hits the bottom of the viewport
      end: "+=1200",
      scrub: true,
    },
  });







  const section3 = document.getElementById("mortgageBurden");
  if (!section3) throw new Error(`Section element #${sectionId} not found`);
  let section3Initialized = false;
  ScrollTrigger.create({
    trigger: section3,
    start: "top 80%", // trigger when section is 80% into viewport
    pin: true,
    start: "top top+=30px",
    end: "+=2500",
    onEnter: () => {
      if (section3Initialized) return;
      section3Initialized = true;
    },
  });
  //});
} catch (err) {
  console.error("Main init error", err);
}
//})();
