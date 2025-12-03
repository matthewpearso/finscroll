
export async function fetchFredSeries(seriesId) {
  const params = new URLSearchParams({ series_id: seriesId });
  const url = `/api/fred/series/observations?${params.toString()}`;
  //const url = 'src/charts/fred_response.json'; 
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Proxy FRED request failed: ${res.status}`);
  const json = await res.json();

  if (!json || !Array.isArray(json.observations)) {
    throw new Error('Unexpected FRED response format');
  }

  return json.observations.map(o => ({
    date: o.date,
    value: o.value === '.' ? null : Number(o.value)
  }));
}
