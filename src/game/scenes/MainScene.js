import Phaser from 'phaser'

export default class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene')
    this.collectedItems = 0
    this.totalItems = 16
    this.gameComplete = false
    this.textObjects = []
    this.playerDirection = 'down'
  }

  init(data) {
    this.onItemCollected = data.onItemCollected || (() => {})
    this.onGameComplete = data.onGameComplete || (() => {})
    this.collectedItems = 0
    this.gameComplete = false
  }

  create() {
    this.createMap()
    this.createPlayer()
    this.createZombies()
    this.createBeers()
    this.createGraveyardItems()
    this.createPrincess()
    this.createUI()
    this.setupControls()
    this.setupCamera()
    this.createAmbientEffects()
  }

  createMap() {
    const mapWidth = 1600
    const mapHeight = 1200
    
    // Создаём тайловую карту из травы
    for (let x = 0; x < mapWidth; x += 32) {
      for (let y = 0; y < mapHeight; y += 32) {
        this.add.image(x, y, 'grass').setOrigin(0, 0)
      }
    }
    
    // Дорожки
    const paths = [
      { x: 100, y: 0, w: 3, h: 38 },      // Вертикальная дорожка слева
      { x: 100, y: 600, w: 50, h: 3 },    // Горизонтальная дорожка
      { x: 750, y: 300, w: 3, h: 20 },    // Вертикальная дорожка в центре
      { x: 1300, y: 0, w: 3, h: 38 },     // Вертикальная дорожка справа
    ]
    
    paths.forEach(p => {
      for (let i = 0; i < p.w; i++) {
        for (let j = 0; j < p.h; j++) {
          this.add.image(p.x + i * 32, p.y + j * 32, 'path').setOrigin(0, 0)
        }
      }
    })
    
    // Забор по периметру
    this.walls = this.physics.add.staticGroup()
    
    // Верхний забор
    for (let x = 0; x < mapWidth; x += 32) {
      const fence = this.walls.create(x, 0, 'fence')
      fence.setOrigin(0, 0)
      fence.refreshBody()
    }
    
    // Нижний забор
    for (let x = 0; x < mapWidth; x += 32) {
      const fence = this.walls.create(x, mapHeight - 32, 'fence')
      fence.setOrigin(0, 0)
      fence.refreshBody()
    }
    
    // Левый забор
    for (let y = 32; y < mapHeight - 32; y += 32) {
      const fence = this.walls.create(0, y, 'fence')
      fence.setOrigin(0, 0)
      fence.setAngle(90)
      fence.refreshBody()
    }
    
    // Правый забор
    for (let y = 32; y < mapHeight - 32; y += 32) {
      const fence = this.walls.create(mapWidth - 32, y, 'fence')
      fence.setOrigin(0, 0)
      fence.setAngle(90)
      fence.refreshBody()
    }
    
    // Устанавливаем границы мира
    this.physics.world.setBounds(32, 32, mapWidth - 64, mapHeight - 64)
  }

  createPlayer() {
    this.player = this.physics.add.sprite(200, 600, 'player')
    this.player.setCollideWorldBounds(true)
    this.player.setSize(20, 20)
    this.player.setOffset(6, 10)
    this.player.setDepth(10)
    
    // Коллизия со стенами
    this.physics.add.collider(this.player, this.walls)
    
    // Текст SALO над игроком
    this.saloText = this.add.text(0, 0, 'SALO', {
      fontFamily: 'monospace',
      fontSize: '8px',
      fill: '#ff0000',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0.5).setDepth(100)
    
    // Здоровье игрока
    this.playerHealth = 3
    this.isInvulnerable = false
    
    // Состояние опьянения
    this.drunkLevel = 0
    this.drunkTimer = null
    this.drunkWobble = 0
  }

  createZombies() {
    this.zombies = this.physics.add.group()
    
    // Позиции зомби
    const zombiePositions = [
      { x: 600, y: 300, patrolX: [500, 700] },
      { x: 900, y: 500, patrolY: [400, 600] },
      { x: 400, y: 800, patrolX: [300, 500] },
      { x: 1000, y: 300, patrolY: [200, 400] },
      { x: 1200, y: 800, patrolX: [1100, 1300] },
      { x: 500, y: 1000, patrolY: [900, 1100] },
    ]
    
    zombiePositions.forEach((pos, index) => {
      const zombie = this.zombies.create(pos.x, pos.y, 'zombie')
      zombie.setOrigin(0.5, 0.5)
      zombie.setSize(20, 20)
      zombie.setOffset(6, 10)
      zombie.setDepth(10)
      zombie.setCollideWorldBounds(true)
      
      // Данные зомби
      zombie.zombieData = {
        state: 'patrol',  // patrol, chase, return
        direction: 'down',
        patrolX: pos.patrolX || null,
        patrolY: pos.patrolY || null,
        patrolDirection: 1,
        speed: 60,
        chaseSpeed: 120,
        detectionRange: 150,
        loseRange: 250,
        homeX: pos.x,
        homeY: pos.y
      }
    })
    
    // Коллизия зомби со стенами
    this.physics.add.collider(this.zombies, this.walls)
    
    // Коллизия зомби с игроком
    this.physics.add.overlap(this.player, this.zombies, this.zombieHitPlayer, null, this)
  }

  zombieHitPlayer(player, zombie) {
    if (this.isInvulnerable || this.gameComplete) return
    
    this.playerHealth--
    this.updateHealthUI()
    
    // Отбрасывание игрока
    const angle = Phaser.Math.Angle.Between(zombie.x, zombie.y, player.x, player.y)
    player.setVelocity(
      Math.cos(angle) * 300,
      Math.sin(angle) * 300
    )
    
    // Неуязвимость на время
    this.isInvulnerable = true
    
    // Мигание игрока
    this.tweens.add({
      targets: player,
      alpha: 0.3,
      duration: 100,
      yoyo: true,
      repeat: 5,
      onComplete: () => {
        player.alpha = 1
        this.isInvulnerable = false
      }
    })
    
    // Эффект удара
    this.cameras.main.shake(200, 0.01)
    
    // Проверка смерти
    if (this.playerHealth <= 0) {
      this.gameOver()
    }
  }

  updateHealthUI() {
    let hearts = ''
    for (let i = 0; i < 3; i++) {
      hearts += i < this.playerHealth ? '❤️' : '🖤'
    }
    this.healthText.setText(hearts)
  }

  gameOver() {
    this.gameComplete = true
    this.player.setVelocity(0)
    this.player.setTint(0xff0000)
    
    const gameOverText = this.add.text(400, 250, '💀 GAME OVER 💀', {
      fontFamily: 'monospace',
      fontSize: '48px',
      fill: '#ff0000',
      stroke: '#000000',
      strokeThickness: 6
    }).setOrigin(0.5).setScrollFactor(0).setDepth(1000)
    
    const restartText = this.add.text(400, 320, 'Нажмите R для рестарта', {
      fontFamily: 'monospace',
      fontSize: '20px',
      fill: '#ffffff'
    }).setOrigin(0.5).setScrollFactor(0).setDepth(1000)
    
    this.input.keyboard.once('keydown-R', () => {
      this.scene.restart()
    })
  }

  updateZombies() {
    this.zombies.children.each(zombie => {
      const data = zombie.zombieData
      const distToPlayer = Phaser.Math.Distance.Between(
        zombie.x, zombie.y, this.player.x, this.player.y
      )
      
      // Определяем состояние
      if (data.state === 'patrol') {
        if (distToPlayer < data.detectionRange) {
          data.state = 'chase'
          // Звук обнаружения (визуальный эффект)
          this.showAlertIcon(zombie)
        }
      } else if (data.state === 'chase') {
        if (distToPlayer > data.loseRange) {
          data.state = 'return'
        }
      } else if (data.state === 'return') {
        const distToHome = Phaser.Math.Distance.Between(
          zombie.x, zombie.y, data.homeX, data.homeY
        )
        if (distToHome < 10) {
          data.state = 'patrol'
        }
        if (distToPlayer < data.detectionRange) {
          data.state = 'chase'
          this.showAlertIcon(zombie)
        }
      }
      
      // Движение в зависимости от состояния
      let velocityX = 0
      let velocityY = 0
      
      if (data.state === 'patrol') {
        // Патрулирование
        if (data.patrolX) {
          velocityX = data.patrolDirection * data.speed
          if (zombie.x <= data.patrolX[0]) data.patrolDirection = 1
          if (zombie.x >= data.patrolX[1]) data.patrolDirection = -1
        } else if (data.patrolY) {
          velocityY = data.patrolDirection * data.speed
          if (zombie.y <= data.patrolY[0]) data.patrolDirection = 1
          if (zombie.y >= data.patrolY[1]) data.patrolDirection = -1
        }
      } else if (data.state === 'chase') {
        // Преследование
        const angle = Phaser.Math.Angle.Between(
          zombie.x, zombie.y, this.player.x, this.player.y
        )
        velocityX = Math.cos(angle) * data.chaseSpeed
        velocityY = Math.sin(angle) * data.chaseSpeed
      } else if (data.state === 'return') {
        // Возвращение домой
        const angle = Phaser.Math.Angle.Between(
          zombie.x, zombie.y, data.homeX, data.homeY
        )
        velocityX = Math.cos(angle) * data.speed
        velocityY = Math.sin(angle) * data.speed
      }
      
      zombie.setVelocity(velocityX, velocityY)
      
      // Обновляем направление спрайта
      if (Math.abs(velocityX) > Math.abs(velocityY)) {
        data.direction = velocityX > 0 ? 'right' : 'left'
      } else if (velocityY !== 0) {
        data.direction = velocityY > 0 ? 'down' : 'up'
      }
      
      zombie.setTexture(`zombie_${data.direction}`)
      
      // Красный оттенок когда агрится
      if (data.state === 'chase') {
        zombie.setTint(0xff6666)
      } else {
        zombie.clearTint()
      }
    })
  }

  createBeers() {
    this.beers = this.physics.add.group()
    
    // Позиции пива по всей карте
    const beerPositions = [
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
    
    beerPositions.forEach(pos => {
      const beer = this.beers.create(pos.x, pos.y, 'beer')
      beer.setOrigin(0.5, 0.5)
      beer.setDepth(5)
      
      // Анимация покачивания
      this.tweens.add({
        targets: beer,
        y: beer.y - 3,
        duration: 1000 + Math.random() * 500,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      })
    })
    
    // Коллизия с пивом
    this.physics.add.overlap(this.player, this.beers, this.drinkBeer, null, this)
  }

  drinkBeer(player, beer) {
    // Удаляем бутылку
    beer.destroy()
    
    // Увеличиваем опьянение
    this.drunkLevel = Math.min(this.drunkLevel + 1, 3)
    this.updateDrunkUI()
    
    // Эффект сбора
    const drinkText = this.add.text(player.x, player.y - 30, '🍺 БУЛЬ!', {
      fontSize: '20px',
      fontFamily: 'monospace',
      fill: '#ffcc00'
    }).setOrigin(0.5).setDepth(200)
    
    this.tweens.add({
      targets: drinkText,
      y: drinkText.y - 40,
      alpha: 0,
      duration: 1000,
      onComplete: () => drinkText.destroy()
    })
    
    // Эффекты опьянения на камере
    this.applyDrunkEffects()
    
    // Сбрасываем/продлеваем таймер трезвости
    if (this.drunkTimer) {
      this.drunkTimer.remove()
    }
    
    this.drunkTimer = this.time.addEvent({
      delay: 8000, // 8 секунд опьянения
      callback: () => {
        this.drunkLevel = Math.max(0, this.drunkLevel - 1)
        this.updateDrunkUI()
        if (this.drunkLevel === 0) {
          this.removeDrunkEffects()
        }
      },
      repeat: this.drunkLevel - 1
    })
  }

  applyDrunkEffects() {
    // Просто визуальные эффекты без tween камеры
    // Зеленоватый оттенок в зависимости от уровня
    if (this.drunkLevel === 1) {
      this.cameras.main.setBackgroundColor(0x1a2a1e)
    } else if (this.drunkLevel === 2) {
      this.cameras.main.setBackgroundColor(0x1a3a1e)
    } else if (this.drunkLevel >= 3) {
      this.cameras.main.setBackgroundColor(0x1a4a1e)
    }
  }

  removeDrunkEffects() {
    this.cameras.main.setBackgroundColor(0x000000)
  }

  updateDrunkUI() {
    let beers = ''
    for (let i = 0; i < 3; i++) {
      beers += i < this.drunkLevel ? '🍺' : '⬜'
    }
    this.drunkText.setText(beers)
  }

  showAlertIcon(zombie) {
    const alert = this.add.text(zombie.x, zombie.y - 30, '❗', {
      fontSize: '24px'
    }).setOrigin(0.5).setDepth(200)
    
    this.tweens.add({
      targets: alert,
      y: alert.y - 20,
      alpha: 0,
      duration: 800,
      onComplete: () => alert.destroy()
    })
  }

  createGraveyardItems() {
    this.graves = this.physics.add.group()
    
    const graveTexts = [
      "zabbix", "telegraf", "openvpn", "gmail",
      "grafana", "vagrant", "named", "l2-vpn",
      "firezone", "gitlab", "kafka", "airflow",
      "prometheus", "mobile app", "parser", "redash"
    ]
    
    // Расположение могил по всей карте (16 штук)
    const positions = [
      // Левая часть кладбища
      { x: 300, y: 200 }, { x: 450, y: 200 },
      { x: 300, y: 400 }, { x: 450, y: 400 },
      // Центральная часть
      { x: 700, y: 200 }, { x: 850, y: 200 },
      { x: 700, y: 450 }, { x: 850, y: 450 },
      { x: 700, y: 700 }, { x: 850, y: 700 },
      // Правая часть
      { x: 1100, y: 250 }, { x: 1250, y: 250 },
      { x: 1100, y: 500 }, { x: 1250, y: 500 },
      { x: 1100, y: 750 }, { x: 1250, y: 750 },
    ]
    
    positions.forEach((pos, index) => {
      // Холмик земли под крестом/надгробием
      const mound = this.add.image(pos.x, pos.y + 12, 'mound')
      mound.setOrigin(0.5, 0.5)
      mound.setDepth(3)
      
      const isCross = index % 2 === 0
      const grave = this.graves.create(pos.x, pos.y, isCross ? 'cross' : 'tombstone')
      grave.setOrigin(0.5, 0.5)
      grave.body.setImmovable(true)
      grave.body.setSize(24, 24)
      grave.setDepth(5)
      
      // Сохраняем ссылку на холмик
      grave.mound = mound
      
      // Текст над могилой
      const text = this.add.text(pos.x, pos.y - 25, graveTexts[index], {
        fontFamily: 'monospace',
        fontSize: '10px',
        fill: '#ffffff',
        backgroundColor: 'rgba(0,0,0,0.7)',
        padding: { x: 4, y: 2 }
      }).setOrigin(0.5).setDepth(6)
      
      this.textObjects.push({ sprite: grave, text })
    })
    
    // Коллизия с могилами
    this.physics.add.overlap(this.player, this.graves, this.destroyGrave, null, this)
  }

  createPrincess() {
    // Принцесса в правом нижнем углу карты
    this.princess = this.physics.add.sprite(1400, 1000, 'princess')
    this.princess.setOrigin(0.5, 0.5)
    this.princess.body.setImmovable(true)
    this.princess.setVisible(false)
    this.princess.setDepth(10)
    
    // Свечение вокруг принцессы
    this.princessGlow = this.add.circle(1400, 1000, 50, 0xff69b4, 0.3)
    this.princessGlow.setVisible(false)
    this.princessGlow.setDepth(9)
    
    this.tweens.add({
      targets: this.princessGlow,
      scale: 1.5,
      alpha: 0.1,
      duration: 1000,
      yoyo: true,
      repeat: -1
    })
    
    // Коллизия с принцессой
    this.physics.add.overlap(this.player, this.princess, this.reachPrincess, null, this)
  }

  createUI() {
    this.uiContainer = this.add.container(0, 0).setScrollFactor(0).setDepth(1000)
    
    const counterBg = this.add.rectangle(100, 30, 180, 40, 0x000000, 0.7)
      .setStrokeStyle(2, 0xffffff)
    
    this.counterText = this.add.text(100, 30, `☠️ 0 / ${this.totalItems}`, {
      fontFamily: 'monospace',
      fontSize: '20px',
      fill: '#ffffff'
    }).setOrigin(0.5)
    
    // Здоровье
    const healthBg = this.add.rectangle(700, 30, 120, 40, 0x000000, 0.7)
      .setStrokeStyle(2, 0xffffff)
    
    this.healthText = this.add.text(700, 30, '❤️❤️❤️', {
      fontFamily: 'monospace',
      fontSize: '20px',
      fill: '#ffffff'
    }).setOrigin(0.5)
    
    // Индикатор опьянения
    const drunkBg = this.add.rectangle(400, 570, 120, 30, 0x000000, 0.7)
      .setStrokeStyle(2, 0xffcc00)
    
    this.drunkText = this.add.text(400, 570, '⬜⬜⬜', {
      fontFamily: 'monospace',
      fontSize: '18px',
      fill: '#ffffff'
    }).setOrigin(0.5)
    
    this.uiContainer.add([counterBg, this.counterText, healthBg, this.healthText, drunkBg, this.drunkText])
  }

  setupControls() {
    this.cursors = this.input.keyboard.createCursorKeys()
    
    this.wasd = {
      up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
    }
  }

  setupCamera() {
    this.cameras.main.setBounds(0, 0, 1600, 1200)
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1)
    this.cameras.main.setZoom(1)
  }

  createAmbientEffects() {
    // Летающие светлячки
    this.add.particles(0, 0, 'spark', {
      x: { min: 0, max: 1600 },
      y: { min: 0, max: 1200 },
      speed: { min: 5, max: 15 },
      angle: { min: 0, max: 360 },
      scale: { start: 0.5, end: 0 },
      alpha: { start: 0.6, end: 0 },
      lifespan: 4000,
      frequency: 300,
      tint: [0xffff00, 0x88ff88, 0xffffff]
    })
    
    // Туман
    const fogGraphics = this.add.graphics()
    fogGraphics.fillStyle(0x888888, 0.1)
    for (let i = 0; i < 20; i++) {
      fogGraphics.fillCircle(
        Phaser.Math.Between(0, 1600),
        Phaser.Math.Between(0, 1200),
        Phaser.Math.Between(50, 150)
      )
    }
    fogGraphics.setDepth(50)
    fogGraphics.setAlpha(0.3)
  }

  destroyGrave(player, grave) {
    if (this.gameComplete) return
    
    // Находим связанный текст
    const textObj = this.textObjects.find(obj => obj.sprite === grave)
    if (textObj) {
      textObj.text.destroy()
      this.textObjects = this.textObjects.filter(obj => obj.sprite !== grave)
    }
    
    // Удаляем холмик
    if (grave.mound) {
      grave.mound.destroy()
    }
    
    // Эффект разрушения
    this.createDestroyEffect(grave.x, grave.y)
    
    // Удаляем могилу
    grave.destroy()
    
    // Обновляем счетчик
    this.collectedItems++
    this.counterText.setText(`☠️ ${this.collectedItems} / ${this.totalItems}`)
    this.onItemCollected(this.collectedItems)
    
    // Эффект на UI
    this.tweens.add({
      targets: this.counterText,
      scale: 1.3,
      duration: 100,
      yoyo: true
    })
    
    // Проверяем завершение
    if (this.collectedItems >= this.totalItems) {
      this.showPrincess()
    }
  }

  createDestroyEffect(x, y) {
    const colors = [0x8b4513, 0x696969, 0xa0a0a0, 0x5d4037]
    
    this.add.particles(x, y, 'particle', {
      speed: { min: 50, max: 150 },
      angle: { min: 0, max: 360 },
      scale: { start: 1, end: 0 },
      alpha: { start: 1, end: 0 },
      lifespan: 500,
      quantity: 15,
      tint: colors
    }).explode()
    
    this.cameras.main.shake(100, 0.005)
  }

  showPrincess() {
    this.princess.setVisible(true)
    this.princessGlow.setVisible(true)
    
    // Сообщение
    const msg = this.add.text(400, 100, '👑 Принцесса ждёт тебя в правом нижнем углу!', {
      fontFamily: 'monospace',
      fontSize: '20px',
      fill: '#ffd700',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5).setScrollFactor(0).setDepth(1000)
    
    this.tweens.add({
      targets: msg,
      alpha: 0,
      y: 50,
      duration: 3000,
      delay: 3000,
      onComplete: () => msg.destroy()
    })
  }

  reachPrincess(player, princess) {
    if (this.collectedItems >= this.totalItems && !this.gameComplete) {
      this.completeGame()
    }
  }

  completeGame() {
    if (this.gameComplete) return
    this.gameComplete = true
    
    this.player.setVelocity(0)
    this.onGameComplete()
    
    // Поцелуй
    this.kissAnimation()
  }

  kissAnimation() {
    // Большое сердце
    const heart = this.add.text(
      (this.player.x + this.princess.x) / 2,
      (this.player.y + this.princess.y) / 2 - 30,
      '💋❤️',
      { fontSize: '48px' }
    ).setOrigin(0.5).setDepth(200)
    
    this.tweens.add({
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
    
    // Множество сердечек
    for (let i = 0; i < 20; i++) {
      const h = this.add.text(
        this.player.x + Phaser.Math.Between(-50, 50),
        this.player.y + Phaser.Math.Between(-50, 50),
        '❤️',
        { fontSize: `${Phaser.Math.Between(16, 32)}px` }
      ).setOrigin(0.5).setDepth(200)
      
      this.tweens.add({
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
    const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff, 0xff8800, 0xff0088]
    
    for (let i = 0; i < 20; i++) {
      this.time.delayedCall(i * 300, () => {
        const x = this.player.x + Phaser.Math.Between(-200, 200)
        const y = this.player.y + Phaser.Math.Between(-200, 200)
        const color = colors[Phaser.Math.Between(0, colors.length - 1)]
        
        this.createFirework(x, y, color)
      })
    }
    
    // Поздравление
    const congrats = this.add.text(
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
    
    this.tweens.add({
      targets: congrats,
      scale: 1.2,
      yoyo: true,
      repeat: -1,
      duration: 500
    })
    
    const subText = this.add.text(
      400,
      350,
      '💕 Вы спасли принцессу! 💕',
      {
        fontFamily: 'monospace',
        fontSize: '28px',
        fill: '#ff69b4',
        stroke: '#000000',
        strokeThickness: 3
      }
    ).setOrigin(0.5).setScrollFactor(0).setDepth(1000)
    
    this.tweens.add({
      targets: subText,
      alpha: 0.7,
      yoyo: true,
      repeat: -1,
      duration: 800
    })
  }

  createFirework(x, y, color) {
    this.add.particles(x, y, 'spark', {
      speed: { min: 100, max: 200 },
      angle: { min: 0, max: 360 },
      scale: { start: 1.5, end: 0 },
      alpha: { start: 1, end: 0 },
      lifespan: 800,
      quantity: 30,
      tint: color
    }).explode()
    
    const flash = this.add.circle(x, y, 15, 0xffffff, 1)
    this.tweens.add({
      targets: flash,
      scale: 3,
      alpha: 0,
      duration: 300,
      onComplete: () => flash.destroy()
    })
  }

  update() {
    if (this.gameComplete) return
    
    // Обновляем зомби
    this.updateZombies()
    
    const speed = 200
    let velocityX = 0
    let velocityY = 0
    
    // Горизонтальное движение
    if (this.cursors.left.isDown || this.wasd.left.isDown) {
      velocityX = -speed
      this.playerDirection = 'left'
    } else if (this.cursors.right.isDown || this.wasd.right.isDown) {
      velocityX = speed
      this.playerDirection = 'right'
    }
    
    // Вертикальное движение
    if (this.cursors.up.isDown || this.wasd.up.isDown) {
      velocityY = -speed
      this.playerDirection = 'up'
    } else if (this.cursors.down.isDown || this.wasd.down.isDown) {
      velocityY = speed
      this.playerDirection = 'down'
    }
    
    // Нормализация диагонального движения
    if (velocityX !== 0 && velocityY !== 0) {
      velocityX *= 0.707
      velocityY *= 0.707
    }
    
    // Эффект опьянения - случайное отклонение
    if (this.drunkLevel > 0 && (velocityX !== 0 || velocityY !== 0)) {
      const wobble = this.drunkLevel * 40
      velocityX += Phaser.Math.Between(-wobble, wobble)
      velocityY += Phaser.Math.Between(-wobble, wobble)
    }
    
    // Покачивание камеры при опьянении
    if (this.drunkLevel > 0) {
      this.drunkWobble += 0.1
      const wobbleAngle = Math.sin(this.drunkWobble) * this.drunkLevel * 1.5
      this.cameras.main.setAngle(wobbleAngle)
    }
    
    this.player.setVelocity(velocityX, velocityY)
    
    // Обновляем спрайт в зависимости от направления
    this.player.setTexture(`player_${this.playerDirection}`)
    
    // Обновляем позицию текста SALO
    this.saloText.x = this.player.x
    this.saloText.y = this.player.y - 20
  }
}
