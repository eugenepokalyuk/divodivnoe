# divodivnoe.com

Лендинг цветочной мастерской «Диводивное». Next.js 16 (App Router) + React 19 +
Redux Toolkit + SCSS Modules — стек как в `forma-next`.

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
- `src/app/icon.tsx` — фавикон-заглушка с буквой «Д».
- `NEXT_PUBLIC_APP_URL` — для `metadataBase` и OG-тегов.

## Структура

```
src/
├── app/
│   ├── layout.tsx            # шрифты, метаданные, провайдеры, Layout
│   ├── page.tsx              # → home/page.tsx
│   ├── icon.tsx              # фавикон (ImageResponse)
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
