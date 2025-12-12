export class CollisionSystem {
  constructor(scene) {
    this.scene = scene
  }

  setupCollisions() {
    const { player } = this.scene
    const { walls } = this.scene.mapSystem
    const { buildings, medkits, officeDoor } = this.scene.buildingSystem
    const { zombies, crutches } = this.scene.zombieManager
    const { sprite: zubkov } = this.scene.zubkovEntity
    const { sprite: zombieGirl } = this.scene.zombieGirlEntity
    const { servers } = this.scene.graveyardSystem
    const { beers } = this.scene.beerSystem
    const { transferServers } = this.scene.serverTransferSystem
    const { princess } = this.scene.princessSystem
    
    // Игрок со стенами
    this.scene.physics.add.collider(player, walls)
    
    // Игрок со стенами зданий
    buildings.forEach(building => {
      building.walls.forEach(wall => {
        this.scene.physics.add.collider(player, wall)
      })
    })
    
    // Игрок с закрытой дверью офиса
    if (officeDoor) {
      this.scene.buildingSystem.officeDoorCollider = this.scene.physics.add.collider(player, officeDoor)
    }
    
    // Игрок с серверами для переноса
    if (transferServers) {
      this.scene.physics.add.overlap(player, transferServers, 
        (p, s) => this.scene.serverTransferSystem.pickupServer(p, s), null, this.scene)
    }
    
    // Игрок с аптечками
    if (medkits) {
      this.scene.physics.add.overlap(player, medkits, this.collectMedkit, null, this)
    }
    
    // Зомби со стенами
    this.scene.physics.add.collider(zombies, walls)
    buildings.forEach(building => {
      building.walls.forEach(wall => {
        this.scene.physics.add.collider(zombies, wall)
        this.scene.physics.add.collider(zubkov, wall)
        this.scene.physics.add.collider(zombieGirl, wall)
      })
    })
    
    // Zubkov со стенами
    this.scene.physics.add.collider(zubkov, walls)
    
    // ZombieGirl со стенами
    this.scene.physics.add.collider(zombieGirl, walls)
    
    // Коллизии с врагами
    this.scene.physics.add.overlap(player, zombies, this.zombieHitPlayer, null, this)
    this.scene.physics.add.overlap(player, crutches, this.crutchHitPlayer, null, this)
    this.scene.physics.add.overlap(player, zubkov, this.zubkovHitPlayer, null, this)
    this.scene.physics.add.overlap(player, zombieGirl, this.zombieGirlHitPlayer, null, this)
    
    // Коллизии с предметами
    this.scene.physics.add.overlap(player, servers, 
      (p, s) => this.scene.graveyardSystem.killServer(p, s), null, this.scene)
    this.scene.physics.add.overlap(player, beers, 
      (p, b) => this.scene.beerSystem.drinkBeer(p, b), null, this.scene)
    this.scene.physics.add.overlap(player, princess, 
      (p, pr) => this.scene.princessSystem.reach(p, pr), null, this.scene)
  }

  collectMedkit(player, medkit) {
    if (this.scene.playerEntity.health >= 3) return
    
    this.scene.tweens.add({
      targets: medkit,
      scale: 1.5,
      alpha: 0,
      duration: 200,
      onComplete: () => medkit.destroy()
    })
    
    this.scene.playerEntity.health = Math.min(3, this.scene.playerEntity.health + 1)
    this.scene.playerEntity.updateHealthUI()
    
    player.setTint(0x00ff00)
    this.scene.time.delayedCall(300, () => {
      player.clearTint()
    })
    
    for (let i = 0; i < 10; i++) {
      const particle = this.scene.add.circle(
        medkit.x + Phaser.Math.Between(-20, 20),
        medkit.y + Phaser.Math.Between(-20, 20),
        4, 0x00ff00
      )
      particle.setDepth(100)
      this.scene.tweens.add({
        targets: particle,
        y: particle.y - 30,
        alpha: 0,
        duration: 500,
        onComplete: () => particle.destroy()
      })
    }
    
    this.scene.sound.playHeal()
    
    const healText = this.scene.add.text(player.x, player.y - 30, '+1 ❤️', {
      fontFamily: 'monospace',
      fontSize: '14px',
      fill: '#00ff00',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0.5).setDepth(100)
    
    this.scene.tweens.add({
      targets: healText,
      y: healText.y - 30,
      alpha: 0,
      duration: 1000,
      onComplete: () => healText.destroy()
    })
  }

  zombieHitPlayer(player, zombie) {
    if (this.scene.playerEntity.isInvulnerable || this.scene.gameComplete) return
    
    const isDead = this.scene.playerEntity.takeDamage(1)
    
    const angle = Phaser.Math.Angle.Between(zombie.x, zombie.y, player.x, player.y)
    player.setVelocity(Math.cos(angle) * 300, Math.sin(angle) * 300)
    
    this.scene.playerEntity.setInvulnerable(1000)
    
    this.scene.tweens.add({
      targets: player,
      alpha: 0.3,
      duration: 100,
      yoyo: true,
      repeat: 5,
      onComplete: () => {
        player.alpha = 1
      }
    })
    
    this.scene.sound.playHurt()
    this.scene.cameras.main.shake(200, 0.01)
    
    if (isDead) {
      this.scene.gameOver()
    }
  }

  crutchHitPlayer(player, crutch) {
    if (this.scene.playerEntity.isInvulnerable || this.scene.gameComplete || this.scene.buildingSystem.isHiding) return
    
    crutch.destroy()
    
    const isDead = this.scene.playerEntity.takeDamage(1)
    
    this.scene.cameras.main.shake(150, 0.01)
    player.setTint(0xffaa00)
    
    this.scene.time.delayedCall(200, () => {
      if (player.active) player.clearTint()
    })
    
    const damageText = this.scene.add.text(player.x, player.y - 30, '🦴 -1 ❤️', {
      fontFamily: 'monospace',
      fontSize: '12px',
      fill: '#ff6600',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0.5).setDepth(100)
    
    this.scene.tweens.add({
      targets: damageText,
      y: damageText.y - 30,
      alpha: 0,
      duration: 800,
      onComplete: () => damageText.destroy()
    })
    
    this.scene.playerEntity.setInvulnerable(800)
    
    if (isDead) {
      this.scene.gameOver()
    }
  }

  zubkovHitPlayer(player, zubkov) {
    if (this.scene.playerEntity.isInvulnerable || this.scene.gameComplete) return
    
    const isDead = this.scene.playerEntity.takeDamage(2)
    
    const angle = Phaser.Math.Angle.Between(zubkov.x, zubkov.y, player.x, player.y)
    player.setVelocity(Math.cos(angle) * 400, Math.sin(angle) * 400)
    
    this.scene.playerEntity.setInvulnerable(1000)
    
    this.scene.tweens.add({
      targets: player,
      alpha: 0.3,
      duration: 100,
      yoyo: true,
      repeat: 7,
      onComplete: () => {
        player.alpha = 1
      }
    })
    
    this.scene.cameras.main.shake(300, 0.02)
    this.scene.sound.playZubkov()
    
    const shout = this.scene.add.text(zubkov.x, zubkov.y - 50, '💀 УВОЛЕН!', {
      fontSize: '16px',
      fontFamily: 'monospace',
      fill: '#ff0000',
      stroke: '#000',
      strokeThickness: 2
    }).setOrigin(0.5).setDepth(200)
    
    this.scene.tweens.add({
      targets: shout,
      y: shout.y - 30,
      alpha: 0,
      duration: 1500,
      onComplete: () => shout.destroy()
    })
    
    if (isDead) {
      this.scene.gameOver()
    }
  }

  zombieGirlHitPlayer(player, zombieGirl) {
    if (this.scene.playerEntity.isInvulnerable || this.scene.gameComplete || this.scene.buildingSystem.isHiding) return
    if (!zombieGirl.girlData) return
    
    const damage = zombieGirl.girlData.damage
    const isDead = this.scene.playerEntity.takeDamage(damage)
    
    this.scene.cameras.main.shake(100, 0.005)
    player.setTint(0xff69b4)
    
    this.scene.time.delayedCall(200, () => {
      if (player.active) player.clearTint()
    })
    
    this.scene.sound.playAlert()
    this.scene.playerEntity.setInvulnerable(1000)
    
    if (isDead) {
      this.scene.gameOver()
    }
  }
}

