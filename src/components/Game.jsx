import React, { useEffect, useRef } from 'react'
import Phaser from 'phaser'
import BootScene from '../game/scenes/BootScene'
import MainScene from '../game/scenes/MainScene'
import './Game.css'

const Game = ({ onItemCollected, onGameComplete, onServerTransferred, onDrunkChange, onHealthChange, onTimeUpdate, totalItems }) => {
  const gameRef = useRef(null)
  const phaserGameRef = useRef(null)

  useEffect(() => {
    if (!gameRef.current || phaserGameRef.current) return

    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: gameRef.current,
      pixelArt: true,
      antialias: false,
      roundPixels: true,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0 },  // Нет гравитации для top-down
          debug: false
        }
      },
      scene: [BootScene, MainScene],
      scale: {
        mode: Phaser.Scale.NONE,
        autoCenter: Phaser.Scale.NO_CENTER
      }
    }

    phaserGameRef.current = new Phaser.Game(config)

    // Передаем callbacks в сцену
    phaserGameRef.current.events.on('ready', () => {
      const mainScene = phaserGameRef.current.scene.getScene('MainScene')
      if (mainScene) {
        mainScene.events.on('create', () => {
          mainScene.onItemCollected = onItemCollected
          mainScene.onGameComplete = onGameComplete
          mainScene.onServerTransferred = onServerTransferred
          mainScene.onDrunkChange = onDrunkChange
          mainScene.onHealthChange = onHealthChange
          mainScene.onTimeUpdate = onTimeUpdate
        })
      }
    })

    // Запускаем MainScene с данными
    phaserGameRef.current.events.once('ready', () => {
      phaserGameRef.current.scene.start('MainScene', {
        onItemCollected,
        onGameComplete,
        onServerTransferred,
        onDrunkChange,
        onHealthChange,
        onTimeUpdate,
        totalItems
      })
    })

    return () => {
      if (phaserGameRef.current) {
        phaserGameRef.current.destroy(true)
        phaserGameRef.current = null
      }
    }
  }, [])

  return <div ref={gameRef} className="game-container" />
}

export default Game
