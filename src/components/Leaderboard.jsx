import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import './Leaderboard.css'

function Leaderboard({ currentUserNickname }) {
  const [scores, setScores] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchScores()
  }, [])

  const fetchScores = async () => {
    try {
      // Получаем все результаты
      const { data, error } = await supabase
        .from('leaderboard')
        .select('*')
        .order('time', { ascending: true })

      if (error) throw error

      // Группируем по nickname и оставляем только лучший результат для каждого игрока
      const bestScores = {}
      
      data?.forEach(score => {
        const nickname = score.nickname || score.user_id
        if (!bestScores[nickname] || score.time < bestScores[nickname].time) {
          bestScores[nickname] = score
        }
      })

      // Преобразуем в массив, сортируем и берём топ-10
      const topScores = Object.values(bestScores)
        .sort((a, b) => a.time - b.time)
        .slice(0, 10)

      setScores(topScores)
    } catch (error) {
      console.error('Error fetching scores:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  if (loading) {
    return (
      <div className="leaderboard-container">
        <div className="leaderboard-box">
          <h2>🏆 Рейтинг</h2>
          <p className="loading">Загрузка...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="leaderboard-container">
      <div className="leaderboard-box">
        <h2>🏆 ТОП-10 Игроков</h2>
        
        {scores.length === 0 ? (
          <p className="no-scores">Пока нет результатов. Будь первым!</p>
        ) : (
          <div className="scores-list">
            {scores.map((score, index) => (
              <div 
                key={score.id} 
                className={`score-item ${score.nickname === currentUserNickname ? 'current-user' : ''} ${index < 3 ? `medal-${index + 1}` : ''}`}
              >
                <span className="rank">
                  {index === 0 && '🥇'}
                  {index === 1 && '🥈'}
                  {index === 2 && '🥉'}
                  {index > 2 && `#${index + 1}`}
                </span>
                <span className="nickname">{score.nickname || 'Аноним'}</span>
                <span className="time">⏱️ {formatTime(score.time)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Leaderboard

