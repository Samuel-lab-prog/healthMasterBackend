import { pool } from '../connection';

async function clearDatabase() {
  console.log(' Clearing database...');
  await pool.query(`
    DROP TABLE IF EXISTS referrals;
    DROP TABLE IF EXISTS consultations;
    DROP TABLE IF EXISTS users;
    DROP TABLE IF EXISTS doctors;
    DROP TABLE IF EXISTS migrations;
  `);
  console.log('✅ Database successfully cleared!');
  process.exit(0);
}
clearDatabase();
