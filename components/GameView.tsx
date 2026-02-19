type GameViewProps = {
	attempts: number
	guess: string
	message: string
	onGuessChange: (value: string) => void
	onSubmit: () => void
}

export function GameView({
	attempts,
	guess,
	message,
	onGuessChange,
	onSubmit,
}: GameViewProps) {
	return (
		<div style={{ maxWidth: 520, margin: '40px auto', padding: 16 }}>
			<h1 style={{ textAlign: 'center' }}>Guess the number</h1>

			<div
				style={{
					width: 60,
					height: 60,
					borderRadius: '50%',
					border: '2px solid black',
					display: 'grid',
					placeItems: 'center',
					margin: '16px auto',
					fontSize: 22,
					fontWeight: 700,
				}}
				title='Versuche'
			>
				{attempts}
			</div>

			<div style={{ textAlign: 'center', fontSize: 42, margin: '16px 0' }}>
				???
			</div>

			<div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
				<input
					value={guess}
					onChange={e => onGuessChange(e.target.value)}
					onKeyDown={e => e.key === 'Enter' && onSubmit()}
					placeholder='Geben Sie eine Zahl zwischen 1–20 ein'
					inputMode='numeric'
					style={{ padding: 10, fontSize: 16, width: 220 }}
				/>
				<button onClick={onSubmit} style={{ padding: '10px 14px' }}>
					Submit
				</button>
			</div>

			<p style={{ textAlign: 'center', marginTop: 14, minHeight: 24 }}>
				{message}
			</p>

			<p style={{ textAlign: 'center', opacity: 0.7 }}>Bereich: 1–20</p>
		</div>
	)
}
