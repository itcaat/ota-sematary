export class BuildingSprites {
  constructor(scene) {
    this.scene = scene
  }

  generate() {
    this.createSelectelBuilding()
    this.createYandexBuilding()
    this.createOfficeBuilding()
    this.createPhuketskBuilding()
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
        
        ctx.fillStyle = serverColors[col % 3]
        ctx.fillRect(sx, sy, 45, 35)
        
        ctx.strokeStyle = '#4a4a5a'
        ctx.lineWidth = 2
        ctx.strokeRect(sx, sy, 45, 35)
        
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
    ctx.beginPath()
    ctx.arc(167, 37, 8, 0, Math.PI * 2)
    ctx.fillStyle = '#3a4a3a'
    ctx.fill()
    ctx.strokeStyle = '#8a9a8a'
    ctx.stroke()
    
    // Стены (толстые, вид сверху)
    ctx.fillStyle = '#3d5a4e'
    ctx.fillRect(0, 0, 200, wallThickness)
    ctx.fillRect(0, 180 - wallThickness, 200, wallThickness)
    ctx.fillRect(0, 0, wallThickness, 180)
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
    
    this.scene.textures.addCanvas('building_selectel', canvas)
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
        
        ctx.fillStyle = '#1a1a1a'
        ctx.fillRect(sx, sy, 38, 45)
        
        ctx.fillStyle = '#ffcc00'
        ctx.fillRect(sx, sy, 38, 6)
        
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
    ctx.fillStyle = '#2a4a6a'
    ctx.fillRect(150, 135, 25, 18)
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
    
    ctx.fillStyle = '#000000'
    ctx.font = 'bold 12px monospace'
    ctx.fillText('YANDEX', 100, 158)
    
    this.scene.textures.addCanvas('building_yandex', canvas)
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
        
        ctx.fillStyle = '#8b7355'
        ctx.fillRect(dx, dy, 55, 30)
        ctx.strokeStyle = '#6b5335'
        ctx.lineWidth = 2
        ctx.strokeRect(dx, dy, 55, 30)
        
        ctx.fillStyle = '#2a3a4a'
        ctx.fillRect(dx + 15, dy + 5, 25, 16)
        ctx.fillStyle = '#4a8acc'
        ctx.fillRect(dx + 17, dy + 7, 21, 12)
        
        ctx.fillStyle = '#3a3a3a'
        ctx.fillRect(dx + 12, dy + 23, 20, 5)
        
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
    ctx.fillText('SALO OFFICE', 110, 191)
    
    this.scene.textures.addCanvas('building_office', canvas)
  }

  createPhuketskBuilding() {
    const canvas = document.createElement('canvas')
    canvas.width = 220
    canvas.height = 200
    const ctx = canvas.getContext('2d')
    ctx.imageSmoothingEnabled = false
    
    const wallThickness = 14
    
    // Тень
    ctx.fillStyle = 'rgba(0,0,0,0.5)'
    ctx.fillRect(12, 12, 208, 188)
    
    // Пол офиса (ковролин светлее)
    ctx.fillStyle = '#5a6878'
    ctx.fillRect(wallThickness, wallThickness, 220 - wallThickness*2, 200 - wallThickness*2)
    
    // Текстура ковролина
    for (let i = 0; i < 500; i++) {
      ctx.fillStyle = Math.random() > 0.5 ? '#4a5868' : '#6a7888'
      ctx.fillRect(
        wallThickness + Math.random() * (220 - wallThickness*2),
        wallThickness + Math.random() * (200 - wallThickness*2),
        2, 2
      )
    }
    
    // Рабочие столы команды 1 (слева) - Козлов
    for (let row = 0; row < 2; row++) {
      const dx = 25
      const dy = 30 + row * 70
      
      ctx.fillStyle = '#8b7355'
      ctx.fillRect(dx, dy, 55, 30)
      ctx.strokeStyle = '#6b5335'
      ctx.lineWidth = 2
      ctx.strokeRect(dx, dy, 55, 30)
      
      ctx.fillStyle = '#2a3a4a'
      ctx.fillRect(dx + 15, dy + 5, 25, 16)
      ctx.fillStyle = '#4a8acc'
      ctx.fillRect(dx + 17, dy + 7, 21, 12)
      
      ctx.fillStyle = '#3a3a3a'
      ctx.fillRect(dx + 12, dy + 23, 20, 5)
      
      ctx.fillStyle = '#2a2a2a'
      ctx.beginPath()
      ctx.arc(dx + 27, dy + 45, 10, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#8a5a1a'
      ctx.beginPath()
      ctx.arc(dx + 27, dy + 45, 7, 0, Math.PI * 2)
      ctx.fill()
    }
    
    // Рабочие столы команды 2 (справа) - Погожий
    for (let row = 0; row < 2; row++) {
      const dx = 140
      const dy = 30 + row * 70
      
      ctx.fillStyle = '#8b7355'
      ctx.fillRect(dx, dy, 55, 30)
      ctx.strokeStyle = '#6b5335'
      ctx.lineWidth = 2
      ctx.strokeRect(dx, dy, 55, 30)
      
      ctx.fillStyle = '#2a3a4a'
      ctx.fillRect(dx + 15, dy + 5, 25, 16)
      ctx.fillStyle = '#4a8acc'
      ctx.fillRect(dx + 17, dy + 7, 21, 12)
      
      ctx.fillStyle = '#3a3a3a'
      ctx.fillRect(dx + 12, dy + 23, 20, 5)
      
      ctx.fillStyle = '#2a2a2a'
      ctx.beginPath()
      ctx.arc(dx + 27, dy + 45, 10, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#5a1a8a'
      ctx.beginPath()
      ctx.arc(dx + 27, dy + 45, 7, 0, Math.PI * 2)
      ctx.fill()
    }
    
    // Кофемашина
    ctx.fillStyle = '#2a2a2a'
    ctx.fillRect(100, 25, 20, 25)
    ctx.fillStyle = '#aa4444'
    ctx.fillRect(102, 27, 16, 8)
    
    // Кулер с водой
    ctx.fillStyle = '#e0e0e0'
    ctx.fillRect(100, 60, 18, 30)
    ctx.fillStyle = '#4a9aff'
    ctx.fillRect(102, 62, 14, 15)
    
    // Принтер
    ctx.fillStyle = '#4a4a4a'
    ctx.fillRect(20, 160, 35, 25)
    ctx.fillStyle = '#2a2a2a'
    ctx.fillRect(22, 162, 31, 10)
    
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
    ctx.fillStyle = '#5a6878'
    ctx.fillRect(90, 200 - wallThickness, 40, wallThickness)
    ctx.fillStyle = '#8a3a5a'
    ctx.fillRect(92, 200 - wallThickness, 36, 5)
    
    // Вывеска Пхукетск
    ctx.fillStyle = '#8a1a4a'
    ctx.fillRect(65, 180, 90, 14)
    ctx.strokeStyle = '#fa3a8a'
    ctx.lineWidth = 2
    ctx.strokeRect(65, 180, 90, 14)
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 11px monospace'
    ctx.textAlign = 'center'
    ctx.fillText('Пхукетск', 110, 191)
    
    this.scene.textures.addCanvas('building_phuketsk', canvas)
  }
}

