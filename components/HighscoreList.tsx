import type { Highscore } from '@/utils/storage'

type HighscoreListProps = {
	highscores: Highscore[]
}

export function HighscoreList({ highscores }: HighscoreListProps) {
	return (
		<div style={{ maxWidth: 520, margin: '0 auto 60px', padding: 16 }}>
			<h2 style={{ textAlign: 'center' }}>Highscore</h2>

			{highscores.length === 0 ? (
				<p style={{ textAlign: 'center', opacity: 0.7 }}>
					Noch keine Ergebnisse.
				</p>
			) : (
				<div style={{ display: 'grid', gap: 8 }}>
					{highscores.map((s, index) => (
						<div
							key={s.id ?? `${s.name}-${index}`}
							style={{
								display: 'flex',
								justifyContent: 'space-between',
								alignItems: 'center',
								border: '1px solid #ddd',
								padding: '10px 12px',
								borderRadius: 8,
							}}
						>
							<span style={{ minWidth: 140 }}>
								{index + 1}. {s.name}
							</span>
							<b style={{ minWidth: 40, textAlign: 'center' }}>{s.attempts}</b>
							{s.date && (
								<span style={{ opacity: 0.55, fontSize: 13 }}>
									{new Date(s.date).toLocaleDateString()}
								</span>
							)}
						</div>
					))}
				</div>
			)}
		</div>
	)
}
