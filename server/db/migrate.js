import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { query, pool } from '../src/config/db.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function run() {
  const sql = fs.readFileSync(path.join(__dirname, 'init.sql'), 'utf8');
  await query(sql);

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@pkgraphics.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123';
  const adminName = process.env.ADMIN_NAME || 'PK Admin';

  const existing = await query('SELECT id FROM users WHERE email = $1', [adminEmail]);
  if (existing.rows.length === 0) {
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    await query(
      'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3)',
      [adminName, adminEmail, passwordHash]
    );
    console.log('Created default admin:', adminEmail);
  }

  console.log('Migration complete.');
  await pool.end();
}

run().catch(async (error) => {
  console.error(error);
  await pool.end();
  process.exit(1);
});
