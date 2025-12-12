export class NPCSprites {
  constructor(scene) {
    this.scene = scene
  }

  generate() {
    this.generateFriendlyNPCSprite()
    this.generatePrincessSprite()
  }

  generateFriendlyNPCSprite() {
    const colors = [
      { shirt: '#2196f3', name: 'karpov' },
      { shirt: '#9c27b0', name: 'rukavkov' },
      { shirt: '#ff9800', name: 'mazalov' },
      { shirt: '#4caf50', name: 'sergeev' },
      { shirt: '#e91e63', name: 'sindov' },
      { shirt: '#8b4513', name: 'kozlov' },
      { shirt: '#ff1744', name: 'pogozhiy' },
    ]
    
    colors.forEach(config => {
      const canvas = document.createElement('canvas')
      canvas.width = 32
      canvas.height = 32
      const ctx = canvas.getContext('2d')
      ctx.imageSmoothingEnabled = false
      
      // Тень
      ctx.fillStyle = 'rgba(0,0,0,0.3)'
      ctx.beginPath()
      ctx.ellipse(16, 28, 8, 3, 0, 0, Math.PI * 2)
      ctx.fill()
      
      // Тело (футболка)
      ctx.fillStyle = config.shirt
      ctx.fillRect(10, 12, 12, 12)
      
      // Контур
      ctx.strokeStyle = '#000'
      ctx.lineWidth = 1
      ctx.strokeRect(10, 12, 12, 12)
      
      // Голова
      ctx.fillStyle = '#ffcc99'
      ctx.fillRect(11, 4, 10, 9)
      
      // Волосы
      ctx.fillStyle = '#5d4037'
      ctx.fillRect(11, 3, 10, 3)
      
      // Глаза (добрые)
      ctx.fillStyle = '#000'
      ctx.fillRect(13, 7, 2, 2)
      ctx.fillRect(17, 7, 2, 2)
      
      // Улыбка
      ctx.fillStyle = '#e57373'
      ctx.fillRect(14, 10, 4, 1)
      
      // Руки
      ctx.fillStyle = '#ffcc99'
      ctx.fillRect(7, 13, 3, 8)
      ctx.fillRect(22, 13, 3, 8)
      
      // Ноги
      ctx.fillStyle = '#37474f'
      ctx.fillRect(11, 24, 4, 5)
      ctx.fillRect(17, 24, 4, 5)
      
      this.scene.textures.addCanvas(`npc_${config.name}`, canvas)
    })
  }

  generatePrincessSprite() {
    const directions = ['down', 'up', 'left', 'right']
    
    directions.forEach(dir => {
      const canvas = document.createElement('canvas')
      canvas.width = 32
      canvas.height = 32
      const ctx = canvas.getContext('2d')
      ctx.imageSmoothingEnabled = false
      
      this.drawTopDownPrincess(ctx, dir)
      this.scene.textures.addCanvas(`princess_${dir}`, canvas)
    })
    
    const defaultCanvas = document.createElement('canvas')
    defaultCanvas.width = 32
    defaultCanvas.height = 32
    const defaultCtx = defaultCanvas.getContext('2d')
    defaultCtx.imageSmoothingEnabled = false
    this.drawTopDownPrincess(defaultCtx, 'down')
    this.scene.textures.addCanvas('princess', defaultCanvas)
  }

  drawTopDownPrincess(ctx, direction) {
    // Тень
    ctx.fillStyle = 'rgba(0,0,0,0.3)'
    ctx.beginPath()
    ctx.ellipse(16, 28, 10, 4, 0, 0, Math.PI * 2)
    ctx.fill()
    
    // Платье (вид сверху - круглое)
    ctx.fillStyle = '#e91e63'
    ctx.beginPath()
    ctx.ellipse(16, 20, 12, 10, 0, 0, Math.PI * 2)
    ctx.fill()
    
    // Детали платья
    ctx.fillStyle = '#c2185b'
    ctx.beginPath()
    ctx.ellipse(16, 20, 8, 6, 0, 0, Math.PI * 2)
    ctx.fill()
    
    // Голова
    ctx.fillStyle = '#ffcc99'
    ctx.beginPath()
    ctx.arc(16, 8, 6, 0, Math.PI * 2)
    ctx.fill()
    
    // Волосы
    ctx.fillStyle = '#ffd54f'
    if (direction === 'down') {
      ctx.beginPath()
      ctx.arc(16, 7, 6, Math.PI, 0)
      ctx.fill()
      ctx.fillRect(10, 7, 3, 8)
      ctx.fillRect(19, 7, 3, 8)
      // Глаза
      ctx.fillStyle = '#000'
      ctx.fillRect(13, 8, 2, 2)
      ctx.fillRect(17, 8, 2, 2)
    } else if (direction === 'up') {
      ctx.beginPath()
      ctx.arc(16, 8, 6, 0, Math.PI * 2)
      ctx.fill()
    } else {
      ctx.beginPath()
      ctx.arc(16, 7, 6, Math.PI, 0)
      ctx.fill()
      if (direction === 'left') {
        ctx.fillRect(10, 7, 3, 8)
      } else {
        ctx.fillRect(19, 7, 3, 8)
      }
    }
    
    // Корона
    ctx.fillStyle = '#ffc107'
    ctx.fillRect(12, 1, 8, 3)
    ctx.fillRect(13, 0, 2, 2)
    ctx.fillRect(17, 0, 2, 2)
    
    // Камень на короне
    ctx.fillStyle = '#e91e63'
    ctx.fillRect(15, 1, 2, 2)
  }
}

