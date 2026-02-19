type WinViewProps = {
	attempts: number
	secretNumber: number
	playerName: string
	onNameChange: (value: string) => void
	onSave: () => void
	onNewGame: () => void
	message?: string
	isSaved?: boolean
}

export function WinView({
	attempts,
	secretNumber,
	playerName,
	onNameChange,
	onSave,
	onNewGame,
	message,
	isSaved = false,
}: WinViewProps) {
	return (
		<div style={{ maxWidth: 520, margin: '40px auto', padding: 16 }}>
			<h1 style={{ textAlign: 'center' }}>🎉 Gewonnen!</h1>

			<div style={{ textAlign: 'center', fontSize: 42, margin: '16px 0' }}>
				{secretNumber}
			</div>

			<p style={{ textAlign: 'center', fontSize: 18 }}>
				Du hast es in <b>{attempts}</b> Versuchen geschafft.
			</p>

			<p style={{ textAlign: 'center' }}>
				Trage dich in die Highscore-Liste ein:
			</p>

			<div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
				<input
					value={playerName}
					onChange={e => onNameChange(e.target.value)}
					onKeyDown={e => e.key === 'Enter' && !isSaved && onSave()}
					placeholder='Dein Name'
					disabled={isSaved}
					style={{
						padding: 10,
						fontSize: 16,
						width: 220,
						opacity: isSaved ? 0.5 : 1,
					}}
				/>
				<button
					onClick={onSave}
					disabled={isSaved}
					style={{
						padding: '10px 14px',
						opacity: isSaved ? 0.5 : 1,
						cursor: isSaved ? 'default' : 'pointer',
					}}
				>
					Save
				</button>
			</div>

			<p style={{ textAlign: 'center', marginTop: 10, minHeight: 24 }}>
				{message ?? ''}
			</p>

			<div style={{ display: 'flex', justifyContent: 'center', marginTop: 12 }}>
				<button onClick={onNewGame} style={{ padding: '10px 14px' }}>
					New Game
				</button>
			</div>
		</div>
	)
}
