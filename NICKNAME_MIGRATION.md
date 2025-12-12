# 🎮 Миграция системы никнеймов

## Описание

Система никнеймов позволяет пользователям выбирать уникальные игровые имена после регистрации.

## Шаг 1: Создание таблицы profiles

Выполните следующий SQL в Supabase SQL Editor:

```sql
-- Создаём таблицу профилей для хранения никнеймов
CREATE TABLE IF NOT EXISTS profiles (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  nickname TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Индекс для быстрого поиска по user_id
CREATE INDEX idx_profiles_user_id ON profiles(user_id);

-- Индекс для проверки уникальности никнейма (case-insensitive)
CREATE UNIQUE INDEX idx_profiles_nickname_lower ON profiles(LOWER(nickname));

-- RLS (Row Level Security) политики
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Любой аутентифицированный пользователь может читать профили
CREATE POLICY "Anyone can view profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

-- Пользователи могут создавать только свой профиль
CREATE POLICY "Users can create their own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Пользователи не могут изменять свой профиль (ник нельзя менять)
-- Если нужно разрешить изменение email, раскомментируйте:
-- CREATE POLICY "Users can update their own email"
--   ON profiles FOR UPDATE
--   TO authenticated
--   USING (auth.uid() = user_id)
--   WITH CHECK (auth.uid() = user_id AND nickname = OLD.nickname);
```

## Шаг 2: Обновление таблицы leaderboard

Обновите таблицу leaderboard для работы с никнеймами:

```sql
-- Добавляем новые колонки
ALTER TABLE leaderboard
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS nickname TEXT;

-- Создаём индексы
CREATE INDEX IF NOT EXISTS idx_leaderboard_user_id ON leaderboard(user_id);
CREATE INDEX IF NOT EXISTS idx_leaderboard_nickname ON leaderboard(nickname);
CREATE INDEX IF NOT EXISTS idx_leaderboard_time ON leaderboard(time);

-- Миграция существующих данных (опционально)
-- Если у вас уже есть данные с email, можно их связать с никнеймами:
-- UPDATE leaderboard l
-- SET user_id = p.user_id, nickname = p.nickname
-- FROM profiles p
-- WHERE l.email = p.email;

-- После миграции можно удалить колонку email (опционально):
-- ALTER TABLE leaderboard DROP COLUMN IF EXISTS email;
```

## Шаг 3: Функция для проверки уникальности никнейма

Создайте функцию для проверки уникальности (опционально, для дополнительной валидации):

```sql
CREATE OR REPLACE FUNCTION is_nickname_available(nickname_to_check TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN NOT EXISTS (
    SELECT 1 FROM profiles
    WHERE LOWER(nickname) = LOWER(nickname_to_check)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## Шаг 4: Триггер для автоматического создания профиля (опционально)

Если хотите автоматически создавать пустой профиль при регистрации:

```sql
-- Функция для создания профиля
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Не создаём профиль автоматически, пользователь сам выберет ник
  -- Но можем записать email для будущего использования
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Триггер (можно не использовать, если профиль создаётся через UI)
-- CREATE TRIGGER on_auth_user_created
--   AFTER INSERT ON auth.users
--   FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## Шаг 5: Представление для топ-игроков

Создайте представление для удобного получения топа:

```sql
CREATE OR REPLACE VIEW leaderboard_top AS
SELECT 
  l.id,
  l.user_id,
  l.nickname,
  l.time,
  l.created_at,
  ROW_NUMBER() OVER (ORDER BY l.time ASC) as rank
FROM leaderboard l
WHERE l.nickname IS NOT NULL
ORDER BY l.time ASC
LIMIT 10;

-- Даём доступ на чтение
GRANT SELECT ON leaderboard_top TO authenticated, anon;
```

## Проверка

После выполнения миграции проверьте:

1. Таблица `profiles` создана:
```sql
SELECT * FROM profiles;
```

2. Таблица `leaderboard` обновлена:
```sql
\d leaderboard
```

3. RLS политики применены:
```sql
SELECT * FROM pg_policies WHERE tablename = 'profiles';
```

## Откат (если нужно)

Если что-то пошло не так:

```sql
-- Удалить таблицу profiles
DROP TABLE IF EXISTS profiles CASCADE;

-- Удалить функцию проверки
DROP FUNCTION IF EXISTS is_nickname_available(TEXT);

-- Удалить представление
DROP VIEW IF EXISTS leaderboard_top;

-- Вернуть leaderboard к исходному виду (если нужно)
-- ALTER TABLE leaderboard DROP COLUMN IF EXISTS user_id;
-- ALTER TABLE leaderboard DROP COLUMN IF EXISTS nickname;
```

## Примечания

- Никнейм **нельзя изменить** после создания (по требованию)
- Никнеймы уникальны (case-insensitive)
- Минимальная длина: 3 символа
- Максимальная длина: 20 символов
- Разрешённые символы: буквы, цифры, пробелы, дефис, подчёркивание
- Пробелы по краям автоматически удаляются при сохранении
- Множественные пробелы подряд запрещены
- Анонимные пользователи не сохраняют результаты

