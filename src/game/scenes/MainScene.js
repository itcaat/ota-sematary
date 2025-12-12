import Phaser from 'phaser'
import SoundManager from '../SoundManager'
import { PlayerEntity } from '../entities/Player'
import { NPCManager } from '../entities/NPCManager'
import { MapSystem } from '../systems/MapSystem'
import { BuildingSystem } from '../systems/BuildingSystem'
import { ServerTransferSystem } from '../systems/ServerTransferSystem'
import { GraveyardSystem } from '../systems/GraveyardSystem'
import { BeerSystem } from '../systems/BeerSystem'
import { EnterosgelSystem } from '../systems/EnterosgelSystem'
import { MineSystem } from '../systems/MineSystem'
import { PrincessSystem } from '../systems/PrincessSystem'
import { CollisionSystem } from '../systems/CollisionSystem'

export default class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene')
    this.gameComplete = false
  }

  init(data) {
    this.onItemCollected = data.onItemCollected || (() => {})
    this.onGameComplete = data.onGameComplete || (() => {})
    this.onServerTransferred = data.onServerTransferred || (() => {})
    this.onDrunkChange = data.onDrunkChange || (() => {})
    this.onHealthChange = data.onHealthChange || (() => {})
    this.onTimeUpdate = data.onTimeUpdate || (() => {})
    this.onMineCountChange = data.onMineCountChange || (() => {})
    this.gameComplete = false
    this.gameTime = 0
  }

  create() {
    // Инициализация звуков
    this.sound = new SoundManager()
    this.sound.init()
    
    this.input.once('pointerdown', () => {
      this.sound.resume()
      this.sound.startMusic()
    })
    
    this.input.keyboard.once('keydown', () => {
      this.sound.resume()
      this.sound.startMusic()
    })
    
    // Создаём системы
    this.mapSystem = new MapSystem(this)
    this.buildingSystem = new BuildingSystem(this)
    this.serverTransferSystem = new ServerTransferSystem(this)
    this.graveyardSystem = new GraveyardSystem(this)
    this.beerSystem = new BeerSystem(this)
    this.enterosgelSystem = new EnterosgelSystem(this)
    this.mineSystem = new MineSystem(this)
    this.princessSystem = new PrincessSystem(this)
    
    // Создаём энтити
    this.playerEntity = new PlayerEntity(this)
    this.npcManager = new NPCManager(this)
    
    // Создаём мир
    this.mapSystem.create()
    this.buildingSystem.create()
    this.serverTransferSystem.create(this.buildingSystem.buildings)
    this.graveyardSystem.create()
    this.beerSystem.create()
    this.enterosgelSystem.create()
    this.mineSystem.create()
    this.princessSystem.create()
    
    // Создаём игрока
    this.player = this.playerEntity.create(200, 600)
    this.playerEntity.onMineCountChange = this.onMineCountChange
    this.playerEntity.updateMineCountUI()
    
    // Создаём врагов и NPC
    this.npcManager.create()
    
    // Настройка коллизий
    this.collisionSystem = new CollisionSystem(this)
    this.collisionSystem.setupCollisions()
    
    // Настройка управления и камеры
    this.setupControls()
    this.setupCamera()
    
    // Эффекты
    this.mapSystem.createAmbientEffects()
    
    // Периодические события
    this.time.addEvent({
      delay: 2500,
      callback: () => this.npcManager.throwCrutch(),
      loop: true
    })
    
    this.time.addEvent({
      delay: 3000,
      callback: () => this.playRandomZombieSound(),
      loop: true
    })
    
    // Таймер игры (обновляется каждую секунду)
    this.time.addEvent({
      delay: 1000,
      callback: () => {
        if (!this.gameComplete) {
          this.gameTime++
          this.onTimeUpdate(this.gameTime)
        }
      },
      loop: true
    })
  }

  setupControls() {
    this.cursors = this.input.keyboard.createCursorKeys()
    this.wasd = {
      up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
    }
    
    // Пробел для установки мины
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
    this.spaceKey.on('down', () => {
      if (!this.gameComplete) {
        this.mineSystem.placeMine(this.player.x, this.player.y)
      }
    })
  }

  setupCamera() {
    this.cameras.main.setBounds(0, 0, 1600, 1200)
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1)
    this.cameras.main.setZoom(1)
  }

  playRandomZombieSound() {
    if (this.gameComplete) return
    
    let closestDist = Infinity
    
    // Проверяем всех зомби
    this.npcManager.zombies.forEach(zombie => {
      if (zombie.sprite && zombie.sprite.active) {
        const dist = Phaser.Math.Distance.Between(
          zombie.sprite.x, zombie.sprite.y, 
          this.player.x, this.player.y
        )
        if (dist < closestDist && dist < 400) {
          closestDist = dist
        }
      }
    })
    
    // Проверяем Zubkov
    const zubkovSprite = this.npcManager.getZubkovSprite()
    if (zubkovSprite && zubkovSprite.active) {
      const zubkovDist = Phaser.Math.Distance.Between(
        zubkovSprite.x, zubkovSprite.y, 
        this.player.x, this.player.y
      )
      if (zubkovDist < closestDist && zubkovDist < 400) {
        closestDist = zubkovDist
      }
    }
    
    if (closestDist < 400) {
      this.sound.playZombieGrowl()
    }
  }

  gameOver() {
    this.gameComplete = true
    this.player.setVelocity(0)
    this.player.setTint(0xff0000)
    
    this.sound.stopMusic()
    this.sound.playGameOver()
    this.cameras.main.stopFollow()
    
    const centerX = this.cameras.main.scrollX + this.cameras.main.width / 2
    const centerY = this.cameras.main.scrollY + this.cameras.main.height / 2
    
    const gameOverText = this.add.text(centerX, centerY - 50, '💼 ТЫ ВЫГОРЕЛ 💼', {
      fontFamily: 'monospace',
      fontSize: '48px',
      fill: '#ff0000',
      stroke: '#000000',
      strokeThickness: 6
    }).setOrigin(0.5).setDepth(10000)
    
    const restartText = this.add.text(centerX, centerY + 20, 'Нажмите R чтобы попробовать снова', {
      fontFamily: 'monospace',
      fontSize: '20px',
      fill: '#ffffff',
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5).setDepth(10000)
    
    this.input.keyboard.once('keydown-R', () => {
      this.scene.restart()
    })
  }

  update() {
    if (this.gameComplete) return
    
    // Обновляем игрока
    this.playerEntity.update()
    
    // Обновляем всех NPC (враги и дружественные)
    this.npcManager.update()
    
    // Обновляем системы
    this.serverTransferSystem.update()
    this.buildingSystem.update()
    
    // Проверяем укрытие
    this.buildingSystem.checkOverlap(this.player)
    this.isHiding = this.buildingSystem.isHiding
  }
}

