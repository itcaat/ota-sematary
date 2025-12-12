export class PlayerSprites {
  constructor(scene) {
    this.scene = scene
  }

  generate() {
    const directions = ['down', 'up', 'left', 'right']
    
    directions.forEach(dir => {
      const canvas = document.createElement('canvas')
      canvas.width = 32
      canvas.height = 32
      const ctx = canvas.getContext('2d')
      ctx.imageSmoothingEnabled = false
      
      this.drawTopDownPlayer(ctx, dir)
      this.scene.textures.addCanvas(`player_${dir}`, canvas)
    })
    
    // Дефолтный спрайт
    const defaultCanvas = document.createElement('canvas')
    defaultCanvas.width = 32
    defaultCanvas.height = 32
    const defaultCtx = defaultCanvas.getContext('2d')
    defaultCtx.imageSmoothingEnabled = false
    this.drawTopDownPlayer(defaultCtx, 'down')
    this.scene.textures.addCanvas('player', defaultCanvas)
  }

  drawTopDownPlayer(ctx, direction) {
    // Тень
    ctx.fillStyle = 'rgba(0,0,0,0.3)'
    ctx.beginPath()
    ctx.ellipse(16, 28, 10, 4, 0, 0, Math.PI * 2)
    ctx.fill()
    
    // Тело (футболка сверху)
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(8, 10, 16, 14)
    
    // Контур футболки
    ctx.strokeStyle = '#cccccc'
    ctx.lineWidth = 1
    ctx.strokeRect(8, 10, 16, 14)
    
    // Надпись OTAOPS
    ctx.fillStyle = '#00ff00'
    ctx.font = 'bold 5px monospace'
    ctx.fillText('OTAOPS', 7, 20)
    
    // Голова
    ctx.fillStyle = '#ffcc99'
    
    if (direction === 'down') {
      ctx.fillRect(10, 2, 12, 10)
      // Волосы
      ctx.fillStyle = '#4a3728'
      ctx.fillRect(10, 1, 12, 4)
      // Глаза
      ctx.fillStyle = '#000'
      ctx.fillRect(12, 6, 2, 2)
      ctx.fillRect(18, 6, 2, 2)
    } else if (direction === 'up') {
      ctx.fillRect(10, 2, 12, 10)
      // Волосы (вид сзади)
      ctx.fillStyle = '#4a3728'
      ctx.fillRect(10, 1, 12, 6)
    } else if (direction === 'left') {
      ctx.fillRect(8, 2, 12, 10)
      ctx.fillStyle = '#4a3728'
      ctx.fillRect(8, 1, 12, 4)
      ctx.fillStyle = '#000'
      ctx.fillRect(10, 6, 2, 2)
    } else if (direction === 'right') {
      ctx.fillRect(12, 2, 12, 10)
      ctx.fillStyle = '#4a3728'
      ctx.fillRect(12, 1, 12, 4)
      ctx.fillStyle = '#000'
      ctx.fillRect(20, 6, 2, 2)
    }
    
    // Ноги (вид сверху - ботинки)
    ctx.fillStyle = '#3b5998'
    if (direction === 'down' || direction === 'up') {
      ctx.fillRect(9, 24, 5, 6)
      ctx.fillRect(18, 24, 5, 6)
    } else {
      ctx.fillRect(12, 24, 8, 6)
    }
    
    // Обувь
    ctx.fillStyle = '#2d2d2d'
    if (direction === 'down') {
      ctx.fillRect(9, 28, 5, 3)
      ctx.fillRect(18, 28, 5, 3)
    }
  }
}

