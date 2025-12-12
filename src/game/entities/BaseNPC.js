/**
 * Базовый класс для всех NPC (враги и дружественные)
 * Поддерживает AI, фразы, анимации
 */
export class BaseNPC {
  constructor(scene, config) {
    this.scene = scene
    this.config = config
    this.sprite = null
    this.nameText = null
    this.phraseText = null
    this.phraseTimer = null
  }

  create(x, y) {
    // Создаём спрайт
    this.sprite = this.scene.physics.add.sprite(x, y, this.config.spriteKey)
    this.sprite.setOrigin(0.5, 0.5)
    this.sprite.setDepth(this.config.depth || 10)
    
    if (this.config.scale) {
      this.sprite.setScale(this.config.scale)
    }
    
    if (this.config.bodySize) {
      this.sprite.body.setSize(this.config.bodySize.width, this.config.bodySize.height)
      if (this.config.bodyOffset) {
        this.sprite.body.setOffset(this.config.bodyOffset.x, this.config.bodyOffset.y)
      }
    }
    
    if (this.config.collideWorldBounds) {
      this.sprite.setCollideWorldBounds(true)
    }
    
    // Сохраняем данные AI
    this.sprite.npcData = {
      type: this.config.type,
      state: 'patrol',
      direction: 'down',
      ...this.config.ai,
      startX: x,
      startY: y
    }
    
    // Создаём текст имени если нужен
    if (this.config.showName) {
      this.nameText = this.scene.add.text(x, y - 30, this.config.name, {
        fontFamily: 'monospace',
        fontSize: this.config.nameFontSize || '10px',
        fill: this.config.nameColor || '#ffffff',
        stroke: '#000000',
        strokeThickness: 2
      }).setOrigin(0.5).setDepth(100)
    }
    
    // Запускаем таймер фраз если нужен
    if (this.config.phrases && this.config.phrases.length > 0) {
      this.startPhraseTimer()
    }
    
    // Анимация покачивания для статичных NPC
    if (this.config.bobbing) {
      this.scene.tweens.add({
        targets: this.sprite,
        y: y - 3,
        duration: 1000 + Math.random() * 500,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      })
    }
    
    return this.sprite
  }

  startPhraseTimer() {
    // Первая фраза с задержкой
    this.scene.time.addEvent({
      delay: (this.config.initialPhraseDelay || 1000) + Math.random() * 2000,
      callback: () => {
        this.showPhrase()
        
        // Повторяющиеся фразы
        this.phraseTimer = this.scene.time.addEvent({
          delay: (this.config.phraseInterval || 5000) + Math.random() * 2000,
          callback: () => this.showPhrase(),
          callbackScope: this,
          loop: true
        })
      },
      callbackScope: this
    })
  }

  showPhrase() {
    if (!this.sprite || !this.sprite.active || this.scene.gameComplete) return
    
    // Удаляем старую фразу
    if (this.sprite.activePhrase) {
      this.sprite.activePhrase.destroy()
    }
    
    // Выбираем случайную фразу
    const phrase = Phaser.Utils.Array.GetRandom(this.config.phrases)
    
    const phraseEffect = this.scene.add.text(this.sprite.x, this.sprite.y - 50, phrase, {
      fontFamily: 'monospace',
      fontSize: this.config.phraseFontSize || '10px',
      fill: this.config.phraseColor || '#ffffff',
      stroke: '#000000',
      strokeThickness: 2,
      align: 'center',
      wordWrap: { width: 120 }
    }).setOrigin(0.5).setDepth(200)
    
    this.sprite.activePhrase = phraseEffect
    this.sprite.phraseStartY = this.sprite.y - 50
    this.sprite.phraseStartTime = this.scene.time.now
    
    // Анимация фразы
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
    
    // Звук для агрессивных NPC
    if (this.config.alertSound && this.sprite.npcData.state === 'chase') {
      this.scene.sound.playAlert()
    }
  }

  update() {
    if (!this.sprite || !this.sprite.active) return
    
    const data = this.sprite.npcData
    
    // AI для мобильных NPC
    if (this.config.ai) {
      this.updateAI(data)
    }
    
    // Обновляем позицию имени
    if (this.nameText) {
      this.nameText.x = this.sprite.x
      this.nameText.y = this.sprite.y - (this.config.nameOffset || 30)
    }
    
    // Обновляем позицию фразы (следует за NPC с вертикальным движением)
    if (this.sprite.activePhrase && this.sprite.phraseStartTime) {
      const elapsed = this.scene.time.now - this.sprite.phraseStartTime
      const offsetY = (elapsed / 5000) * 30
      this.sprite.activePhrase.x = this.sprite.x
      this.sprite.activePhrase.y = this.sprite.phraseStartY - offsetY
    }
  }

  updateAI(data) {
    const player = this.scene.player
    const distToPlayer = Phaser.Math.Distance.Between(this.sprite.x, this.sprite.y, player.x, player.y)
    
    // Обновляем состояние
    if (data.state === 'patrol') {
      if (this.config.hostile && distToPlayer < data.detectionRange && !this.scene.isHiding) {
        data.state = 'chase'
        this.showPhrase()
      }
    } else if (data.state === 'chase') {
      if (distToPlayer > data.loseRange || this.scene.isHiding) {
        data.state = 'return'
      }
    } else if (data.state === 'return') {
      const distToHome = Phaser.Math.Distance.Between(
        this.sprite.x, this.sprite.y, 
        data.homeX || data.startX, 
        data.homeY || data.startY
      )
      if (distToHome < 10) {
        data.state = 'patrol'
        if (data.currentPatrolIndex !== undefined) {
          data.currentPatrolIndex = 0
        }
      }
      if (this.config.hostile && distToPlayer < data.detectionRange && !this.scene.isHiding) {
        data.state = 'chase'
        this.showPhrase()
      }
    }
    
    // Вычисляем движение
    let velocityX = 0
    let velocityY = 0
    
    if (data.state === 'patrol') {
      if (data.patrolX) {
        // Патрулирование по X
        velocityX = data.patrolDirection * data.speed
        if (this.sprite.x <= data.patrolX[0]) data.patrolDirection = 1
        if (this.sprite.x >= data.patrolX[1]) data.patrolDirection = -1
      } else if (data.patrolY) {
        // Патрулирование по Y
        velocityY = data.patrolDirection * data.speed
        if (this.sprite.y <= data.patrolY[0]) data.patrolDirection = 1
        if (this.sprite.y >= data.patrolY[1]) data.patrolDirection = -1
      } else if (data.patrolPoints) {
        // Патрулирование по точкам
        const target = data.patrolPoints[data.currentPatrolIndex]
        const distToTarget = Phaser.Math.Distance.Between(
          this.sprite.x, this.sprite.y, target.x, target.y
        )
        
        if (distToTarget < 10) {
          data.currentPatrolIndex = (data.currentPatrolIndex + 1) % data.patrolPoints.length
        }
        
        const angle = Phaser.Math.Angle.Between(this.sprite.x, this.sprite.y, target.x, target.y)
        velocityX = Math.cos(angle) * data.speed
        velocityY = Math.sin(angle) * data.speed
      }
    } else if (data.state === 'chase') {
      const angle = Phaser.Math.Angle.Between(this.sprite.x, this.sprite.y, player.x, player.y)
      velocityX = Math.cos(angle) * data.chaseSpeed
      velocityY = Math.sin(angle) * data.chaseSpeed
    } else if (data.state === 'return') {
      const homeX = data.homeX || data.startX
      const homeY = data.homeY || data.startY
      const angle = Phaser.Math.Angle.Between(this.sprite.x, this.sprite.y, homeX, homeY)
      velocityX = Math.cos(angle) * data.speed
      velocityY = Math.sin(angle) * data.speed
    }
    
    this.sprite.setVelocity(velocityX, velocityY)
    
    // Обновляем направление спрайта
    if (Math.abs(velocityX) > Math.abs(velocityY)) {
      data.direction = velocityX > 0 ? 'right' : 'left'
    } else if (velocityY !== 0) {
      data.direction = velocityY > 0 ? 'down' : 'up'
    }
    
    // Обновляем текстуру
    const textureKey = this.config.hasDirections 
      ? `${this.config.spriteKey}_${data.direction}`
      : this.config.spriteKey
    this.sprite.setTexture(textureKey)
    
    // Тинт при преследовании
    if (this.config.chaseTint) {
      if (data.state === 'chase') {
        this.sprite.setTint(this.config.chaseTint)
      } else {
        this.sprite.clearTint()
      }
    }
  }

  destroy() {
    if (this.sprite) {
      if (this.sprite.activePhrase) {
        this.sprite.activePhrase.destroy()
      }
      this.sprite.destroy()
    }
    if (this.nameText) {
      this.nameText.destroy()
    }
    if (this.phraseTimer) {
      this.phraseTimer.destroy()
    }
  }
}

