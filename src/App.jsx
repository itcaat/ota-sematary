import React, { useState } from 'react'
import Game from './components/Game'
import Instructions from './components/Instructions'
import GameUI from './components/GameUI'
import './App.css'

function App() {
  const [gameState, setGameState] = useState({
    collectedItems: 0,
    totalItems: 16,
    gameComplete: false
  })

  return (
    <div className="app">
      <div className="game-wrapper">
        <Instructions />
        <GameUI 
          collectedItems={gameState.collectedItems}
          totalItems={gameState.totalItems}
          gameComplete={gameState.gameComplete}
        />
        <Game 
          onItemCollected={(count) => setGameState(prev => ({ ...prev, collectedItems: count }))}
          onGameComplete={() => setGameState(prev => ({ ...prev, gameComplete: true }))}
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
