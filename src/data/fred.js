
// export async function fetchFredSeries(seriesId) {
//   const url = `src/data/fred_response_${seriesId}.json`; 
//   const res = await fetch(url);
//   if (!res.ok) throw new Error(`Proxy FRED request failed: ${res.status}`);
//   const json = await res.json();

//   if (!json || !Array.isArray(json.observations)) {
//     throw new Error('Unexpected FRED response format');
//   }

//   return json.observations.map(o => ({
//     x: o.date,
//     y: Number(o.value)
//   }));

// }
