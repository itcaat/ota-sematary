export class ZombieSprites {
  constructor(scene) {
    this.scene = scene
  }

  generate() {
    this.generateZombieSprite()
    this.generateZubkovSprite()
    this.generateZombieGirlSprite()
    this.generateCrutchSprite()
  }

  generateZombieSprite() {
    const directions = ['down', 'up', 'left', 'right']
    
    directions.forEach(dir => {
      const canvas = document.createElement('canvas')
      canvas.width = 32
      canvas.height = 32
      const ctx = canvas.getContext('2d')
      ctx.imageSmoothingEnabled = false
      
      this.drawTopDownZombie(ctx, dir)
      this.scene.textures.addCanvas(`zombie_${dir}`, canvas)
    })
    
    const defaultCanvas = document.createElement('canvas')
    defaultCanvas.width = 32
    defaultCanvas.height = 32
    const defaultCtx = defaultCanvas.getContext('2d')
    defaultCtx.imageSmoothingEnabled = false
    this.drawTopDownZombie(defaultCtx, 'down')
    this.scene.textures.addCanvas('zombie', defaultCanvas)
  }

  drawTopDownZombie(ctx, direction) {
    // Тень
    ctx.fillStyle = 'rgba(0,0,0,0.3)'
    ctx.beginPath()
    ctx.ellipse(16, 28, 10, 4, 0, 0, Math.PI * 2)
    ctx.fill()
    
    // Тело (рваная одежда)
    ctx.fillStyle = '#4a6741'
    ctx.fillRect(8, 10, 16, 14)
    
    // Рваные края одежды
    ctx.fillStyle = '#3d5636'
    ctx.fillRect(8, 22, 3, 3)
    ctx.fillRect(21, 20, 3, 4)
    ctx.fillRect(12, 23, 2, 2)
    
    // Голова (зелёная кожа)
    ctx.fillStyle = '#7cb342'
    
    if (direction === 'down') {
      ctx.fillRect(10, 2, 12, 10)
      ctx.fillStyle = '#33691e'
      ctx.fillRect(11, 1, 3, 3)
      ctx.fillRect(18, 2, 2, 2)
      ctx.fillStyle = '#ff0000'
      ctx.fillRect(12, 5, 3, 3)
      ctx.fillRect(17, 5, 3, 3)
      ctx.fillStyle = '#000'
      ctx.fillRect(13, 6, 1, 1)
      ctx.fillRect(18, 6, 1, 1)
      ctx.fillStyle = '#1b5e20'
      ctx.fillRect(13, 9, 6, 2)
    } else if (direction === 'up') {
      ctx.fillRect(10, 2, 12, 10)
      ctx.fillStyle = '#33691e'
      ctx.fillRect(10, 1, 12, 4)
    } else if (direction === 'left') {
      ctx.fillRect(8, 2, 12, 10)
      ctx.fillStyle = '#33691e'
      ctx.fillRect(8, 1, 10, 3)
      ctx.fillStyle = '#ff0000'
      ctx.fillRect(10, 5, 3, 3)
    } else if (direction === 'right') {
      ctx.fillRect(12, 2, 12, 10)
      ctx.fillStyle = '#33691e'
      ctx.fillRect(14, 1, 10, 3)
      ctx.fillStyle = '#ff0000'
      ctx.fillRect(19, 5, 3, 3)
    }
    
    // Руки (вытянуты вперёд для зомби)
    ctx.fillStyle = '#7cb342'
    if (direction === 'down') {
      ctx.fillRect(5, 12, 4, 10)
      ctx.fillRect(23, 12, 4, 10)
    } else if (direction === 'up') {
      ctx.fillRect(6, 8, 4, 8)
      ctx.fillRect(22, 8, 4, 8)
    } else if (direction === 'left') {
      ctx.fillRect(2, 10, 8, 4)
    } else if (direction === 'right') {
      ctx.fillRect(22, 10, 8, 4)
    }
    
    // Ноги
    ctx.fillStyle = '#5d4037'
    if (direction === 'down' || direction === 'up') {
      ctx.fillRect(9, 24, 5, 6)
      ctx.fillRect(18, 24, 5, 6)
    } else {
      ctx.fillRect(12, 24, 8, 6)
    }
  }

  generateZubkovSprite() {
    const directions = ['down', 'up', 'left', 'right']
    
    directions.forEach(dir => {
      const canvas = document.createElement('canvas')
      canvas.width = 48
      canvas.height = 48
      const ctx = canvas.getContext('2d')
      ctx.imageSmoothingEnabled = false
      
      this.drawZubkov(ctx, dir)
      this.scene.textures.addCanvas(`zubkov_${dir}`, canvas)
    })
    
    const defaultCanvas = document.createElement('canvas')
    defaultCanvas.width = 48
    defaultCanvas.height = 48
    const defaultCtx = defaultCanvas.getContext('2d')
    defaultCtx.imageSmoothingEnabled = false
    this.drawZubkov(defaultCtx, 'down')
    this.scene.textures.addCanvas('zubkov', defaultCanvas)
  }

  drawZubkov(ctx, direction) {
    // Тень (больше чем у обычного зомби)
    ctx.fillStyle = 'rgba(0,0,0,0.4)'
    ctx.beginPath()
    ctx.ellipse(24, 44, 14, 5, 0, 0, Math.PI * 2)
    ctx.fill()
    
    // Тело (больше, в костюме)
    ctx.fillStyle = '#1a237e'
    ctx.fillRect(12, 16, 24, 22)
    
    // Белая рубашка
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(18, 18, 12, 8)
    
    // Галстук
    ctx.fillStyle = '#c62828'
    ctx.fillRect(22, 18, 4, 12)
    
    // Надпись ZUBKOV на пиджаке
    ctx.fillStyle = '#ffd700'
    ctx.font = 'bold 6px monospace'
    ctx.fillText('ZUBKOV', 13, 36)
    
    // Голова (зелёная кожа зомби, но больше)
    ctx.fillStyle = '#558b2f'
    
    if (direction === 'down') {
      ctx.fillRect(14, 2, 20, 16)
      ctx.fillStyle = '#33691e'
      ctx.fillRect(16, 1, 6, 3)
      ctx.fillRect(26, 2, 4, 2)
      ctx.fillStyle = '#ff0000'
      ctx.fillRect(17, 7, 5, 4)
      ctx.fillRect(26, 7, 5, 4)
      ctx.fillStyle = '#000'
      ctx.fillRect(19, 8, 2, 2)
      ctx.fillRect(28, 8, 2, 2)
      ctx.fillStyle = '#1b5e20'
      ctx.fillRect(19, 14, 10, 3)
      ctx.fillStyle = '#ffeb3b'
      ctx.fillRect(20, 14, 2, 2)
      ctx.fillRect(24, 14, 2, 2)
      ctx.fillRect(27, 14, 2, 2)
    } else if (direction === 'up') {
      ctx.fillRect(14, 2, 20, 16)
      ctx.fillStyle = '#33691e'
      ctx.fillRect(14, 1, 20, 6)
    } else if (direction === 'left') {
      ctx.fillRect(10, 2, 18, 16)
      ctx.fillStyle = '#33691e'
      ctx.fillRect(10, 1, 14, 4)
      ctx.fillStyle = '#ff0000'
      ctx.fillRect(14, 7, 5, 4)
    } else if (direction === 'right') {
      ctx.fillRect(20, 2, 18, 16)
      ctx.fillStyle = '#33691e'
      ctx.fillRect(24, 1, 14, 4)
      ctx.fillStyle = '#ff0000'
      ctx.fillRect(29, 7, 5, 4)
    }
    
    // Руки (вытянуты как у зомби)
    ctx.fillStyle = '#558b2f'
    if (direction === 'down') {
      ctx.fillRect(6, 18, 6, 16)
      ctx.fillRect(36, 18, 6, 16)
    } else if (direction === 'up') {
      ctx.fillRect(8, 14, 6, 12)
      ctx.fillRect(34, 14, 6, 12)
    } else if (direction === 'left') {
      ctx.fillRect(2, 16, 12, 6)
    } else if (direction === 'right') {
      ctx.fillRect(34, 16, 12, 6)
    }
    
    // Ноги (брюки)
    ctx.fillStyle = '#263238'
    if (direction === 'down' || direction === 'up') {
      ctx.fillRect(14, 38, 8, 8)
      ctx.fillRect(26, 38, 8, 8)
    } else {
      ctx.fillRect(18, 38, 12, 8)
    }
    
    // Ботинки
    ctx.fillStyle = '#000000'
    ctx.fillRect(14, 44, 8, 3)
    ctx.fillRect(26, 44, 8, 3)
  }

  generateZombieGirlSprite() {
    const directions = ['down', 'up', 'left', 'right']
    
    directions.forEach(dir => {
      const canvas = document.createElement('canvas')
      canvas.width = 32
      canvas.height = 40
      const ctx = canvas.getContext('2d')
      ctx.imageSmoothingEnabled = false
      
      this.drawZombieGirl(ctx, dir)
      this.scene.textures.addCanvas(`zombie_girl_${dir}`, canvas)
    })
    
    const defaultCanvas = document.createElement('canvas')
    defaultCanvas.width = 32
    defaultCanvas.height = 40
    const defaultCtx = defaultCanvas.getContext('2d')
    defaultCtx.imageSmoothingEnabled = false
    this.drawZombieGirl(defaultCtx, 'down')
    this.scene.textures.addCanvas('zombie_girl', defaultCanvas)
  }

  drawZombieGirl(ctx, direction) {
    // Тень (маленькая, худая)
    ctx.fillStyle = 'rgba(0,0,0,0.3)'
    ctx.beginPath()
    ctx.ellipse(16, 38, 6, 3, 0, 0, Math.PI * 2)
    ctx.fill()
    
    // Худое тело в офисном платье
    ctx.fillStyle = '#4a148c'
    ctx.fillRect(12, 14, 8, 18)
    
    // Тонкие руки
    ctx.fillStyle = '#7cb342'
    ctx.fillRect(8, 16, 4, 10)
    ctx.fillRect(20, 16, 4, 10)
    
    // Худые ноги
    ctx.fillStyle = '#7cb342'
    ctx.fillRect(12, 32, 3, 6)
    ctx.fillRect(17, 32, 3, 6)
    
    // Туфли
    ctx.fillStyle = '#d32f2f'
    ctx.fillRect(11, 36, 4, 3)
    ctx.fillRect(17, 36, 4, 3)
    
    // Голова
    ctx.fillStyle = '#7cb342'
    
    if (direction === 'down') {
      ctx.fillRect(10, 2, 12, 13)
      ctx.fillStyle = '#5d4037'
      ctx.fillRect(8, 0, 16, 5)
      ctx.fillRect(6, 3, 4, 14)
      ctx.fillRect(22, 3, 4, 14)
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(11, 6, 4, 4)
      ctx.fillRect(17, 6, 4, 4)
      ctx.fillStyle = '#000000'
      ctx.fillRect(12, 7, 2, 2)
      ctx.fillRect(18, 7, 2, 2)
      ctx.fillStyle = '#33691e'
      ctx.fillRect(13, 12, 6, 2)
    } else if (direction === 'up') {
      ctx.fillRect(10, 2, 12, 13)
      ctx.fillStyle = '#5d4037'
      ctx.fillRect(8, 0, 16, 8)
      ctx.fillRect(6, 3, 4, 14)
      ctx.fillRect(22, 3, 4, 14)
    } else if (direction === 'left') {
      ctx.fillRect(8, 2, 12, 13)
      ctx.fillStyle = '#5d4037'
      ctx.fillRect(6, 0, 12, 5)
      ctx.fillRect(4, 3, 4, 14)
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(10, 6, 3, 3)
      ctx.fillStyle = '#000000'
      ctx.fillRect(10, 7, 2, 2)
    } else {
      ctx.fillRect(12, 2, 12, 13)
      ctx.fillStyle = '#5d4037'
      ctx.fillRect(14, 0, 12, 5)
      ctx.fillRect(24, 3, 4, 14)
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(19, 6, 3, 3)
      ctx.fillStyle = '#000000'
      ctx.fillRect(20, 7, 2, 2)
    }
    
    // Бейджик (имя)
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(12, 15, 8, 4)
    ctx.fillStyle = '#000000'
    ctx.font = '3px monospace'
    ctx.fillText('Нарине', 11, 18)
  }

  generateCrutchSprite() {
    const canvas = document.createElement('canvas')
    canvas.width = 24
    canvas.height = 24
    const ctx = canvas.getContext('2d')
    ctx.imageSmoothingEnabled = false
    
    // Костыль (вид сверху, летящий)
    ctx.fillStyle = '#8b4513'
    ctx.save()
    ctx.translate(12, 12)
    ctx.rotate(Math.PI / 4)
    ctx.fillRect(-10, -2, 20, 4)
    ctx.restore()
    
    // Поперечина
    ctx.fillStyle = '#a0522d'
    ctx.save()
    ctx.translate(12, 12)
    ctx.rotate(Math.PI / 4)
    ctx.fillRect(-8, -5, 6, 3)
    ctx.restore()
    
    // Резиновый наконечник
    ctx.fillStyle = '#333333'
    ctx.beginPath()
    ctx.arc(18, 18, 3, 0, Math.PI * 2)
    ctx.fill()
    
    // Блик
    ctx.fillStyle = '#cd853f'
    ctx.save()
    ctx.translate(12, 12)
    ctx.rotate(Math.PI / 4)
    ctx.fillRect(-8, -1, 8, 2)
    ctx.restore()
    
    this.scene.textures.addCanvas('crutch', canvas)
  }
}

