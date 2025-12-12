export class BeerSystem {
  constructor(scene) {
    this.scene = scene
    this.beers = null
    this.beerSound = null
  }

  create() {
    this.beers = this.scene.physics.add.group()
    
    try {
      this.beerSound = this.scene.sys.game.sound.add('beer_sound', { volume: 0.5 })
    } catch (e) {
      this.beerSound = null
    }
    
    const positions = [
      { x: 250, y: 400 },
      { x: 550, y: 250 },
      { x: 750, y: 600 },
      { x: 950, y: 200 },
      { x: 1150, y: 500 },
      { x: 350, y: 900 },
      { x: 650, y: 1050 },
      { x: 1050, y: 900 },
      { x: 1350, y: 700 },
      { x: 450, y: 650 },
    ]
    
    positions.forEach(pos => {
      const beer = this.beers.create(pos.x, pos.y, 'beer')
      beer.setOrigin(0.5, 0.5)
      beer.setDepth(5)
      
      this.scene.tweens.add({
        targets: beer,
        y: beer.y - 3,
        duration: 1000 + Math.random() * 500,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      })
    })
  }

  drinkBeer(player, beer) {
    beer.destroy()
    
    if (this.beerSound) {
      this.beerSound.play()
    } else {
      this.scene.sound.playBeer()
    }
    
    this.scene.playerEntity.drinkBeer()
    
    const drinkText = this.scene.add.text(player.x, player.y - 30, '🍺 БУЛЬ!', {
      fontSize: '20px',
      fontFamily: 'monospace',
      fill: '#ffcc00'
    }).setOrigin(0.5).setDepth(200)
    
    this.scene.tweens.add({
      targets: drinkText,
      y: drinkText.y - 40,
      alpha: 0,
      duration: 1000,
      onComplete: () => drinkText.destroy()
    })
  }
}

