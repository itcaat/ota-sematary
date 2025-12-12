export class ZombieGirlEntity {
  constructor(scene) {
    this.scene = scene
    this.sprite = null
    this.nameText = null
    this.phraseText = null
    
    this.phrases = [
      'Хватит в офисе мусорить!',
      'Туда не ходи, сюда ходи!',
      'Кто опять свет не выключил?!',
      'Документы где?!',
      'Заявку напиши!',
      'По регламенту не положено!',
      'Сначала согласуй!',
      'А пропуск где?',
      'Кофе кончился, ваша очередь покупать!',
      'Принтер опять сломали!',
      'Кондиционер не трогать!',
      'Уборщица уже ушла!',
    ]
  }

  create(x, y) {
    this.sprite = this.scene.physics.add.sprite(x, y, 'zombie_girl')
    this.sprite.setOrigin(0.5, 0.5)
    this.sprite.setDepth(10)
    this.sprite.body.setSize(20, 28)
    this.sprite.body.setOffset(6, 10)
    
    this.sprite.girlData = {
      state: 'patrol',
      patrolPoints: [
        { x: 400, y: 300 },
        { x: 700, y: 300 },
        { x: 700, y: 600 },
        { x: 400, y: 600 }
      ],
      currentPatrolIndex: 0,
      speed: 25,
      chaseSpeed: 40,
      detectionRange: 150,
      loseRange: 250,
      startX: x,
      startY: y,
      damage: 1
    }
    
    this.nameText = this.scene.add.text(x, y - 30, 'Нарине', {
      fontFamily: 'monospace',
      fontSize: '8px',
      fill: '#ff69b4',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0.5).setDepth(11)
    
    this.phraseText = this.scene.add.text(x, y - 45, '', {
      fontFamily: 'monospace',
      fontSize: '9px',
      fill: '#ffffff',
      stroke: '#4a148c',
      strokeThickness: 2,
      align: 'center',
      wordWrap: { width: 150 }
    }).setOrigin(0.5).setDepth(11)
    
    this.scene.time.addEvent({
      delay: 4000,
      callback: () => this.showPhrase(),
      loop: true
    })
    
    return this.sprite
  }

  showPhrase() {
    if (!this.sprite || !this.sprite.active) return
    
    if (this.sprite.activePhrase) {
      this.sprite.activePhrase.destroy()
    }
    
    const phrase = Phaser.Math.RND.pick(this.phrases)
    const phraseEffect = this.scene.add.text(this.sprite.x, this.sprite.y - 50, phrase, {
      fontFamily: 'monospace',
      fontSize: '10px',
      fill: '#ff69b4',
      stroke: '#000000',
      strokeThickness: 2,
      align: 'center',
      wordWrap: { width: 120 }
    }).setOrigin(0.5).setDepth(200)
    
    this.sprite.activePhrase = phraseEffect
    this.sprite.phraseStartY = this.sprite.y - 50
    this.sprite.phraseStartTime = this.scene.time.now
    
    this.scene.tweens.add({
      targets: phraseEffect,
      alpha: 0,
      scale: 1.5,
      duration: 5000,
      ease: 'Power2',
      onComplete: () => {
        phraseEffect.destroy()
        this.sprite.activePhrase = null
      }
    })
  }

  update() {
    if (!this.sprite || !this.sprite.active) return
    
    const data = this.sprite.girlData
    const player = this.scene.player
    const distToPlayer = Phaser.Math.Distance.Between(this.sprite.x, this.sprite.y, player.x, player.y)
    
    if (data.state === 'patrol') {
      if (distToPlayer < data.detectionRange && !this.scene.isHiding) {
        data.state = 'chase'
      }
    } else if (data.state === 'chase') {
      if (distToPlayer > data.loseRange || this.scene.isHiding) {
        data.state = 'return'
      }
    } else if (data.state === 'return') {
      const distToHome = Phaser.Math.Distance.Between(this.sprite.x, this.sprite.y, data.startX, data.startY)
      if (distToHome < 10) {
        data.state = 'patrol'
        data.currentPatrolIndex = 0
      }
      if (distToPlayer < data.detectionRange && !this.scene.isHiding) {
        data.state = 'chase'
      }
    }
    
    let velocityX = 0
    let velocityY = 0
    let direction = 'down'
    
    if (data.state === 'patrol') {
      const target = data.patrolPoints[data.currentPatrolIndex]
      const distToTarget = Phaser.Math.Distance.Between(this.sprite.x, this.sprite.y, target.x, target.y)
      
      if (distToTarget < 10) {
        data.currentPatrolIndex = (data.currentPatrolIndex + 1) % data.patrolPoints.length
      }
      
      const angle = Phaser.Math.Angle.Between(this.sprite.x, this.sprite.y, target.x, target.y)
      velocityX = Math.cos(angle) * data.speed
      velocityY = Math.sin(angle) * data.speed
    } else if (data.state === 'chase') {
      const angle = Phaser.Math.Angle.Between(this.sprite.x, this.sprite.y, player.x, player.y)
      velocityX = Math.cos(angle) * data.chaseSpeed
      velocityY = Math.sin(angle) * data.chaseSpeed
    } else if (data.state === 'return') {
      const angle = Phaser.Math.Angle.Between(this.sprite.x, this.sprite.y, data.startX, data.startY)
      velocityX = Math.cos(angle) * data.speed
      velocityY = Math.sin(angle) * data.speed
    }
    
    this.sprite.setVelocity(velocityX, velocityY)
    
    if (Math.abs(velocityX) > Math.abs(velocityY)) {
      direction = velocityX > 0 ? 'right' : 'left'
    } else if (velocityY !== 0) {
      direction = velocityY > 0 ? 'down' : 'up'
    }
    
    this.sprite.setTexture(`zombie_girl_${direction}`)
    
    if (data.state === 'chase') {
      this.sprite.setTint(0xff69b4)
    } else {
      this.sprite.clearTint()
    }
    
    this.nameText.x = this.sprite.x
    this.nameText.y = this.sprite.y - 28
    this.phraseText.x = this.sprite.x
    this.phraseText.y = this.sprite.y - 45
    
    if (this.sprite.activePhrase && this.sprite.phraseStartTime) {
      const elapsed = this.scene.time.now - this.sprite.phraseStartTime
      const offsetY = (elapsed / 5000) * 30
      this.sprite.activePhrase.x = this.sprite.x
      this.sprite.activePhrase.y = this.sprite.phraseStartY - offsetY
    }
  }
}

