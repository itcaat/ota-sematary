export class MineSystem {
  constructor(scene) {
    this.scene = scene
    this.mines = null
    this.explosionRadius = 150
    this.explosionDamage = 999 // Мгновенная смерть для игрока
  }

  create() {
    this.mines = this.scene.physics.add.group()
  }

  placeMine(x, y) {
    if (this.scene.playerEntity.mineCount <= 0) {
      return false
    }

    // Уменьшаем количество мин
    this.scene.playerEntity.useMine()

    // Создаём мину
    const mine = this.mines.create(x, y, 'mine')
    mine.setDepth(5)
    mine.setOrigin(0.5, 0.5)
    mine.body.setAllowGravity(false)
    mine.body.setImmovable(true)
    
    // Мигающая анимация
    this.scene.tweens.add({
      targets: mine,
      alpha: 0.3,
      duration: 200,
      yoyo: true,
      repeat: -1
    })

    // Звук установки мины
    this.scene.sound.playAlert()

    // Таймер до взрыва (3 секунды)
    mine.timer = this.scene.time.delayedCall(3000, () => {
      this.explode(mine)
    })

    // Текст обратного отсчёта
    mine.countdownText = this.scene.add.text(x, y - 20, '3', {
      fontSize: '16px',
      fontFamily: 'monospace',
      fill: '#ff0000',
      stroke: '#000',
      strokeThickness: 3
    }).setOrigin(0.5).setDepth(100)

    // Обратный отсчёт
    let countdown = 3
    mine.countdownInterval = this.scene.time.addEvent({
      delay: 1000,
      callback: () => {
        countdown--
        if (countdown > 0 && mine.countdownText && mine.countdownText.active) {
          mine.countdownText.setText(countdown.toString())
        }
      },
      repeat: 2
    })

    return true
  }

  explode(mine) {
    if (!mine || !mine.active) return

    const x = mine.x
    const y = mine.y

    // Удаляем текст обратного отсчёта
    if (mine.countdownText) {
      mine.countdownText.destroy()
    }

    // Очищаем таймер
    if (mine.timer) {
      mine.timer.remove()
    }
    if (mine.countdownInterval) {
      mine.countdownInterval.remove()
    }

    // Удаляем мину
    mine.destroy()

    // Создаём визуальный эффект взрыва
    this.createExplosionEffect(x, y)

    // Звук взрыва
    this.scene.sound.playZubkov()
    this.scene.cameras.main.shake(500, 0.03)

    // Проверяем попадание игрока
    this.checkPlayerInExplosion(x, y)

    // Проверяем попадание NPC
    this.checkNPCsInExplosion(x, y)
  }

  createExplosionEffect(x, y) {
    // Круг взрыва
    const explosion = this.scene.add.circle(x, y, this.explosionRadius, 0xff6600, 0.7)
    explosion.setDepth(200)

    this.scene.tweens.add({
      targets: explosion,
      alpha: 0,
      scale: 1.5,
      duration: 500,
      ease: 'Power2',
      onComplete: () => explosion.destroy()
    })

    // Текст взрыва
    const explosionText = this.scene.add.text(x, y, '💥 BOOM!', {
      fontSize: '32px',
      fontFamily: 'monospace',
      fill: '#ff0000',
      stroke: '#000',
      strokeThickness: 4
    }).setOrigin(0.5).setDepth(300)

    this.scene.tweens.add({
      targets: explosionText,
      scale: 2,
      alpha: 0,
      duration: 800,
      ease: 'Power2',
      onComplete: () => explosionText.destroy()
    })

    // Частицы
    for (let i = 0; i < 20; i++) {
      const angle = (Math.PI * 2 * i) / 20
      const distance = 50 + Math.random() * 50
      const particle = this.scene.add.circle(
        x + Math.cos(angle) * distance,
        y + Math.sin(angle) * distance,
        5 + Math.random() * 5,
        0xff6600
      )
      particle.setDepth(200)

      this.scene.tweens.add({
        targets: particle,
        x: x + Math.cos(angle) * (distance + 100),
        y: y + Math.sin(angle) * (distance + 100),
        alpha: 0,
        duration: 500,
        onComplete: () => particle.destroy()
      })
    }
  }

  checkPlayerInExplosion(x, y) {
    const distance = Phaser.Math.Distance.Between(x, y, this.scene.player.x, this.scene.player.y)
    
    if (distance <= this.explosionRadius) {
      // Игрок в радиусе взрыва - мгновенная смерть
      this.scene.playerEntity.health = 0
      this.scene.playerEntity.updateHealthUI()
      
      // Отбрасываем игрока
      const angle = Phaser.Math.Angle.Between(x, y, this.scene.player.x, this.scene.player.y)
      this.scene.player.setVelocity(Math.cos(angle) * 500, Math.sin(angle) * 500)
      
      // Game Over
      this.scene.time.delayedCall(100, () => {
        this.scene.gameOver()
      })
    }
  }

  checkNPCsInExplosion(x, y) {
    if (!this.scene.npcManager) return

    // Проверяем зомби
    if (this.scene.npcManager.zombies) {
      this.scene.npcManager.zombies.forEach(npc => {
        if (npc && npc.sprite && npc.sprite.active) {
          const distance = Phaser.Math.Distance.Between(x, y, npc.sprite.x, npc.sprite.y)
          if (distance <= this.explosionRadius) {
            this.killNPC(npc)
          }
        }
      })
    }

    // Проверяем Zubkov
    if (this.scene.npcManager.zubkov) {
      const npc = this.scene.npcManager.zubkov
      if (npc.sprite && npc.sprite.active) {
        const distance = Phaser.Math.Distance.Between(x, y, npc.sprite.x, npc.sprite.y)
        if (distance <= this.explosionRadius) {
          this.killNPC(npc)
        }
      }
    }

    // Проверяем Zombie Girl
    if (this.scene.npcManager.zombieGirl) {
      const npc = this.scene.npcManager.zombieGirl
      if (npc.sprite && npc.sprite.active) {
        const distance = Phaser.Math.Distance.Between(x, y, npc.sprite.x, npc.sprite.y)
        if (distance <= this.explosionRadius) {
          this.killNPC(npc)
        }
      }
    }

    // Дружественные NPC не уничтожаем (они не враги)
  }

  killNPC(npc) {
    if (!npc || !npc.sprite || !npc.sprite.active) return

    const sprite = npc.sprite

    // Эффект смерти
    const deathText = this.scene.add.text(sprite.x, sprite.y - 30, '💀', {
      fontSize: '24px',
      fontFamily: 'monospace'
    }).setOrigin(0.5).setDepth(200)

    this.scene.tweens.add({
      targets: deathText,
      y: deathText.y - 50,
      alpha: 0,
      duration: 1000,
      onComplete: () => deathText.destroy()
    })

    // Удаляем текст имени (если есть)
    if (sprite.nameText && sprite.nameText.destroy) {
      sprite.nameText.destroy()
    }

    // Удаляем активную фразу (если есть)
    if (sprite.activePhrase && sprite.activePhrase.destroy) {
      sprite.activePhrase.destroy()
    }

    // Удаляем таймер фраз (если есть)
    if (npc.phraseTimer && npc.phraseTimer.remove) {
      npc.phraseTimer.remove()
    }

    // Вызываем метод destroy NPC (если есть)
    if (npc.destroy && typeof npc.destroy === 'function') {
      npc.destroy()
    } else {
      // Или просто удаляем спрайт
      sprite.destroy()
    }
  }

  update() {
    // Обновления, если потребуются
  }
}

