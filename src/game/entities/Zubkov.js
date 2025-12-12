export class ZubkovEntity {
  constructor(scene) {
    this.scene = scene
    this.sprite = null
    this.nameText = null
  }

  create(x, y) {
    this.sprite = this.scene.physics.add.sprite(x, y, 'zubkov')
    this.sprite.setOrigin(0.5, 0.5)
    this.sprite.setSize(30, 30)
    this.sprite.setOffset(9, 14)
    this.sprite.setDepth(10)
    this.sprite.setCollideWorldBounds(true)
    this.sprite.setScale(1.2)
    
    this.sprite.zombieData = {
      state: 'patrol',
      direction: 'down',
      patrolX: [600, 1000],
      patrolY: null,
      patrolDirection: 1,
      speed: 80,
      chaseSpeed: 160,
      detectionRange: 200,
      loseRange: 350,
      homeX: x,
      homeY: y
    }
    
    this.nameText = this.scene.add.text(x, y - 35, 'ZUBKOV', {
      fontFamily: 'monospace',
      fontSize: '10px',
      fill: '#ffd700',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0.5).setDepth(100)
    
    return this.sprite
  }

  showAlert() {
    this.scene.sound.playAlert()
    
    if (this.sprite.activePhrase) {
      this.sprite.activePhrase.destroy()
    }
    
    const alert = this.scene.add.text(this.sprite.x, this.sprite.y - 50, '🔥 ГДЕ МОИ РАЗРАБЫ!?', {
      fontSize: '14px',
      fontFamily: 'monospace',
      fill: '#ff0000',
      stroke: '#000',
      strokeThickness: 2
    }).setOrigin(0.5).setDepth(200)
    
    this.sprite.activePhrase = alert
    this.sprite.phraseStartY = this.sprite.y - 50
    this.sprite.phraseStartTime = this.scene.time.now
    
    this.scene.tweens.add({
      targets: alert,
      alpha: 0,
      scale: 1.5,
      duration: 5000,
      onComplete: () => {
        alert.destroy()
        this.sprite.activePhrase = null
      }
    })
  }

  update() {
    if (!this.sprite || !this.sprite.active) return
    
    const data = this.sprite.zombieData
    const player = this.scene.player
    const distToPlayer = Phaser.Math.Distance.Between(this.sprite.x, this.sprite.y, player.x, player.y)
    
    if (data.state === 'patrol') {
      if (distToPlayer < data.detectionRange && !this.scene.isHiding) {
        data.state = 'chase'
        this.showAlert()
      }
    } else if (data.state === 'chase') {
      if (distToPlayer > data.loseRange || this.scene.isHiding) {
        data.state = 'return'
      }
    } else if (data.state === 'return') {
      const distToHome = Phaser.Math.Distance.Between(this.sprite.x, this.sprite.y, data.homeX, data.homeY)
      if (distToHome < 10) {
        data.state = 'patrol'
      }
      if (distToPlayer < data.detectionRange && !this.scene.isHiding) {
        data.state = 'chase'
        this.showAlert()
      }
    }
    
    let velocityX = 0
    let velocityY = 0
    
    if (data.state === 'patrol') {
      if (data.patrolX) {
        velocityX = data.patrolDirection * data.speed
        if (this.sprite.x <= data.patrolX[0]) data.patrolDirection = 1
        if (this.sprite.x >= data.patrolX[1]) data.patrolDirection = -1
      }
    } else if (data.state === 'chase') {
      const angle = Phaser.Math.Angle.Between(this.sprite.x, this.sprite.y, player.x, player.y)
      velocityX = Math.cos(angle) * data.chaseSpeed
      velocityY = Math.sin(angle) * data.chaseSpeed
    } else if (data.state === 'return') {
      const angle = Phaser.Math.Angle.Between(this.sprite.x, this.sprite.y, data.homeX, data.homeY)
      velocityX = Math.cos(angle) * data.speed
      velocityY = Math.sin(angle) * data.speed
    }
    
    this.sprite.setVelocity(velocityX, velocityY)
    
    if (Math.abs(velocityX) > Math.abs(velocityY)) {
      data.direction = velocityX > 0 ? 'right' : 'left'
    } else if (velocityY !== 0) {
      data.direction = velocityY > 0 ? 'down' : 'up'
    }
    
    this.sprite.setTexture(`zubkov_${data.direction}`)
    
    if (data.state === 'chase') {
      this.sprite.setTint(0xff4444)
    } else {
      this.sprite.clearTint()
    }
    
    this.nameText.x = this.sprite.x
    this.nameText.y = this.sprite.y - 35
    
    if (this.sprite.activePhrase && this.sprite.phraseStartTime) {
      const elapsed = this.scene.time.now - this.sprite.phraseStartTime
      const offsetY = (elapsed / 5000) * 30
      this.sprite.activePhrase.x = this.sprite.x
      this.sprite.activePhrase.y = this.sprite.phraseStartY - offsetY
    }
  }
}

