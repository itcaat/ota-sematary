export class ItemSprites {
  constructor(scene) {
    this.scene = scene
  }

  generate() {
    this.generateServerSprite()
    this.generateMedkitSprite()
    this.generateBeerSprite()
    this.generateEnterosgelSprite()
    this.generateMineSprite()
    this.generateGraveMound()
    this.generateGraveyardSprites()
  }

  generateServerSprite() {
    const canvas = document.createElement('canvas')
    canvas.width = 32
    canvas.height = 40
    const ctx = canvas.getContext('2d')
    ctx.imageSmoothingEnabled = false
    
    // Тень
    ctx.fillStyle = 'rgba(0,0,0,0.3)'
    ctx.beginPath()
    ctx.ellipse(16, 38, 12, 4, 0, 0, Math.PI * 2)
    ctx.fill()
    
    // Корпус сервера
    ctx.fillStyle = '#37474f'
    ctx.fillRect(4, 4, 24, 32)
    
    // Передняя панель
    ctx.fillStyle = '#455a64'
    ctx.fillRect(6, 6, 20, 28)
    
    // Слоты дисков
    ctx.fillStyle = '#263238'
    ctx.fillRect(8, 8, 16, 4)
    ctx.fillRect(8, 14, 16, 4)
    ctx.fillRect(8, 20, 16, 4)
    ctx.fillRect(8, 26, 16, 4)
    
    // LED индикаторы (зелёные - работает)
    ctx.fillStyle = '#4caf50'
    ctx.fillRect(22, 9, 2, 2)
    ctx.fillRect(22, 15, 2, 2)
    ctx.fillRect(22, 21, 2, 2)
    ctx.fillRect(22, 27, 2, 2)
    
    // Вентиляционные отверстия
    ctx.fillStyle = '#1a237e'
    for (let y = 32; y < 36; y += 2) {
      ctx.fillRect(8, y, 16, 1)
    }
    
    // Блик
    ctx.fillStyle = 'rgba(255,255,255,0.1)'
    ctx.fillRect(6, 6, 4, 28)
    
    this.scene.textures.addCanvas('server', canvas)
    
    // Сервер с ошибкой (красные LED)
    const errorCanvas = document.createElement('canvas')
    errorCanvas.width = 32
    errorCanvas.height = 40
    const eCtx = errorCanvas.getContext('2d')
    eCtx.imageSmoothingEnabled = false
    
    eCtx.fillStyle = 'rgba(0,0,0,0.3)'
    eCtx.beginPath()
    eCtx.ellipse(16, 38, 12, 4, 0, 0, Math.PI * 2)
    eCtx.fill()
    
    eCtx.fillStyle = '#37474f'
    eCtx.fillRect(4, 4, 24, 32)
    
    eCtx.fillStyle = '#455a64'
    eCtx.fillRect(6, 6, 20, 28)
    
    eCtx.fillStyle = '#263238'
    eCtx.fillRect(8, 8, 16, 4)
    eCtx.fillRect(8, 14, 16, 4)
    eCtx.fillRect(8, 20, 16, 4)
    eCtx.fillRect(8, 26, 16, 4)
    
    // Красные LED - ошибка!
    eCtx.fillStyle = '#f44336'
    eCtx.fillRect(22, 9, 2, 2)
    eCtx.fillRect(22, 15, 2, 2)
    eCtx.fillRect(22, 21, 2, 2)
    eCtx.fillRect(22, 27, 2, 2)
    
    this.scene.textures.addCanvas('server_error', errorCanvas)
  }

  generateMedkitSprite() {
    const canvas = document.createElement('canvas')
    canvas.width = 28
    canvas.height = 28
    const ctx = canvas.getContext('2d')
    ctx.imageSmoothingEnabled = false
    
    // Тень
    ctx.fillStyle = 'rgba(0,0,0,0.4)'
    ctx.fillRect(4, 22, 22, 6)
    
    // Белый корпус аптечки
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(2, 4, 24, 18)
    
    // Красный крест
    ctx.fillStyle = '#ff0000'
    ctx.fillRect(11, 6, 6, 14)
    ctx.fillRect(6, 9, 16, 6)
    
    // Рамка
    ctx.strokeStyle = '#cc0000'
    ctx.lineWidth = 2
    ctx.strokeRect(2, 4, 24, 18)
    
    // Блик
    ctx.fillStyle = 'rgba(255,255,255,0.5)'
    ctx.fillRect(4, 6, 8, 4)
    
    // Ручка сверху
    ctx.fillStyle = '#dddddd'
    ctx.fillRect(10, 2, 8, 4)
    
    this.scene.textures.addCanvas('medkit', canvas)
  }

  generateBeerSprite() {
    const canvas = document.createElement('canvas')
    canvas.width = 28
    canvas.height = 32
    const ctx = canvas.getContext('2d')
    ctx.imageSmoothingEnabled = false
    
    // Тень
    ctx.fillStyle = 'rgba(0,0,0,0.4)'
    ctx.beginPath()
    ctx.ellipse(14, 30, 8, 3, 0, 0, Math.PI * 2)
    ctx.fill()
    
    // Ручка кружки
    ctx.fillStyle = '#c0c0c0'
    ctx.beginPath()
    ctx.arc(24, 18, 5, -Math.PI/2, Math.PI/2)
    ctx.lineTo(24, 23)
    ctx.arc(24, 18, 3, Math.PI/2, -Math.PI/2, true)
    ctx.fill()
    ctx.strokeStyle = '#909090'
    ctx.lineWidth = 1
    ctx.stroke()
    
    // Кружка (основа)
    ctx.fillStyle = '#c0c0c0'
    ctx.fillRect(4, 8, 18, 20)
    
    // Стекло кружки (прозрачность)
    ctx.fillStyle = 'rgba(200,200,200,0.3)'
    ctx.fillRect(5, 9, 16, 18)
    
    // Пиво в кружке
    ctx.fillStyle = '#ffc107'
    ctx.fillRect(6, 12, 14, 14)
    
    // Градиент пива (темнее внизу)
    ctx.fillStyle = '#e6a800'
    ctx.fillRect(6, 20, 14, 6)
    
    // Пена сверху
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(6, 9, 14, 5)
    
    // Пузырьки пены
    ctx.beginPath()
    ctx.arc(8, 8, 2, 0, Math.PI * 2)
    ctx.arc(12, 7, 2.5, 0, Math.PI * 2)
    ctx.arc(16, 8, 2, 0, Math.PI * 2)
    ctx.arc(10, 6, 1.5, 0, Math.PI * 2)
    ctx.arc(14, 5, 1.5, 0, Math.PI * 2)
    ctx.fill()
    
    // Блик на кружке
    ctx.fillStyle = 'rgba(255,255,255,0.4)'
    ctx.fillRect(7, 12, 3, 12)
    
    // Пузырьки в пиве
    ctx.fillStyle = 'rgba(255,255,255,0.5)'
    ctx.beginPath()
    ctx.arc(10, 18, 1, 0, Math.PI * 2)
    ctx.arc(14, 22, 1, 0, Math.PI * 2)
    ctx.arc(12, 16, 0.8, 0, Math.PI * 2)
    ctx.arc(16, 19, 0.8, 0, Math.PI * 2)
    ctx.fill()
    
    // Контур кружки
    ctx.strokeStyle = '#909090'
    ctx.lineWidth = 1
    ctx.strokeRect(4, 8, 18, 20)
    
    this.scene.textures.addCanvas('beer', canvas)
  }

  generateEnterosgelSprite() {
    const canvas = document.createElement('canvas')
    canvas.width = 32
    canvas.height = 32
    const ctx = canvas.getContext('2d')
    ctx.imageSmoothingEnabled = false
    
    // Тень
    ctx.fillStyle = 'rgba(0,0,0,0.4)'
    ctx.beginPath()
    ctx.ellipse(16, 30, 10, 3, 0, 0, Math.PI * 2)
    ctx.fill()
    
    // Корпус тюбика (белый)
    ctx.fillStyle = '#f5f5f5'
    ctx.beginPath()
    ctx.roundRect(8, 8, 16, 20, 2)
    ctx.fill()
    
    // Крышка (синяя)
    ctx.fillStyle = '#2196f3'
    ctx.beginPath()
    ctx.roundRect(11, 4, 10, 6, 1)
    ctx.fill()
    
    // Полоска на крышке
    ctx.fillStyle = '#1976d2'
    ctx.fillRect(11, 7, 10, 2)
    
    // Синяя полоса на тюбике
    ctx.fillStyle = '#2196f3'
    ctx.fillRect(8, 14, 16, 8)
    
    // Надпись "E"
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 12px monospace'
    ctx.textAlign = 'center'
    ctx.fillText('E', 16, 21)
    
    // Обводка тюбика
    ctx.strokeStyle = '#bdbdbd'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.roundRect(8, 8, 16, 20, 2)
    ctx.stroke()
    
    // Блик
    ctx.fillStyle = 'rgba(255,255,255,0.5)'
    ctx.fillRect(10, 10, 3, 10)
    
    // Детали внизу тюбика (сгиб)
    ctx.fillStyle = '#e0e0e0'
    ctx.fillRect(8, 24, 16, 2)
    ctx.fillRect(10, 26, 12, 1)
    
    this.scene.textures.addCanvas('enterosgel', canvas)
  }

  generateMineSprite() {
    const canvas = document.createElement('canvas')
    canvas.width = 32
    canvas.height = 32
    const ctx = canvas.getContext('2d')
    ctx.imageSmoothingEnabled = false
    
    // Тень
    ctx.fillStyle = 'rgba(0,0,0,0.4)'
    ctx.beginPath()
    ctx.ellipse(16, 30, 10, 3, 0, 0, Math.PI * 2)
    ctx.fill()
    
    // Корпус мины (темно-серый круг)
    ctx.fillStyle = '#2a2a2a'
    ctx.beginPath()
    ctx.arc(16, 16, 12, 0, Math.PI * 2)
    ctx.fill()
    
    // Металлический обод
    ctx.strokeStyle = '#4a4a4a'
    ctx.lineWidth = 2
    ctx.stroke()
    
    // Шипы на мине
    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI * 2 * i) / 8
      const x1 = 16 + Math.cos(angle) * 12
      const y1 = 16 + Math.sin(angle) * 12
      const x2 = 16 + Math.cos(angle) * 17
      const y2 = 16 + Math.sin(angle) * 17
      
      ctx.strokeStyle = '#1a1a1a'
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)
      ctx.stroke()
    }
    
    // Красный индикатор в центре
    ctx.fillStyle = '#ff0000'
    ctx.beginPath()
    ctx.arc(16, 16, 4, 0, Math.PI * 2)
    ctx.fill()
    
    // Блик на индикаторе
    ctx.fillStyle = 'rgba(255,255,255,0.5)'
    ctx.beginPath()
    ctx.arc(15, 15, 2, 0, Math.PI * 2)
    ctx.fill()
    
    this.scene.textures.addCanvas('mine', canvas)
  }

  generateGraveMound() {
    const canvas = document.createElement('canvas')
    canvas.width = 48
    canvas.height = 32
    const ctx = canvas.getContext('2d')
    ctx.imageSmoothingEnabled = false
    
    // Тень
    ctx.fillStyle = 'rgba(0,0,0,0.3)'
    ctx.beginPath()
    ctx.ellipse(24, 28, 22, 6, 0, 0, Math.PI * 2)
    ctx.fill()
    
    // Холмик земли (овальная форма)
    ctx.fillStyle = '#3e2723'
    ctx.beginPath()
    ctx.ellipse(24, 24, 20, 10, 0, 0, Math.PI * 2)
    ctx.fill()
    
    // Верхняя часть холмика (светлее)
    ctx.fillStyle = '#5d4037'
    ctx.beginPath()
    ctx.ellipse(24, 22, 18, 8, 0, 0, Math.PI)
    ctx.fill()
    
    // Текстура земли - комочки
    ctx.fillStyle = '#4e342e'
    for (let i = 0; i < 8; i++) {
      const x = 10 + Math.random() * 28
      const y = 18 + Math.random() * 10
      ctx.fillRect(x, y, 3, 2)
    }
    
    // Трава на холмике
    ctx.fillStyle = '#2e7d32'
    ctx.fillRect(8, 20, 2, 4)
    ctx.fillRect(14, 18, 2, 5)
    ctx.fillRect(32, 19, 2, 4)
    ctx.fillRect(38, 21, 2, 3)
    
    // Цветочек
    ctx.fillStyle = '#ffeb3b'
    ctx.fillRect(22, 16, 3, 3)
    ctx.fillStyle = '#4caf50'
    ctx.fillRect(23, 19, 1, 4)
    
    this.scene.textures.addCanvas('mound', canvas)
  }

  generateGraveyardSprites() {
    // Крест (вид сверху)
    const crossCanvas = document.createElement('canvas')
    crossCanvas.width = 32
    crossCanvas.height = 32
    const cCtx = crossCanvas.getContext('2d')
    cCtx.imageSmoothingEnabled = false
    
    // Тень
    cCtx.fillStyle = 'rgba(0,0,0,0.4)'
    cCtx.beginPath()
    cCtx.ellipse(16, 28, 12, 4, 0, 0, Math.PI * 2)
    cCtx.fill()
    
    // Вертикальная часть
    cCtx.fillStyle = '#5d4037'
    cCtx.fillRect(13, 4, 6, 24)
    
    // Горизонтальная часть
    cCtx.fillRect(4, 8, 24, 6)
    
    // Светлые грани
    cCtx.fillStyle = '#8d6e63'
    cCtx.fillRect(13, 4, 6, 2)
    cCtx.fillRect(4, 8, 24, 2)
    
    this.scene.textures.addCanvas('cross', crossCanvas)
    
    // Надгробие (вид сверху)
    const tombCanvas = document.createElement('canvas')
    tombCanvas.width = 32
    tombCanvas.height = 32
    const tCtx = tombCanvas.getContext('2d')
    tCtx.imageSmoothingEnabled = false
    
    // Тень
    tCtx.fillStyle = 'rgba(0,0,0,0.4)'
    tCtx.beginPath()
    tCtx.ellipse(16, 28, 10, 4, 0, 0, Math.PI * 2)
    tCtx.fill()
    
    // Камень
    tCtx.fillStyle = '#607d8b'
    tCtx.beginPath()
    tCtx.moveTo(6, 28)
    tCtx.lineTo(8, 8)
    tCtx.quadraticCurveTo(16, 2, 24, 8)
    tCtx.lineTo(26, 28)
    tCtx.closePath()
    tCtx.fill()
    
    // Светлая грань
    tCtx.fillStyle = '#78909c'
    tCtx.beginPath()
    tCtx.moveTo(6, 28)
    tCtx.lineTo(8, 8)
    tCtx.quadraticCurveTo(16, 2, 16, 8)
    tCtx.lineTo(16, 28)
    tCtx.closePath()
    tCtx.fill()
    
    this.scene.textures.addCanvas('tombstone', tombCanvas)
  }
}

