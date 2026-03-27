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
- `GET /build` -> thong tin branch/commit dang chay tren Render
- `GET /health` -> trang thai service va DB
- `GET /users`
- `GET /users/:id`
- `POST /users`
- `PUT /users/me` (can access token)
- `PUT /users/:id` (can access token)
- `DELETE /users/:id`
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout` (can access token)
- `POST /auth/refresh`
- `GET /courts` (can access token + role admin)
- `GET /courts/:id` (can access token + role admin)
- `POST /courts` (can access token + role admin)
- `PUT /courts/:id` (can access token + role admin)
- `DELETE /courts/:id` (can access token + role admin)

## 4) Bien moi truong

Co 2 cach cau hinh DB:

- Cach 1 (khuyen nghi): dung `DB_URL`
- Cach 2: dung tung bien `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`

Xem file `.env.example` de copy dung format.

## 5) Deploy Render (tu GitHub)

### Cach A - Deploy thu cong tren dashboard Render

1. Push source len GitHub.
2. Tren Render, tao `Web Service` moi va connect repo.
3. Dam bao:
   - Branch: `main`
   - Root Directory: `.`
4. Chon:
   - Build Command: `npm ci`
   - Start Command: `npm start`
5. Them env vars trong Render:
   - `DB_URL` (hoac bo bien DB_HOST/DB_USER/...)
   - `DB_SSL=true` neu nha cung cap DB yeu cau SSL
6. Deploy.

### Cach B - Dung Blueprint

Repo da co file `render.yaml`, ban chi can:

1. Push code len GitHub.
2. Tren Render chon `New` -> `Blueprint`.
3. Chon repo va deploy.
4. Sau khi tao service, vao Environment them `DB_URL` (hoac bo bien DB_HOST/DB_USER/...).

## 6) Kiem tra sau deploy

1. Kiem tra service song:
   - `GET https://<your-service>.onrender.com/health`
2. Kiem tra dung commit vua push:
   - `GET https://<your-service>.onrender.com/build`
3. Kiem tra route auth:
   - `POST https://<your-service>.onrender.com/auth/login`
4. Neu `/users` chay nhung `/auth` hoac `/courts` bi 404:
   - Kiem tra service dang deploy dung repo + branch `main`
   - Manual Deploy latest commit
   - Xac nhan khong bi nham service cu

## 7) Luu y production

- Nho them CORS policy theo domain frontend that su dung o production.
- Khong commit file `.env`.
- Neu DB dung SSL, dat `DB_SSL=true`.
