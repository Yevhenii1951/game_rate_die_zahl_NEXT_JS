'use client'

import { GameView } from '@/components/GameView'
import { HighscoreList } from '@/components/HighscoreList'
import { WinView } from '@/components/WinView'
import {
	loadHighscores,
	resetHighscores,
	saveHighscore,
	type Highscore,
} from '@/utils/storage'
import { useEffect, useState } from 'react'

function randomInt(min: number, max: number) {
	return Math.floor(Math.random() * (max - min + 1)) + min
}

const MIN = 1
const MAX = 20

export default function GameApp() {
	const [secretNumber, setSecretNumber] = useState<number>(() =>
		randomInt(MIN, MAX),
	)
	const [guess, setGuess] = useState<string>('')
	const [attempts, setAttempts] = useState<number>(0)
	const [message, setMessage] = useState<string>('')
	const [isWon, setIsWon] = useState<boolean>(false)
	const [playerName, setPlayerName] = useState<string>('')
	const [highscores, setHighscores] = useState<Highscore[]>([])
	const [winMessage, setWinMessage] = useState<string>('')
	const [isSaved, setIsSaved] = useState<boolean>(false)

	useEffect(() => {
		loadHighscores()
			.then(setHighscores)
			.catch(() => setHighscores([]))
	}, [])

	function handleSubmitGuess() {
		const numberGuess = Number(guess)

		if (
			!Number.isInteger(numberGuess) ||
			numberGuess < MIN ||
			numberGuess > MAX
		) {
			setMessage(`Bitte gib eine ganze Zahl von ${MIN} bis ${MAX} ein.`)
			return
		}

		setAttempts(prev => prev + 1)

		if (numberGuess > secretNumber) {
			setMessage('Zu groß')
			return
		}
		if (numberGuess < secretNumber) {
			setMessage('Zu klein')
			return
		}

		setMessage('Gewonnen!')
		setIsWon(true)
		setWinMessage('')
	}

	async function handleSaveScore() {
		if (isSaved) return
		const name = playerName.trim()
		if (name.length === 0) {
			setWinMessage('Bitte gib deinen Namen ein.')
			return
		}
		try {
			await saveHighscore(name, attempts)
			const updated = await loadHighscores()
			setHighscores(updated)
			setIsSaved(true)
			setWinMessage('Gespeichert ✅')
		} catch {
			setWinMessage('Fehler beim Speichern ❌')
		}
	}

	function handleNewGame() {
		setSecretNumber(randomInt(MIN, MAX))
		setGuess('')
		setAttempts(0)
		setMessage('')
		setIsWon(false)
		setPlayerName('')
		setWinMessage('')
		setIsSaved(false)
	}

	return (
		<div>
			{!isWon ? (
				<GameView
					attempts={attempts}
					guess={guess}
					message={message}
					onGuessChange={setGuess}
					onSubmit={handleSubmitGuess}
				/>
			) : (
				<WinView
					attempts={attempts}
					secretNumber={secretNumber}
					playerName={playerName}
					onNameChange={setPlayerName}
					onSave={handleSaveScore}
					onNewGame={handleNewGame}
					message={winMessage}
					isSaved={isSaved}
				/>
			)}

			<HighscoreList highscores={highscores} />

			<div style={{ textAlign: 'center', marginBottom: 24 }}>
				<button
					onClick={async () => {
						try {
							await resetHighscores()
							setHighscores([])
						} catch (err) {
							console.error('Error resetting highscores:', err)
						}
					}}
					style={{ padding: '10px 16px', cursor: 'pointer' }}
				>
					Reset Highscores
				</button>
			</div>
		</div>
	)
}
