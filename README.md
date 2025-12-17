# Autoradar — Агрегатор автозапчастей (MVP)

Autoradar — это сервис поиска запчастей в Астане по модели "Uber для запчастей". Клиент оставляет заявку (фото/текст), бот рассылает её проверенным продавцам, мы агрегируем цены и выдаем клиенту лучшее предложение с доставкой.

## 🚀 Технологический стек

* **Frontend:** Next.js 15 (App Router), React, TypeScript (Strict Mode)
* **Styling:** Tailwind CSS, Shadcn/ui, Framer Motion
* **Backend:** Next.js Server Actions + API Routes
* **Database:** Supabase (PostgreSQL + RLS)
* **Bot:** Telegraf (Node.js) via Webhooks
* **Design:** Apple HIG (Glassmorphism, Large Typography)

## 🛠 Установка и запуск

### 1. Клонирование и зависимости
```bash
git clone <repository-url>
cd autoradar
npm install