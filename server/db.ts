
import { Pool } from 'pg';

const connectionConfig = {
  host: 'db.redeis.com.br',
  port: 5555,
  user: 'sotech',
  password: 'SthNox@2022',
  database: 'dbapr',
  ssl: {
    rejectUnauthorized: false
  },
  schema: 'sotech'
};

export const pool = new Pool(connectionConfig);

// Test connection
pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Database connection error:', err);
});

// Helper function to execute queries
export async function query(text: string, params?: any[]) {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
}

export default pool;
