const fs = require('fs');
const Papa = require('papaparse');
const { Client } = require('pg');
const {config} = require('dotenv');

config();

// PostgreSQL database connection config
const Config = {
    user: process.env.DB_USER,
    host: 'localhost',
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: 5432, // Default PostgreSQL port
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

    console.log(Config)
    const client = new Client(Config);

    await client.connect();
    // Create the table dynamically based on the headers
    await createTable(headers, client);

    parsedData.data.map(async (row) => {
      // Pass the row object directly to the insertDataToPostgres function
      await insertDataToPostgres(row, client);
    })
});

// Function to create the table dynamically based on headers
async function createTable(headers, client) {
    try {

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
    }
}


async function insertDataToPostgres(row, client) {

  try {
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
  }
}

