export class MapSystem {
  constructor(scene) {
    this.scene = scene
    this.walls = null
  }

  create() {
    const mapWidth = 1600
    const mapHeight = 1200
    
    // Создаём тайловую карту из травы
    for (let x = 0; x < mapWidth; x += 32) {
      for (let y = 0; y < mapHeight; y += 32) {
        this.scene.add.image(x, y, 'grass').setOrigin(0, 0)
      }
    }
    
    // Дорожки
    const paths = [
      { x: 100, y: 0, w: 3, h: 38 },
      { x: 100, y: 600, w: 50, h: 3 },
      { x: 750, y: 300, w: 3, h: 20 },
      { x: 1300, y: 0, w: 3, h: 38 },
    ]
    
    paths.forEach(p => {
      for (let i = 0; i < p.w; i++) {
        for (let j = 0; j < p.h; j++) {
          this.scene.add.image(p.x + i * 32, p.y + j * 32, 'path').setOrigin(0, 0)
        }
      }
    })
    
    // Забор по периметру
    this.walls = this.scene.physics.add.staticGroup()
    
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
    this.scene.physics.world.setBounds(32, 32, mapWidth - 64, mapHeight - 64)
  }

  createAmbientEffects() {
    this.scene.add.particles(0, 0, 'spark', {
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
    
    const fogGraphics = this.scene.add.graphics()
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
}

