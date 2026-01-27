# SIAK - KSBD F

Aplikasi Sistem Informasi Akademik (SIAK) dengan role **admin**, **pegawai**, **dosen**, dan **mahasiswa**.
Frontend dibangun dengan React + Vite, backend menggunakan Node.js + Express + MySQL.

## Fitur Utama
- **Admin**: manajemen user & hak akses, tahun akademik/semester, KRS/KHS, nilai, absensi, monitoring.
- **Pegawai**: kelola master data (mata kuliah, ruang, jadwal), rekap absensi, layanan akademik.
- **Dosen**: pertemuan, absensi, input nilai, bimbingan, approval KRS, profil.
- **Mahasiswa**: KRS online, KHS, transkrip sementara, absensi & nilai sendiri, profil.

## Tech Stack
- Frontend: React 19, Vite, TypeScript, Tailwind CSS, Lucide Icons, Recharts
- Backend: Node.js, Express, MySQL2, JWT, Multer

## Struktur Folder
- `frontend/` — aplikasi React (Vite)
- `backend/` — API server (Express)
- `backend/uploads/` — penyimpanan file foto profil

## Prasyarat
- Node.js 20+
- npm
- MySQL

## Setup Database
1) Buat database MySQL (mis: `ac_fix`) dan import schema + data seed.
2) Update konfigurasi DB di `backend/src/config/db.js` sesuai environment kamu.

Contoh konfigurasi saat ini:
```
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'kiki05',
  database: 'ac_fix'
});
```

## Instalasi
Buka dua terminal terpisah.

### Backend
```bash
cd backend
npm install
npm run dev
```
Server berjalan di: `http://localhost:5000`

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend berjalan di: `http://localhost:5173`

## Konfigurasi API Base (Opsional)
Secara default frontend memakai `http://localhost:5000`.
Jika ingin ubah, buat file `frontend/.env`:
```
VITE_API_BASE_URL=http://localhost:5000
```

## Upload Foto Profil
File foto disimpan di `backend/uploads/` dan diakses melalui URL:
```
http://localhost:5000/uploads/<nama_file>
```

## Troubleshooting
- **Vite/nodemon: Permission denied**
  - Hapus `node_modules` + `package-lock.json`, lalu `npm install` ulang.
- **Rollup optional dependency error**
  - Hapus `node_modules` + `package-lock.json`, lalu `npm install` ulang.

## Lisensi
Internal project.
