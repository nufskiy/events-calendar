# Афиша — календарь событий

Сайт с месячным календарём анонсов и админкой для добавления событий (даты, место, описание, картинка).

## Запуск

```bash
cd events-calendar
cp .env.example .env.local   # Windows: copy .env.example .env.local
npm run seed                 # примеры событий (опционально)
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000).

- **Календарь:** `/`
- **Админка:** `/admin` (пароль по умолчанию `admin`, задаётся в `ADMIN_PASSWORD`)

## API (для Telegram-ботов позже)

| Метод | Путь | Доступ |
|-------|------|--------|
| GET | `/api/events?from=&to=` | публичный |
| GET | `/api/events/[id]` | публичный |
| POST | `/api/events` | авторизация (cookie сессии) |
| PUT | `/api/events/[id]` | авторизация |
| DELETE | `/api/events/[id]` | авторизация |
| POST | `/api/upload` | авторизация, multipart `file` |

Данные хранятся в `data/events.json`. Картинки — в `public/uploads/`.

Следующий шаг для ботов: добавить API-ключ в заголовке `Authorization` для POST/PUT/DELETE без браузерной сессии.
