import React, { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import './SetNickname.css'

function SetNickname({ userId, userEmail, onNicknameSet }) {
  const [nickname, setNickname] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!nickname || nickname.trim().length < 3) {
      setError('Ник должен быть минимум 3 символа')
      return
    }

    if (nickname.length > 20) {
      setError('Ник не должен быть длиннее 20 символов')
      return
    }

    // Проверка на валидные символы (буквы, цифры, дефис, подчёркивание, пробелы)
    if (!/^[a-zA-Zа-яА-Я0-9_\-\s]+$/.test(nickname.trim())) {
      setError('Ник может содержать только буквы, цифры, дефис, подчёркивание и пробелы')
      return
    }

    // Проверка на пробелы в начале/конце (уже обработаны через trim)
    // Проверка на множественные пробелы подряд
    if (/\s{2,}/.test(nickname)) {
      setError('Ник не может содержать несколько пробелов подряд')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Проверяем, существует ли уже такой ник
      const { data: existingNick, error: checkError } = await supabase
        .from('profiles')
        .select('nickname')
        .eq('nickname', nickname.trim())
        .single()

      if (checkError && checkError.code !== 'PGRST116') {
        // PGRST116 = not found, это нормально
        throw checkError
      }

      if (existingNick) {
        setError('❌ Этот ник уже занят! Выберите другой.')
        setLoading(false)
        return
      }

      // Сохраняем ник
      const { error: insertError } = await supabase
        .from('profiles')
        .insert([
          {
            user_id: userId,
            email: userEmail,
            nickname: nickname.trim(),
            created_at: new Date().toISOString()
          }
        ])

      if (insertError) throw insertError

      // Успешно установлен ник
      if (onNicknameSet) {
        onNicknameSet(nickname.trim())
      }
    } catch (err) {
      console.error('Error setting nickname:', err)
      setError('Ошибка: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="nickname-container">
      <div className="nickname-box">
        <h2>🎮 Выбери свой ник</h2>
        <p className="nickname-description">
          Этот ник будет отображаться в рейтинге
        </p>
        <p className="nickname-warning">
          ⚠️ Ник нельзя будет изменить!
        </p>
        
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Введите ник (3-20 символов)"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            disabled={loading}
            className="nickname-input"
            maxLength={20}
            autoFocus
          />
          
          <button 
            type="submit" 
            disabled={loading || nickname.trim().length < 3}
            className="nickname-button"
          >
            {loading ? 'Проверка...' : '✅ Сохранить ник'}
          </button>
        </form>

        {error && (
          <div className="nickname-error">
            {error}
          </div>
        )}

        <div className="nickname-tips">
          <p>💡 Советы:</p>
          <p>• Минимум 3 символа</p>
          <p>• Буквы, цифры, пробелы, - и _</p>
          <p>• Пробелы по краям удаляются</p>
          <p>• Выбирай уникальный ник!</p>
        </div>
      </div>
    </div>
  )
}

export default SetNickname

