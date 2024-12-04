import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;  // Destructure Pool from the default import

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
  ssl: {
    rejectUnauthorized: false
  }
});

const checkConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('Database connected successfully');
    client.release();  // Release the client when done
  } catch (err) {
    console.error('Database connection error', err);
  }
};

export { pool, checkConnection };