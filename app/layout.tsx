import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
	title: 'Guess the Number',
	description: 'Rate die Zahl — ein Zahlenratespiel mit Highscore-Liste',
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang='de'>
			<body>{children}</body>
		</html>
	)
}
