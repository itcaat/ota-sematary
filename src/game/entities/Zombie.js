export class ZombieManager {
  constructor(scene) {
    this.scene = scene
    this.zombies = null
    this.crutches = null
    
    this.zombiePhrases = [
      'Не могу к базе подключиться. Connection timed out to 127.0.0.1',
      'У меня упал билд, посмотрите пж',
      'Это не наше, давайте позовем Сашу Зубкова',
      'У нас миграции упали! Можете починить?',
      'Взяли в беклог, но не знаем когда сможем сделать',
      'У нас МОНОЛИТ!!!',
      'А скиньте логи с прода плиз',
      'Какие у нас внешние IP адреса?',
      'А как собрать мордор?',
      'У нас всё встало! Памагити',
      'Билеты не выписываются!',
      'Пользователи жалуются, что почта не приходит!',
      'А можно мне доступ к v2_prod?',
      'Скиньте секреты',
      'Помогите ошибка (ошибка на странице показана)',
      'Привет! Выполните, пожалуйста, запрос',
      'Подробнее в треде',
      'Гляньте пж (вообще не связанная тема с нашим сектором работы)',
      'Нужны доступы к базе',
      'У нас какая-то проблема с деплоем',
      'У нас сервисы по хелзчеку упали, посмотрите пожалуйста',
      'А воркфлоу по получению доступа к бд в канале актуален',
      'Ilya Klishevich is typing',
    ]
  }

  create() {
    this.zombies = this.scene.physics.add.group()
    this.crutches = this.scene.physics.add.group()
    
    const positions = [
      { x: 600, y: 300, patrolX: [500, 700] },
      { x: 900, y: 500, patrolY: [400, 600] },
      { x: 400, y: 800, patrolX: [300, 500] },
      { x: 1000, y: 300, patrolY: [200, 400] },
      { x: 1200, y: 800, patrolX: [1100, 1300] },
      { x: 500, y: 1000, patrolY: [900, 1100] },
    ]
    
    positions.forEach((pos) => {
      const zombie = this.zombies.create(pos.x, pos.y, 'zombie')
      zombie.setOrigin(0.5, 0.5)
      zombie.setSize(20, 20)
      zombie.setOffset(6, 10)
      zombie.setDepth(10)
      zombie.setCollideWorldBounds(true)
      
      zombie.phraseText = this.scene.add.text(pos.x, pos.y - 35, '', {
        fontFamily: 'monospace',
        fontSize: '9px',
        fill: '#ff4444',
        stroke: '#000000',
        strokeThickness: 2,
        align: 'center',
        wordWrap: { width: 120 }
      }).setOrigin(0.5).setDepth(11).setAlpha(0)
      
      zombie.zombieData = {
        state: 'patrol',
        direction: 'down',
        patrolX: pos.patrolX || null,
        patrolY: pos.patrolY || null,
        patrolDirection: 1,
        speed: 60,
        chaseSpeed: 120,
        detectionRange: 150,
        loseRange: 250,
        homeX: pos.x,
        homeY: pos.y,
        phrase: Phaser.Math.RND.pick(this.zombiePhrases)
      }
    })
    
    return this.zombies
  }

  showPhrase(zombie) {
    if (!zombie.zombieData) return
    
    if (zombie.activePhrase) {
      zombie.activePhrase.destroy()
    }
    
    const phraseEffect = this.scene.add.text(zombie.x, zombie.y - 40, zombie.zombieData.phrase, {
      fontFamily: 'monospace',
      fontSize: '10px',
      fill: '#ff4444',
      stroke: '#000000',
      strokeThickness: 2,
      align: 'center',
      wordWrap: { width: 120 }
    }).setOrigin(0.5).setDepth(200)
    
    zombie.activePhrase = phraseEffect
    zombie.phraseStartY = zombie.y - 40
    zombie.phraseStartTime = this.scene.time.now
    
    this.scene.tweens.add({
      targets: phraseEffect,
      alpha: 0,
      scale: 1.5,
      duration: 5000,
      ease: 'Power2',
      onComplete: () => {
        phraseEffect.destroy()
        zombie.activePhrase = null
      }
    })
  }

  throwCrutch() {
    if (this.scene.gameComplete || !this.zombies) return
    
    const activeZombies = this.zombies.getChildren().filter(z => {
      if (!z.active || !z.zombieData) return false
      const dist = Phaser.Math.Distance.Between(z.x, z.y, this.scene.player.x, this.scene.player.y)
      return dist < 300 && dist > 80 && !this.scene.isHiding
    })
    
    if (activeZombies.length === 0) return
    if (Math.random() > 0.4) return
    
    const zombie = Phaser.Math.RND.pick(activeZombies)
    const crutch = this.crutches.create(zombie.x, zombie.y, 'crutch')
    crutch.setDepth(15)
    crutch.body.setAllowGravity(false)
    
    const angle = Phaser.Math.Angle.Between(zombie.x, zombie.y, this.scene.player.x, this.scene.player.y)
    const speed = 180
    crutch.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed)
    
    this.scene.tweens.add({
      targets: crutch,
      angle: 720,
      duration: 1000,
      ease: 'Linear'
    })
    
    zombie.setTint(0xffaa00)
    this.scene.time.delayedCall(200, () => {
      if (zombie.active) zombie.clearTint()
    })
    
    this.scene.sound.playAlert()
    
    this.scene.time.delayedCall(3000, () => {
      if (crutch.active) crutch.destroy()
    })
  }

  update() {
    if (!this.zombies) return
    
    this.zombies.children.each(zombie => {
      const data = zombie.zombieData
      const player = this.scene.player
      const distToPlayer = Phaser.Math.Distance.Between(zombie.x, zombie.y, player.x, player.y)
      
      if (data.state === 'patrol') {
        if (distToPlayer < data.detectionRange && !this.scene.isHiding) {
          data.state = 'chase'
          this.showPhrase(zombie)
        }
      } else if (data.state === 'chase') {
        if (distToPlayer > data.loseRange || this.scene.isHiding) {
          data.state = 'return'
          if (zombie.phraseText) {
            zombie.phraseText.setAlpha(0)
          }
        }
      } else if (data.state === 'return') {
        const distToHome = Phaser.Math.Distance.Between(zombie.x, zombie.y, data.homeX, data.homeY)
        if (distToHome < 10) {
          data.state = 'patrol'
        }
        if (distToPlayer < data.detectionRange && !this.scene.isHiding) {
          data.state = 'chase'
          this.showPhrase(zombie)
        }
      }
      
      let velocityX = 0
      let velocityY = 0
      
      if (data.state === 'patrol') {
        if (data.patrolX) {
          velocityX = data.patrolDirection * data.speed
          if (zombie.x <= data.patrolX[0]) data.patrolDirection = 1
          if (zombie.x >= data.patrolX[1]) data.patrolDirection = -1
        } else if (data.patrolY) {
          velocityY = data.patrolDirection * data.speed
          if (zombie.y <= data.patrolY[0]) data.patrolDirection = 1
          if (zombie.y >= data.patrolY[1]) data.patrolDirection = -1
        }
      } else if (data.state === 'chase') {
        const angle = Phaser.Math.Angle.Between(zombie.x, zombie.y, player.x, player.y)
        velocityX = Math.cos(angle) * data.chaseSpeed
        velocityY = Math.sin(angle) * data.chaseSpeed
      } else if (data.state === 'return') {
        const angle = Phaser.Math.Angle.Between(zombie.x, zombie.y, data.homeX, data.homeY)
        velocityX = Math.cos(angle) * data.speed
        velocityY = Math.sin(angle) * data.speed
      }
      
      zombie.setVelocity(velocityX, velocityY)
      
      if (Math.abs(velocityX) > Math.abs(velocityY)) {
        data.direction = velocityX > 0 ? 'right' : 'left'
      } else if (velocityY !== 0) {
        data.direction = velocityY > 0 ? 'down' : 'up'
      }
      
      zombie.setTexture(`zombie_${data.direction}`)
      
      if (zombie.phraseText) {
        zombie.phraseText.x = zombie.x
        zombie.phraseText.y = zombie.y - 35
      }
      
      if (zombie.activePhrase && zombie.phraseStartTime) {
        const elapsed = this.scene.time.now - zombie.phraseStartTime
        const offsetY = (elapsed / 5000) * 30
        zombie.activePhrase.x = zombie.x
        zombie.activePhrase.y = zombie.phraseStartY - offsetY
      }
      
      if (data.state === 'chase') {
        zombie.setTint(0xff6666)
      } else {
        zombie.clearTint()
      }
    })
  }
}

