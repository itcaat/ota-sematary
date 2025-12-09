import Phaser from 'phaser'
import SoundManager from '../SoundManager'

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
    this.officeUnlocked = false
  }

  create() {
    // Инициализация звуков
    this.sound = new SoundManager()
    this.sound.init()
    
    // Активация звука и музыки при первом клике
    this.input.once('pointerdown', () => {
      this.sound.resume()
      this.sound.startMusic()
    })
    
    // Также при нажатии любой клавиши
    this.input.keyboard.once('keydown', () => {
      this.sound.resume()
      this.sound.startMusic()
    })
    
    // Состояние укрытия
    this.isHiding = false
    this.currentBuilding = null
    
    this.createMap()
    this.createBuildings()
    this.createPlayer()
    this.createZombies()
    this.createFriendlyNPCs()
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

  createBuildings() {
    this.buildings = []
    
    const buildingConfigs = [
      { type: 'selectel', x: 200, y: 190, name: 'Датацентр Selectel', width: 200, height: 180 },
      { type: 'yandex', x: 1400, y: 190, name: 'Датацентр Yandex', width: 200, height: 180 },
      { type: 'office', x: 800, y: 1000, name: 'SALO OFFICE', width: 220, height: 200 },
    ]
    
    buildingConfigs.forEach(config => {
      const building = this.add.sprite(config.x, config.y, `building_${config.type}`)
      building.setOrigin(0.5, 0.5)
      building.setDepth(4)
      
      // Физические стены здания (непроходимые границы)
      const wallThickness = 15
      const hw = config.width / 2
      const hh = config.height / 2
      
      // Создаём 4 стены как физические объекты
      building.walls = []
      
      // Верхняя стена
      const topWall = this.add.rectangle(config.x, config.y - hh + wallThickness/2, config.width, wallThickness, 0x000000, 0)
      this.physics.add.existing(topWall, true)
      building.walls.push(topWall)
      
      // Левая стена
      const leftWall = this.add.rectangle(config.x - hw + wallThickness/2, config.y, wallThickness, config.height, 0x000000, 0)
      this.physics.add.existing(leftWall, true)
      building.walls.push(leftWall)
      
      // Правая стена
      const rightWall = this.add.rectangle(config.x + hw - wallThickness/2, config.y, wallThickness, config.height, 0x000000, 0)
      this.physics.add.existing(rightWall, true)
      building.walls.push(rightWall)
      
      // Нижняя стена (с проёмом для двери)
      const doorWidth = 40
      const bottomLeftWall = this.add.rectangle(
        config.x - hw/2 - doorWidth/4, 
        config.y + hh - wallThickness/2, 
        hw - doorWidth/2, 
        wallThickness, 
        0x000000, 0
      )
      this.physics.add.existing(bottomLeftWall, true)
      building.walls.push(bottomLeftWall)
      
      const bottomRightWall = this.add.rectangle(
        config.x + hw/2 + doorWidth/4, 
        config.y + hh - wallThickness/2, 
        hw - doorWidth/2, 
        wallThickness, 
        0x000000, 0
      )
      this.physics.add.existing(bottomRightWall, true)
      building.walls.push(bottomRightWall)
      
      // Зона входа (у двери здания)
      const zone = this.add.zone(config.x, config.y + hh, 60, 30)
      this.physics.world.enable(zone)
      zone.body.setAllowGravity(false)
      zone.body.setImmovable(true)
      
      // Текст-подсказка
      const hint = this.add.text(config.x, config.y - hh - 25, `🏢 ${config.name}\n↓ ВХОД`, {
        fontFamily: 'monospace',
        fontSize: '12px',
        fill: '#00ff00',
        stroke: '#000000',
        strokeThickness: 3,
        align: 'center',
        shadow: { offsetX: 2, offsetY: 2, color: '#000', blur: 0, fill: true }
      }).setOrigin(0.5).setDepth(100).setAlpha(0)
      
      building.zone = zone
      building.hint = hint
      building.buildingName = config.name
      building.buildingType = config.type
      building.buildingWidth = config.width
      building.buildingHeight = config.height
      
      this.buildings.push(building)
    })
    
    // Индикатор укрытия
    this.hidingText = this.add.text(400, 550, '', {
      fontFamily: 'monospace',
      fontSize: '16px',
      fill: '#00ff00',
      stroke: '#000000',
      strokeThickness: 3,
      shadow: { offsetX: 2, offsetY: 2, color: '#000', blur: 0, fill: true }
    }).setOrigin(0.5).setScrollFactor(0).setDepth(1000).setAlpha(0)
    
    // Находим офис и блокируем его
    this.officeBuilding = this.buildings.find(b => b.buildingType === 'office')
    if (this.officeBuilding) {
      // Создаём блокирующую дверь
      this.officeDoor = this.add.rectangle(
        this.officeBuilding.x, 
        this.officeBuilding.y + this.officeBuilding.buildingHeight/2 - 7,
        50, 14, 0x8b0000
      )
      this.officeDoor.setDepth(5)
      this.physics.add.existing(this.officeDoor, true)
      
      // Текст "ЗАКРЫТО"
      this.officeDoorText = this.add.text(
        this.officeBuilding.x,
        this.officeBuilding.y + this.officeBuilding.buildingHeight/2 - 7,
        '🔒 ЗАКРЫТО',
        {
          fontFamily: 'monospace',
          fontSize: '10px',
          fill: '#ffffff',
          stroke: '#000000',
          strokeThickness: 2
        }
      ).setOrigin(0.5).setDepth(6)
      
      // Коллизия с закрытой дверью добавляется в createPlayer после создания игрока
    }
    
    // Аптечки в датацентрах
    this.medkits = this.physics.add.group()
    
    const datacenters = this.buildings.filter(b => b.buildingType === 'selectel' || b.buildingType === 'yandex')
    datacenters.forEach(dc => {
      // Размещаем аптечку внутри датацентра
      const medkit = this.medkits.create(dc.x + 60, dc.y + 40, 'medkit')
      medkit.setDepth(5)
      medkit.body.setAllowGravity(false)
      
      // Эффект свечения
      this.tweens.add({
        targets: medkit,
        alpha: 0.6,
        duration: 500,
        yoyo: true,
        repeat: -1
      })
    })
    
    // Коллизия игрока с аптечками
    this.physics.add.overlap(this.player, this.medkits, this.collectMedkit, null, this)
  }
  
  collectMedkit(player, medkit) {
    // Эффект подбора
    this.tweens.add({
      targets: medkit,
      scale: 1.5,
      alpha: 0,
      duration: 200,
      onComplete: () => medkit.destroy()
    })
    
    // Восстанавливаем здоровье
    const healAmount = 50
    this.playerHealth = Math.min(100, this.playerHealth + healAmount)
    this.healthText.setText(`❤️ ${this.playerHealth}`)
    
    // Обновляем цвет здоровья
    if (this.playerHealth > 60) {
      this.healthText.setFill('#00ff00')
    } else if (this.playerHealth > 30) {
      this.healthText.setFill('#ffff00')
    }
    
    // Визуальный эффект исцеления
    this.player.setTint(0x00ff00)
    this.time.delayedCall(300, () => {
      this.player.clearTint()
    })
    
    // Эффект частиц
    for (let i = 0; i < 10; i++) {
      const particle = this.add.circle(
        medkit.x + Phaser.Math.Between(-20, 20),
        medkit.y + Phaser.Math.Between(-20, 20),
        4, 0x00ff00
      )
      particle.setDepth(100)
      this.tweens.add({
        targets: particle,
        y: particle.y - 30,
        alpha: 0,
        duration: 500,
        onComplete: () => particle.destroy()
      })
    }
    
    // Звук исцеления
    this.sound.playHeal()
    
    // Текст +HP
    const healText = this.add.text(player.x, player.y - 30, `+${healAmount} HP`, {
      fontFamily: 'monospace',
      fontSize: '14px',
      fill: '#00ff00',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0.5).setDepth(100)
    
    this.tweens.add({
      targets: healText,
      y: healText.y - 30,
      alpha: 0,
      duration: 1000,
      onComplete: () => healText.destroy()
    })
  }
  
  unlockOffice() {
    if (!this.officeBuilding || !this.officeDoor) return
    
    // Удаляем дверь
    this.officeDoor.destroy()
    this.officeDoorText.destroy()
    
    // Удаляем коллизию
    if (this.officeDoorCollider) {
      this.officeDoorCollider.destroy()
    }
    
    // Эффект открытия
    this.cameras.main.flash(500, 0, 255, 0)
    
    // Уведомление
    const unlockText = this.add.text(400, 300, '🔓 ОФИС ОТКРЫТ!\n👸 Принцесса ждёт тебя!', {
      fontFamily: 'monospace',
      fontSize: '20px',
      fill: '#00ff00',
      stroke: '#000000',
      strokeThickness: 4,
      align: 'center'
    }).setOrigin(0.5).setScrollFactor(0).setDepth(1000)
    
    this.tweens.add({
      targets: unlockText,
      scale: 1.2,
      alpha: 0,
      duration: 3000,
      onComplete: () => unlockText.destroy()
    })
    
    // Показываем принцессу в офисе
    this.showPrincess()
  }

  createPlayer() {
    this.player = this.physics.add.sprite(200, 600, 'player')
    this.player.setCollideWorldBounds(true)
    this.player.setSize(20, 20)
    this.player.setOffset(6, 10)
    this.player.setDepth(10)
    
    // Коллизия со стенами
    this.physics.add.collider(this.player, this.walls)
    
    // Коллизия со стенами зданий
    this.buildings.forEach(building => {
      building.walls.forEach(wall => {
        this.physics.add.collider(this.player, wall)
      })
    })
    
    // Коллизия с закрытой дверью офиса
    if (this.officeDoor) {
      this.officeDoorCollider = this.physics.add.collider(this.player, this.officeDoor)
    }
    
    // Текст OTAOPS над игроком
    this.saloText = this.add.text(0, 0, 'OTAOPS', {
      fontFamily: 'monospace',
      fontSize: '8px',
      fill: '#00ff00',
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
    
    // Коллизия зомби со стенами зданий
    this.buildings.forEach(building => {
      building.walls.forEach(wall => {
        this.physics.add.collider(this.zombies, wall)
      })
    })
    
    // Коллизия зомби с игроком
    this.physics.add.overlap(this.player, this.zombies, this.zombieHitPlayer, null, this)
    
    // Периодические звуки зомби
    this.time.addEvent({
      delay: 3000,
      callback: this.playRandomZombieSound,
      callbackScope: this,
      loop: true
    })
    
    // Создаём босса Zubkov
    this.createZubkov()
  }

  playRandomZombieSound() {
    if (this.gameComplete) return
    
    // Находим ближайшего зомби к игроку
    let closestZombie = null
    let closestDist = Infinity
    
    this.zombies.children.each(zombie => {
      const dist = Phaser.Math.Distance.Between(
        zombie.x, zombie.y, this.player.x, this.player.y
      )
      if (dist < closestDist && dist < 400) {
        closestDist = dist
        closestZombie = zombie
      }
    })
    
    // Также проверяем Zubkov
    if (this.zubkov && this.zubkov.active) {
      const zubkovDist = Phaser.Math.Distance.Between(
        this.zubkov.x, this.zubkov.y, this.player.x, this.player.y
      )
      if (zubkovDist < closestDist && zubkovDist < 400) {
        closestDist = zubkovDist
        closestZombie = this.zubkov
      }
    }
    
    if (closestZombie) {
      const data = closestZombie.zombieData
      if (data && data.state === 'chase') {
        this.sound.playZombieGrowl()
      } else {
        this.sound.playZombieMoan()
      }
    }
  }

  createZubkov() {
    this.zubkov = this.physics.add.sprite(800, 600, 'zubkov')
    this.zubkov.setOrigin(0.5, 0.5)
    this.zubkov.setSize(30, 30)
    this.zubkov.setOffset(9, 14)
    this.zubkov.setDepth(10)
    this.zubkov.setCollideWorldBounds(true)
    this.zubkov.setScale(1.2)
    
    // Данные Zubkov - он сильнее и быстрее
    this.zubkov.zombieData = {
      state: 'patrol',
      direction: 'down',
      patrolX: [600, 1000],
      patrolY: null,
      patrolDirection: 1,
      speed: 80,
      chaseSpeed: 160,  // Быстрее обычных зомби
      detectionRange: 200,  // Видит дальше
      loseRange: 350,
      homeX: 800,
      homeY: 600
    }
    
    // Текст над Zubkov
    this.zubkovText = this.add.text(this.zubkov.x, this.zubkov.y - 35, 'ZUBKOV', {
      fontFamily: 'monospace',
      fontSize: '10px',
      fill: '#ffd700',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0.5).setDepth(100)
    
    // Коллизии
    this.physics.add.collider(this.zubkov, this.walls)
    
    // Коллизия Zubkov со стенами зданий
    this.buildings.forEach(building => {
      building.walls.forEach(wall => {
        this.physics.add.collider(this.zubkov, wall)
      })
    })
    
    this.physics.add.overlap(this.player, this.zubkov, this.zubkovHitPlayer, null, this)
  }

  zubkovHitPlayer(player, zubkov) {
    if (this.isInvulnerable || this.gameComplete) return
    
    // Zubkov наносит 2 урона!
    this.playerHealth -= 2
    this.updateHealthUI()
    
    // Сильное отбрасывание
    const angle = Phaser.Math.Angle.Between(zubkov.x, zubkov.y, player.x, player.y)
    player.setVelocity(
      Math.cos(angle) * 400,
      Math.sin(angle) * 400
    )
    
    // Неуязвимость
    this.isInvulnerable = true
    
    // Мигание
    this.tweens.add({
      targets: player,
      alpha: 0.3,
      duration: 100,
      yoyo: true,
      repeat: 7,
      onComplete: () => {
        player.alpha = 1
        this.isInvulnerable = false
      }
    })
    
    // Сильная тряска
    this.cameras.main.shake(300, 0.02)
    
    // Звук
    this.sound.playZubkov()
    
    // Zubkov говорит
    const shout = this.add.text(zubkov.x, zubkov.y - 50, '💀 УВОЛЕН!', {
      fontSize: '16px',
      fontFamily: 'monospace',
      fill: '#ff0000',
      stroke: '#000',
      strokeThickness: 2
    }).setOrigin(0.5).setDepth(200)
    
    this.tweens.add({
      targets: shout,
      y: shout.y - 30,
      alpha: 0,
      duration: 1500,
      onComplete: () => shout.destroy()
    })
    
    if (this.playerHealth <= 0) {
      this.gameOver()
    }
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
    
    // Звук урона
    this.sound.playHurt()
    
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
    
    // Останавливаем музыку
    this.sound.stopMusic()
    
    // Звук Game Over
    this.sound.playGameOver()
    
    const gameOverText = this.add.text(400, 250, '💼 ТЫ УВОЛЕН 💼', {
      fontFamily: 'monospace',
      fontSize: '48px',
      fill: '#ff0000',
      stroke: '#000000',
      strokeThickness: 6
    }).setOrigin(0.5).setScrollFactor(0).setDepth(1000)
    
    const restartText = this.add.text(400, 320, 'Нажмите R чтобы попробовать снова', {
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
      // Если игрок прячется - зомби его не видит
      if (data.state === 'patrol') {
        if (distToPlayer < data.detectionRange && !this.isHiding) {
          data.state = 'chase'
          // Звук обнаружения (визуальный эффект)
          this.showAlertIcon(zombie)
        }
      } else if (data.state === 'chase') {
        // Если игрок спрятался или далеко - теряем его
        if (distToPlayer > data.loseRange || this.isHiding) {
          data.state = 'return'
        }
      } else if (data.state === 'return') {
        const distToHome = Phaser.Math.Distance.Between(
          zombie.x, zombie.y, data.homeX, data.homeY
        )
        if (distToHome < 10) {
          data.state = 'patrol'
        }
      if (distToPlayer < data.detectionRange && !this.isHiding) {
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

  createFriendlyNPCs() {
    // Саркастические "подбадривающие" фразы
    this.sarcasticPhrases = [
      "Отлично справляешься! 👍\n(нет)",
      "Ты точно DevOps? 🤔",
      "Может тебе в PM?",
      "Сервера сами\nне упадут!",
      "Красавчик! 💪\n(сарказм)",
      "Так держать!\n...подальше от прода",
      "Верю в тебя!\n(на самом деле нет)",
      "Ещё чуть-чуть!\n...до увольнения",
      "Молодец! 🎉\n(это ирония)",
      "Ты лучший! 🏆\n...в ломании серверов",
      "Супер! Осталось\nвсего 100500 тасков",
      "Не сдавайся!\n(хотя стоило бы)",
      "Классно!\nZubkov доволен\n(нет)",
      "Ты справишься!\n...когда-нибудь",
      "Вот это скилл! 😎\n(шутка)",
      "Профессионал! 💼\n(по версии мамы)",
      "Так и надо!\n(на самом деле нет)",
      "Огонь! 🔥\n(как и сервера)",
      "Легенда! 🌟\n(в своих мечтах)",
      "Бог DevOps! ⚡\n(богохульство)",
    ]
    
    // Конфигурация NPC
    const npcs = [
      { name: 'karpov', x: 200, y: 300 },
      { name: 'rukavkov', x: 550, y: 550 },
      { name: 'mazalov', x: 950, y: 350 },
      { name: 'sergeev', x: 1300, y: 600 },
      { name: 'sindov', x: 750, y: 900 },
    ]
    
    this.friendlyNPCs = []
    
    npcs.forEach(config => {
      const npc = this.add.sprite(config.x, config.y, `npc_${config.name}`)
      npc.setOrigin(0.5, 0.5)
      npc.setDepth(10)
      
      // Имя над NPC
      const nameText = this.add.text(config.x, config.y - 25, config.name, {
        fontFamily: 'monospace',
        fontSize: '10px',
        fill: '#ffffff',
        stroke: '#000000',
        strokeThickness: 2
      }).setOrigin(0.5).setDepth(100)
      
      // Текст фразы (изначально пустой)
      const phraseText = this.add.text(config.x, config.y - 45, '', {
        fontFamily: 'monospace',
        fontSize: '9px',
        fill: '#ffeb3b',
        stroke: '#000000',
        strokeThickness: 2,
        align: 'center',
        wordWrap: { width: 120 }
      }).setOrigin(0.5).setDepth(100)
      
      npc.nameText = nameText
      npc.phraseText = phraseText
      npc.npcName = config.name
      
      // Анимация покачивания
      this.tweens.add({
        targets: npc,
        y: npc.y - 3,
        duration: 1000 + Math.random() * 500,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      })
      
      this.friendlyNPCs.push(npc)
      
      // Запускаем фразы для каждого NPC отдельно с разным интервалом
      this.time.addEvent({
        delay: 1000 + Math.random() * 2000, // Начальная задержка
        callback: () => this.startNPCPhrases(npc),
        callbackScope: this
      })
    })
  }

  startNPCPhrases(npc) {
    // Показать первую фразу
    this.showNPCPhrase(npc)
    
    // Повторять каждые 5-7 секунд
    this.time.addEvent({
      delay: 5000 + Math.random() * 2000,
      callback: () => this.showNPCPhrase(npc),
      callbackScope: this,
      loop: true
    })
  }

  showNPCPhrase(npc) {
    if (this.gameComplete) return
    
    // Выбираем случайную фразу
    const phrase = Phaser.Utils.Array.GetRandom(this.sarcasticPhrases)
    
    // Показываем фразу
    npc.phraseText.setText(phrase)
    npc.phraseText.setAlpha(1)
    npc.phraseText.y = npc.y - 55
    
    // Появление
    this.tweens.add({
      targets: npc.phraseText,
      alpha: 1,
      y: npc.y - 60,
      duration: 300,
      ease: 'Power2'
    })
    
    // Исчезновение через 5 секунд
    this.time.delayedCall(4500, () => {
      this.tweens.add({
        targets: npc.phraseText,
        alpha: 0,
        y: npc.phraseText.y - 15,
        duration: 500,
        ease: 'Power2'
      })
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
    
    // Звук
    this.sound.playBeer()
    
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

  updateZubkov() {
    if (!this.zubkov || !this.zubkov.active) return
    
    const data = this.zubkov.zombieData
    const distToPlayer = Phaser.Math.Distance.Between(
      this.zubkov.x, this.zubkov.y, this.player.x, this.player.y
    )
    
    // Определяем состояние
    // Zubkov тоже не видит спрятавшегося игрока
    if (data.state === 'patrol') {
      if (distToPlayer < data.detectionRange && !this.isHiding) {
        data.state = 'chase'
        this.showZubkovAlert()
      }
    } else if (data.state === 'chase') {
      if (distToPlayer > data.loseRange || this.isHiding) {
        data.state = 'return'
      }
    } else if (data.state === 'return') {
      const distToHome = Phaser.Math.Distance.Between(
        this.zubkov.x, this.zubkov.y, data.homeX, data.homeY
      )
      if (distToHome < 10) {
        data.state = 'patrol'
      }
      if (distToPlayer < data.detectionRange && !this.isHiding) {
        data.state = 'chase'
        this.showZubkovAlert()
      }
    }
    
    let velocityX = 0
    let velocityY = 0
    
    if (data.state === 'patrol') {
      if (data.patrolX) {
        velocityX = data.patrolDirection * data.speed
        if (this.zubkov.x <= data.patrolX[0]) data.patrolDirection = 1
        if (this.zubkov.x >= data.patrolX[1]) data.patrolDirection = -1
      }
    } else if (data.state === 'chase') {
      const angle = Phaser.Math.Angle.Between(
        this.zubkov.x, this.zubkov.y, this.player.x, this.player.y
      )
      velocityX = Math.cos(angle) * data.chaseSpeed
      velocityY = Math.sin(angle) * data.chaseSpeed
    } else if (data.state === 'return') {
      const angle = Phaser.Math.Angle.Between(
        this.zubkov.x, this.zubkov.y, data.homeX, data.homeY
      )
      velocityX = Math.cos(angle) * data.speed
      velocityY = Math.sin(angle) * data.speed
    }
    
    this.zubkov.setVelocity(velocityX, velocityY)
    
    // Обновляем направление
    if (Math.abs(velocityX) > Math.abs(velocityY)) {
      data.direction = velocityX > 0 ? 'right' : 'left'
    } else if (velocityY !== 0) {
      data.direction = velocityY > 0 ? 'down' : 'up'
    }
    
    this.zubkov.setTexture(`zubkov_${data.direction}`)
    
    // Красный оттенок когда агрится
    if (data.state === 'chase') {
      this.zubkov.setTint(0xff4444)
    } else {
      this.zubkov.clearTint()
    }
    
    // Обновляем позицию текста
    this.zubkovText.x = this.zubkov.x
    this.zubkovText.y = this.zubkov.y - 35
  }

  showZubkovAlert() {
    this.sound.playAlert()
    
    const alert = this.add.text(this.zubkov.x, this.zubkov.y - 50, '🔥 ТЫ УВОЛЕН!', {
      fontSize: '14px',
      fontFamily: 'monospace',
      fill: '#ff0000',
      stroke: '#000',
      strokeThickness: 2
    }).setOrigin(0.5).setDepth(200)
    
    this.tweens.add({
      targets: alert,
      y: alert.y - 30,
      alpha: 0,
      scale: 1.5,
      duration: 1500,
      onComplete: () => alert.destroy()
    })
  }

  showAlertIcon(zombie) {
    this.sound.playAlert()
    
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
    this.servers = this.physics.add.group()
    this.graves = this.physics.add.group()
    
    // Названия сервисов
    const serviceNames = [
      "zabbix", "telegraf", "openvpn", "gmail",
      "grafana", "vagrant", "named", "l2-vpn",
      "firezone", "gitlab", "kafka", "airflow",
      "prometheus", "mobile app", "parser", "redash"
    ]
    
    // Эпитафии для могил
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
    
    // Расположение серверов по всей карте (16 штук)
    const positions = [
      // Левая часть
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
      const server = this.servers.create(pos.x, pos.y, 'server')
      server.setOrigin(0.5, 0.5)
      server.body.setImmovable(true)
      server.body.setSize(24, 32)
      server.setDepth(5)
      
      // Сохраняем название сервиса
      server.serviceName = serviceNames[index]
      
      // Текст над сервером
      const text = this.add.text(pos.x, pos.y - 30, serviceNames[index], {
        fontFamily: 'monospace',
        fontSize: '10px',
        fill: '#4caf50',
        backgroundColor: 'rgba(0,0,0,0.7)',
        padding: { x: 4, y: 2 }
      }).setOrigin(0.5).setDepth(6)
      
      server.label = text
      
      // Мигание LED
      this.tweens.add({
        targets: server,
        alpha: 0.9,
        duration: 500 + Math.random() * 500,
        yoyo: true,
        repeat: -1
      })
    })
    
    // Коллизия с серверами
    this.physics.add.overlap(this.player, this.servers, this.killServer, null, this)
  }

  killServer(player, server) {
    if (this.gameComplete) return
    
    const x = server.x
    const y = server.y
    const serviceName = server.serviceName
    
    // Удаляем текст сервера
    if (server.label) {
      server.label.destroy()
    }
    
    // Удаляем сервер
    server.destroy()
    
    // Создаём могилку на месте сервера
    const mound = this.add.image(x, y + 12, 'mound')
    mound.setOrigin(0.5, 0.5)
    mound.setDepth(3)
    
    const isCross = Math.random() > 0.5
    const grave = this.add.image(x, y, isCross ? 'cross' : 'tombstone')
    grave.setOrigin(0.5, 0.5)
    grave.setDepth(5)
    
    // Рандомная эпитафия
    const epitaph = this.epitaphs[Phaser.Math.Between(0, this.epitaphs.length - 1)]
    
    // Текст с названием сервиса и эпитафией
    const graveText = this.add.text(x, y - 35, `${serviceName}\n${epitaph}`, {
      fontFamily: 'monospace',
      fontSize: '8px',
      fill: '#ffffff',
      backgroundColor: 'rgba(0,0,0,0.8)',
      padding: { x: 4, y: 2 },
      align: 'center'
    }).setOrigin(0.5).setDepth(6)
    
    // Эффект превращения
    this.createServerDeathEffect(x, y)
    
    // Звук
    this.sound.playServerDeath()
    
    // Обновляем счетчик
    this.collectedItems++
    this.counterText.setText(`💀 ${this.collectedItems} / ${this.totalItems}`)
    this.onItemCollected(this.collectedItems)
    
    // Эффект на UI
    this.tweens.add({
      targets: this.counterText,
      scale: 1.3,
      duration: 100,
      yoyo: true
    })
    
    // Проверяем завершение - открываем офис когда все серверы уничтожены
    if (this.collectedItems >= this.totalItems && !this.officeUnlocked) {
      this.officeUnlocked = true
      this.unlockOffice()
    }
  }

  createServerDeathEffect(x, y) {
    // Искры и дым
    this.add.particles(x, y, 'particle', {
      speed: { min: 50, max: 150 },
      angle: { min: 0, max: 360 },
      scale: { start: 1, end: 0 },
      alpha: { start: 1, end: 0 },
      lifespan: 600,
      quantity: 20,
      tint: [0xff5722, 0xffeb3b, 0x607d8b, 0x000000]
    }).explode()
    
    // Текст ошибки
    const errorText = this.add.text(x, y - 20, '❌ SHUTDOWN', {
      fontSize: '12px',
      fontFamily: 'monospace',
      fill: '#ff0000',
      stroke: '#000',
      strokeThickness: 2
    }).setOrigin(0.5).setDepth(200)
    
    this.tweens.add({
      targets: errorText,
      y: errorText.y - 40,
      alpha: 0,
      duration: 1000,
      onComplete: () => errorText.destroy()
    })
    
    this.cameras.main.shake(150, 0.008)
  }

  createPrincess() {
    // Принцесса внутри офиса (офис x:800, y:1000)
    this.princess = this.physics.add.sprite(800, 980, 'princess')
    this.princess.setOrigin(0.5, 0.5)
    this.princess.body.setImmovable(true)
    this.princess.setVisible(false)
    this.princess.setDepth(10)
    
    // Свечение вокруг принцессы
    this.princessGlow = this.add.circle(800, 980, 50, 0xff69b4, 0.3)
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

  checkBuildingOverlap() {
    // Автоматическая проверка - игрок внутри здания или нет
    let insideBuilding = null
    
    for (const building of this.buildings) {
      const hw = building.buildingWidth / 2 - 15 // минус толщина стен
      const hh = building.buildingHeight / 2 - 15
      
      if (this.player.x > building.x - hw && 
          this.player.x < building.x + hw &&
          this.player.y > building.y - hh && 
          this.player.y < building.y + hh) {
        insideBuilding = building
        break
      }
    }
    
    // Вошёл в здание
    if (insideBuilding && !this.isHiding) {
      this.isHiding = true
      this.currentBuilding = insideBuilding
      
      // Здание становится полупрозрачным
      insideBuilding.setAlpha(0.5)
      
      // Показываем индикатор
      this.hidingText.setText(`🏢 В УКРЫТИИ: ${insideBuilding.buildingName}`)
      this.hidingText.setAlpha(1)
      
      // Звук входа
      this.sound.playServerDeath()
    }
    // Вышел из здания
    else if (!insideBuilding && this.isHiding) {
      if (this.currentBuilding) {
        this.currentBuilding.setAlpha(1)
      }
      
      this.isHiding = false
      this.currentBuilding = null
      
      // Скрываем индикатор
      this.hidingText.setAlpha(0)
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
    // Останавливаем фоновую музыку
    this.sound.stopMusic()
    
    // Звук победы
    this.sound.playVictory()
    
    const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff, 0xff8800, 0xff0088]
    
    for (let i = 0; i < 20; i++) {
      this.time.delayedCall(i * 300, () => {
        const x = this.player.x + Phaser.Math.Between(-200, 200)
        const y = this.player.y + Phaser.Math.Between(-200, 200)
        const color = colors[Phaser.Math.Between(0, colors.length - 1)]
        
        this.createFirework(x, y, color)
        this.sound.playFirework()
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
    
    // Обновляем Zubkov
    this.updateZubkov()
    
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
    
    // Обновляем позицию текста OTAOPS
    this.saloText.x = this.player.x
    this.saloText.y = this.player.y - 20
    
    // Обновляем позиции текстов NPC
    this.friendlyNPCs.forEach(npc => {
      npc.nameText.x = npc.x
      npc.nameText.y = npc.y - 25
    })
    
    // Проверяем, внутри ли игрок здания
    this.checkBuildingOverlap()
    
    // Показываем подсказки зданий рядом с игроком (у входа)
    this.buildings.forEach(building => {
      const doorY = building.y + building.buildingHeight/2
      const dist = Phaser.Math.Distance.Between(
        this.player.x, this.player.y,
        building.x, doorY
      )
      
      if (dist < 100 && !this.isHiding) {
        building.hint.setAlpha(1)
        // Мигающий эффект подсказки
        building.hint.setScale(1 + Math.sin(this.time.now / 200) * 0.05)
      } else {
        building.hint.setAlpha(0)
      }
    })
  }
}
