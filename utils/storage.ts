// utils/storage.ts
// В Next.js API-роуты находятся в том же приложении,
// поэтому используем относительный путь /api без переменных окружения.

export type Highscore = {
	id?: number
	name: string
	attempts: number
	date?: string
}

/** Загружает Top-10 Highscores с сервера */
export async function loadHighscores(): Promise<Highscore[]> {
	const res = await fetch('/api/highscores')
	if (!res.ok) throw new Error('Fehler beim Laden der Highscores')
	return res.json()
}

/** Сохраняет новый результат */
export async function saveHighscore(
	name: string,
	attempts: number,
): Promise<Highscore> {
	const res = await fetch('/api/highscores', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ name, attempts }),
	})
	if (!res.ok) throw new Error('Fehler beim Speichern des Ergebnisses')
	return res.json()
}

/** Удаляет все Highscores */
export async function resetHighscores(): Promise<void> {
	const res = await fetch('/api/highscores', { method: 'DELETE' })
	if (!res.ok) throw new Error('Fehler beim Löschen der Highscores')
}
