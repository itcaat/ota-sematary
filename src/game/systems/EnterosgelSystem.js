export class EnterosgelSystem {
  constructor(scene) {
    this.scene = scene
    this.enterosgels = null
  }

  create() {
    this.enterosgels = this.scene.physics.add.group()
    
    // Раскидываем энтеросгели по карте (в разных местах)
    const positions = [
      { x: 300, y: 500 },
      { x: 700, y: 350 },
      { x: 1100, y: 450 },
      { x: 500, y: 800 },
      { x: 900, y: 700 },
      { x: 1300, y: 550 },
    ]
    
    positions.forEach(pos => {
      const enterosgel = this.enterosgels.create(pos.x, pos.y, 'enterosgel')
      enterosgel.setOrigin(0.5, 0.5)
      enterosgel.setDepth(5)
      
      // Анимация покачивания
      this.scene.tweens.add({
        targets: enterosgel,
        y: enterosgel.y - 4,
        duration: 1200 + Math.random() * 400,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      })
      
      // Небольшое вращение
      this.scene.tweens.add({
        targets: enterosgel,
        angle: 10,
        duration: 2000 + Math.random() * 500,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      })
    })
  }

  takeEnterosgel(player, enterosgel) {
    enterosgel.destroy()
    
    // Звуковой эффект (используем звук аптечки)
    this.scene.sound.playHeal()
    
    // Уменьшаем опьянение
    this.scene.playerEntity.takeEnterosgel()
    
    // Текстовое уведомление
    const text = this.scene.add.text(player.x, player.y - 30, '💊 ТРЕЗВЕЕМ!', {
      fontSize: '18px',
      fontFamily: 'monospace',
      fill: '#2196f3',
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5).setDepth(200)
    
    this.scene.tweens.add({
      targets: text,
      y: text.y - 40,
      alpha: 0,
      duration: 1000,
      onComplete: () => text.destroy()
    })
    
    // Эффект частиц
    for (let i = 0; i < 12; i++) {
      const particle = this.scene.add.circle(
        enterosgel.x + Phaser.Math.Between(-15, 15),
        enterosgel.y + Phaser.Math.Between(-15, 15),
        3, 0x2196f3
      )
      particle.setDepth(100)
      this.scene.tweens.add({
        targets: particle,
        y: particle.y - 30,
        alpha: 0,
        duration: 500 + Math.random() * 300,
        onComplete: () => particle.destroy()
      })
    }
  }
}

