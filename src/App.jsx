import React, { useState } from 'react'
import Game from './components/Game'
import Instructions from './components/Instructions'
import GameUI from './components/GameUI'
import './App.css'

function App() {
  const [gameState, setGameState] = useState({
    collectedItems: 0,
    totalItems: 16,
    gameComplete: false,
    serversTransferred: 0,
    totalServersToTransfer: 6,
    drunkLevel: 0,
    health: 3
  })

  return (
    <div className="app">
      <div className="game-wrapper">
        <Instructions />
        <GameUI 
          collectedItems={gameState.collectedItems}
          totalItems={gameState.totalItems}
          gameComplete={gameState.gameComplete}
          serversTransferred={gameState.serversTransferred}
          totalServersToTransfer={gameState.totalServersToTransfer}
          drunkLevel={gameState.drunkLevel}
          health={gameState.health}
        />
        <Game 
          onItemCollected={(count) => setGameState(prev => ({ ...prev, collectedItems: count }))}
          onGameComplete={() => setGameState(prev => ({ ...prev, gameComplete: true }))}
          onServerTransferred={(count) => setGameState(prev => ({ ...prev, serversTransferred: count }))}
          onDrunkChange={(level) => setGameState(prev => ({ ...prev, drunkLevel: level }))}
          onHealthChange={(hp) => setGameState(prev => ({ ...prev, health: hp }))}
          totalItems={gameState.totalItems}
        />
      </div>
      <footer className="footer">
        <span>🎮 SALO Platformer</span>
        <span>•</span>
        <span>Разработано с ❤️ и Phaser 3</span>
      </footer>
    </div>
  )
}

export default App
