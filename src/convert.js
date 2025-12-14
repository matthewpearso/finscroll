import fs from 'fs';

const filePath = 'data/fred_response_HHMSDODNS.json';

try {
  const data = fs.readFileSync(filePath, 'utf8');
  const json = JSON.parse(data);

  // Convert each value from billions to millions
  json.observations.forEach(obs => {
    if (obs.value !== '.') { // Skip missing values
      obs.value = (parseFloat(obs.value) * 1000).toString();
    }
  });

  // Write back to file
  fs.writeFileSync(filePath, JSON.stringify(json, null, 2));
  console.log('Conversion complete: values multiplied by 1000 (billions to millions).');
} catch (err) {
  console.error('Error:', err.message);
}