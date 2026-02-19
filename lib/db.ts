import { Pool } from 'pg'

// Vercel Postgres / Neon / Render — все используют DATABASE_URL
// Локально: задай DATABASE_URL в .env.local
const pool = process.env.DATABASE_URL
	? new Pool({
			connectionString: process.env.DATABASE_URL,
			ssl: { rejectUnauthorized: false },
		})
	: new Pool({
			user: process.env.DB_USER || 'dci-student',
			host: process.env.DB_HOST || 'localhost',
			database: process.env.DB_NAME || 'guess-number',
			password: process.env.DB_PASSWORD || '',
			port: Number(process.env.DB_PORT) || 5432,
		})

export default pool
