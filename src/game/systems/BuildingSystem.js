export class BuildingSystem {
  constructor(scene) {
    this.scene = scene
    this.buildings = []
    this.isHiding = false
    this.currentBuilding = null
    this.officeBuilding = null
    this.officeDoor = null
    this.officeDoorText = null
    this.officeDoorCollider = null
    this.officeUnlocked = false
  }

  create() {
    const buildingConfigs = [
      { type: 'selectel', x: 200, y: 190, name: 'Датацентр Selectel', width: 200, height: 180 },
      { type: 'yandex', x: 1400, y: 190, name: 'Датацентр Yandex', width: 200, height: 180 },
      { type: 'office', x: 800, y: 1000, name: 'SALO OFFICE', width: 220, height: 200 },
      { type: 'phuketsk', x: 1200, y: 800, name: 'Пхукетск', width: 220, height: 200 },
    ]
    
    buildingConfigs.forEach(config => {
      const building = this.scene.add.sprite(config.x, config.y, `building_${config.type}`)
      building.setOrigin(0.5, 0.5)
      building.setDepth(4)
      
      const wallThickness = 15
      const hw = config.width / 2
      const hh = config.height / 2
      
      building.walls = []
      
      const topWall = this.scene.add.rectangle(config.x, config.y - hh + wallThickness/2, config.width, wallThickness, 0x000000, 0)
      this.scene.physics.add.existing(topWall, true)
      building.walls.push(topWall)
      
      const leftWall = this.scene.add.rectangle(config.x - hw + wallThickness/2, config.y, wallThickness, config.height, 0x000000, 0)
      this.scene.physics.add.existing(leftWall, true)
      building.walls.push(leftWall)
      
      const rightWall = this.scene.add.rectangle(config.x + hw - wallThickness/2, config.y, wallThickness, config.height, 0x000000, 0)
      this.scene.physics.add.existing(rightWall, true)
      building.walls.push(rightWall)
      
      const doorWidth = 40
      const bottomLeftWall = this.scene.add.rectangle(
        config.x - hw/2 - doorWidth/4, 
        config.y + hh - wallThickness/2, 
        hw - doorWidth/2, 
        wallThickness, 
        0x000000, 0
      )
      this.scene.physics.add.existing(bottomLeftWall, true)
      building.walls.push(bottomLeftWall)
      
      const bottomRightWall = this.scene.add.rectangle(
        config.x + hw/2 + doorWidth/4, 
        config.y + hh - wallThickness/2, 
        hw - doorWidth/2, 
        wallThickness, 
        0x000000, 0
      )
      this.scene.physics.add.existing(bottomRightWall, true)
      building.walls.push(bottomRightWall)
      
      const zone = this.scene.add.zone(config.x, config.y + hh, 60, 30)
      this.scene.physics.world.enable(zone)
      zone.body.setAllowGravity(false)
      zone.body.setImmovable(true)
      
      const hint = this.scene.add.text(config.x, config.y - hh - 25, `🏢 ${config.name}\n↓ ВХОД`, {
        fontFamily: 'monospace',
        fontSize: '12px',
        fill: '#00ff00',
        stroke: '#000000',
        strokeThickness: 3,
        align: 'center',
        shadow: { offsetX: 2, offsetY: 2, color: '#000', blur: 0, fill: true }
      }).setOrigin(0.5).setDepth(100).setAlpha(0)
      
      building.zone = zone
      building.hint = hint
      building.buildingName = config.name
      building.buildingType = config.type
      building.buildingWidth = config.width
      building.buildingHeight = config.height
      
      this.buildings.push(building)
    })
    
    this.hidingText = this.scene.add.text(400, 550, '', {
      fontFamily: 'monospace',
      fontSize: '16px',
      fill: '#00ff00',
      stroke: '#000000',
      strokeThickness: 3,
      shadow: { offsetX: 2, offsetY: 2, color: '#000', blur: 0, fill: true }
    }).setOrigin(0.5).setScrollFactor(0).setDepth(1000).setAlpha(0)
    
    this.lockOffice()
    this.createMedkits()
  }

  lockOffice() {
    this.officeBuilding = this.buildings.find(b => b.buildingType === 'office')
    if (!this.officeBuilding) return
    
    this.officeDoor = this.scene.add.rectangle(
      this.officeBuilding.x, 
      this.officeBuilding.y + this.officeBuilding.buildingHeight/2 - 7,
      50, 14, 0x8b0000
    )
    this.officeDoor.setDepth(5)
    this.scene.physics.add.existing(this.officeDoor, true)
    
    this.officeDoorText = this.scene.add.text(
      this.officeBuilding.x,
      this.officeBuilding.y + this.officeBuilding.buildingHeight/2 - 7,
      '🔒 ЗАКРЫТО',
      {
        fontFamily: 'monospace',
        fontSize: '10px',
        fill: '#ffffff',
        stroke: '#000000',
        strokeThickness: 2
      }
    ).setOrigin(0.5).setDepth(6)
  }

  unlockOffice() {
    if (!this.officeBuilding || !this.officeDoor) return
    
    this.officeDoor.destroy()
    this.officeDoorText.destroy()
    
    if (this.officeDoorCollider) {
      this.officeDoorCollider.destroy()
    }
    
    this.scene.cameras.main.flash(500, 0, 255, 0)
    
    const unlockText = this.scene.add.text(400, 300, '🔓 ОФИС ОТКРЫТ!\n👸 Принцесса ждёт тебя!', {
      fontFamily: 'monospace',
      fontSize: '20px',
      fill: '#00ff00',
      stroke: '#000000',
      strokeThickness: 4,
      align: 'center'
    }).setOrigin(0.5).setScrollFactor(0).setDepth(1000)
    
    this.scene.tweens.add({
      targets: unlockText,
      scale: 1.2,
      alpha: 0,
      duration: 3000,
      onComplete: () => unlockText.destroy()
    })
    
    this.officeUnlocked = true
  }

  createMedkits() {
    this.medkits = this.scene.physics.add.group()
    
    const datacenters = this.buildings.filter(b => b.buildingType === 'selectel' || b.buildingType === 'yandex')
    datacenters.forEach(dc => {
      const medkit = this.medkits.create(dc.x + 60, dc.y + 40, 'medkit')
      medkit.setDepth(5)
      medkit.body.setAllowGravity(false)
      
      this.scene.tweens.add({
        targets: medkit,
        alpha: 0.6,
        duration: 500,
        yoyo: true,
        repeat: -1
      })
    })
  }

  checkOverlap(player) {
    let insideBuilding = null
    
    for (const building of this.buildings) {
      const hw = building.buildingWidth / 2 - 15
      const hh = building.buildingHeight / 2 - 15
      
      if (player.x > building.x - hw && 
          player.x < building.x + hw &&
          player.y > building.y - hh && 
          player.y < building.y + hh) {
        insideBuilding = building
        break
      }
    }
    
    if (insideBuilding && !this.isHiding) {
      this.isHiding = true
      this.currentBuilding = insideBuilding
      insideBuilding.setAlpha(0.5)
      this.hidingText.setText(`🏢 В УКРЫТИИ: ${insideBuilding.buildingName}`)
      this.hidingText.setAlpha(1)
      this.scene.sound.playServerDeath()
    } else if (!insideBuilding && this.isHiding) {
      if (this.currentBuilding) {
        this.currentBuilding.setAlpha(1)
      }
      this.isHiding = false
      this.currentBuilding = null
      this.hidingText.setAlpha(0)
    }
  }

  update() {
    this.buildings.forEach(building => {
      const doorY = building.y + building.buildingHeight/2
      const dist = Phaser.Math.Distance.Between(
        this.scene.player.x, this.scene.player.y,
        building.x, doorY
      )
      
      if (dist < 100 && !this.isHiding) {
        building.hint.setAlpha(1)
        building.hint.setScale(1 + Math.sin(this.scene.time.now / 200) * 0.05)
      } else {
        building.hint.setAlpha(0)
      }
    })
  }
}

