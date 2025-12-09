import Phaser from 'phaser'

export default class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene')
  }

  preload() {
    this.createLoadingBar()
    this.generateAssets()
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
    this.generatePlayerSprite()
    this.generateZombieSprite()
    this.generateZubkovSprite()
    this.generateFriendlyNPCSprite()
    this.generateServerSprite()
    this.generateBuildingSprites()
    this.generateGraveMound()
    this.generateGraveyardSprites()
    this.generatePrincessSprite()
    this.generateBeerSprite()
    this.generateTiles()
    this.generateParticles()
  }

  generatePlayerSprite() {
    // Персонаж сверху - 4 направления
    const directions = ['down', 'up', 'left', 'right']
    
    directions.forEach(dir => {
      const canvas = document.createElement('canvas')
      canvas.width = 32
      canvas.height = 32
      const ctx = canvas.getContext('2d')
      ctx.imageSmoothingEnabled = false
      
      this.drawTopDownPlayer(ctx, dir)
      this.textures.addCanvas(`player_${dir}`, canvas)
    })
    
    // Дефолтный спрайт
    const defaultCanvas = document.createElement('canvas')
    defaultCanvas.width = 32
    defaultCanvas.height = 32
    const defaultCtx = defaultCanvas.getContext('2d')
    defaultCtx.imageSmoothingEnabled = false
    this.drawTopDownPlayer(defaultCtx, 'down')
    this.textures.addCanvas('player', defaultCanvas)
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

  generateZombieSprite() {
    const directions = ['down', 'up', 'left', 'right']
    
    directions.forEach(dir => {
      const canvas = document.createElement('canvas')
      canvas.width = 32
      canvas.height = 32
      const ctx = canvas.getContext('2d')
      ctx.imageSmoothingEnabled = false
      
      this.drawTopDownZombie(ctx, dir)
      this.textures.addCanvas(`zombie_${dir}`, canvas)
    })
    
    // Дефолтный спрайт
    const defaultCanvas = document.createElement('canvas')
    defaultCanvas.width = 32
    defaultCanvas.height = 32
    const defaultCtx = defaultCanvas.getContext('2d')
    defaultCtx.imageSmoothingEnabled = false
    this.drawTopDownZombie(defaultCtx, 'down')
    this.textures.addCanvas('zombie', defaultCanvas)
  }

  drawTopDownZombie(ctx, direction) {
    // Тень
    ctx.fillStyle = 'rgba(0,0,0,0.3)'
    ctx.beginPath()
    ctx.ellipse(16, 28, 10, 4, 0, 0, Math.PI * 2)
    ctx.fill()
    
    // Тело (рваная одежда)
    ctx.fillStyle = '#4a6741'  // Зеленоватый
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
      // Редкие волосы
      ctx.fillStyle = '#33691e'
      ctx.fillRect(11, 1, 3, 3)
      ctx.fillRect(18, 2, 2, 2)
      // Глаза (красные, злые)
      ctx.fillStyle = '#ff0000'
      ctx.fillRect(12, 5, 3, 3)
      ctx.fillRect(17, 5, 3, 3)
      // Зрачки
      ctx.fillStyle = '#000'
      ctx.fillRect(13, 6, 1, 1)
      ctx.fillRect(18, 6, 1, 1)
      // Рот
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
      this.textures.addCanvas(`zubkov_${dir}`, canvas)
    })
    
    // Дефолтный спрайт
    const defaultCanvas = document.createElement('canvas')
    defaultCanvas.width = 48
    defaultCanvas.height = 48
    const defaultCtx = defaultCanvas.getContext('2d')
    defaultCtx.imageSmoothingEnabled = false
    this.drawZubkov(defaultCtx, 'down')
    this.textures.addCanvas('zubkov', defaultCanvas)
  }

  drawZubkov(ctx, direction) {
    // Тень (больше чем у обычного зомби)
    ctx.fillStyle = 'rgba(0,0,0,0.4)'
    ctx.beginPath()
    ctx.ellipse(24, 44, 14, 5, 0, 0, Math.PI * 2)
    ctx.fill()
    
    // Тело (больше, в костюме)
    ctx.fillStyle = '#1a237e' // Тёмно-синий пиджак
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
      // Лысина/редкие волосы
      ctx.fillStyle = '#33691e'
      ctx.fillRect(16, 1, 6, 3)
      ctx.fillRect(26, 2, 4, 2)
      // Глаза (красные, злые, большие)
      ctx.fillStyle = '#ff0000'
      ctx.fillRect(17, 7, 5, 4)
      ctx.fillRect(26, 7, 5, 4)
      // Зрачки
      ctx.fillStyle = '#000'
      ctx.fillRect(19, 8, 2, 2)
      ctx.fillRect(28, 8, 2, 2)
      // Злой рот
      ctx.fillStyle = '#1b5e20'
      ctx.fillRect(19, 14, 10, 3)
      // Зубы
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

  generateFriendlyNPCSprite() {
    const colors = [
      { shirt: '#2196f3', name: 'karpov' },    // Синяя
      { shirt: '#9c27b0', name: 'rukavkov' },  // Фиолетовая
      { shirt: '#ff9800', name: 'mazalov' },   // Оранжевая
      { shirt: '#4caf50', name: 'sergeev' },   // Зелёная
      { shirt: '#e91e63', name: 'sindov' },    // Розовая
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
      
      this.textures.addCanvas(`npc_${config.name}`, canvas)
    })
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
    
    this.textures.addCanvas('server', canvas)
    
    // Сервер с ошибкой (красные LED)
    const errorCanvas = document.createElement('canvas')
    errorCanvas.width = 32
    errorCanvas.height = 40
    const eCtx = errorCanvas.getContext('2d')
    eCtx.imageSmoothingEnabled = false
    
    // Тень
    eCtx.fillStyle = 'rgba(0,0,0,0.3)'
    eCtx.beginPath()
    eCtx.ellipse(16, 38, 12, 4, 0, 0, Math.PI * 2)
    eCtx.fill()
    
    // Корпус
    eCtx.fillStyle = '#37474f'
    eCtx.fillRect(4, 4, 24, 32)
    
    // Передняя панель
    eCtx.fillStyle = '#455a64'
    eCtx.fillRect(6, 6, 20, 28)
    
    // Слоты
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
    
    this.textures.addCanvas('server_error', errorCanvas)
  }

  generateBuildingSprites() {
    // Датацентр Selectel - вид сверху без крыши
    this.createSelectelBuilding()
    
    // Датацентр Yandex - вид сверху без крыши
    this.createYandexBuilding()
    
    // Офис - вид сверху без крыши
    this.createOfficeBuilding()
  }

  createSelectelBuilding() {
    const canvas = document.createElement('canvas')
    canvas.width = 200
    canvas.height = 180
    const ctx = canvas.getContext('2d')
    ctx.imageSmoothingEnabled = false
    
    const wallThickness = 12
    
    // Тень здания
    ctx.fillStyle = 'rgba(0,0,0,0.5)'
    ctx.fillRect(10, 10, 190, 170)
    
    // Пол датацентра (тёмно-серый кафель)
    ctx.fillStyle = '#2a2a35'
    ctx.fillRect(wallThickness, wallThickness, 200 - wallThickness*2, 180 - wallThickness*2)
    
    // Сетка пола
    ctx.strokeStyle = '#3a3a45'
    ctx.lineWidth = 1
    for (let i = 0; i < 10; i++) {
      ctx.beginPath()
      ctx.moveTo(wallThickness, wallThickness + i * 18)
      ctx.lineTo(200 - wallThickness, wallThickness + i * 18)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(wallThickness + i * 20, wallThickness)
      ctx.lineTo(wallThickness + i * 20, 180 - wallThickness)
      ctx.stroke()
    }
    
    // Серверные стойки (вид сверху)
    const serverColors = ['#1a1a2a', '#222233', '#1a1a2a']
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        const sx = 25 + col * 55
        const sy = 30 + row * 45
        
        // Стойка
        ctx.fillStyle = serverColors[col % 3]
        ctx.fillRect(sx, sy, 45, 35)
        
        // Рама стойки
        ctx.strokeStyle = '#4a4a5a'
        ctx.lineWidth = 2
        ctx.strokeRect(sx, sy, 45, 35)
        
        // Мигающие индикаторы
        for (let led = 0; led < 6; led++) {
          const colors = ['#00ff00', '#00ff00', '#ffff00', '#00ff00', '#ff0000', '#00ff00']
          ctx.fillStyle = colors[led]
          ctx.fillRect(sx + 5 + led * 6, sy + 5, 4, 3)
          ctx.fillRect(sx + 5 + led * 6, sy + 12, 4, 3)
          ctx.fillRect(sx + 5 + led * 6, sy + 19, 4, 3)
          ctx.fillRect(sx + 5 + led * 6, sy + 26, 4, 3)
        }
      }
    }
    
    // Кондиционер (вид сверху)
    ctx.fillStyle = '#5a6a5a'
    ctx.fillRect(150, 25, 35, 25)
    ctx.strokeStyle = '#7a8a7a'
    ctx.strokeRect(150, 25, 35, 25)
    // Вентилятор
    ctx.beginPath()
    ctx.arc(167, 37, 8, 0, Math.PI * 2)
    ctx.fillStyle = '#3a4a3a'
    ctx.fill()
    ctx.strokeStyle = '#8a9a8a'
    ctx.stroke()
    
    // Стены (толстые, вид сверху)
    ctx.fillStyle = '#3d5a4e'
    // Верхняя стена
    ctx.fillRect(0, 0, 200, wallThickness)
    // Нижняя стена
    ctx.fillRect(0, 180 - wallThickness, 200, wallThickness)
    // Левая стена
    ctx.fillRect(0, 0, wallThickness, 180)
    // Правая стена
    ctx.fillRect(200 - wallThickness, 0, wallThickness, 180)
    
    // Текстура стен (кирпичи)
    ctx.fillStyle = '#4d6a5e'
    for (let i = 0; i < 16; i++) {
      ctx.fillRect(i * 12 + 2, 2, 10, 4)
      ctx.fillRect(i * 12 + 2, 180 - wallThickness + 2, 10, 4)
    }
    
    // Дверной проём (внизу)
    ctx.fillStyle = '#2a2a35'
    ctx.fillRect(80, 180 - wallThickness, 40, wallThickness)
    // Порог
    ctx.fillStyle = '#5a5a6a'
    ctx.fillRect(82, 180 - wallThickness, 36, 3)
    
    // Надпись SELECTEL на стене
    ctx.fillStyle = '#00ff66'
    ctx.font = 'bold 14px monospace'
    ctx.textAlign = 'center'
    ctx.fillText('SELECTEL', 100, 175)
    
    // Зелёное свечение у надписи
    ctx.fillStyle = 'rgba(0,255,100,0.2)'
    ctx.fillRect(50, 160, 100, 15)
    
    this.textures.addCanvas('building_selectel', canvas)
  }

  createYandexBuilding() {
    const canvas = document.createElement('canvas')
    canvas.width = 200
    canvas.height = 180
    const ctx = canvas.getContext('2d')
    ctx.imageSmoothingEnabled = false
    
    const wallThickness = 12
    
    // Тень
    ctx.fillStyle = 'rgba(0,0,0,0.5)'
    ctx.fillRect(10, 10, 190, 170)
    
    // Пол (белая плитка)
    ctx.fillStyle = '#e8e8e0'
    ctx.fillRect(wallThickness, wallThickness, 200 - wallThickness*2, 180 - wallThickness*2)
    
    // Шахматный узор пола
    ctx.fillStyle = '#d0d0c8'
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 10; col++) {
        if ((row + col) % 2 === 0) {
          ctx.fillRect(wallThickness + col * 18, wallThickness + row * 18, 18, 18)
        }
      }
    }
    
    // Серверные стойки Яндекса (жёлто-чёрные)
    for (let row = 0; row < 2; row++) {
      for (let col = 0; col < 4; col++) {
        const sx = 20 + col * 45
        const sy = 25 + row * 55
        
        // Стойка
        ctx.fillStyle = '#1a1a1a'
        ctx.fillRect(sx, sy, 38, 45)
        
        // Жёлтая полоса Яндекса
        ctx.fillStyle = '#ffcc00'
        ctx.fillRect(sx, sy, 38, 6)
        
        // Индикаторы
        for (let led = 0; led < 4; led++) {
          ctx.fillStyle = led % 2 === 0 ? '#ffcc00' : '#00ff00'
          ctx.fillRect(sx + 5 + led * 8, sy + 12, 5, 4)
          ctx.fillRect(sx + 5 + led * 8, sy + 22, 5, 4)
          ctx.fillRect(sx + 5 + led * 8, sy + 32, 5, 4)
        }
        
        ctx.strokeStyle = '#ffcc00'
        ctx.lineWidth = 2
        ctx.strokeRect(sx, sy, 38, 45)
      }
    }
    
    // Рабочее место оператора
    ctx.fillStyle = '#4a4a4a'
    ctx.fillRect(140, 130, 45, 30)
    // Монитор
    ctx.fillStyle = '#2a4a6a'
    ctx.fillRect(150, 135, 25, 18)
    // Клавиатура
    ctx.fillStyle = '#3a3a3a'
    ctx.fillRect(148, 155, 30, 8)
    
    // Стены (жёлтые)
    ctx.fillStyle = '#ffcc00'
    ctx.fillRect(0, 0, 200, wallThickness)
    ctx.fillRect(0, 180 - wallThickness, 200, wallThickness)
    ctx.fillRect(0, 0, wallThickness, 180)
    ctx.fillRect(200 - wallThickness, 0, wallThickness, 180)
    
    // Красная полоса на стенах
    ctx.fillStyle = '#cc0000'
    ctx.fillRect(0, 0, 200, 3)
    ctx.fillRect(0, 180 - 3, 200, 3)
    ctx.fillRect(0, 0, 3, 180)
    ctx.fillRect(200 - 3, 0, 3, 180)
    
    // Дверной проём
    ctx.fillStyle = '#e8e8e0'
    ctx.fillRect(80, 180 - wallThickness, 40, wallThickness)
    ctx.fillStyle = '#aa0000'
    ctx.fillRect(82, 180 - 3, 36, 3)
    
    // Логотип Яндекса
    ctx.fillStyle = '#ff0000'
    ctx.fillRect(90, 160, 20, 15)
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 12px monospace'
    ctx.textAlign = 'center'
    ctx.fillText('Я', 100, 172)
    
    // Надпись
    ctx.fillStyle = '#000000'
    ctx.font = 'bold 12px monospace'
    ctx.fillText('YANDEX', 100, 158)
    
    this.textures.addCanvas('building_yandex', canvas)
  }

  createOfficeBuilding() {
    const canvas = document.createElement('canvas')
    canvas.width = 220
    canvas.height = 200
    const ctx = canvas.getContext('2d')
    ctx.imageSmoothingEnabled = false
    
    const wallThickness = 14
    
    // Тень
    ctx.fillStyle = 'rgba(0,0,0,0.5)'
    ctx.fillRect(12, 12, 208, 188)
    
    // Пол офиса (ковролин)
    ctx.fillStyle = '#4a5568'
    ctx.fillRect(wallThickness, wallThickness, 220 - wallThickness*2, 200 - wallThickness*2)
    
    // Текстура ковролина
    for (let i = 0; i < 500; i++) {
      ctx.fillStyle = Math.random() > 0.5 ? '#3a4558' : '#5a6578'
      ctx.fillRect(
        wallThickness + Math.random() * (220 - wallThickness*2),
        wallThickness + Math.random() * (200 - wallThickness*2),
        2, 2
      )
    }
    
    // Рабочие столы (open space)
    for (let row = 0; row < 2; row++) {
      for (let col = 0; col < 3; col++) {
        const dx = 25 + col * 65
        const dy = 30 + row * 70
        
        // Стол
        ctx.fillStyle = '#8b7355'
        ctx.fillRect(dx, dy, 55, 30)
        ctx.strokeStyle = '#6b5335'
        ctx.lineWidth = 2
        ctx.strokeRect(dx, dy, 55, 30)
        
        // Монитор
        ctx.fillStyle = '#2a3a4a'
        ctx.fillRect(dx + 15, dy + 5, 25, 16)
        // Экран светится
        ctx.fillStyle = '#4a8acc'
        ctx.fillRect(dx + 17, dy + 7, 21, 12)
        
        // Клавиатура
        ctx.fillStyle = '#3a3a3a'
        ctx.fillRect(dx + 12, dy + 23, 20, 5)
        
        // Стул (вид сверху)
        ctx.fillStyle = '#2a2a2a'
        ctx.beginPath()
        ctx.arc(dx + 27, dy + 45, 10, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = '#1a5a8a'
        ctx.beginPath()
        ctx.arc(dx + 27, dy + 45, 7, 0, Math.PI * 2)
        ctx.fill()
      }
    }
    
    // Кофемашина
    ctx.fillStyle = '#2a2a2a'
    ctx.fillRect(180, 25, 20, 25)
    ctx.fillStyle = '#aa4444'
    ctx.fillRect(182, 27, 16, 8)
    
    // Кулер с водой
    ctx.fillStyle = '#e0e0e0'
    ctx.fillRect(180, 60, 18, 30)
    ctx.fillStyle = '#4a9aff'
    ctx.fillRect(182, 62, 14, 15)
    
    // Принтер
    ctx.fillStyle = '#4a4a4a'
    ctx.fillRect(20, 160, 35, 25)
    ctx.fillStyle = '#2a2a2a'
    ctx.fillRect(22, 162, 31, 10)
    
    // Переговорка (отдельная комната)
    ctx.fillStyle = '#5a6578'
    ctx.fillRect(140, 130, 60, 50)
    ctx.strokeStyle = '#3a4558'
    ctx.lineWidth = 3
    ctx.strokeRect(140, 130, 60, 50)
    // Стол переговорной
    ctx.fillStyle = '#6b5335'
    ctx.fillRect(150, 145, 40, 20)
    
    // Стены (кирпичные)
    ctx.fillStyle = '#8b5a3a'
    ctx.fillRect(0, 0, 220, wallThickness)
    ctx.fillRect(0, 200 - wallThickness, 220, wallThickness)
    ctx.fillRect(0, 0, wallThickness, 200)
    ctx.fillRect(220 - wallThickness, 0, wallThickness, 200)
    
    // Кирпичная текстура стен
    ctx.fillStyle = '#9b6a4a'
    for (let i = 0; i < 16; i++) {
      ctx.fillRect(i * 14 + 2, 2, 11, 5)
      ctx.fillRect(i * 14 + 2, 200 - wallThickness + 2, 11, 5)
    }
    
    // Дверной проём
    ctx.fillStyle = '#4a5568'
    ctx.fillRect(90, 200 - wallThickness, 40, wallThickness)
    // Коврик
    ctx.fillStyle = '#3a8a5a'
    ctx.fillRect(92, 200 - wallThickness, 36, 5)
    
    // Вывеска OTA
    ctx.fillStyle = '#1a4a8a'
    ctx.fillRect(75, 180, 70, 14)
    ctx.strokeStyle = '#3a8afa'
    ctx.lineWidth = 2
    ctx.strokeRect(75, 180, 70, 14)
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 11px monospace'
    ctx.textAlign = 'center'
    ctx.fillText('OTA OFFICE', 110, 191)
    
    this.textures.addCanvas('building_office', canvas)
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
    
    // Цветочек (опционально)
    ctx.fillStyle = '#ffeb3b'
    ctx.fillRect(22, 16, 3, 3)
    ctx.fillStyle = '#4caf50'
    ctx.fillRect(23, 19, 1, 4)
    
    this.textures.addCanvas('mound', canvas)
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
    
    this.textures.addCanvas('cross', crossCanvas)
    
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
    
    this.textures.addCanvas('tombstone', tombCanvas)
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
      this.textures.addCanvas(`princess_${dir}`, canvas)
    })
    
    const defaultCanvas = document.createElement('canvas')
    defaultCanvas.width = 32
    defaultCanvas.height = 32
    const defaultCtx = defaultCanvas.getContext('2d')
    defaultCtx.imageSmoothingEnabled = false
    this.drawTopDownPrincess(defaultCtx, 'down')
    this.textures.addCanvas('princess', defaultCanvas)
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

  generateBeerSprite() {
    const canvas = document.createElement('canvas')
    canvas.width = 24
    canvas.height = 24
    const ctx = canvas.getContext('2d')
    ctx.imageSmoothingEnabled = false
    
    // Тень
    ctx.fillStyle = 'rgba(0,0,0,0.3)'
    ctx.beginPath()
    ctx.ellipse(12, 22, 6, 2, 0, 0, Math.PI * 2)
    ctx.fill()
    
    // Бутылка
    ctx.fillStyle = '#4a2c00'
    ctx.fillRect(9, 6, 6, 14)
    
    // Горлышко
    ctx.fillRect(10, 2, 4, 5)
    
    // Этикетка
    ctx.fillStyle = '#f5f5dc'
    ctx.fillRect(9, 10, 6, 6)
    
    // Надпись на этикетке
    ctx.fillStyle = '#ff0000'
    ctx.fillRect(10, 12, 4, 2)
    
    // Пробка
    ctx.fillStyle = '#8b4513'
    ctx.fillRect(10, 1, 4, 2)
    
    // Блик
    ctx.fillStyle = 'rgba(255,255,255,0.3)'
    ctx.fillRect(13, 6, 2, 10)
    
    this.textures.addCanvas('beer', canvas)
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
    
    this.textures.addCanvas('grass', grassCanvas)
    
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
    
    this.textures.addCanvas('path', pathCanvas)
    
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
    
    this.textures.addCanvas('fence', fenceCanvas)
  }

  generateParticles() {
    const particleCanvas = document.createElement('canvas')
    particleCanvas.width = 8
    particleCanvas.height = 8
    const pCtx = particleCanvas.getContext('2d')
    
    pCtx.fillStyle = '#ffffff'
    pCtx.fillRect(0, 0, 8, 8)
    
    this.textures.addCanvas('particle', particleCanvas)
    
    const sparkCanvas = document.createElement('canvas')
    sparkCanvas.width = 4
    sparkCanvas.height = 4
    const sCtx = sparkCanvas.getContext('2d')
    
    sCtx.fillStyle = '#ffffff'
    sCtx.beginPath()
    sCtx.arc(2, 2, 2, 0, Math.PI * 2)
    sCtx.fill()
    
    this.textures.addCanvas('spark', sparkCanvas)
  }

  create() {
    this.scene.start('MainScene')
  }
}
