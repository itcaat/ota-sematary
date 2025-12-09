// Менеджер звуков на Web Audio API
// Генерирует 8-bit звуки программно

export default class SoundManager {
  constructor() {
    this.audioContext = null
    this.enabled = true
    this.volume = 0.3
    this.musicVolume = 0.15
    this.musicPlaying = false
    this.musicNodes = []
  }

  init() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
    } catch (e) {
      console.warn('Web Audio API not supported')
      this.enabled = false
    }
  }

  // Фоновая музыка
  startMusic() {
    if (!this.enabled || this.musicPlaying) return
    this.resume()
    this.musicPlaying = true
    this.playMusicLoop()
  }

  stopMusic() {
    this.musicPlaying = false
    this.musicNodes.forEach(node => {
      try { node.stop() } catch(e) {}
    })
    this.musicNodes = []
  }

  playMusicLoop() {
    if (!this.musicPlaying) return
    
    // Часть 1: Зловещее вступление
    const part1_melody = [
      { note: 130.81, duration: 0.5 },  // C3
      { note: 155.56, duration: 0.5 },  // Eb3
      { note: 196.00, duration: 0.5 },  // G3
      { note: 233.08, duration: 1.0 },  // Bb3
      { note: 0, duration: 0.25 },
      { note: 220.00, duration: 0.5 },  // A3
      { note: 196.00, duration: 0.5 },  // G3
      { note: 164.81, duration: 0.5 },  // E3
      { note: 130.81, duration: 1.0 },  // C3
      { note: 0, duration: 0.25 },
    ]
    
    // Часть 2: Нарастание напряжения
    const part2_melody = [
      { note: 146.83, duration: 0.25 }, // D3
      { note: 164.81, duration: 0.25 }, // E3
      { note: 174.61, duration: 0.25 }, // F3
      { note: 196.00, duration: 0.25 }, // G3
      { note: 220.00, duration: 0.5 },  // A3
      { note: 196.00, duration: 0.25 }, // G3
      { note: 174.61, duration: 0.25 }, // F3
      { note: 164.81, duration: 0.5 },  // E3
      { note: 0, duration: 0.25 },
      { note: 130.81, duration: 0.25 }, // C3
      { note: 146.83, duration: 0.25 }, // D3
      { note: 155.56, duration: 0.25 }, // Eb3
      { note: 164.81, duration: 0.5 },  // E3
      { note: 155.56, duration: 0.5 },  // Eb3
      { note: 130.81, duration: 1.0 },  // C3
      { note: 0, duration: 0.5 },
    ]
    
    // Часть 3: Кульминация
    const part3_melody = [
      { note: 261.63, duration: 0.25 }, // C4
      { note: 0, duration: 0.125 },
      { note: 261.63, duration: 0.25 }, // C4
      { note: 233.08, duration: 0.25 }, // Bb3
      { note: 220.00, duration: 0.25 }, // A3
      { note: 196.00, duration: 0.5 },  // G3
      { note: 0, duration: 0.25 },
      { note: 293.66, duration: 0.25 }, // D4
      { note: 261.63, duration: 0.25 }, // C4
      { note: 233.08, duration: 0.25 }, // Bb3
      { note: 196.00, duration: 0.5 },  // G3
      { note: 164.81, duration: 0.5 },  // E3
      { note: 130.81, duration: 1.0 },  // C3
      { note: 0, duration: 0.5 },
    ]
    
    // Часть 4: Затихание
    const part4_melody = [
      { note: 196.00, duration: 0.75 }, // G3
      { note: 174.61, duration: 0.75 }, // F3
      { note: 164.81, duration: 0.75 }, // E3
      { note: 155.56, duration: 0.75 }, // Eb3
      { note: 146.83, duration: 0.75 }, // D3
      { note: 130.81, duration: 1.5 },  // C3
      { note: 0, duration: 0.75 },
    ]
    
    // Объединяем все части
    const fullMelody = [...part1_melody, ...part2_melody, ...part3_melody, ...part4_melody]
    
    // Бас линия (длинная)
    const bass = [
      // Часть 1
      { note: 65.41, duration: 2.5 },   // C2
      { note: 58.27, duration: 2.5 },   // Bb1
      // Часть 2
      { note: 73.42, duration: 1.25 },  // D2
      { note: 65.41, duration: 1.25 },  // C2
      { note: 58.27, duration: 1.25 },  // Bb1
      { note: 65.41, duration: 1.75 },  // C2
      // Часть 3
      { note: 65.41, duration: 1.0 },   // C2
      { note: 73.42, duration: 1.0 },   // D2
      { note: 58.27, duration: 1.0 },   // Bb1
      { note: 65.41, duration: 1.5 },   // C2
      // Часть 4
      { note: 49.00, duration: 1.5 },   // G1
      { note: 55.00, duration: 1.5 },   // A1
      { note: 58.27, duration: 1.5 },   // Bb1
      { note: 65.41, duration: 2.25 },  // C2
    ]
    
    // Арпеджио (добавляет атмосферу)
    const arpeggio = [
      // Cm арпеджио
      { note: 261.63, duration: 0.2 },  // C4
      { note: 311.13, duration: 0.2 },  // Eb4
      { note: 392.00, duration: 0.2 },  // G4
      { note: 311.13, duration: 0.2 },  // Eb4
      { note: 261.63, duration: 0.2 },  // C4
      { note: 0, duration: 0.5 },
      // Gm арпеджио
      { note: 196.00, duration: 0.2 },  // G3
      { note: 233.08, duration: 0.2 },  // Bb3
      { note: 293.66, duration: 0.2 },  // D4
      { note: 233.08, duration: 0.2 },  // Bb3
      { note: 196.00, duration: 0.2 },  // G3
      { note: 0, duration: 0.5 },
      // Fm арпеджио
      { note: 174.61, duration: 0.2 },  // F3
      { note: 220.00, duration: 0.2 },  // A3 (будет Ab в реале)
      { note: 261.63, duration: 0.2 },  // C4
      { note: 220.00, duration: 0.2 },  // A3
      { note: 174.61, duration: 0.2 },  // F3
      { note: 0, duration: 0.5 },
      // Обратно к Cm
      { note: 130.81, duration: 0.2 },  // C3
      { note: 155.56, duration: 0.2 },  // Eb3
      { note: 196.00, duration: 0.2 },  // G3
      { note: 155.56, duration: 0.2 },  // Eb3
      { note: 130.81, duration: 0.4 },  // C3
      { note: 0, duration: 2.0 },
    ]
    
    // Воспроизводим мелодию
    let melodyTime = 0
    fullMelody.forEach(note => {
      if (note.note > 0) {
        this.scheduleNote(note.note, melodyTime, note.duration * 0.9, 'square', this.musicVolume)
      }
      melodyTime += note.duration
    })
    
    // Воспроизводим бас
    let bassTime = 0
    bass.forEach(note => {
      if (note.note > 0) {
        this.scheduleNote(note.note, bassTime, note.duration * 0.95, 'triangle', this.musicVolume * 0.7)
      }
      bassTime += note.duration
    })
    
    // Воспроизводим арпеджио (начинается позже)
    let arpTime = 5.0 // Начинаем арпеджио с 5-й секунды
    arpeggio.forEach(note => {
      if (note.note > 0) {
        this.scheduleNote(note.note, arpTime, note.duration * 0.8, 'sine', this.musicVolume * 0.4)
      }
      arpTime += note.duration
    })
    
    // Ударные
    const totalDuration = Math.max(melodyTime, bassTime)
    for (let t = 0; t < totalDuration; t += 0.5) {
      // Kick на каждый такт
      if (Math.floor(t * 2) % 2 === 0) {
        this.scheduleDrum(t, this.musicVolume * 0.4)
      }
      // Hi-hat на офф-биты
      if (Math.floor(t * 4) % 2 === 1) {
        this.scheduleHiHat(t, this.musicVolume * 0.2)
      }
    }
    
    // Повторяем через длительность композиции
    setTimeout(() => {
      if (this.musicPlaying) {
        this.playMusicLoop()
      }
    }, totalDuration * 1000)
  }

  scheduleHiHat(startTime, vol) {
    // Hi-hat звук (белый шум, очень короткий)
    const bufferSize = this.audioContext.sampleRate * 0.05
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate)
    const data = buffer.getChannelData(0)
    
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1
    }
    
    const noise = this.audioContext.createBufferSource()
    const gain = this.audioContext.createGain()
    const filter = this.audioContext.createBiquadFilter()
    
    noise.buffer = buffer
    filter.type = 'highpass'
    filter.frequency.setValueAtTime(8000, this.audioContext.currentTime + startTime)
    
    noise.connect(filter)
    filter.connect(gain)
    gain.connect(this.audioContext.destination)
    
    gain.gain.setValueAtTime(vol, this.audioContext.currentTime + startTime)
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + startTime + 0.05)
    
    noise.start(this.audioContext.currentTime + startTime)
    noise.stop(this.audioContext.currentTime + startTime + 0.05)
    
    this.musicNodes.push(noise)
  }

  scheduleNote(freq, startTime, duration, type, vol) {
    const osc = this.audioContext.createOscillator()
    const gain = this.audioContext.createGain()
    const filter = this.audioContext.createBiquadFilter()
    
    osc.connect(filter)
    filter.connect(gain)
    gain.connect(this.audioContext.destination)
    
    osc.type = type
    osc.frequency.setValueAtTime(freq, this.audioContext.currentTime + startTime)
    
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(800, this.audioContext.currentTime + startTime)
    
    gain.gain.setValueAtTime(0, this.audioContext.currentTime + startTime)
    gain.gain.linearRampToValueAtTime(vol, this.audioContext.currentTime + startTime + 0.02)
    gain.gain.setValueAtTime(vol, this.audioContext.currentTime + startTime + duration - 0.05)
    gain.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + startTime + duration)
    
    osc.start(this.audioContext.currentTime + startTime)
    osc.stop(this.audioContext.currentTime + startTime + duration)
    
    this.musicNodes.push(osc)
  }

  scheduleDrum(startTime, vol) {
    // Kick drum
    const osc = this.audioContext.createOscillator()
    const gain = this.audioContext.createGain()
    
    osc.connect(gain)
    gain.connect(this.audioContext.destination)
    
    osc.type = 'sine'
    osc.frequency.setValueAtTime(150, this.audioContext.currentTime + startTime)
    osc.frequency.exponentialRampToValueAtTime(50, this.audioContext.currentTime + startTime + 0.1)
    
    gain.gain.setValueAtTime(vol, this.audioContext.currentTime + startTime)
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + startTime + 0.15)
    
    osc.start(this.audioContext.currentTime + startTime)
    osc.stop(this.audioContext.currentTime + startTime + 0.15)
    
    this.musicNodes.push(osc)
  }

  resume() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume()
    }
  }

  // Звук уничтожения сервера
  playServerDeath() {
    if (!this.enabled) return
    this.resume()
    
    const osc = this.audioContext.createOscillator()
    const gain = this.audioContext.createGain()
    
    osc.connect(gain)
    gain.connect(this.audioContext.destination)
    
    osc.type = 'square'
    osc.frequency.setValueAtTime(400, this.audioContext.currentTime)
    osc.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.2)
    
    gain.gain.setValueAtTime(this.volume, this.audioContext.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3)
    
    osc.start()
    osc.stop(this.audioContext.currentTime + 0.3)
  }

  // Звук получения урона
  playHurt() {
    if (!this.enabled) return
    this.resume()
    
    const osc = this.audioContext.createOscillator()
    const gain = this.audioContext.createGain()
    
    osc.connect(gain)
    gain.connect(this.audioContext.destination)
    
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(200, this.audioContext.currentTime)
    osc.frequency.exponentialRampToValueAtTime(50, this.audioContext.currentTime + 0.3)
    
    gain.gain.setValueAtTime(this.volume, this.audioContext.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3)
    
    osc.start()
    osc.stop(this.audioContext.currentTime + 0.3)
  }

  // Звук пива
  playBeer() {
    if (!this.enabled) return
    this.resume()
    
    // Булькающий звук
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        const osc = this.audioContext.createOscillator()
        const gain = this.audioContext.createGain()
        
        osc.connect(gain)
        gain.connect(this.audioContext.destination)
        
        osc.type = 'sine'
        osc.frequency.setValueAtTime(600 + i * 100, this.audioContext.currentTime)
        osc.frequency.exponentialRampToValueAtTime(300, this.audioContext.currentTime + 0.1)
        
        gain.gain.setValueAtTime(this.volume * 0.5, this.audioContext.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1)
        
        osc.start()
        osc.stop(this.audioContext.currentTime + 0.1)
      }, i * 80)
    }
  }

  // Звук обнаружения (зомби увидел)
  playAlert() {
    if (!this.enabled) return
    this.resume()
    
    const osc = this.audioContext.createOscillator()
    const gain = this.audioContext.createGain()
    
    osc.connect(gain)
    gain.connect(this.audioContext.destination)
    
    osc.type = 'square'
    osc.frequency.setValueAtTime(800, this.audioContext.currentTime)
    osc.frequency.setValueAtTime(600, this.audioContext.currentTime + 0.1)
    osc.frequency.setValueAtTime(800, this.audioContext.currentTime + 0.2)
    
    gain.gain.setValueAtTime(this.volume * 0.7, this.audioContext.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3)
    
    osc.start()
    osc.stop(this.audioContext.currentTime + 0.3)
  }

  // Звук Zubkov
  playZubkov() {
    if (!this.enabled) return
    this.resume()
    
    const osc = this.audioContext.createOscillator()
    const gain = this.audioContext.createGain()
    
    osc.connect(gain)
    gain.connect(this.audioContext.destination)
    
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(150, this.audioContext.currentTime)
    osc.frequency.setValueAtTime(100, this.audioContext.currentTime + 0.2)
    osc.frequency.setValueAtTime(80, this.audioContext.currentTime + 0.4)
    
    gain.gain.setValueAtTime(this.volume, this.audioContext.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5)
    
    osc.start()
    osc.stop(this.audioContext.currentTime + 0.5)
  }

  // Звук победы
  playVictory() {
    if (!this.enabled) return
    this.resume()
    
    const notes = [523, 659, 784, 1047] // C5, E5, G5, C6
    
    notes.forEach((freq, i) => {
      setTimeout(() => {
        const osc = this.audioContext.createOscillator()
        const gain = this.audioContext.createGain()
        
        osc.connect(gain)
        gain.connect(this.audioContext.destination)
        
        osc.type = 'square'
        osc.frequency.setValueAtTime(freq, this.audioContext.currentTime)
        
        gain.gain.setValueAtTime(this.volume * 0.6, this.audioContext.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3)
        
        osc.start()
        osc.stop(this.audioContext.currentTime + 0.3)
      }, i * 150)
    })
  }

  // Звук фейерверка
  playFirework() {
    if (!this.enabled) return
    this.resume()
    
    // Белый шум для взрыва
    const bufferSize = this.audioContext.sampleRate * 0.2
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate)
    const data = buffer.getChannelData(0)
    
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1
    }
    
    const noise = this.audioContext.createBufferSource()
    const gain = this.audioContext.createGain()
    const filter = this.audioContext.createBiquadFilter()
    
    noise.buffer = buffer
    filter.type = 'highpass'
    filter.frequency.setValueAtTime(1000, this.audioContext.currentTime)
    
    noise.connect(filter)
    filter.connect(gain)
    gain.connect(this.audioContext.destination)
    
    gain.gain.setValueAtTime(this.volume * 0.4, this.audioContext.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2)
    
    noise.start()
    noise.stop(this.audioContext.currentTime + 0.2)
  }

  // Звук Game Over
  playGameOver() {
    if (!this.enabled) return
    this.resume()
    
    const notes = [400, 350, 300, 200]
    
    notes.forEach((freq, i) => {
      setTimeout(() => {
        const osc = this.audioContext.createOscillator()
        const gain = this.audioContext.createGain()
        
        osc.connect(gain)
        gain.connect(this.audioContext.destination)
        
        osc.type = 'square'
        osc.frequency.setValueAtTime(freq, this.audioContext.currentTime)
        
        gain.gain.setValueAtTime(this.volume * 0.6, this.audioContext.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.4)
        
        osc.start()
        osc.stop(this.audioContext.currentTime + 0.4)
      }, i * 200)
    })
  }

  // Звук зомби (стон)
  playZombieMoan() {
    if (!this.enabled) return
    this.resume()
    
    const osc = this.audioContext.createOscillator()
    const gain = this.audioContext.createGain()
    const filter = this.audioContext.createBiquadFilter()
    
    osc.connect(filter)
    filter.connect(gain)
    gain.connect(this.audioContext.destination)
    
    osc.type = 'sawtooth'
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(300, this.audioContext.currentTime)
    
    // Вибрирующий стон
    osc.frequency.setValueAtTime(100, this.audioContext.currentTime)
    osc.frequency.setValueAtTime(120, this.audioContext.currentTime + 0.1)
    osc.frequency.setValueAtTime(90, this.audioContext.currentTime + 0.2)
    osc.frequency.setValueAtTime(110, this.audioContext.currentTime + 0.3)
    osc.frequency.setValueAtTime(80, this.audioContext.currentTime + 0.4)
    
    gain.gain.setValueAtTime(this.volume * 0.3, this.audioContext.currentTime)
    gain.gain.linearRampToValueAtTime(this.volume * 0.4, this.audioContext.currentTime + 0.2)
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5)
    
    osc.start()
    osc.stop(this.audioContext.currentTime + 0.5)
  }

  // Звук зомби рычание (при погоне)
  playZombieGrowl() {
    if (!this.enabled) return
    this.resume()
    
    const osc = this.audioContext.createOscillator()
    const osc2 = this.audioContext.createOscillator()
    const gain = this.audioContext.createGain()
    const filter = this.audioContext.createBiquadFilter()
    
    osc.connect(filter)
    osc2.connect(filter)
    filter.connect(gain)
    gain.connect(this.audioContext.destination)
    
    osc.type = 'sawtooth'
    osc2.type = 'square'
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(200, this.audioContext.currentTime)
    
    osc.frequency.setValueAtTime(80, this.audioContext.currentTime)
    osc.frequency.setValueAtTime(60, this.audioContext.currentTime + 0.15)
    osc.frequency.setValueAtTime(70, this.audioContext.currentTime + 0.3)
    
    osc2.frequency.setValueAtTime(85, this.audioContext.currentTime)
    osc2.frequency.setValueAtTime(55, this.audioContext.currentTime + 0.15)
    
    gain.gain.setValueAtTime(this.volume * 0.25, this.audioContext.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.4)
    
    osc.start()
    osc2.start()
    osc.stop(this.audioContext.currentTime + 0.4)
    osc2.stop(this.audioContext.currentTime + 0.4)
  }

  // Звук шага
  playStep() {
    if (!this.enabled) return
    this.resume()
    
    const osc = this.audioContext.createOscillator()
    const gain = this.audioContext.createGain()
    
    osc.connect(gain)
    gain.connect(this.audioContext.destination)
    
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(100 + Math.random() * 50, this.audioContext.currentTime)
    
    gain.gain.setValueAtTime(this.volume * 0.15, this.audioContext.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.05)
    
    osc.start()
    osc.stop(this.audioContext.currentTime + 0.05)
  }
}

