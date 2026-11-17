# Developer Portfolio — Praktikum DevOps & CI/CD

Aplikasi website portofolio statis untuk tugas mata kuliah **DevOps & CI/CD**, dilengkapi containerization menggunakan **Docker & Docker Compose**, unit test otomatis, serta pipeline CI/CD paralel dengan caching.

## Anggota Kelompok
- **Satrio Athallah**
- **Hendrik Wahyu Kurniawan** (`XCrusiderZ`)

---

## Prasyarat
- **Git**
- **Docker** dan **Docker Compose v2** (`docker compose`)
- **Node.js >= 18** *(opsional untuk menjalankan unit test langsung di host; unit test juga dapat dijalankan melalui container Docker tanpa instalasi Node.js lokal)*

---

## Cara Menjalankan Aplikasi (Setelah `git clone`)

Tidak ada langkah konfigurasi manual yang wajib dilakukan sebelum menjalankan Docker Compose karena `compose.yaml` sudah memiliki nilai default (`APP_PORT=8080`, `IMAGE_TAG=1.0.0`).

1. **Clone repositori dan masuk ke folder proyek:**
   ```bash
   git clone https://github.com/XCrusiderZ/devops-V.git
   cd devops-V
   ```

2. **Jalankan aplikasi dengan Docker Compose:**
   ```bash
   docker compose up -d --build
   ```
   *(Atau `docker compose up --build` untuk melihat log langsung di terminal).*

3. **Akses aplikasi melalui browser:**
   Buka `http://localhost:8080`

4. **Menghentikan container:**
   ```bash
   docker compose down
   ```

### Konfigurasi Environment Opsional (`.env.example`)
Jika ingin mengubah port atau tag image, salin `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```
Variabel yang tersedia:
- `APP_PORT` (default: `8080`)
- `APP_ENV` (default: `production`)
- `IMAGE_TAG` (default: `1.0.0`)

---

## Cara Menjalankan Unit Test

Unit test menggunakan *Node.js built-in test runner* (`node:test`) tanpa ketergantungan eksternal sehingga langsung berjalan setelah `git clone`:

### Opsi 1 — Langsung dengan Node.js:
```bash
npm test
```

### Opsi 2 — Menggunakan Docker (tanpa Node.js lokal):
```bash
docker run --rm -v "${PWD}:/app" -w /app node:20.18.1-alpine3.20 npm test
```

Untuk menjalankan linter HTML & CSS secara lokal (membutuhkan `npm install`):
```bash
npm install
npm run lint
```

---

## Arsitektur Container & Pipeline CI/CD

- **Base Image:** `nginx:1.27.3-alpine` (versi spesifik, bukan `:latest`)
- **Image Tag:** `devops-v:1.0.0` (diatur melalui `compose.yaml`)
- **CI/CD Pipeline:**
  - Menggunakan **GitHub Actions** ([`.github/workflows/devops-pipeline.yml`](.github/workflows/devops-pipeline.yml)) dengan job paralel (`unit-test`, `lint-html`, `lint-css`), caching `~/.npm` via `actions/cache@v4`, serta verifikasi `docker compose config` dan `docker build`. *(Dipilih sebagai alternatif GitLab Shared Runner karena GitLab.com mewajibkan verifikasi kartu kredit).*
  - File [`.gitlab-ci.yml`](.gitlab-ci.yml) juga disertakan di repositori sebagai definisi konfigurasi pipeline GitLab CI/CD.
