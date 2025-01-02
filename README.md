# Sistem Manajemen Antrian

Sistem Manajemen Antrian adalah aplikasi yang dirancang untuk mengelola alur antrian pelanggan secara efisien, memastikan layanan yang teratur, dan mengurangi waktu tunggu.


## Daftar Isi

1. [Pendahuluan](#pendahuluan)
2. [Fitur Utama](#fitur-utama)
3. [Panduan Pengguna Non-Teknis](#panduan-pengguna-non-teknis)
   - [Mengambil Nomor Antrian](#mengambil-nomor-antrian)
   - [Memantau Status Antrian](#memantau-status-antrian)
   - [Mendapatkan Layanan](#mendapatkan-layanan)
4. [Panduan Pengguna Teknis](#panduan-pengguna-teknis)
   - [Persyaratan Sistem](#persyaratan-sistem)
   - [Instalasi dan Konfigurasi](#instalasi-dan-konfigurasi)
5. [Cara menggunakan NGROK](#cara-menggunakan-ngrok)
6. [Catatan](#catatan)
7. [Pengembangan dan Pengujian](#pengembangan-dan-pengujian)
8. [FAQ](#faq)
    

## Pendahuluan

**Sistem Manajemen Antrian** adalah aplikasi yang dirancang untuk mengelola alur antrian pelanggan secara efisien, memastikan layanan yang teratur dan mengurangi waktu tunggu.

## Fitur Utama

- **Ambil Antrian**: `/ambil-antrian` Pelanggan dapat mengambil nomor antrian dengan memilih layanan yang diinginkan.
- **Monitoring Antrian**: `/monitoring` Menampilkan status antrian saat ini di semua loket dan memberikan pengumuman audio.
- **Dashboard Antrian**: `/antrian` Antarmuka untuk petugas loket dalam mengelola antrian dan melayani pelanggan.

## Panduan Pengguna Non-Teknis

### Mengambil Nomor Antrian

1. **Akses Halaman Ambil Antrian**: Gunakan perangkat yang disediakan atau aplikasi untuk membuka halaman "Ambil Antrian".
2. **Pilih Layanan**: Dari daftar layanan yang tersedia, pilih layanan yang Anda butuhkan.
3. **Dapatkan Nomor Antrian**: Setelah memilih layanan, sistem akan memberikan nomor antrian. Simpan nomor ini dan tunggu hingga dipanggil.

### Memantau Status Antrian

- **Layar Monitor**: Perhatikan layar yang menampilkan nomor antrian yang sedang dilayani.
- **Pengumuman Audio**: Dengarkan pengumuman audio yang memanggil nomor antrian Anda.

### Mendapatkan Layanan

- **Saat Nomor Dipanggil**: Segera menuju loket atau petugas yang ditunjuk dan tunjukkan nomor antrian Anda untuk mendapatkan layanan.

## Panduan Pengguna Teknis

### Persyaratan Sistem

- **Node.js**: Versi 18 atau lebih tinggi.
- **PostgreSQL**: Sebagai basis data.
- **Next.js**: Framework React untuk pengembangan front-end.
- **Tailwind CSS**: Untuk styling antarmuka.
- **Prisma**: ORM untuk manajemen basis data.
- **Docker** (opsional): Untuk deployment terkontainerisasi.

### Instalasi dan Konfigurasi

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
Ganti `<user>`, `<password>`, `<host>`, `<port>`, dan `<database>` dengan detail PostgreSQL Anda.

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

## Cara menggunakan NGROK

NGROK adalah alat yang memungkinkan Anda untuk membuat tunnel ke aplikasi lokal Anda, sehingga dapat diakses melalui URL publik. Ini sangat berguna untuk pengujian aplikasi di lingkungan lokal tanpa perlu meng-deploy ke server.

### Langkah-langkah untuk menggunakan NGROK

1. **Install NGROK**  
   Unduh dan install NGROK dari [situs resmi NGROK](https://ngrok.com/download) sesuai dengan sistem operasi yang Anda gunakan.

2. **Jalankan aplikasi lokal Anda**  
   Pastikan aplikasi Anda berjalan di port yang diinginkan (misalnya, `http://localhost:3000`).

3. **Jalankan NGROK**  
   Buka terminal dan jalankan perintah berikut untuk membuka tunnel ke port aplikasi Anda (misalnya, `3000`):

   ```bash
   ngrok http 3000
   ```
   Jika aplikasi Anda berjalan di port yang berbeda, ganti angka 3000 dengan port yang sesuai.

4. **Akses URL Publik***
   Setelah menjalankan perintah di atas, NGROK akan memberikan URL publik yang dapat diakses di luar jaringan lokal Anda. URL tersebut akan terlihat seperti ini:
   ```bash
   Forwarding                    http://abcd1234.ngrok.io -> http://localhost:3000
   ```
5. **Gunakan URL untuk Akses Aplikasi**
   Sekarang, Anda dapat mengakses aplikasi Anda menggunakan URL yang diberikan oleh NGROK (misalnya, http://abcd1234.ngrok.io).

## Catatan

URL NGROK akan berubah setiap kali Anda menjalankan NGROK. Untuk menggunakan URL yang lebih stabil, pertimbangkan untuk mendaftar akun NGROK dan mendapatkan subdomain tetap.
NGROK dapat digunakan untuk keperluan pengujian aplikasi yang melibatkan webhook atau akses API eksternal yang memerlukan URL publik.


### Pengembangan dan Pengujian

- Menjalankan Server Pengembangan: Gunakan npm run dev untuk menjalankan server dalam mode pengembangan.
- Membangun Proyek: Gunakan npm run build untuk membangun proyek sebelum deployment.
- Pengujian: Implementasikan dan jalankan pengujian untuk memastikan kualitas kode.

### FAQ

- Q: Bagaimana cara menambahkan layanan baru?
- A: Untuk menambahkan layanan baru, buka file konfigurasi layanan dan tambahkan entri layanan baru sesuai dengan format yang sudah ada.

- Q: Apakah sistem ini mendukung multi-lokasi?
- A: Ya, sistem ini mendukung multi-lokasi dan memungkinkan pengelolaan antrian di beberapa lokasi secara bersamaan.
