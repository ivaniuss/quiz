// lib/db.ts
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.connect()
  .then(() => {
    console.log('✅ Conectado a la base de datos PostgreSQL con éxito');
  })
  .catch((err) => {
    console.error('❌ Error al conectar a la base de datos:', err);
  });

export const db = drizzle(pool);
