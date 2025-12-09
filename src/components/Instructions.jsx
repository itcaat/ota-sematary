import React, { useState, useEffect } from 'react'
import './Instructions.css'

function Instructions() {
  const [visible, setVisible] = useState(true)
  
  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 10000)
    return () => clearTimeout(timer)
  }, [])

  if (!visible) return null

  return (
    <div className="instructions">
      <div className="instructions-content">
        <h2>
          <span className="icon">💀</span>
          OTA: Кладбищенские Приключения
          <span className="icon">💀</span>
        </h2>
        <div className="controls">
          <div className="control-group">
            <span className="key">↑</span>
            <span className="key">↓</span>
            <span className="key">←</span>
            <span className="key">→</span>
          </div>
          <div className="control-group">
            <span className="label">или</span>
            <span className="key">W</span>
            <span className="key">A</span>
            <span className="key">S</span>
            <span className="key">D</span>
          </div>
        </div>
        <p className="mission">Исследуй кладбище, избегай зомби 🧟, разбей серверы и найди принцессу! Прячься в зданиях 🏢</p>
        <button className="start-btn" onClick={() => setVisible(false)}>
          НАЧАТЬ ИГРУ
        </button>
      </div>
    </div>
  )
}

export default Instructions
