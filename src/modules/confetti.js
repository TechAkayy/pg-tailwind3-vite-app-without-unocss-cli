import confetti from 'canvas-confetti'

export function tada() {
	confetti.create(null, {
		resize: true,
		useWorker: true
	})({ particleCount: 200, spread: 200 })
}
