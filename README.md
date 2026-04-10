# Wallet TMA (React + TypeScript)

Telegram Mini App (верхняя часть интерфейса под `@wallet`) с TonConnect, Telegram SDK, zustand и модальными окнами через state.

## Стек

- React + Vite + TypeScript (strict)
- `@telegram-apps/sdk`
- `@telegram-apps/telegram-ui`
- `@tonconnect/ui-react`
- `zustand`
- `react-hot-toast`
- `react-hook-form` + `zod`
- `qrcode.react`

## Запуск

1. Установите Node.js `>=20`
2. Установите зависимости:
   - `pnpm install` (или `yarn`)
3. Запустите dev:
   - `pnpm dev`
4. Откройте URL из консоли Vite

## Сборка для TMA

1. `pnpm build`
2. Готовый бандл находится в `dist/`
3. Загрузите `dist` на ваш хостинг (HTTPS)
4. Укажите URL в настройках Web App у вашего Telegram-бота в `@BotFather`

## Деплой на Vercel (бесплатно)

1. Залейте проект в GitHub.
2. В Vercel нажмите `Add New... -> Project` и импортируйте репозиторий.
3. Build settings определятся из `vercel.json` автоматически:
   - Install: `pnpm install`
   - Build: `pnpm build`
   - Output: `dist`
4. После первого деплоя получите URL вида `https://your-project.vercel.app`.
5. В Vercel -> `Project Settings -> Environment Variables` добавьте:
   - `VITE_TONCONNECT_MANIFEST_URL=https://your-project.vercel.app/tonconnect-manifest.json`
6. Обновите `public/tonconnect-manifest.json` (поля `url`, `termsOfUseUrl`, `privacyPolicyUrl`) на ваш домен Vercel.
7. В `@BotFather` у бота поставьте Web App URL = `https://your-project.vercel.app`.

## Важно

- По умолчанию TonConnect манифест читается из `public/tonconnect-manifest.json`.
- Для production укажите свой URL манифеста через `VITE_TONCONNECT_MANIFEST_URL`.
- Для TMA нужен HTTPS-хостинг и корректные ссылки в `public/tonconnect-manifest.json`.
