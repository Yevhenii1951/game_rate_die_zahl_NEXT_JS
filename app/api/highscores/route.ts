import pool from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/highscores — Top-10 Ergebnisse
export async function GET() {
	try {
		const result = await pool.query(`
      SELECT
        gr.id,
        p.username  AS name,
        gr.attempts,
        gr.played_at AS date
      FROM game_results gr
      JOIN players p ON p.id = gr.player_id
      ORDER BY gr.attempts ASC, gr.played_at ASC
      LIMIT 10
    `)
		return NextResponse.json(result.rows)
	} catch (err) {
		console.error(err)
		return NextResponse.json({ error: 'Database error' }, { status: 500 })
	}
}

// POST /api/highscores — neues Ergebnis speichern
export async function POST(req: NextRequest) {
	const body = await req.json().catch(() => null)

	if (!body) {
		return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
	}

	const { name, attempts } = body

	if (!name || typeof name !== 'string' || name.trim().length === 0) {
		return NextResponse.json({ error: 'name is required' }, { status: 400 })
	}
	if (!Number.isInteger(attempts) || attempts < 1) {
		return NextResponse.json(
			{ error: 'attempts must be a positive integer' },
			{ status: 400 },
		)
	}

	const username = name.trim()

	try {
		await pool.query(
			`INSERT INTO players (username) VALUES ($1) ON CONFLICT (username) DO NOTHING`,
			[username],
		)
		const playerResult = await pool.query(
			`SELECT id FROM players WHERE username = $1`,
			[username],
		)
		const playerId = playerResult.rows[0].id

		const insertResult = await pool.query(
			`INSERT INTO game_results (player_id, attempts) VALUES ($1, $2) RETURNING id, attempts, played_at`,
			[playerId, attempts],
		)

		return NextResponse.json(
			{
				id: insertResult.rows[0].id,
				name: username,
				attempts: insertResult.rows[0].attempts,
				date: insertResult.rows[0].played_at,
			},
			{ status: 201 },
		)
	} catch (err) {
		console.error(err)
		return NextResponse.json({ error: 'Database error' }, { status: 500 })
	}
}

// DELETE /api/highscores — alle Highscores löschen
export async function DELETE() {
	try {
		await pool.query('DELETE FROM game_results')
		await pool.query('DELETE FROM players')
		return NextResponse.json({ message: 'All highscores deleted' })
	} catch (err) {
		console.error(err)
		return NextResponse.json({ error: 'Database error' }, { status: 500 })
	}
}
