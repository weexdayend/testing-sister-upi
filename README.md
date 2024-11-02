# Sistem Antrian


## Features

- Ambil Antrian -
    Pelanggan mengambil nomor antrian dengan memilih layanan yang mereka butuhkan.

- Monitoring Antrian -
    Menampilkan status antrian saat ini di semua loket dan memberikan pengumuman audio.

- Antrian Dashboard -
    Dashboard untuk loket agar dapat mengelola antrian dan melayani pelanggan.


## Requirements

- Node.js (version 18 or higher)
- PostgreSQL as the database
- Next.js
- Tailwind CSS for styling
- Prisma as the ORM for database management
- Optional: Docker for containerized deployment


## Installation

1. First, clone the repository and install the dependencies:

```bash
git clone https://github.com/your-username/sistem-antrian.git
cd sistem-antrian
npm install
```

2. Configure Environment Variables
Buat file .env di direktori root dan tambahkan variabel:
```bash
DATABASE_URL="postgresql://<user>:<password>@<host>:<port>/<database>"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate with openssl"
```
Ganti <user>, <password>, <host>, <port>, dan <database> dengan detail PostgreSQL Anda.

3. Run Database Migrations
Jalankan migrasi Prisma untuk mengatur skema database Anda:

```bash
npx prisma migrate dev
```

4. Start the Development Server
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```