# Настройка Supabase для системы рейтинга

## 1. Создайте проект в Supabase

1. Зайдите на [https://supabase.com](https://supabase.com)
2. Создайте новый проект
3. Сохраните URL проекта и Anon Key

## 2. Создайте таблицу для рейтинга

Перейдите в SQL Editor в вашем Supabase проекте и выполните следующий SQL:

```sql
-- Создаём таблицу для рейтинга
CREATE TABLE leaderboard (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  time INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Создаём индекс для быстрой сортировки по времени
CREATE INDEX idx_leaderboard_time ON leaderboard(time);

-- Включаем Row Level Security
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;

-- Политика: все могут читать рейтинг
CREATE POLICY "Anyone can view leaderboard"
  ON leaderboard FOR SELECT
  USING (true);

-- Политика: аутентифицированные пользователи могут добавлять результаты
CREATE POLICY "Authenticated users can insert scores"
  ON leaderboard FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);
```

## 3. Настройте аутентификацию

### Email (Magic Link)

1. В Supabase Dashboard перейдите в **Authentication** → **Providers**
2. Включите **Email** provider
3. Настройте Email Templates (опционально)

### Google OAuth

1. Перейдите в **Authentication** → **Providers**
2. Включите **Google** provider
3. Настройте Google OAuth:

   **A. Создайте проект в Google Cloud Console:**
   - Зайдите на https://console.cloud.google.com/
   - Создайте новый проект или выберите существующий
   - Перейдите в **APIs & Services** → **Credentials**
   - Нажмите **Create Credentials** → **OAuth 2.0 Client ID**
   - Выберите **Web application**
   
   **B. Настройте Authorized redirect URIs:**
   - Добавьте: `https://your-project.supabase.co/auth/v1/callback`
   - Замените `your-project` на ваш реальный ID проекта
   
   **C. Скопируйте credentials:**
   - Client ID
   - Client Secret
   
   **D. Вставьте в Supabase:**
   - Вернитесь в Supabase → **Authentication** → **Providers** → **Google**
   - Вставьте Client ID и Client Secret
   - Нажмите **Save**

## 4. Добавьте переменные окружения

Создайте файл `.env` в корне проекта:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Замените значения на ваши настоящие URL и ключ из Supabase Dashboard.

## 5. Запустите проект

```bash
npm run dev
```

## Как это работает

1. **Вход через Email (Magic Link):**
   - Пользователь вводит email
   - Supabase отправляет письмо со ссылкой
   - При переходе по ссылке пользователь автоматически входит

2. **Сохранение результата:**
   - Когда игра завершается (игрок спасает принцессу)
   - Автоматически сохраняется результат: email + время
   - Результат попадает в таблицу `leaderboard`

3. **Рейтинг:**
   - Отображается ТОП-10 лучших результатов
   - Сортировка по времени (меньше = лучше)
   - Текущий пользователь подсвечивается

## Структура таблицы leaderboard

| Поле | Тип | Описание |
|------|-----|----------|
| id | UUID | Уникальный идентификатор записи |
| email | TEXT | Email игрока |
| time | INTEGER | Время прохождения в секундах |
| created_at | TIMESTAMP | Дата и время сохранения результата |

## Безопасность

- Row Level Security (RLS) включен
- Анонимные пользователи могут только читать рейтинг
- Только аутентифицированные пользователи могут добавлять результаты
- Email скрыты через маскировку (первые 2 символа + ***)

