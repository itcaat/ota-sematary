import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import './VictoryScreen.css'

function VictoryScreen({ userNickname, gameTime, isAnonymous, onRestart, isVictory = true }) {
  const [scores, setScores] = useState([])
  const [userRank, setUserRank] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchScoresAndRank()
  }, [])

  const fetchScoresAndRank = async () => {
    try {
      // Получаем все результаты
      const { data: allScores, error: topError } = await supabase
        .from('leaderboard')
        .select('*')
        .order('time', { ascending: true })

      if (topError) throw topError

      // Группируем по nickname и оставляем только лучший результат для каждого игрока
      const bestScores = {}
      
      allScores?.forEach(score => {
        const nickname = score.nickname || score.user_id
        if (!bestScores[nickname] || score.time < bestScores[nickname].time) {
          bestScores[nickname] = score
        }
      })

      // Преобразуем в массив и сортируем
      const sortedScores = Object.values(bestScores)
        .sort((a, b) => a.time - b.time)

      // Берём топ-10 для отображения
      setScores(sortedScores.slice(0, 10))

      // Если не анонимный пользователь и это победа, находим его место
      if (!isAnonymous && userNickname && isVictory) {
        // Получаем лучший результат текущего игрока
        const { data: userScores, error: userError } = await supabase
          .from('leaderboard')
          .select('time')
          .eq('nickname', userNickname)
          .order('time', { ascending: true })
          .limit(1)

        if (userError) throw userError

        const userBestTime = userScores?.[0]?.time || gameTime

        // Считаем сколько игроков имеют лучший результат
        const betterPlayersCount = sortedScores.filter(
          score => score.time < userBestTime
        ).length

        // Место = количество игроков с лучшим временем + 1
        setUserRank(betterPlayersCount + 1)
      }
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

  const getMedalEmoji = (rank) => {
    if (rank === 1) return '🥇'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    return `#${rank}`
  }

  return (
    <div className="victory-screen-overlay">
      <div className="victory-screen">
        <div className="victory-header">
          <h1 className={`victory-title ${!isVictory ? 'game-over' : ''}`}>
            {isVictory ? '🎉 ПОБЕДА! 🎉' : '💼 ТЫ ВЫГОРЕЛ 💼'}
          </h1>
          <p className="victory-subtitle">
            {isVictory 
              ? 'Ты спас принцессу и получил великолепное НИЧЕГО!' 
              : 'Не расстраивайся, попробуй ещё раз!'}
          </p>
        </div>

        {isVictory && (
          <div className="victory-stats">
            <div className="stat-item">
              <span className="stat-label">⏱️ Твоё время:</span>
              <span className="stat-value">{formatTime(gameTime)}</span>
            </div>
            
            {!isAnonymous && userRank && (
              <div className="stat-item">
                <span className="stat-label">🏆 Твоё место:</span>
                <span className="stat-value rank-badge">{getMedalEmoji(userRank)}</span>
              </div>
            )}

            {isAnonymous && (
              <div className="anonymous-note">
                <p>🎭 Анонимный режим - результат не сохранён</p>
              </div>
            )}
          </div>
        )}

        {loading ? (
          <div className="leaderboard-section">
            <h2>🏆 Рейтинг</h2>
            <p className="loading">Загрузка...</p>
          </div>
        ) : (
          <div className="leaderboard-section">
            <h2>🏆 ТОП-10 Игроков</h2>
            
            {scores.length === 0 ? (
              <p className="no-scores">Пока нет результатов</p>
            ) : (
              <div className="scores-list">
                {scores.map((score, index) => (
                  <div 
                    key={score.id} 
                    className={`score-item ${score.nickname === userNickname ? 'current-user' : ''} ${index < 3 ? `medal-${index + 1}` : ''}`}
                  >
                    <span className="rank">
                      {getMedalEmoji(index + 1)}
                    </span>
                    <span className="nickname">{score.nickname || 'Аноним'}</span>
                    <span className="time">⏱️ {formatTime(score.time)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="victory-footer">
          <button 
            className="restart-button"
            onClick={() => {
              if (onRestart) {
                onRestart()
              } else {
                window.location.reload()
              }
            }}
          >
            🔄 Играть снова
          </button>
        </div>
      </div>
    </div>
  )
}

export default VictoryScreen

