import Phaser from '../lib/phaser.js'

export default class GameOver extends Phaser.Scene
{
	constructor()
	{
		super('game-over')
	}

	create()
	{
		const width = this.scale.width
		const height = this.scale.height

    const style = { fontFamily: 'OptimusPrinceps', fontSize: 48, color: '#FF1F1F' };
		this.add.text(width * 0.5, height * 0.5, 'YOU DIED.', style)
		.setOrigin(0.5)

		this.input.keyboard.once('keydown-SPACE', () => {
			this.scene.start('game')
		})
	}
}
