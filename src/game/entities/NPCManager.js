import { BaseNPC } from './BaseNPC'
import { zombieConfig, zubkovConfig, zombieGirlConfig, friendlyNPCConfigs } from './NPCConfigs'

/**
 * Менеджер всех NPC в игре
 * Управляет созданием и обновлением зомби, Zubkov, девочки и дружественных NPC
 */
export class NPCManager {
  constructor(scene) {
    this.scene = scene
    this.zombies = []
    this.zubkov = null
    this.zombieGirl = null
    this.friendlyNPCs = []
    this.crutches = null
  }

  create() {
    this.createZombies()
    this.createZubkov()
    this.createZombieGirl()
    this.createFriendlyNPCs()
    this.createCrutches()
  }

  createZombies() {
    const zombieGroup = this.scene.physics.add.group()
    
    const positions = [
      { x: 600, y: 300, patrolX: [500, 700] },
      { x: 900, y: 500, patrolY: [400, 600] },
      { x: 400, y: 800, patrolX: [300, 500] },
      { x: 1000, y: 300, patrolY: [200, 400] },
      { x: 1200, y: 800, patrolX: [1100, 1300] },
      { x: 500, y: 1000, patrolY: [900, 1100] },
    ]
    
    positions.forEach(pos => {
      const config = {
        ...zombieConfig,
        ai: {
          ...zombieConfig.ai,
          patrolX: pos.patrolX || null,
          patrolY: pos.patrolY || null,
          homeX: pos.x,
          homeY: pos.y
        }
      }
      
      const zombie = new BaseNPC(this.scene, config)
      const sprite = zombie.create(pos.x, pos.y)
      
      // Добавляем в группу для физики
      zombieGroup.add(sprite)
      
      this.zombies.push(zombie)
    })
    
    return zombieGroup
  }

  createZubkov() {
    this.zubkov = new BaseNPC(this.scene, zubkovConfig)
    const sprite = this.zubkov.create(800, 600)
    return sprite
  }

  createZombieGirl() {
    this.zombieGirl = new BaseNPC(this.scene, zombieGirlConfig)
    const sprite = this.zombieGirl.create(600, 400)
    return sprite
  }

  createFriendlyNPCs() {
    const positions = [
      { name: 'karpov', x: 150, y: 320 },
      { name: 'rukavkov', x: 550, y: 550 },
      { name: 'mazalov', x: 950, y: 350 },
      { name: 'sergeev', x: 1300, y: 600 },
      { name: 'sindov', x: 750, y: 1000 },
      { name: 'kozlov', x: 1150, y: 760 },
      { name: 'pogozhiy', x: 1250, y: 760 },
    ]
    
    positions.forEach(pos => {
      const config = friendlyNPCConfigs[pos.name]
      const npc = new BaseNPC(this.scene, config)
      npc.create(pos.x, pos.y)
      this.friendlyNPCs.push(npc)
    })
  }

  createCrutches() {
    this.crutches = this.scene.physics.add.group()
    return this.crutches
  }

  throwCrutch() {
    if (this.scene.gameComplete || !this.zombies.length) return
    
    // Находим активных зомби рядом с игроком
    const activeZombies = this.zombies.filter(z => {
      if (!z.sprite || !z.sprite.active || !z.sprite.npcData) return false
      const dist = Phaser.Math.Distance.Between(
        z.sprite.x, z.sprite.y, 
        this.scene.player.x, this.scene.player.y
      )
      return dist < 300 && dist > 80 && !this.scene.isHiding
    })
    
    if (activeZombies.length === 0) return
    if (Math.random() > 0.4) return
    
    const zombie = Phaser.Math.RND.pick(activeZombies)
    const crutch = this.crutches.create(zombie.sprite.x, zombie.sprite.y, 'crutch')
    crutch.setDepth(15)
    crutch.body.setAllowGravity(false)
    
    const angle = Phaser.Math.Angle.Between(
      zombie.sprite.x, zombie.sprite.y, 
      this.scene.player.x, this.scene.player.y
    )
    const speed = 180
    crutch.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed)
    
    this.scene.tweens.add({
      targets: crutch,
      angle: 720,
      duration: 1000,
      ease: 'Linear'
    })
    
    zombie.sprite.setTint(0xffaa00)
    this.scene.time.delayedCall(200, () => {
      if (zombie.sprite.active) zombie.sprite.clearTint()
    })
    
    this.scene.sound.playAlert()
    
    this.scene.time.delayedCall(3000, () => {
      if (crutch.active) crutch.destroy()
    })
  }

  update() {
    // Обновляем всех зомби
    this.zombies.forEach(zombie => zombie.update())
    
    // Обновляем Zubkov
    if (this.zubkov) {
      this.zubkov.update()
    }
    
    // Обновляем девочку
    if (this.zombieGirl) {
      this.zombieGirl.update()
    }
    
    // Обновляем дружественных NPC
    this.friendlyNPCs.forEach(npc => npc.update())
  }

  // Получить группу зомби для коллизий
  getZombieGroup() {
    const group = this.scene.physics.add.group()
    this.zombies.forEach(z => {
      if (z.sprite) group.add(z.sprite)
    })
    return group
  }

  // Получить спрайт Zubkov для коллизий
  getZubkovSprite() {
    return this.zubkov ? this.zubkov.sprite : null
  }

  // Получить спрайт девочки для коллизий
  getZombieGirlSprite() {
    return this.zombieGirl ? this.zombieGirl.sprite : null
  }

  // Получить группу костылей для коллизий
  getCrutchGroup() {
    return this.crutches
  }

  destroy() {
    this.zombies.forEach(z => z.destroy())
    if (this.zubkov) this.zubkov.destroy()
    if (this.zombieGirl) this.zombieGirl.destroy()
    this.friendlyNPCs.forEach(npc => npc.destroy())
    this.zombies = []
    this.friendlyNPCs = []
  }
}

