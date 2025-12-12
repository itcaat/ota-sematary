export class GraveyardSystem {
  constructor(scene) {
    this.scene = scene
    this.servers = null
    this.graves = null
    this.collectedItems = 0
    this.totalItems = 16
    this.allDestroyedMessageShown = false
    
    this.epitaphs = [
      "Покойся с миром 🙏",
      "Ты был лучшим сервером",
      "Навеки в логах",
      "F in chat",
      "Ушёл, но не забыт",
      "До свидания, дружок",
      "Вечный uptime на небесах",
      "Больше нет 500 ошибок",
      "Теперь он в облаке ☁️",
      "Спи спокойно, сервер"
    ]
  }

  create() {
    this.servers = this.scene.physics.add.group()
    this.graves = this.scene.physics.add.group()
    
    const serviceNames = [
      "zabbix", "telegraf", "openvpn", "gmail",
      "grafana", "vagrant", "named", "l2-vpn",
      "firezone", "gitlab", "kafka", "airflow",
      "prometheus", "mobile app", "parser", "redash"
    ]
    
    const positions = [
      { x: 300, y: 200 }, { x: 450, y: 200 },
      { x: 300, y: 400 }, { x: 450, y: 400 },
      { x: 700, y: 200 }, { x: 850, y: 200 },
      { x: 700, y: 450 }, { x: 850, y: 450 },
      { x: 700, y: 700 }, { x: 850, y: 700 },
      { x: 1100, y: 250 }, { x: 1250, y: 250 },
      { x: 1100, y: 500 }, { x: 1250, y: 500 },
      { x: 1100, y: 750 }, { x: 1250, y: 750 },
    ]

    positions.forEach((pos, index) => {
      const server = this.servers.create(pos.x, pos.y, 'server')
      server.setOrigin(0.5, 0.5)
      server.body.setImmovable(true)
      server.body.setSize(24, 32)
      server.setDepth(5)
      server.serviceName = serviceNames[index]
      
      const text = this.scene.add.text(pos.x, pos.y - 30, serviceNames[index], {
        fontFamily: 'monospace',
        fontSize: '10px',
        fill: '#4caf50',
        backgroundColor: 'rgba(0,0,0,0.7)',
        padding: { x: 4, y: 2 }
      }).setOrigin(0.5).setDepth(6)
      
      server.label = text
      
      this.scene.tweens.add({
        targets: server,
        alpha: 0.9,
        duration: 500 + Math.random() * 500,
        yoyo: true,
        repeat: -1
      })
    })
  }

  killServer(player, server) {
    if (this.scene.gameComplete) return
    
    const x = server.x
    const y = server.y
    const serviceName = server.serviceName
    
    if (server.label) {
      server.label.destroy()
    }
    
    server.destroy()
    
    const mound = this.scene.add.image(x, y + 12, 'mound')
    mound.setOrigin(0.5, 0.5)
    mound.setDepth(3)
    
    const isCross = Math.random() > 0.5
    const grave = this.scene.add.image(x, y, isCross ? 'cross' : 'tombstone')
    grave.setOrigin(0.5, 0.5)
    grave.setDepth(5)
    
    const epitaph = this.epitaphs[Phaser.Math.Between(0, this.epitaphs.length - 1)]
    const graveText = this.scene.add.text(x, y - 35, `${serviceName}\n${epitaph}`, {
      fontFamily: 'monospace',
      fontSize: '8px',
      fill: '#ffffff',
      backgroundColor: 'rgba(0,0,0,0.8)',
      padding: { x: 4, y: 2 },
      align: 'center'
    }).setOrigin(0.5).setDepth(6)
    
    this.createDeathEffect(x, y)
    this.scene.sound.playServerDeath()
    
    this.collectedItems++
    this.scene.onItemCollected(this.collectedItems)
    
    // Если все серверы уничтожены
    if (this.collectedItems >= this.totalItems) {
      this.onAllServersDestroyed()
    }
    
    // Проверяем, выполнены ли все задания (уничтожение + перенос)
    this.scene.checkAllTasksComplete()
  }

  onAllServersDestroyed() {
    // Проверяем один раз
    if (this.allDestroyedMessageShown) return
    this.allDestroyedMessageShown = true
    
    // Проверяем, перенесены ли все серверы
    const allTransferred = this.scene.serverTransferSystem.serversTransferred >= this.scene.serverTransferSystem.totalServersToTransfer
    const message = allTransferred 
      ? '✅ ВСЕ СЕРВЕРЫ УНИЧТОЖЕНЫ!\nОфис открыт! Беги скорее!' 
      : '✅ ВСЕ СЕРВЕРЫ УНИЧТОЖЕНЫ!\nТеперь перенеси серверы из Selectel в Yandex!'
    
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
  }

  createDeathEffect(x, y) {
    this.scene.add.particles(x, y, 'particle', {
      speed: { min: 50, max: 150 },
      angle: { min: 0, max: 360 },
      scale: { start: 1, end: 0 },
      alpha: { start: 1, end: 0 },
      lifespan: 600,
      quantity: 20,
      tint: [0xff5722, 0xffeb3b, 0x607d8b, 0x000000]
    }).explode()
    
    const errorText = this.scene.add.text(x, y - 20, '❌ SHUTDOWN', {
      fontSize: '12px',
      fontFamily: 'monospace',
      fill: '#ff0000',
      stroke: '#000',
      strokeThickness: 2
    }).setOrigin(0.5).setDepth(200)
    
    this.scene.tweens.add({
      targets: errorText,
      y: errorText.y - 40,
      alpha: 0,
      duration: 1000,
      onComplete: () => errorText.destroy()
    })
    
    this.scene.cameras.main.shake(150, 0.008)
  }
}

