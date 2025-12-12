import { PlayerSprites } from './PlayerSprites'
import { ZombieSprites } from './ZombieSprites'
import { NPCSprites } from './NPCSprites'
import { BuildingSprites } from './BuildingSprites'
import { ItemSprites } from './ItemSprites'
import { TileSprites } from './TileSprites'

export class SpriteGenerator {
  constructor(scene) {
    this.scene = scene
    this.playerSprites = new PlayerSprites(scene)
    this.zombieSprites = new ZombieSprites(scene)
    this.npcSprites = new NPCSprites(scene)
    this.buildingSprites = new BuildingSprites(scene)
    this.itemSprites = new ItemSprites(scene)
    this.tileSprites = new TileSprites(scene)
  }

  generateAll() {
    this.playerSprites.generate()
    this.zombieSprites.generate()
    this.npcSprites.generate()
    this.buildingSprites.generate()
    this.itemSprites.generate()
    this.tileSprites.generate()
  }
}

