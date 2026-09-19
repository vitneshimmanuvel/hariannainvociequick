import { neon } from '@neondatabase/serverless';

const sql = neon('postgresql://neondb_owner:npg_9laqX6xPpViR@ep-spring-surf-b43gzqzu-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require');

async function test() {
  try {
    const result = await sql`SELECT NOW() as current_time;`;
    console.log('Neon DB Connection SUCCESSFUL:', result);

    await sql`
      CREATE TABLE IF NOT EXISTS invoices (
        id TEXT PRIMARY KEY,
        invoice_number TEXT NOT NULL,
        invoice_date TEXT NOT NULL,
        client_name TEXT NOT NULL,
        data JSONB NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log('Invoices table created and ready in Neon DB!');
  } catch (err) {
    console.error('Neon DB Error:', err);
  }
}

test();
