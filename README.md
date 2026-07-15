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

Сейчас домен на **парковке reg.ru**: `divodivnoe.com` → `95.163.244.138`
(openresty, заглушка регистратора, HTTPS нет). Это не наш сервер — выложить
туда сайт нельзя, нужно увести DNS на Pages. NS домена: `ns1/ns2.reg.ru`.

Порядок важен: пока DNS не переехал, `basePath` трогать нельзя — иначе
сломается и github.io-ссылка, и домен.

1. **DNS у reg.ru** — заменить A-запись парковки на четыре адреса GitHub:
   `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`.
   Плюс `CNAME www` → `eugenepokalyuk.github.io`.
2. Settings → Pages → Custom domain → `divodivnoe.com`, дождаться проверки,
   включить Enforce HTTPS (сертификат выпустит GitHub).
3. Создать `public/CNAME` с одной строкой `divodivnoe.com`.
4. В workflow убрать `NEXT_PUBLIC_BASE_PATH` и поправить `NEXT_PUBLIC_APP_URL`
   на `https://divodivnoe.com` — префикс станет не нужен.

Проверить, что DNS доехал: `dig +short divodivnoe.com A` должен вернуть
адреса GitHub, а не `95.163.244.138`.

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

## Акции и мессенджеры

На карточке акции три кнопки (порядок задан `MessengerOrder`):

- **Telegram** — чат с уже набранным текстом (message draft link,
  `https://t.me/<username>?text=<текст>`).
- **WhatsApp** — то же самое: `https://wa.me/<номер>?text=<текст>`.
- **MAX** — просто открывает чат магазина. Предзаполнить текст нельзя:
  [документация MAX](https://dev.max.ru/help/deeplinks) знает только `?start=`
  для ботов и `:share?text=`, который открывает выбор получателя, а не наш чат.
  Наш аккаунт — бизнес-профиль, не бот. Поэтому на карточке показан **промокод**,
  который клиент называет в чате.

Сообщение во всех случаях отправляет сам клиент — мы только подставляем текст.

Кто что умеет — задано флагом `supportsPrefill` в `Messengers`
(`src/utils/consts/contacts.ts`), а не разбросано по компонентам.
Кнопки рисует общий `MessengerActions` — добавить четвёртый мессенджер значит
дописать enum + запись в `Messengers` + `MessengerOrder`.

Что где лежит:

- **Список акций** — `src/store/slices/promotions/promotionsSlice.ts`
  (`initialPromotions`). Добавить акцию: новый `PromotionId` в `types.ts` + запись
  в массив (не забыть `code` — промокод). Когда появится админка — список приедет
  с бэкенда через `promotionsActions.setPromotions`.
- **Контакты** — `src/utils/consts/contacts.ts`. Аккаунты заданы в enum
  `TelegramContact`, `WhatsappContact` и `MaxContact`: поменять значение здесь —
  обновится во всех акциях и кнопках.
- **Текст сообщения** — `buildPromotionMessage` в
  `src/utils/helpers/messengers.ts`.

## Шрифты

- **Yauza TYGRA** — фирменный, только для логотипа (шапка и футер).
  `src/fonts/yauzatygra.woff2`, подключён через `next/font/local` в
  `src/lib/helpers/getFonts.ts`, переменная `--font-yauza`.
  Исходный `Yauza TYGRA.zip` сконвертирован в woff2: 102 КБ → 18 КБ.
  Правообладатель — TYGRA (`src/fonts/COPYRIGHT.txt`), `fsType = 0`
  (installable embedding).
- **Cormorant Garamond** — заголовки. **Inter** — текст. Оба из Google Fonts.

## Что заменить перед продом

Все контакты боевые, заглушек не осталось: Telegram `@divo_divnoe_nsk`,
телефон `+7 923 106-86-26`, WhatsApp `79231068626`, MAX, VK `viva_flo`,
почта `vivaflowers54@gmail.com`, адрес и часы работы (с карточки 2ГИС).

`TelegramContact.Manager` принимает и username (`divo_divnoe_nsk`), и телефон
(`+79231068626`) — [оба формата](https://core.telegram.org/api/links) умеют
`?text=`, ссылка собирается конкатенацией. Меняется в одном месте.

Флаг `isPlaceholder` в `Messengers` оставлен на будущее: если добавите канал
с ещё не выданным контактом — пометьте, чтобы грепом было видно.

Адрес, город и часы работы лежат в `contacts.ts` (`CompanyAddress`,
`CompanyCity`, `WorkingHours`) — правятся в одном месте, а не по вёрстке.
- `CompanyEmail` — сейчас `hello@divodivnoe.com`.
- Плейсхолдеры под фото: герой (`HeroSection`) и карточки каталога
  (`CatalogSection`) — серые блоки вместо `<Image>`.
- Тексты секций «О нас» / «Доставка» и цены в `CatalogSection` — рыба.
  Там же выдуманные цифры: «5 лет собираем букеты», «2 часа до доставки»,
  «доставка 400 ₽», «бесплатно от 5 000 ₽» — проверить перед продом.
- `public/favicon.svg` — заглушка с буквой «Д».
- В 2ГИС висит акция «-10% на первый заказ по промокоду 2ГИС» — на сайт
  сознательно не переносили, чтобы не путать с `FIRST500`.

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
