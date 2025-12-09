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
          OTA: Миграция
          <span className="icon">💀</span>
        </h2>
        
        <div className="tasks">
          <h3>📋 ЗАДАНИЯ:</h3>
          <div className="task">1️⃣ Перенеси 6 серверов из <span className="highlight-green">SELECTEL</span> в <span className="highlight-yellow">YANDEX</span></div>
          <div className="task">2️⃣ Уничтожь все серверы на улице (16 шт)</div>
          <div className="task">3️⃣ Зайди в <span className="highlight-blue">SALO OFFICE</span></div>
        </div>

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
        
        <div className="tips">
          <p>🧟 Избегай зомби и narine!</p>
          <p>🏢 Прячься в датацентрах</p>
          <p>🏥 Аптечки восстанавливают жизни</p>
          <p>🍺 Пиво замедляет!</p>
        </div>
        
        <button className="start-btn" onClick={() => setVisible(false)}>
          НАЧАТЬ МИГРАЦИЮ
        </button>
      </div>
    </div>
  )
}

export default Instructions
