export class FriendlyNPCManager {
  constructor(scene) {
    this.scene = scene
    this.npcs = []
    
    this.sarcasticPhrases = [
      "Отлично справляешься! 👍\n(нет)",
      "Ты точно DevOps? 🤔",
      "Может тебе в PM?",
      "Сервера сами\nне упадут!",
      "Красавчик! 💪\n(сарказм)",
      "Так держать!\n...подальше от прода",
      "Верю в тебя!\n(на самом деле нет)",
      "Ещё чуть-чуть!\n...до увольнения",
      "Молодец! 🎉\n(это ирония)",
      "Ты лучший! 🏆\n...в ломании серверов",
      "Супер! Осталось\nвсего 100500 тасков",
      "Не сдавайся!\n(хотя стоило бы)",
      "Классно!\nZubkov доволен\n(нет)",
      "Ты справишься!\n...когда-нибудь",
      "Вот это скилл! 😎\n(шутка)",
      "Профессионал! 💼\n(по версии мамы)",
      "Так и надо!\n(на самом деле нет)",
      "Огонь! 🔥\n(как и сервера)",
      "Легенда! 🌟\n(в своих мечтах)",
      "Бог DevOps! ⚡\n(богохульство)",
    ]
    
    this.kozlovPhrases = [
      "Когда уже в yandex\nпереедем?",
      "Чет я уже заебался",
      "Да сколько можно?!",
      "Штош...",
      "Ну ты слоняра",
      "Где Погожий?",
    ]
    
    this.pogozhiyPhrases = [
      "НЕ ДОЛЖНЫМ ОБРАЗОМ\nОТТЕСТИРОВАННЫЙ КОД",
      "COMPOSE\nНА ПЕТАБАЙТЫ",
      "Я чайка ебаная",
      "ГОВНО МОЧА",
      "ЁБАНЫЙ ХУЙ ГНОЙ\nЗАЛУПА ПИДОРЫ",
      "РУКИ ОТОРВАТЬ\nПИДОРАМ",
      "ПРИКЛЮЧЕНИЕ\nНА ДВАДЦАТЬ МИНУТ",
      "Я ВАМ НА ЕБАЛЕ\nПОПРЫГАЮ",
    ]
  }

  create() {
    const configs = [
      { name: 'karpov', x: 150, y: 320 },
      { name: 'rukavkov', x: 550, y: 550 },
      { name: 'mazalov', x: 950, y: 350 },
      { name: 'sergeev', x: 1300, y: 600 },
      { name: 'sindov', x: 750, y: 1000 },
      { name: 'kozlov', x: 1150, y: 760 },
      { name: 'pogozhiy', x: 1250, y: 760 },
    ]
    
    const displayNames = {
      'karpov': 'karpov',
      'rukavkov': 'rukavkov',
      'mazalov': 'mazalov',
      'sergeev': 'sergeev',
      'sindov': 'sindov',
      'kozlov': 'Козлов',
      'pogozhiy': 'Погожий',
    }
    
    configs.forEach(config => {
      const npc = this.scene.add.sprite(config.x, config.y, `npc_${config.name}`)
      npc.setOrigin(0.5, 0.5)
      npc.setDepth(10)
      
      const displayName = displayNames[config.name] || config.name
      const nameText = this.scene.add.text(config.x, config.y - 25, displayName, {
        fontFamily: 'monospace',
        fontSize: '10px',
        fill: '#ffffff',
        stroke: '#000000',
        strokeThickness: 2
      }).setOrigin(0.5).setDepth(100)
      
      const phraseText = this.scene.add.text(config.x, config.y - 45, '', {
        fontFamily: 'monospace',
        fontSize: '9px',
        fill: '#ffeb3b',
        stroke: '#000000',
        strokeThickness: 2,
        align: 'center',
        wordWrap: { width: 120 }
      }).setOrigin(0.5).setDepth(100)
      
      npc.nameText = nameText
      npc.phraseText = phraseText
      npc.npcName = config.name
      
      this.scene.tweens.add({
        targets: npc,
        y: npc.y - 3,
        duration: 1000 + Math.random() * 500,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      })
      
      this.npcs.push(npc)
      
      this.scene.time.addEvent({
        delay: 1000 + Math.random() * 2000,
        callback: () => this.startPhrases(npc),
        callbackScope: this
      })
    })
  }

  startPhrases(npc) {
    this.showPhrase(npc)
    
    this.scene.time.addEvent({
      delay: 5000 + Math.random() * 2000,
      callback: () => this.showPhrase(npc),
      callbackScope: this,
      loop: true
    })
  }

  showPhrase(npc) {
    if (this.scene.gameComplete) return
    
    if (npc.activePhrase) {
      npc.activePhrase.destroy()
    }
    
    let phrasesArray = this.sarcasticPhrases
    let phraseColor = '#ffeb3b'
    
    if (npc.npcName === 'kozlov') {
      phrasesArray = this.kozlovPhrases
      phraseColor = '#ffa726'
    } else if (npc.npcName === 'pogozhiy') {
      phrasesArray = this.pogozhiyPhrases
      phraseColor = '#ff1744'
    }
    
    const phrase = Phaser.Utils.Array.GetRandom(phrasesArray)
    const phraseEffect = this.scene.add.text(npc.x, npc.y - 50, phrase, {
      fontFamily: 'monospace',
      fontSize: '10px',
      fill: phraseColor,
      stroke: '#000000',
      strokeThickness: 2,
      align: 'center',
      wordWrap: { width: 120 }
    }).setOrigin(0.5).setDepth(200)
    
    npc.activePhrase = phraseEffect
    npc.phraseStartY = npc.y - 50
    npc.phraseStartTime = this.scene.time.now
    
    this.scene.tweens.add({
      targets: phraseEffect,
      alpha: 0,
      scale: 1.5,
      duration: 5000,
      ease: 'Power2',
      onComplete: () => {
        phraseEffect.destroy()
        npc.activePhrase = null
      }
    })
  }

  update() {
    this.npcs.forEach(npc => {
      npc.nameText.x = npc.x
      npc.nameText.y = npc.y - 25
      
      if (npc.activePhrase && npc.phraseStartTime) {
        const elapsed = this.scene.time.now - npc.phraseStartTime
        const offsetY = (elapsed / 5000) * 30
        npc.activePhrase.x = npc.x
        npc.activePhrase.y = npc.phraseStartY - offsetY
      }
    })
  }
}

