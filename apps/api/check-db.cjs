const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgresql://autocomm:autocomm_secret@localhost:5433/autocomm'
});

async function main() {
  try {
    // Check users
    const users = await pool.query('SELECT id, name, email FROM "user" LIMIT 5');
    console.log('Users:', JSON.stringify(users.rows, null, 2));

    // Check accounts
    const accounts = await pool.query('SELECT id, account_id, provider_id, user_id FROM account LIMIT 5');
    console.log('Accounts:', JSON.stringify(accounts.rows, null, 2));

    // Check column types
    const cols = await pool.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'user'
      ORDER BY ordinal_position
    `);
    console.log('User columns:', JSON.stringify(cols.rows, null, 2));
  } catch(e) {
    console.error('Error:', e.message);
  }
  await pool.end();
}
main();
