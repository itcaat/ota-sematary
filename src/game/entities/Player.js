export class PlayerEntity {
  constructor(scene) {
    this.scene = scene
    this.health = 3
    this.isInvulnerable = false
    this.direction = 'down'
    this.speedMultiplier = 1
    
    // Состояние опьянения
    this.drunkLevel = 0
    this.drunkTimer = null
    this.drunkWobble = 0
    this.beerSpeedBonus = 1
    this.unstableSpeed = false
    
    // Мины
    this.mineCount = 3
    this.onMineCountChange = null
  }

  create(x, y) {
    this.sprite = this.scene.physics.add.sprite(x, y, 'player')
    this.sprite.setCollideWorldBounds(true)
    this.sprite.setSize(20, 20)
    this.sprite.setOffset(6, 10)
    this.sprite.setDepth(10)
    
    return this.sprite
  }

  updateHealthUI() {
    this.scene.onHealthChange(this.health)
  }

  takeDamage(amount) {
    if (this.isInvulnerable || this.scene.gameComplete) return false
    
    this.health -= amount
    const isDead = this.health <= 0
    
    // Не даём здоровью уйти в минус
    if (isDead) {
      this.health = 0
    }
    
    this.updateHealthUI()
    
    return isDead
  }

  setInvulnerable(duration) {
    this.isInvulnerable = true
    this.scene.time.delayedCall(duration, () => {
      this.isInvulnerable = false
    })
  }

  drinkBeer() {
    this.drunkLevel++
    this.scene.onDrunkChange(this.drunkLevel)
    this.updateBeerSpeedBonus()
    
    if (this.drunkTimer) {
      this.drunkTimer.remove()
    }
    
    this.drunkTimer = this.scene.time.addEvent({
      delay: 8000,
      callback: () => {
        this.drunkLevel = Math.max(0, this.drunkLevel - 1)
        this.scene.onDrunkChange(this.drunkLevel)
        this.updateBeerSpeedBonus()
        if (this.drunkLevel === 0) {
          this.removeDrunkEffects()
        }
      },
      repeat: Math.max(0, this.drunkLevel - 1)
    })
    
    this.applyDrunkEffects()
  }

  takeEnterosgel() {
    if (this.drunkLevel > 0) {
      this.drunkLevel--
      this.scene.onDrunkChange(this.drunkLevel)
      this.updateBeerSpeedBonus()
      
      if (this.drunkLevel === 0) {
        this.removeDrunkEffects()
        if (this.drunkTimer) {
          this.drunkTimer.remove()
          this.drunkTimer = null
        }
      }
    }
  }

  useMine() {
    if (this.mineCount > 0) {
      this.mineCount--
      if (this.onMineCountChange) {
        this.onMineCountChange(this.mineCount)
      }
    }
  }

  updateMineCountUI() {
    if (this.onMineCountChange) {
      this.onMineCountChange(this.mineCount)
    }
  }

  updateBeerSpeedBonus() {
    if (this.drunkLevel <= 3) {
      this.beerSpeedBonus = 1 + (this.drunkLevel * 0.15)
      this.unstableSpeed = false
    } else {
      this.beerSpeedBonus = 1.45
      this.unstableSpeed = true
    }
  }

  applyDrunkEffects() {
    if (this.drunkLevel === 1) {
      this.scene.cameras.main.setBackgroundColor(0x1a2a1e)
    } else if (this.drunkLevel === 2) {
      this.scene.cameras.main.setBackgroundColor(0x1a3a1e)
    } else if (this.drunkLevel >= 3) {
      this.scene.cameras.main.setBackgroundColor(0x1a4a1e)
    }
  }

  removeDrunkEffects() {
    this.scene.cameras.main.setBackgroundColor(0x000000)
  }

  update() {
    if (!this.sprite || this.scene.gameComplete) return

    const baseSpeed = 200
    let beerMultiplier = this.beerSpeedBonus
    
    if (this.unstableSpeed) {
      beerMultiplier = 0.5 + Math.abs(Math.sin(this.scene.time.now / 300)) * 1.5
    }
    
    const speed = baseSpeed * this.speedMultiplier * beerMultiplier
    let velocityX = 0
    let velocityY = 0
    
    const cursors = this.scene.cursors
    const wasd = this.scene.wasd
    
    if (cursors.left.isDown || wasd.left.isDown) {
      velocityX = -speed
      this.direction = 'left'
    } else if (cursors.right.isDown || wasd.right.isDown) {
      velocityX = speed
      this.direction = 'right'
    }
    
    if (cursors.up.isDown || wasd.up.isDown) {
      velocityY = -speed
      this.direction = 'up'
    } else if (cursors.down.isDown || wasd.down.isDown) {
      velocityY = speed
      this.direction = 'down'
    }
    
    if (velocityX !== 0 && velocityY !== 0) {
      velocityX *= 0.707
      velocityY *= 0.707
    }
    
    if (this.drunkLevel > 0 && (velocityX !== 0 || velocityY !== 0)) {
      const wobble = this.drunkLevel * 40
      velocityX += Phaser.Math.Between(-wobble, wobble)
      velocityY += Phaser.Math.Between(-wobble, wobble)
    }
    
    if (this.drunkLevel > 0) {
      this.drunkWobble += 0.1
      const wobbleAngle = Math.sin(this.drunkWobble) * this.drunkLevel * 1.5
      this.scene.cameras.main.setAngle(wobbleAngle)
    }
    
    this.sprite.setVelocity(velocityX, velocityY)
    this.sprite.setTexture(`player_${this.direction}`)
  }
}

