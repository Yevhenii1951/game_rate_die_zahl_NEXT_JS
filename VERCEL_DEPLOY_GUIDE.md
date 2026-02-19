# Деплой Next.js проекта на Vercel — пошаговая инструкция

## 1. Подготовка

- Проект на Next.js (App Router)
- Код запушен на GitHub
- Аккаунт на [vercel.com](https://vercel.com) (вход через GitHub)

---

## 2. Создание проекта на Vercel

1. Зайди на [vercel.com](https://vercel.com) → войди через **GitHub**
2. На дашборде нажми **Add New → Project**
3. Найди свой репозиторий → нажми **Import**
4. Vercel автоматически определит **Next.js** как фреймворк
5. Нажми **Deploy**
6. Через 1–2 минуты сайт будет доступен по URL вида `https://твой-проект.vercel.app`

---

## 3. Подключение базы данных (Neon PostgreSQL)

1. В Vercel → твой проект → **Storage** (вкладка вверху)
2. Нажми **Create** → выбери **Neon** (это PostgreSQL)
3. Дай имя базе → выбери регион → нажми **Create**
4. **Готово!** Vercel автоматически добавит `DATABASE_URL` в Environment Variables

### Создание таблиц

1. Зайди на [console.neon.tech](https://console.neon.tech) (вход через тот же GitHub)
2. Выбери свою базу данных
3. Слева нажми **SQL Editor**
4. Вставь SQL из `schema.sql`:

```sql
CREATE TABLE IF NOT EXISTS players (
  id         SERIAL PRIMARY KEY,
  username   VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS game_results (
  id        SERIAL PRIMARY KEY,
  player_id INTEGER NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  attempts  INTEGER NOT NULL CHECK (attempts > 0),
  played_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_game_results_attempts ON game_results(attempts ASC);
CREATE INDEX IF NOT EXISTS idx_game_results_player   ON game_results(player_id);
```

5. Нажми **Run**

### Передеплой после подключения базы

После подключения базы нужно передеплоить, чтобы приложение подхватило `DATABASE_URL`:

- **Вариант 1:** Vercel → Deployments → три точки (⋯) → Redeploy
- **Вариант 2:** Сделай `git push` (даже пустой коммит):
  ```bash
  git commit --allow-empty -m "trigger redeploy"
  git push
  ```

---

## 4. Как работает база данных на Vercel (сравнение с Render)

### На Render (как было раньше)

На Render нужно было настраивать **3 отдельных сервиса**:

| Сервис                | Что делал                                    |
| --------------------- | -------------------------------------------- |
| **PostgreSQL**        | Отдельный сервис базы данных                 |
| **Backend** (Express) | Отдельный Web Service с `DATABASE_URL` в env |
| **Frontend** (Vite)   | Static Site с `VITE_API_URL` в env           |

Ты вручную:

- Создавал PostgreSQL сервис
- Копировал `Internal Database URL` из PostgreSQL
- Вставлял его в env переменные Backend-а как `DATABASE_URL`
- Указывал `VITE_API_URL` для фронтенда
- Настраивал Build Command, Start Command для каждого сервиса

### На Vercel (как сейчас)

На Vercel всё **в одном проекте**:

| Что               | Как                                                         |
| ----------------- | ----------------------------------------------------------- |
| **Frontend**      | `app/page.tsx` — рендерится Vercel автоматически            |
| **Backend (API)** | `app/api/*/route.ts` — Serverless Functions (автоматически) |
| **База данных**   | Neon PostgreSQL — подключается через Storage                |

#### Почему не нужно настраивать env вручную?

Когда ты создаёшь базу через **Storage → Neon**, Vercel делает всё сам:

1. Создаёт PostgreSQL базу на серверах Neon
2. Получает строку подключения (connection string)
3. **Автоматически добавляет** переменную `DATABASE_URL` в Environment Variables проекта
4. При каждом деплое эта переменная доступна в `process.env.DATABASE_URL`

В коде `lib/db.ts` мы используем:

```typescript
const pool = process.env.DATABASE_URL
	? new Pool({
			connectionString: process.env.DATABASE_URL,
			ssl: { rejectUnauthorized: false },
		})
	: new Pool({
			/* локальные настройки */
		})
```

Поэтому:

- **На Vercel** — `DATABASE_URL` есть → подключается к Neon
- **Локально** — `DATABASE_URL` нет → подключается к локальной БД через `.env.local`

#### Почему не нужен отдельный backend?

В Next.js файлы `app/api/*/route.ts` автоматически становятся **Serverless Functions** на Vercel. Это заменяет Express-сервер. Каждый API-запрос (`/api/highscores`, `/api/health`) обрабатывается отдельной функцией — не нужен постоянно работающий сервер.

---

## 5. Итоговое сравнение

|                     | Render                                 | Vercel                             |
| ------------------- | -------------------------------------- | ---------------------------------- |
| Количество сервисов | 3 (DB + Backend + Frontend)            | 1 проект                           |
| Настройка env       | Вручную копировать URL между сервисами | Автоматически при создании Storage |
| Backend             | Express — отдельный Web Service        | API Routes — Serverless Functions  |
| База данных         | Render PostgreSQL                      | Neon PostgreSQL (через Storage)    |
| Деплой              | Отдельно для каждого сервиса           | Один `git push` деплоит всё        |
| Управление SQL      | Через psql или pgAdmin                 | Через Neon Console → SQL Editor    |

---

## 6. Обновление кода

Просто:

```bash
git add .
git commit -m "описание изменений"
git push
```

Vercel автоматически передеплоит проект за 1–2 минуты.
