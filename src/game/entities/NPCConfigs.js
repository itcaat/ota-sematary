/**
 * Конфигурации для всех типов NPC
 */

// Фразы зомби
const zombiePhrases = [
  'Не могу к базе подключиться. Connection timed out to 127.0.0.1',
  'У меня упал билд, посмотрите пж',
  'Это не наше, давайте позовем Сашу Зубкова',
  'У нас миграции упали! Можете починить?',
  'Взяли в беклог, но не знаем когда сможем сделать',
  'У нас МОНОЛИТ!!!',
  'А скиньте логи с прода плиз',
  'Какие у нас внешние IP адреса?',
  'А как собрать мордор?',
  'У нас всё встало! Памагити',
  'Билеты не выписываются!',
  'Пользователи жалуются, что почта не приходит!',
  'А можно мне доступ к v2_prod?',
  'Скиньте секреты',
  'Помогите ошибка (ошибка на странице показана)',
  'Привет! Выполните, пожалуйста, запрос',
  'Подробнее в треде',
  'Гляньте пж (вообще не связанная тема с нашим сектором работы)',
  'Нужны доступы к базе',
  'У нас какая-то проблема с деплоем',
  'У нас сервисы по хелзчеку упали, посмотрите пожалуйста',
  'А воркфлоу по получению доступа к бд в канале актуален',
  'Ilya Klishevich is typing',
]

// Фразы зомби-девочки
const zombieGirlPhrases = [
  'Хватит в офисе мусорить!',
  'Туда не ходи, сюда ходи!',
  'Кто опять свет не выключил?!',
  'Документы где?!',
  'Заявку напиши!',
  'По регламенту не положено!',
  'Сначала согласуй!',
  'А пропуск где?',
  'Кофе кончился, ваша очередь покупать!',
  'Принтер опять сломали!',
  'Кондиционер не трогать!',
  'Уборщица уже ушла!',
]

// Саркастические фразы
const sarcasticPhrases = [
  "Отлично справляешься! 👍\n(нет)",
  "Ты точно DevOps? 🤔",
  "Может тебе в PM?",
  "Сервера сами\nне упадут!",
  "Красавчик! 💪\n(сарказм)",
  "Так держать!\n...подальше от прода",
  "Верю в тебя!\n(на самом деле нет)",
  "Ещё чуть-чуть!\n...до увольнения",
  "Молодец! 🎉\n(это ирония)",
  "Ты лучший! 🏆\n...в ломании серверов",
  "Супер! Осталось\nвсего 100500 тасков",
  "Не сдавайся!\n(хотя стоило бы)",
  "Классно!\nZubkov доволен\n(нет)",
  "Ты справишься!\n...когда-нибудь",
  "Вот это скилл! 😎\n(шутка)",
  "Профессионал! 💼\n(по версии мамы)",
  "Так и надо!\n(на самом деле нет)",
  "Огонь! 🔥\n(как и сервера)",
  "Легенда! 🌟\n(в своих мечтах)",
  "Бог DevOps! ⚡\n(богохульство)",
]

// Фразы Козлова
const kozlovPhrases = [
  "Когда уже в yandex\nпереедем?",
  "Чет я уже заебался",
  "Да сколько можно?!",
  "Штош...",
  "Ну ты слоняра",
  "Где Погожий?",
]

// Фразы Погожего
const pogozhiyPhrases = [
  "НЕ ДОЛЖНЫМ ОБРАЗОМ\nОТТЕСТИРОВАННЫЙ КОД",
  "COMPOSE\nНА ПЕТАБАЙТЫ",
  "Я чайка ебаная",
  "ГОВНО МОЧА",
  "ЁБАНЫЙ ХУЙ ГНОЙ\nЗАЛУПА ПИДОРЫ",
  "РУКИ ОТОРВАТЬ\nПИДОРАМ",
  "ПРИКЛЮЧЕНИЕ\nНА ДВАДЦАТЬ МИНУТ",
  "Я ВАМ НА ЕБАЛЕ\nПОПРЫГАЮ",
]

// Конфигурация обычного зомби
export const zombieConfig = {
  type: 'zombie',
  spriteKey: 'zombie',
  hasDirections: true,
  hostile: true,
  showName: false,
  bodySize: { width: 20, height: 20 },
  bodyOffset: { x: 6, y: 10 },
  collideWorldBounds: true,
  phrases: zombiePhrases,
  phraseColor: '#ff4444',
  phraseFontSize: '10px',
  phraseInterval: 5000,
  alertSound: true,
  chaseTint: 0xff6666,
  ai: {
    speed: 60,
    chaseSpeed: 120,
    detectionRange: 150,
    loseRange: 250,
    patrolDirection: 1
  }
}

// Конфигурация Zubkov (босс)
export const zubkovConfig = {
  type: 'zubkov',
  spriteKey: 'zubkov',
  hasDirections: true,
  hostile: true,
  showName: true,
  name: 'ZUBKOV',
  nameColor: '#ffd700',
  nameFontSize: '10px',
  nameOffset: 35,
  scale: 1.2,
  bodySize: { width: 30, height: 30 },
  bodyOffset: { x: 9, y: 14 },
  collideWorldBounds: true,
  phrases: ['🔥 ГДЕ МОИ РАЗРАБЫ!?'],
  phraseColor: '#ff0000',
  phraseFontSize: '14px',
  phraseInterval: 10000,
  alertSound: true,
  chaseTint: 0xff4444,
  ai: {
    speed: 80,
    chaseSpeed: 160,
    detectionRange: 200,
    loseRange: 350,
    patrolDirection: 1,
    patrolX: [600, 1000]
  }
}

// Конфигурация зомби-девочки (Нарине)
export const zombieGirlConfig = {
  type: 'zombie_girl',
  spriteKey: 'zombie_girl',
  hasDirections: true,
  hostile: true,
  showName: true,
  name: 'Нарине',
  nameColor: '#ff69b4',
  nameFontSize: '8px',
  nameOffset: 28,
  bodySize: { width: 20, height: 28 },
  bodyOffset: { x: 6, y: 10 },
  phrases: zombieGirlPhrases,
  phraseColor: '#ff69b4',
  phraseFontSize: '10px',
  phraseInterval: 4000,
  chaseTint: 0xff69b4,
  ai: {
    speed: 25,
    chaseSpeed: 40,
    detectionRange: 150,
    loseRange: 250,
    currentPatrolIndex: 0,
    patrolPoints: [
      { x: 400, y: 300 },
      { x: 700, y: 300 },
      { x: 700, y: 600 },
      { x: 400, y: 600 }
    ]
  }
}

// Базовая конфигурация для дружественных NPC
const friendlyNPCBase = {
  hostile: false,
  showName: true,
  nameColor: '#ffffff',
  nameFontSize: '10px',
  nameOffset: 25,
  bobbing: true, // Покачивание
  phraseInterval: 5000,
  initialPhraseDelay: 1000
}

// Конфигурации дружественных NPC
export const friendlyNPCConfigs = {
  karpov: {
    ...friendlyNPCBase,
    type: 'npc_friendly',
    spriteKey: 'npc_karpov',
    name: 'karpov',
    phrases: sarcasticPhrases,
    phraseColor: '#ffeb3b',
    phraseFontSize: '9px'
  },
  rukavkov: {
    ...friendlyNPCBase,
    type: 'npc_friendly',
    spriteKey: 'npc_rukavkov',
    name: 'rukavkov',
    phrases: sarcasticPhrases,
    phraseColor: '#ffeb3b',
    phraseFontSize: '9px'
  },
  mazalov: {
    ...friendlyNPCBase,
    type: 'npc_friendly',
    spriteKey: 'npc_mazalov',
    name: 'mazalov',
    phrases: sarcasticPhrases,
    phraseColor: '#ffeb3b',
    phraseFontSize: '9px'
  },
  sergeev: {
    ...friendlyNPCBase,
    type: 'npc_friendly',
    spriteKey: 'npc_sergeev',
    name: 'sergeev',
    phrases: sarcasticPhrases,
    phraseColor: '#ffeb3b',
    phraseFontSize: '9px'
  },
  sindov: {
    ...friendlyNPCBase,
    type: 'npc_friendly',
    spriteKey: 'npc_sindov',
    name: 'sindov',
    phrases: sarcasticPhrases,
    phraseColor: '#ffeb3b',
    phraseFontSize: '9px'
  },
  kozlov: {
    ...friendlyNPCBase,
    type: 'npc_friendly',
    spriteKey: 'npc_kozlov',
    name: 'Козлов',
    phrases: kozlovPhrases,
    phraseColor: '#ffa726',
    phraseFontSize: '10px'
  },
  pogozhiy: {
    ...friendlyNPCBase,
    type: 'npc_friendly',
    spriteKey: 'npc_pogozhiy',
    name: 'Погожий',
    phrases: pogozhiyPhrases,
    phraseColor: '#ff1744',
    phraseFontSize: '10px'
  }
}

