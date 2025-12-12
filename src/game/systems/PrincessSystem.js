export class PrincessSystem {
  constructor(scene) {
    this.scene = scene
    this.princess = null
    this.princessGlow = null
  }

  create() {
    this.princess = this.scene.physics.add.sprite(800, 980, 'princess')
    this.princess.setOrigin(0.5, 0.5)
    this.princess.body.setImmovable(true)
    this.princess.setVisible(false)
    this.princess.setDepth(10)
    
    this.princessGlow = this.scene.add.circle(800, 980, 50, 0xff69b4, 0.3)
    this.princessGlow.setVisible(false)
    this.princessGlow.setDepth(9)
    
    this.scene.tweens.add({
      targets: this.princessGlow,
      scale: 1.5,
      alpha: 0.1,
      duration: 1000,
      yoyo: true,
      repeat: -1
    })
  }

  show() {
    this.princess.setVisible(true)
    this.princessGlow.setVisible(true)
    
    const msg = this.scene.add.text(400, 100, '👑 Принцесса ждёт тебя в правом нижнем углу!', {
      fontFamily: 'monospace',
      fontSize: '20px',
      fill: '#ffd700',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5).setScrollFactor(0).setDepth(1000)
    
    this.scene.tweens.add({
      targets: msg,
      alpha: 0,
      y: 50,
      duration: 3000,
      delay: 3000,
      onComplete: () => msg.destroy()
    })
  }

  reach(player, princess) {
    // Проверяем ОБА условия: и уничтожение серверов, и их перенос
    const allServersDestroyed = this.scene.graveyardSystem.collectedItems >= this.scene.graveyardSystem.totalItems
    const allServersTransferred = this.scene.serverTransferSystem.serversTransferred >= this.scene.serverTransferSystem.totalServersToTransfer
    
    if (allServersDestroyed && allServersTransferred && !this.scene.gameComplete) {
      this.completeGame()
    } else if (!this.scene.gameComplete) {
      // Показываем что ещё нужно сделать
      this.showIncompleteMessage(allServersDestroyed, allServersTransferred)
    }
  }

  showIncompleteMessage(serversDestroyed, serversTransferred) {
    // Показываем сообщение только раз в 3 секунды, чтобы не спамить
    if (this.lastMessageTime && Date.now() - this.lastMessageTime < 3000) {
      return
    }
    this.lastMessageTime = Date.now()
    
    let message = '⚠️ Ещё не всё готово!\n\n'
    
    if (!serversDestroyed) {
      const remaining = this.scene.graveyardSystem.totalItems - this.scene.graveyardSystem.collectedItems
      message += `❌ Уничтожь серверы на улице (осталось: ${remaining})\n`
    } else {
      message += `✅ Серверы на улице уничтожены\n`
    }
    
    if (!serversTransferred) {
      const remaining = this.scene.serverTransferSystem.totalServersToTransfer - this.scene.serverTransferSystem.serversTransferred
      message += `❌ Перенеси серверы из Selectel в Yandex (осталось: ${remaining})\n`
    } else {
      message += `✅ Серверы перенесены\n`
    }
    
    const warningText = this.scene.add.text(
      this.scene.cameras.main.scrollX + this.scene.cameras.main.width / 2,
      this.scene.cameras.main.scrollY + 100,
      message,
      {
        fontFamily: 'monospace',
        fontSize: '20px',
        fill: '#ff9800',
        stroke: '#000000',
        strokeThickness: 4,
        align: 'center'
      }
    ).setOrigin(0.5).setDepth(10000)
    
    this.scene.tweens.add({
      targets: warningText,
      alpha: 0,
      y: warningText.y - 30,
      duration: 2500,
      onComplete: () => warningText.destroy()
    })
  }

  completeGame() {
    if (this.scene.gameComplete) return
    this.scene.gameComplete = true
    
    this.scene.player.setVelocity(0)
    this.scene.onGameComplete()
    
    this.kissAnimation()
  }

  kissAnimation() {
    const heart = this.scene.add.text(
      (this.scene.player.x + this.princess.x) / 2,
      (this.scene.player.y + this.princess.y) / 2 - 30,
      '💋❤️',
      { fontSize: '48px' }
    ).setOrigin(0.5).setDepth(200)
    
    this.scene.tweens.add({
      targets: heart,
      scale: 2,
      alpha: 0,
      y: heart.y - 50,
      duration: 2000,
      onComplete: () => {
        heart.destroy()
        this.startFireworks()
      }
    })
    
    for (let i = 0; i < 20; i++) {
      const h = this.scene.add.text(
        this.scene.player.x + Phaser.Math.Between(-50, 50),
        this.scene.player.y + Phaser.Math.Between(-50, 50),
        '❤️',
        { fontSize: `${Phaser.Math.Between(16, 32)}px` }
      ).setOrigin(0.5).setDepth(200)
      
      this.scene.tweens.add({
        targets: h,
        x: h.x + Phaser.Math.Between(-100, 100),
        y: h.y - Phaser.Math.Between(50, 150),
        alpha: 0,
        scale: 0.5,
        duration: 2000,
        delay: i * 100,
        onComplete: () => h.destroy()
      })
    }
  }

  startFireworks() {
    this.scene.sound.stopMusic()
    this.scene.sound.playVictory()
    
    const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff, 0xff8800, 0xff0088]
    
    for (let i = 0; i < 20; i++) {
      this.scene.time.delayedCall(i * 300, () => {
        const x = this.scene.player.x + Phaser.Math.Between(-200, 200)
        const y = this.scene.player.y + Phaser.Math.Between(-200, 200)
        const color = colors[Phaser.Math.Between(0, colors.length - 1)]
        
        this.createFirework(x, y, color)
        this.scene.sound.playFirework()
      })
    }
    
    const congrats = this.scene.add.text(
      400,
      250,
      '🎉 ПОБЕДА! 🎉',
      {
        fontFamily: 'monospace',
        fontSize: '64px',
        fill: '#ffd700',
        stroke: '#000000',
        strokeThickness: 6
      }
    ).setOrigin(0.5).setScrollFactor(0).setDepth(1000)
    
    this.scene.tweens.add({
      targets: congrats,
      scale: 1.2,
      yoyo: true,
      repeat: -1,
      duration: 500
    })
    
    const subText = this.scene.add.text(
      400,
      350,
      '🎉 Вы получаете великолепное НИЧЕГО! 🎉',
      {
        fontFamily: 'monospace',
        fontSize: '28px',
        fill: '#ff69b4',
        stroke: '#000000',
        strokeThickness: 3
      }
    ).setOrigin(0.5).setScrollFactor(0).setDepth(1000)
    
    this.scene.tweens.add({
      targets: subText,
      alpha: 0.7,
      yoyo: true,
      repeat: -1,
      duration: 800
    })
  }

  createFirework(x, y, color) {
    this.scene.add.particles(x, y, 'spark', {
      speed: { min: 100, max: 200 },
      angle: { min: 0, max: 360 },
      scale: { start: 1.5, end: 0 },
      alpha: { start: 1, end: 0 },
      lifespan: 800,
      quantity: 30,
      tint: color
    }).explode()
    
    const flash = this.scene.add.circle(x, y, 15, 0xffffff, 1)
    this.scene.tweens.add({
      targets: flash,
      scale: 3,
      alpha: 0,
      duration: 300,
      onComplete: () => flash.destroy()
    })
  }
}

