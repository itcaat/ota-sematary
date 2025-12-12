import React, { useState, useEffect } from 'react'
import Game from './components/Game'
import Instructions from './components/Instructions'
import GameUI from './components/GameUI'
import Auth from './components/Auth'
import Leaderboard from './components/Leaderboard'
import { supabase } from './lib/supabaseClient'
import './App.css'

function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [gameStarted, setGameStarted] = useState(false)
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [showLeaderboardInGame, setShowLeaderboardInGame] = useState(false)
  const [gameState, setGameState] = useState({
    collectedItems: 0,
    totalItems: 16,
    gameComplete: false,
    serversTransferred: 0,
    totalServersToTransfer: 6,
    drunkLevel: 0,
    health: 3,
    gameTime: 0,
    mineCount: 3
  })

  useEffect(() => {
    // Проверяем текущую сессию
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    // Подписываемся на изменения аутентификации
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    // Сохраняем результат в Supabase при завершении игры (только для авторизованных)
    if (gameState.gameComplete && session && !isAnonymous) {
      saveScore()
    }
  }, [gameState.gameComplete])

  const saveScore = async () => {
    if (!session?.user?.email) return

    try {
      const { error } = await supabase
        .from('leaderboard')
        .insert([
          {
            email: session.user.email,
            time: gameState.gameTime,
            created_at: new Date().toISOString()
          }
        ])

      if (error) throw error

      console.log('Score saved successfully!')
    } catch (error) {
      console.error('Error saving score:', error)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setGameStarted(false)
    setIsAnonymous(false)
    setShowLeaderboard(false)
    setShowLeaderboardInGame(false)
    setGameState({
      collectedItems: 0,
      totalItems: 16,
      gameComplete: false,
      serversTransferred: 0,
      totalServersToTransfer: 6,
      drunkLevel: 0,
      health: 3,
      gameTime: 0,
      mineCount: 3
    })
  }

  const handlePlayAnonymous = () => {
    setIsAnonymous(true)
    setGameStarted(true)
  }

  if (loading) {
    return (
      <div className="app">
        <div className="loading-screen">
          <p>Загрузка...</p>
        </div>
      </div>
    )
  }

  // Если не залогинен и не анонимный режим - показываем экран входа
  if (!session && !isAnonymous) {
    return (
      <div className="app">
        <Auth 
          onAuthSuccess={() => {}} 
          onPlayAnonymous={handlePlayAnonymous}
        />
        <footer className="footer">
          <span>🎮 SALO Platformer</span>
          <span>•</span>
          <span>Разработано с ❤️ и Phaser 3</span>
        </footer>
      </div>
    )
  }

  // Если залогинен (или анонимный) но игра не начата - показываем инструкции
  if (!gameStarted) {
    return (
      <div className="app">
        <Instructions 
          onStartGame={() => setGameStarted(true)}
          onShowLeaderboard={() => setShowLeaderboard(!showLeaderboard)}
          onSignOut={handleSignOut}
          userEmail={session?.user?.email}
          isAnonymous={isAnonymous}
          showLeaderboard={showLeaderboard}
        />
        
        {showLeaderboard && !isAnonymous && (
          <>
            <div className="overlay-backdrop" onClick={() => setShowLeaderboard(false)} />
            <div className="leaderboard-overlay">
              <button className="close-overlay" onClick={() => setShowLeaderboard(false)}>
                ✕
              </button>
              <Leaderboard currentUserEmail={session.user.email} />
            </div>
          </>
        )}
        
        <footer className="footer">
          <span>🎮 OTA-SEMATARY</span>
          <span>•</span>
          <span>Разработано с ❤️ и Phaser 3</span>
        </footer>
      </div>
    )
  }

  // Если игра началась - показываем игру
  return (
    <div className="app">
      <div className="game-wrapper">
        <GameUI 
          collectedItems={gameState.collectedItems}
          totalItems={gameState.totalItems}
          gameComplete={gameState.gameComplete}
          serversTransferred={gameState.serversTransferred}
          totalServersToTransfer={gameState.totalServersToTransfer}
          drunkLevel={gameState.drunkLevel}
          health={gameState.health}
          gameTime={gameState.gameTime}
          mineCount={gameState.mineCount}
        />
        <Game 
          onItemCollected={(count) => setGameState(prev => ({ ...prev, collectedItems: count }))}
          onGameComplete={() => setGameState(prev => ({ ...prev, gameComplete: true }))}
          onServerTransferred={(count) => setGameState(prev => ({ ...prev, serversTransferred: count }))}
          onDrunkChange={(level) => setGameState(prev => ({ ...prev, drunkLevel: level }))}
          onHealthChange={(hp) => setGameState(prev => ({ ...prev, health: hp }))}
          onTimeUpdate={(time) => setGameState(prev => ({ ...prev, gameTime: time }))}
          onMineCountChange={(count) => setGameState(prev => ({ ...prev, mineCount: count }))}
          totalItems={gameState.totalItems}
          isPaused={showLeaderboardInGame}
        />
        
        {/* Кнопка рейтинга во время игры */}
        {!isAnonymous && (
          <button 
            className="leaderboard-game-button" 
            onClick={() => setShowLeaderboardInGame(true)} 
            title="Показать рейтинг"
          >
            🏆 Рейтинг
          </button>
        )}
        
        {/* Кнопка выхода во время игры */}
        <button className="exit-game-button" onClick={handleSignOut} title="Выйти из игры">
          🚪 Выйти
        </button>
        
        {/* Рейтинг во время игры */}
        {showLeaderboardInGame && !isAnonymous && (
          <>
            <div className="overlay-backdrop" onClick={() => setShowLeaderboardInGame(false)} />
            <div className="leaderboard-overlay in-game">
              <button className="close-overlay" onClick={() => setShowLeaderboardInGame(false)}>
                ✕
              </button>
              <Leaderboard currentUserEmail={session?.user?.email} />
            </div>
          </>
        )}
      </div>
      <footer className="footer">
        <span>🎮 OTA-SEMATARY</span>
        <span>•</span>
        <span>Разработано с ❤️ и Phaser 3</span>
      </footer>
    </div>
  )
}

export default App
