import Phaser from 'phaser'
import { SpriteGenerator } from '../sprites/SpriteGenerator'

export default class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene')
  }

  preload() {
    this.createLoadingBar()
    this.generateAssets()
    
    // Загружаем звук пива
    this.load.audio('beer_sound', 'assets/sounds/simpsony-barni.mp3')
  }

  createLoadingBar() {
    const width = this.cameras.main.width
    const height = this.cameras.main.height
    
    this.add.rectangle(width / 2, height / 2, width, height, 0x1a1a2e)
    
    this.loadingText = this.add.text(width / 2, height / 2 - 50, 'Загрузка...', {
      fontFamily: 'monospace',
      fontSize: '24px',
      fill: '#ffffff'
    }).setOrigin(0.5)
    
    const progressBox = this.add.graphics()
    const progressBar = this.add.graphics()
    
    progressBox.fillStyle(0x222222, 0.8)
    progressBox.fillRoundedRect(width / 2 - 160, height / 2, 320, 30, 10)
    
    this.load.on('progress', (value) => {
      progressBar.clear()
      progressBar.fillStyle(0x00ff88, 1)
      progressBar.fillRoundedRect(width / 2 - 155, height / 2 + 5, 310 * value, 20, 8)
    })
  }

  generateAssets() {
    const spriteGenerator = new SpriteGenerator(this)
    spriteGenerator.generateAll()
  }

  create() {
    this.scene.start('MainScene')
  }
}

