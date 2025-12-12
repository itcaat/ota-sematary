export class TileSprites {
  constructor(scene) {
    this.scene = scene
  }

  generate() {
    this.generateTiles()
    this.generateParticles()
  }

  generateTiles() {
    // Трава
    const grassCanvas = document.createElement('canvas')
    grassCanvas.width = 32
    grassCanvas.height = 32
    const gCtx = grassCanvas.getContext('2d')
    gCtx.imageSmoothingEnabled = false
    
    gCtx.fillStyle = '#2d5016'
    gCtx.fillRect(0, 0, 32, 32)
    
    // Детали травы
    for (let i = 0; i < 20; i++) {
      gCtx.fillStyle = `rgba(60, 100, 30, ${0.3 + Math.random() * 0.4})`
      gCtx.fillRect(Math.random() * 30, Math.random() * 30, 2, 2)
    }
    
    // Травинки
    gCtx.fillStyle = '#3d6b1e'
    for (let i = 0; i < 8; i++) {
      const x = Math.random() * 28
      const y = Math.random() * 28
      gCtx.fillRect(x, y, 1, 3)
    }
    
    this.scene.textures.addCanvas('grass', grassCanvas)
    
    // Дорожка
    const pathCanvas = document.createElement('canvas')
    pathCanvas.width = 32
    pathCanvas.height = 32
    const pCtx = pathCanvas.getContext('2d')
    pCtx.imageSmoothingEnabled = false
    
    pCtx.fillStyle = '#5d4e37'
    pCtx.fillRect(0, 0, 32, 32)
    
    // Камешки
    for (let i = 0; i < 10; i++) {
      pCtx.fillStyle = `rgba(80, 70, 55, ${0.5 + Math.random() * 0.5})`
      pCtx.fillRect(Math.random() * 28, Math.random() * 28, 3, 3)
    }
    
    this.scene.textures.addCanvas('path', pathCanvas)
    
    // Забор
    const fenceCanvas = document.createElement('canvas')
    fenceCanvas.width = 32
    fenceCanvas.height = 32
    const fCtx = fenceCanvas.getContext('2d')
    fCtx.imageSmoothingEnabled = false
    
    fCtx.fillStyle = '#3e2723'
    fCtx.fillRect(0, 12, 32, 8)
    fCtx.fillRect(4, 8, 4, 16)
    fCtx.fillRect(14, 8, 4, 16)
    fCtx.fillRect(24, 8, 4, 16)
    
    // Светлые грани
    fCtx.fillStyle = '#5d4037'
    fCtx.fillRect(0, 12, 32, 2)
    fCtx.fillRect(4, 8, 4, 2)
    fCtx.fillRect(14, 8, 4, 2)
    fCtx.fillRect(24, 8, 4, 2)
    
    this.scene.textures.addCanvas('fence', fenceCanvas)
  }

  generateParticles() {
    const particleCanvas = document.createElement('canvas')
    particleCanvas.width = 8
    particleCanvas.height = 8
    const pCtx = particleCanvas.getContext('2d')
    
    pCtx.fillStyle = '#ffffff'
    pCtx.fillRect(0, 0, 8, 8)
    
    this.scene.textures.addCanvas('particle', particleCanvas)
    
    const sparkCanvas = document.createElement('canvas')
    sparkCanvas.width = 4
    sparkCanvas.height = 4
    const sCtx = sparkCanvas.getContext('2d')
    
    sCtx.fillStyle = '#ffffff'
    sCtx.beginPath()
    sCtx.arc(2, 2, 2, 0, Math.PI * 2)
    sCtx.fill()
    
    this.scene.textures.addCanvas('spark', sparkCanvas)
  }
}

