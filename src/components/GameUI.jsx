import React from 'react'
import './GameUI.css'

function GameUI({ collectedItems, totalItems, gameComplete, serversTransferred, totalServersToTransfer, drunkLevel, health }) {
  // Защита от отрицательных значений
  const safeHealth = Math.max(0, Math.min(3, health))
  const hearts = '❤️'.repeat(safeHealth) + '🖤'.repeat(3 - safeHealth)
  
  return (
    <div className="game-ui">
      <div className="ui-row">
        <div className="ui-item health">
          <span className="ui-hearts">{hearts}</span>
        </div>
        <div className="ui-item">
          <span className="ui-icon">💀</span>
          <span className="ui-count">{collectedItems}/{totalItems}</span>
        </div>
        <div className="ui-item transfer">
          <span className="ui-icon">📦</span>
          <span className="ui-count">{serversTransferred}/{totalServersToTransfer}</span>
        </div>
        {drunkLevel > 0 && (
          <div className="ui-item drunk">
            <span className="ui-icon">🍺</span>
            <span className="ui-count">{drunkLevel}</span>
          </div>
        )}
      </div>
            
      {gameComplete && (
        <div className="complete-overlay">
          <div className="complete-message">
            <span className="complete-icon">🏆</span>
            <span>Иди в SALO OFFICE!</span>
            <span className="complete-icon">👑</span>
          </div>
        </div>
      )}

    </div>
    
  )
}

export default GameUI
