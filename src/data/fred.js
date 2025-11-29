
export async function fetchFredSeries(seriesId, apiKeyIgnored, start = '', end = '') {
  const params = new URLSearchParams({ series_id: seriesId });
  if (start) params.set('observation_start', start);
  if (end) params.set('observation_end', end);
  const url = `/api/fred/series/observations?${params.toString()}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Proxy FRED request failed: ${res.status}`);
  const json = await res.json();
  return json.observations.map(o => ({ date: o.date, value: o.value === '.' ? null : Number(o.value) }));
}

