import getDBPool from "../db/index.js";

const createParameters = (count) => {
  let params = [];
  for (let i = 1; i <= count; i++) params.push(`$${i}`);
  return params.join(",");
};

export const getDataFromDB = async () => {
  const pool = getDBPool();
  let client;
  try {
    client = await pool.connect();
    const fetchQuery =
      "SELECT * FROM public.sensor_data ORDER BY timestamp ASC";
    const { rows } = await client.query(fetchQuery);
    return rows;
  } catch (e) {
    console.log(`Error in inserting to DB: `, e);
  } finally {
    client && client.release();
    pool && pool.end();
  }
};

export const insertDataIntoDB = async (
  client,
  date,
  location,
  max_temp,
  min_temp,
  avg_temp,
  max_wind,
  total_precip,
  total_snow,
  avg_visiblilty,
  avg_humidity,
  will_it_rain,
  chance_of_rain,
  will_it_snow,
  chance_of_snow,
  condition,
  uv_index
) => {
  try {
    // Columns and values to be inserted
    const columns = [
      "weather_date",
      "location",
      "max_temp",
      "min_temp",
      "avg_temp",
      "max_wind",
      "total_precip",
      "total_snow",
      "avg_visiblilty",
      "avg_humidity",
      "will_it_rain",
      "chance_of_rain",
      "will_it_snow",
      "chance_of_snow",
      "condition",
      "uv_index"
    ];

    values = [
      date,
      location,
      max_temp,
      min_temp,
      avg_temp,
      max_wind,
      total_precip,
      total_snow,
      avg_visiblilty,
      avg_humidity,
      will_it_rain,
      chance_of_rain,
      will_it_snow,
      chance_of_snow,
      condition,
      uv_index
    ];
    const paramsQuery = createParameters(columns.length);
    const insertQuery = `INSERT INTO public.sensor_data (${[...columns].join(
      ","
    )}) VALUES(${paramsQuery}) ON CONFLICT DO NOTHING`;
    await client.query(insertQuery, values);
  } catch (e) {
    console.log(`Error in inserting to DB: `, e);
  }
};