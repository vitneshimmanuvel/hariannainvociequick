import { neon } from '@neondatabase/serverless';

const NEON_CONNECTION_STRING = 'postgresql://neondb_owner:npg_9laqX6xPpViR@ep-spring-surf-b43gzqzu-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require';

let sql = null;

export function getSqlClient() {
  if (!sql) {
    sql = neon(NEON_CONNECTION_STRING);
  }
  return sql;
}

/**
 * Initialize database schema if not already present
 */
export async function initDatabase() {
  try {
    const client = getSqlClient();
    await client`
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
    return { success: true };
  } catch (error) {
    console.error('Failed to init Neon database:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Save or update invoice in Neon PostgreSQL
 */
export async function saveInvoiceToNeon(invoiceData) {
  try {
    const client = getSqlClient();
    const id = invoiceData.id || `inv_${Date.now()}`;
    const invoiceNumber = invoiceData.invoiceNumber || 'PO-0000000';
    const invoiceDate = invoiceData.invoiceDate || new Date().toISOString().split('T')[0];
    const clientName = invoiceData.client?.givenName || 'Unnamed Client';
    const fullData = { ...invoiceData, id };

    await client`
      INSERT INTO invoices (id, invoice_number, invoice_date, client_name, data, updated_at)
      VALUES (${id}, ${invoiceNumber}, ${invoiceDate}, ${clientName}, ${JSON.stringify(fullData)}, NOW())
      ON CONFLICT (id) DO UPDATE SET
        invoice_number = EXCLUDED.invoice_number,
        invoice_date = EXCLUDED.invoice_date,
        client_name = EXCLUDED.client_name,
        data = EXCLUDED.data,
        updated_at = NOW();
    `;

    return { success: true, id, message: 'Saved to Neon DB successfully!' };
  } catch (error) {
    console.error('Neon save error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Fetch all saved invoices from Neon PostgreSQL
 */
export async function fetchAllInvoicesFromNeon() {
  try {
    const client = getSqlClient();
    const rows = await client`
      SELECT id, invoice_number, invoice_date, client_name, data, created_at, updated_at
      FROM invoices
      ORDER BY updated_at DESC;
    `;
    return { success: true, data: rows };
  } catch (error) {
    console.error('Neon fetch error:', error);
    return { success: false, error: error.message, data: [] };
  }
}

/**
 * Delete invoice by ID from Neon
 */
export async function deleteInvoiceFromNeon(id) {
  try {
    const client = getSqlClient();
    await client`
      DELETE FROM invoices WHERE id = ${id};
    `;
    return { success: true };
  } catch (error) {
    console.error('Neon delete error:', error);
    return { success: false, error: error.message };
  }
}
