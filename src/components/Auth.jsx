import React, { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import './Auth.css'

function Auth({ onAuthSuccess, onPlayAnonymous }) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleEmailLogin = async (e) => {
    e.preventDefault()
    
    if (!email) {
      setMessage('Введите email')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      // Используем полный URL с путём для правильного редиректа
      const redirectUrl = window.location.href.split('#')[0].split('?')[0]
      
      const { error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          emailRedirectTo: redirectUrl,
        },
      })

      if (error) throw error

      setMessage('Проверьте почту! Мы отправили вам ссылку для входа.')
    } catch (error) {
      setMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    setMessage('')

    try {
      // Используем полный URL с путём для правильного редиректа
      const redirectUrl = window.location.href.split('#')[0].split('?')[0]
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
        },
      })

      if (error) throw error
    } catch (error) {
      setMessage(error.message)
      setLoading(false)
    }
  }

  const handleAnonymousPlay = () => {
    if (onPlayAnonymous) {
      onPlayAnonymous()
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>🎮 OTA-SEMATARY</h2>
        <p className="auth-description">
          Войдите, чтобы сохранить свой результат в рейтинге
        </p>
        
        {/* Google OAuth */}
        <button 
          onClick={handleGoogleLogin}
          disabled={loading}
          className="auth-button google"
        >
          <span className="button-icon">🔐</span>
          Войти через Google
        </button>

        <div className="auth-divider">
          <span>или</span>
        </div>
        
        {/* Email Login */}
        <form onSubmit={handleEmailLogin}>
          <input
            type="email"
            placeholder="Введите ваш email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            className="auth-input"
          />
          
          <button 
            type="submit" 
            disabled={loading}
            className="auth-button email"
          >
            {loading ? 'Отправка...' : '📧 Войти через Email'}
          </button>
        </form>

        <div className="auth-divider">
          <span>или</span>
        </div>

        {/* Anonymous Play */}
        <button 
          onClick={handleAnonymousPlay}
          className="auth-button anonymous"
        >
          <span className="button-icon">👤</span>
          Играть без регистрации
        </button>
        <p className="anonymous-note">
          ⚠️ Результат не будет сохранён в рейтинге
        </p>

        {message && (
          <div className={`auth-message ${message.includes('Проверьте') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  )
}

export default Auth

