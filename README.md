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

## Деплой на Cloudflare Pages (бесплатно)

1. Залейте проект в GitHub.
2. В Cloudflare Pages нажмите `Create a project` и импортируйте репозиторий.
3. Build settings:
   - Framework preset: `Vite`
   - Build command: `pnpm build`
   - Build output directory: `dist`
4. После первого деплоя получите URL вида `https://<project>.pages.dev`.
5. В `Settings -> Environment variables` добавьте:
   - `VITE_TONCONNECT_MANIFEST_URL=https://b670b3fe.koshelek1.pages.dev/tonconnect-manifest.json`
6. Проверьте `public/tonconnect-manifest.json` (поля `url`, `termsOfUseUrl`, `privacyPolicyUrl`) — они должны указывать на `https://b670b3fe.koshelek1.pages.dev`.
7. В `@BotFather` у бота поставьте Web App URL = `https://b670b3fe.koshelek1.pages.dev/`.

## Важно

- По умолчанию TonConnect манифест читается из `public/tonconnect-manifest.json`.
- Для production укажите свой URL манифеста через `VITE_TONCONNECT_MANIFEST_URL`.
- Для TMA нужен HTTPS-хостинг и корректные ссылки в `public/tonconnect-manifest.json`.
