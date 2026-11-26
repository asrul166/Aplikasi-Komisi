# Komisia

Aplikasi web untuk mencatat penjualan, menyetujui transaksi, dan menghitung komisi sales.

## Menjalankan

Butuh Node.js 22+ dan Docker.

```bash
npm install
cp apps/api/.env.example apps/api/.env   # lalu isi BETTER_AUTH_SECRET dengan string acak
docker compose up -d
npm run db:push -w api
npm run db:seed -w api                   # data demo (tambahkan -- --reset untuk mengulang)

npm run dev:api                          # terminal 1, port 3001
npm run dev:web                          # terminal 2, http://localhost:5173
```

### Akun demo

Password semua akun: `Komisia123!` (bisa diganti lewat variabel `SEED_PASSWORD` saat seed).
Hanya untuk pengembangan lokal.

| Peran   | Email                 |
| ------- | --------------------- |
| Admin   | admin@komisia.test    |
| Manager | manager@komisia.test  |
| Sales   | sales@komisia.test    |

## Hak akses

| Tindakan                               | Admin | Manager | Sales        |
| -------------------------------------- | :---: | :-----: | :----------: |
| Lihat transaksi, ringkasan, laporan    |   ✓   |    ✓    | milik sendiri |
| Tambah, ubah, setujui/tolak transaksi  |   ✓   |    ✓    |      –       |
| Atur target sales                      |   ✓   |    ✓    |      –       |
| Lihat aturan komisi                    |   ✓   |    ✓    |      –       |
| Ubah aturan komisi, impor CSV          |   ✓   |    –    |      –       |
| Kelola pengguna, hapus transaksi       |   ✓   |    –    |      –       |

## Cara komisi dihitung

- Satu aturan aktif per ruang kerja: komisi dasar, ditambah bonus tingkatan (opsional).
- Tingkatan ditentukan dari total penjualan disetujui sales tersebut pada bulan transaksi,
  termasuk transaksi yang sedang disetujui. Hanya tingkatan tertinggi yang dipakai.
- Komisi dihitung saat transaksi **disetujui**. Jika ditolak atau dikembalikan ke Menunggu,
  komisinya dihapus. Komisi transaksi lain tidak dihitung ulang.

## Pengujian

```bash
docker exec autocomm-db psql -U autocomm -d autocomm -c "create database autocomm_test"
# jalankan db:push sekali dengan DATABASE_URL mengarah ke autocomm_test
npm test
```

Test API mengosongkan database yang dipakainya, sehingga hanya mau berjalan pada database
berakhiran `_test`.

## Belum tersedia

Ekspor PDF, pengiriman email, fitur AI, reset password oleh admin, dan halaman audit log
(aktivitas sudah dicatat dan tersedia lewat `GET /api/audit`).

## Struktur

- `apps/web` — React, TypeScript, Vite, Tailwind CSS
- `apps/api` — Express, Better Auth, Drizzle ORM, PostgreSQL
