export class ServerTransferSystem {
  constructor(scene) {
    this.scene = scene
    this.carryingServer = false
    this.serversTransferred = 0
    this.totalServersToTransfer = 6
    this.carriedServerSprite = null
    this.transferServers = null
    this.selectelDC = null
    this.yandexDC = null
    this.deliveryZone = null
    this.deliveryZoneText = null
    this.carryingText = null
    this.allTransferredMessageShown = false
  }

  create(buildings) {
    this.selectelDC = buildings.find(b => b.buildingType === 'selectel')
    this.yandexDC = buildings.find(b => b.buildingType === 'yandex')
    
    if (!this.selectelDC || !this.yandexDC) return
    
    this.transferServers = this.scene.physics.add.group()
    
    const serverPositions = [
      { x: -50, y: -40 },
      { x: 0, y: -40 },
      { x: 50, y: -40 },
      { x: -50, y: 20 },
      { x: 0, y: 20 },
      { x: 50, y: 20 }
    ]
    
    serverPositions.forEach((pos, i) => {
      const glow = this.scene.add.ellipse(
        this.selectelDC.x + pos.x,
        this.selectelDC.y + pos.y + 10,
        35, 20,
        0x00ff00, 0.5
      )
      glow.setDepth(5)
      
      this.scene.tweens.add({
        targets: glow,
        alpha: 0.2,
        scaleX: 1.3,
        scaleY: 1.3,
        duration: 600 + i * 50,
        yoyo: true,
        repeat: -1
      })
      
      const server = this.transferServers.create(
        this.selectelDC.x + pos.x,
        this.selectelDC.y + pos.y,
        'server'
      )
      server.setDepth(6)
      server.body.setAllowGravity(false)
      server.setScale(0.8)
      server.serverId = i
      server.glow = glow
      server.setTint(0x88ff88)
      
      this.scene.tweens.add({
        targets: server,
        scaleX: 0.85,
        scaleY: 0.85,
        duration: 400 + i * 50,
        yoyo: true,
        repeat: -1
      })
    })
    
    this.deliveryZone = this.scene.add.rectangle(
      this.yandexDC.x,
      this.yandexDC.y,
      80, 60,
      0xffcc00, 0.3
    )
    this.deliveryZone.setDepth(5)
    
    this.scene.tweens.add({
      targets: this.deliveryZone,
      alpha: 0.1,
      duration: 800,
      yoyo: true,
      repeat: -1
    })
    
    this.deliveryZoneText = this.scene.add.text(
      this.yandexDC.x,
      this.yandexDC.y + 45,
      '📦 Зона доставки',
      {
        fontFamily: 'monospace',
        fontSize: '9px',
        fill: '#ffcc00',
        stroke: '#000000',
        strokeThickness: 2
      }
    ).setOrigin(0.5).setDepth(6)
    
    this.carryingText = this.scene.add.text(400, 100, '', {
      fontFamily: 'monospace',
      fontSize: '12px',
      fill: '#00ff00',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0.5).setScrollFactor(0).setDepth(1000)
  }

  pickupServer(player, server) {
    if (this.carryingServer) return
    
    this.carryingServer = true
    
    if (server.glow) {
      server.glow.destroy()
    }
    server.destroy()
    
    this.carryingText.setText('🖥️ Несёшь сервер! Отнеси в Yandex DC')
    
    this.carriedServerSprite = this.scene.add.sprite(0, 0, 'server')
    this.carriedServerSprite.setScale(0.6)
    this.carriedServerSprite.setDepth(15)
    this.carriedServerSprite.setAlpha(0.8)
    
    this.scene.sound.playServerDeath()
    this.scene.playerEntity.speedMultiplier = 0.6
  }

  deliverServer() {
    if (!this.carryingServer) return
    
    const dist = Phaser.Math.Distance.Between(
      this.scene.player.x, this.scene.player.y,
      this.yandexDC.x, this.yandexDC.y
    )
    
    if (dist > 60) return
    
    this.carryingServer = false
    this.serversTransferred++
    
    this.scene.onServerTransferred(this.serversTransferred)
    
    if (this.carriedServerSprite) {
      this.carriedServerSprite.destroy()
      this.carriedServerSprite = null
    }
    
    this.carryingText.setText('')
    this.scene.playerEntity.speedMultiplier = 1
    
    this.scene.cameras.main.flash(200, 255, 200, 0)
    
    for (let i = 0; i < 10; i++) {
      const particle = this.scene.add.rectangle(
        this.yandexDC.x + Phaser.Math.Between(-30, 30),
        this.yandexDC.y + Phaser.Math.Between(-30, 30),
        6, 6, 0xffcc00
      )
      particle.setDepth(100)
      this.scene.tweens.add({
        targets: particle,
        y: particle.y - 40,
        alpha: 0,
        duration: 500,
        onComplete: () => particle.destroy()
      })
    }
    
    const plusText = this.scene.add.text(this.scene.player.x, this.scene.player.y - 30, '+1 📦', {
      fontFamily: 'monospace',
      fontSize: '16px',
      fill: '#ffcc00',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0.5).setDepth(100)
    
    this.scene.tweens.add({
      targets: plusText,
      y: plusText.y - 40,
      alpha: 0,
      duration: 1000,
      onComplete: () => plusText.destroy()
    })
    
    this.scene.sound.playHeal()
    
    if (this.serversTransferred >= this.totalServersToTransfer) {
      this.onAllServersTransferred()
    }
    
    // Проверяем, выполнены ли все задания (уничтожение + перенос)
    this.scene.checkAllTasksComplete()
  }

  onAllServersTransferred() {
    // Проверяем один раз
    if (this.allTransferredMessageShown) return
    this.allTransferredMessageShown = true
    
    // Проверяем, уничтожены ли все серверы на улице
    const allDestroyed = this.scene.graveyardSystem.collectedItems >= this.scene.graveyardSystem.totalItems
    const message = allDestroyed 
      ? '✅ ВСЕ СЕРВЕРЫ ПЕРЕНЕСЕНЫ!\nОфис открыт! Беги скорее!' 
      : '✅ ВСЕ СЕРВЕРЫ ПЕРЕНЕСЕНЫ!\nТеперь уничтожь серверы на улице!'
    
    const completeText = this.scene.add.text(400, 250, message, {
      fontFamily: 'monospace',
      fontSize: '18px',
      fill: '#00ff00',
      stroke: '#000000',
      strokeThickness: 4,
      align: 'center'
    }).setOrigin(0.5).setScrollFactor(0).setDepth(1000)
    
    this.scene.tweens.add({
      targets: completeText,
      scale: 1.1,
      duration: 500,
      yoyo: true,
      repeat: 2,
      onComplete: () => {
        this.scene.tweens.add({
          targets: completeText,
          alpha: 0,
          duration: 1000,
          onComplete: () => completeText.destroy()
        })
      }
    })
    
    this.deliveryZone.setVisible(false)
    this.deliveryZoneText.setVisible(false)
  }

  update() {
    if (this.carriedServerSprite && this.carryingServer) {
      this.carriedServerSprite.x = this.scene.player.x + 15
      this.carriedServerSprite.y = this.scene.player.y - 5
    }
    
    if (this.carryingServer && this.yandexDC) {
      const distToYandex = Phaser.Math.Distance.Between(
        this.scene.player.x, this.scene.player.y,
        this.yandexDC.x, this.yandexDC.y
      )
      if (distToYandex < 60) {
        this.deliverServer()
      }
    }
  }
}

