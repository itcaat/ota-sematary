import React from 'react'
import './GameUI.css'

function GameUI({ collectedItems, totalItems, gameComplete }) {
  const progress = (collectedItems / totalItems) * 100

  return (
    <div className="game-ui">
      <div className="ui-panel">
        <div className="ui-header">
          <span className="skull-icon">💀</span>
          <span className="ui-title">Разрушено</span>
        </div>
        <div className="progress-container">
          <div 
            className="progress-bar" 
            style={{ width: `${progress}%` }}
          />
          <span className="progress-text">
            {collectedItems} / {totalItems}
          </span>
        </div>
      </div>
      
      {gameComplete && (
        <div className="complete-overlay">
          <div className="complete-message">
            <span className="complete-icon">🏆</span>
            <span>Иди к принцессе!</span>
            <span className="complete-icon">👑</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default GameUI
