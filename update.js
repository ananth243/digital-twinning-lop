const fs = require('fs');
const Papa = require('papaparse');
const { Client } = require('pg');

// PostgreSQL database connection config
const Config = {
    user: 'postgres',
    host: 'localhost',
    database: 'weather_data',
    password: 'Pranjal@6',
    port: 5433, // Default PostgreSQL port
};

const csvFilePath = 'weather_data.csv';

// Read the CSV file and parse the headers
fs.readFile(csvFilePath, 'utf8', async (err, data) => {
    if (err) {
        console.error('Error reading CSV file');
        return;
    }

    // Parse the CSV data to extract headers
    const parsedData = Papa.parse(data, { header: true });

    // Extract headers from the CSV file
    const headers = parsedData.meta.fields;

    // Create the table dynamically based on the headers
    await createTable(headers);
});

// Function to create the table dynamically based on headers
async function createTable(headers) {
    const client = new Client(Config);

    try {
        await client.connect();

        // Construct the CREATE TABLE query dynamically
        const query = `
            CREATE TABLE IF NOT EXISTS weather (
                ${headers.map(header => `"${header}" VARCHAR(255)`).join(', ')}
            )
        `;

        // Execute the CREATE TABLE query
        await client.query(query);

        console.log('Table "weather" created successfully with dynamic columns');
    } catch (error) {
        console.error('Error creating table:', error);
    } finally {
        await client.end();
    }
}


fs.readFile(csvFilePath, 'utf8', async (err, data) => {
  if (err) {
    console.error('Error reading CSV file');
    return;
  }

  // Parse the CSV data
  const parsedData = Papa.parse(data, { header: true });

  // Now you can work with the parsedData
  parsedData.data.map(async (row) => {
    // Pass the row object directly to the insertDataToPostgres function
    await insertDataToPostgres(row);
  });
});

async function insertDataToPostgres(row) {
  const client = new Client(Config);

  try {
    await client.connect();

    // Replace with your PostgreSQL table name
    const tableName = 'weather';

    // Extract column names dynamically from the CSV header
    const columns = Object.keys(row).map(column => `"${column}"`);

    // Build the dynamic INSERT INTO query
    const query = `
      INSERT INTO "${tableName}" (${columns.join(', ')})
      VALUES (${Object.keys(row).map((_, index) => `$${index + 1}`).join(', ')})
    `;

    // Pass the values as an array to client.query
    await client.query(query, Object.values(row));
    console.log(`Data inserted successfully into PostgreSQL for row ${Object.values(row).join(',')}`);
  } catch (error) {
    console.error(`Error inserting data into PostgreSQL for row ${Object.values(row).join(',')}`, error);
  } finally {
    await client.end();
  }
}

