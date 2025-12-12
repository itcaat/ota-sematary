import Phaser from 'phaser'
import SoundManager from '../SoundManager'
import { PlayerEntity } from '../entities/Player'
import { ZombieManager } from '../entities/Zombie'
import { ZubkovEntity } from '../entities/Zubkov'
import { ZombieGirlEntity } from '../entities/ZombieGirl'
import { FriendlyNPCManager } from '../entities/FriendlyNPC'
import { MapSystem } from '../systems/MapSystem'
import { BuildingSystem } from '../systems/BuildingSystem'
import { ServerTransferSystem } from '../systems/ServerTransferSystem'
import { GraveyardSystem } from '../systems/GraveyardSystem'
import { BeerSystem } from '../systems/BeerSystem'
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
    this.gameComplete = false
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
    this.princessSystem = new PrincessSystem(this)
    
    // Создаём энтити
    this.playerEntity = new PlayerEntity(this)
    this.zombieManager = new ZombieManager(this)
    this.zubkovEntity = new ZubkovEntity(this)
    this.zombieGirlEntity = new ZombieGirlEntity(this)
    this.npcManager = new FriendlyNPCManager(this)
    
    // Создаём мир
    this.mapSystem.create()
    this.buildingSystem.create()
    this.serverTransferSystem.create(this.buildingSystem.buildings)
    this.graveyardSystem.create()
    this.beerSystem.create()
    this.princessSystem.create()
    
    // Создаём игрока
    this.player = this.playerEntity.create(200, 600)
    
    // Создаём врагов и NPC
    this.zombieManager.create()
    this.zubkovEntity.create(800, 600)
    this.zombieGirlEntity.create(600, 400)
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
      callback: () => this.zombieManager.throwCrutch(),
      loop: true
    })
    
    this.time.addEvent({
      delay: 3000,
      callback: () => this.playRandomZombieSound(),
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
  }

  setupCamera() {
    this.cameras.main.setBounds(0, 0, 1600, 1200)
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1)
    this.cameras.main.setZoom(1)
  }

  playRandomZombieSound() {
    if (this.gameComplete) return
    
    let closestDist = Infinity
    
    this.zombieManager.zombies.children.each(zombie => {
      const dist = Phaser.Math.Distance.Between(zombie.x, zombie.y, this.player.x, this.player.y)
      if (dist < closestDist && dist < 400) {
        closestDist = dist
      }
    })
    
    if (this.zubkovEntity.sprite && this.zubkovEntity.sprite.active) {
      const zubkovDist = Phaser.Math.Distance.Between(
        this.zubkovEntity.sprite.x, this.zubkovEntity.sprite.y, 
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
    
    // Обновляем врагов
    this.zombieManager.update()
    this.zubkovEntity.update()
    this.zombieGirlEntity.update()
    
    // Обновляем NPC
    this.npcManager.update()
    
    // Обновляем системы
    this.serverTransferSystem.update()
    this.buildingSystem.update()
    
    // Проверяем укрытие
    this.buildingSystem.checkOverlap(this.player)
    this.isHiding = this.buildingSystem.isHiding
  }
}

