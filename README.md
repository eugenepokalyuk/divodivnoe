# divodivnoe.com

Лендинг цветочной мастерской «Диво Дивное». Next.js 16 (App Router) + React 19 +
Redux Toolkit + SCSS Modules — стек как в `forma-next`.

**Прод:** https://eugenepokalyuk.github.io/divodivnoe/

## Деплой

Мерж в `main` → GitHub Actions собирает статику и публикует на GitHub Pages
(`.github/workflows/deploy.yml`). Можно запустить руками: вкладка Actions →
Deploy to GitHub Pages → Run workflow.

Разово включить перед первым деплоем: **Settings → Pages → Source: GitHub
Actions** (не «Deploy from a branch»).

Как это устроено:

- `output: 'export'` в `next.config.ts` — Pages раздаёт только статику,
  сервера нет. Все страницы пререндерены в `out/`.
- `basePath` берётся из `NEXT_PUBLIC_BASE_PATH` (workflow ставит `/divodivnoe`),
  потому что project-сайт живёт в подпапке. Без префикса отвалятся ассеты.
- `trailingSlash: true` — экспорт кладёт `promotions/index.html`, а без слеша
  Pages искал бы `promotions.html` и отдавал 404.
- `out/.nojekyll` — иначе Jekyll выкинет папку `_next` (начинается с `_`),
  и сайт откроется без стилей.
- Внутренние ссылки — только через `next/link`: он сам подставляет `basePath`.
  Обычный `<a href="/...">` его не получит и уведёт в корень домена.
  Пути в `metadata` (фавикон) Next тоже не префиксует — там подставляем вручную.

### Переезд на divodivnoe.com

1. У регистратора: `A`-записи на `185.199.108-111.153` и `CNAME www` →
   `eugenepokalyuk.github.io`.
2. Создать `public/CNAME` с одной строкой `divodivnoe.com`.
3. В workflow убрать `NEXT_PUBLIC_BASE_PATH` и поправить `NEXT_PUBLIC_APP_URL`
   на `https://divodivnoe.com` — префикс станет не нужен.
4. Settings → Pages → Custom domain → `divodivnoe.com`, включить Enforce HTTPS.

## Запуск

```bash
npm install
npm run dev      # localhost:3000
npm run build
npm run start
```

## Страницы

| Маршрут       | Что там                                                       |
| ------------- | ------------------------------------------------------------- |
| `/`           | Лендинг: герой, каталог, акции, о нас, доставка, контакты      |
| `/promotions` | Все действующие акции                                          |

## Акции, Telegram и MAX

На карточке акции две кнопки:

- **Telegram** — открывает чат с уже набранным текстом (Telegram message draft
  link, `https://t.me/<username>?text=<текст>`). Отправляет сообщение сам клиент.
- **MAX** — просто открывает чат магазина. Предзаполнить текст нельзя:
  [документация MAX](https://dev.max.ru/help/deeplinks) знает только `?start=`
  для ботов и `:share?text=`, который открывает выбор получателя, а не наш чат.
  Наш аккаунт — бизнес-профиль, не бот. Поэтому на карточке показан **промокод**,
  который клиент называет в чате.

Что где лежит:

- **Список акций** — `src/store/slices/promotions/promotionsSlice.ts`
  (`initialPromotions`). Добавить акцию: новый `PromotionId` в `types.ts` + запись
  в массив (не забыть `code` — промокод). Когда появится админка — список приедет
  с бэкенда через `promotionsActions.setPromotions`.
- **Контакты** — `src/utils/consts/contacts.ts`. Аккаунты заданы в enum
  `TelegramContact` и `MaxContact`: поменять значение здесь — обновится во всех
  акциях и кнопках.
- **Текст сообщения** — `buildPromotionMessage` в `src/utils/helpers/telegram.ts`.

## Шрифты

- **Yauza TYGRA** — фирменный, только для логотипа (шапка и футер).
  `src/fonts/yauzatygra.woff2`, подключён через `next/font/local` в
  `src/lib/helpers/getFonts.ts`, переменная `--font-yauza`.
  Исходный `Yauza TYGRA.zip` сконвертирован в woff2: 102 КБ → 18 КБ.
  Правообладатель — TYGRA (`src/fonts/COPYRIGHT.txt`), `fsType = 0`
  (installable embedding).
- **Cormorant Garamond** — заголовки. **Inter** — текст. Оба из Google Fonts.

## Что заменить перед продом

- `TelegramContact.Manager` — сейчас заглушка `wazzupjohnny`.
  (`MaxContact.Shop` — уже боевой бизнес-аккаунт.)
- `PhoneContact.Manager` и `PhoneDisplay` в `contacts.ts` — сейчас `+7 999 999-99-99`.
- `CompanyEmail` — сейчас `hello@divodivnoe.com`.
- Плейсхолдеры под фото: герой (`HeroSection`) и карточки каталога
  (`CatalogSection`) — серые блоки вместо `<Image>`.
- Тексты секций «О нас» / «Доставка» и цены в `CatalogSection` — рыба.
- `public/favicon.svg` — заглушка с буквой «Д».

## Структура

```
src/
├── app/
│   ├── layout.tsx            # шрифты, метаданные, провайдеры, Layout
│   ├── page.tsx              # → home/page.tsx
│   ├── home/_components/     # HeroSection, CatalogSection, PromotionsPreview(+Layout),
│   │                         # AboutSection, DeliverySection
│   └── promotions/
│       ├── page.tsx
│       └── _components/      # PromotionsView (Redux) + PromotionsViewLayout (рендер)
├── components/
│   ├── ui/                   # Button, Section
│   ├── units/                # Header, Footer, Layout
│   └── modules/              # PromotionCard
├── store/
│   ├── store.ts, hooks.ts
│   └── slices/promotions/    # promotionsSlice, types, selectors
├── lib/
│   ├── helpers/getFonts.ts
│   └── providers/AppProviders.tsx
├── utils/
│   ├── consts/               # contacts (enums), routes
│   └── helpers/telegram.ts   # buildTelegramLink, buildPromotionTelegramLink
└── styles/                   # tokens, mixins, globals, index
```

## SCSS

```scss
@use '@/styles/index' as s;

s.gap(4)              // → 16px
s.$br_5               // → 20px
@include s.text_body_1;
@include s.media_down(md);
@include s.glass(s.$width_lg);   // центрирующий контейнер с боковыми отступами
```

Палитра — тёплый белый фон (`#FBF9F7`), приглушённая роза (`#8F5B6B`) как акцент.
Заголовки — Cormorant Garamond, текст — Inter.
