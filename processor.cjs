const Papa = require('papaparse');
const axios = require('axios'); // For making HTTP requests
const fs = require('fs')

// Replace with your actual API details
const apiUrl = 'http://127.0.0.1:8000/sensor/insert-data';
const apiMethod = 'POST'; // Or 'GET', 'PUT', etc.

const csvFilePath = 'weather_data.csv';

// Function to process each CSV row
async function processRow(row) {
  row = Object.values(row)
  // Extract relevant data from the row (replace with your column names)
  const date = row[0];
  const location = row[1];
  const max_temp = row[2];
  const min_temp = row[3];
  const avg_temp = row[4];
  const max_wind = row[5];
  const total_precip = row[6];
  const total_snow = row[7];
  const avg_visiblilty = row[7];
  const avg_humidity = row[8];
  const will_it_rain = row[9];
  const chance_of_rain = row[10];
  const will_it_snow = row[11];
  const chance_of_snow = row[12];
  const condition = row[13];
  const uv_index = row[14];
  // Create API request body (adapt based on your API requirements)
  const requestBody = {
    date: date,
    location: location,
    max_temp: max_temp,
    min_temp: min_temp,
    avg_temp: avg_temp,
    max_wind: max_wind,
    total_precip: total_precip,
    total_snow: total_snow,
    avg_visiblilty: avg_visiblilty,
    avg_humidity: avg_humidity,
    will_it_rain: will_it_rain,
    chance_of_rain: chance_of_rain,
    will_it_snow: will_it_snow,
    chance_of_snow: chance_of_snow,
    condition: condition,
    uv_index: uv_index
  };

  try {
    const response = await axios({
      method: apiMethod,
      url: apiUrl,
      data: requestBody,
    });

    console.log(`API response for row ${row.join(',')}:`, response.data);
  } catch (error) {
    console.error(`Error calling API for row ${row.join(',')}:`, error);
    // Handle errors appropriately, e.g., log, retry, etc.
  }
}


fs.readFile(csvFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading CSV file');
      return;
    }
  
    // Parse the CSV data
    const dataArray = Papa.parse(data, { header: true });
  
    // Now you can work with the dataArray
    dataArray.data.map(async (data) => {
      await processRow(data)
    })
});