# DemoNodejs Backend

Backend API Node.js + Express + MySQL, da setup san cho deploy tren Render.

## 1) Cai dat local

```bash
npm install
```

Sao chep `.env.example` thanh `.env`, sau do dien thong tin DB.

## 2) Chay local

```bash
npm run dev
# hoac
npm start
```

## 3) API co san

- `GET /` -> thong tin service
- `GET /health` -> trang thai service va DB
- `GET /users`
- `GET /users/:id`
- `POST /users`
- `PUT /users/:id`
- `DELETE /users/:id`

## 4) Bien moi truong

Co 2 cach cau hinh DB:

- Cach 1 (khuyen nghi): dung `DB_URL`
- Cach 2: dung tung bien `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`

Xem file `.env.example` de copy dung format.

## 5) Deploy Render (tu GitHub)

### Cach A - Deploy thu cong tren dashboard Render

1. Push source len GitHub.
2. Tren Render, tao `Web Service` moi va connect repo.
3. Chon:
   - Build Command: `npm install`
   - Start Command: `npm start`
4. Them env vars trong Render:
   - `DB_URL` (hoac bo bien DB_HOST/DB_USER/...)
   - `DB_SSL=true` neu nha cung cap DB yeu cau SSL
5. Deploy.

### Cach B - Dung Blueprint

Repo da co file `render.yaml`, ban chi can:

1. Push code len GitHub.
2. Tren Render chon `New` -> `Blueprint`.
3. Chon repo va deploy.
4. Sau khi tao service, vao Environment them `DB_URL` (hoac bo bien DB_HOST/DB_USER/...).

## 6) Luu y production

- Nho them CORS policy theo domain frontend that su dung o production.
- Khong commit file `.env`.
- Neu DB dung SSL, dat `DB_SSL=true`.
