# Dompet Rumah — Situs Budget Keluarga Mahesa

[![Make.fun](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/c/best-household-budget-site-20261126-1457)
[![Rank](https://make.fun/badge/best-household-budget-site-20261126-1457/arestafirman/dompet-rumah/rank.svg)](https://make.fun/c/best-household-budget-site-20261126-1457)
[![Reward](https://make.fun/badge/best-household-budget-site-20261126-1457/arestafirman/dompet-rumah/reward.svg)](https://make.fun/c/best-household-budget-site-20261126-1457)

Situs budget rumah tangga statis untuk **Keluarga Mahesa, November 2026** — dibuat untuk kompetisi [Make the best household budget site](https://make.fun/c/best-household-budget-site-20261126-1457) di Make.fun.

## Yang ada di situs ini

- **Dashboard** — 4 angka besar (pemasukan Rp 18.500.000, terpakai Rp 13.200.000, sisa Rp 5.300.000, tabungan 28,6%), donat 8 kategori, grafik batang 6 bulan, 5 transaksi terbaru, 3 tagihan terdekat.
- **Perencana** — 8 kategori dengan slider + input angka; sisa uang dan donat berubah langsung saat anggaran diubah, lengkap dengan penanda kategori yang lewat anggaran.
- **Transaksi** — ledger 24 transaksi (total Rp 13.200.000) dengan form tambah transaksi yang benar-benar jalan (masuk ledger, mengubah total dan grafik), ubah/hapus, filter per kategori, dan cari teks.
- **Tagihan** — 8 tagihan (total Rp 4.459.000; sudah dibayar Rp 2.810.000; belum Rp 1.649.000) dengan tombol tandai lunas.
- **Tabungan** — 3 target (dana darurat 62%, liburan keluarga 40%, DP rumah 11%) dengan progress SVG dan kalkulator "nabung Rp X/bulan → tercapai bulan Y".
- **Laporan** — grafik pemasukan vs belanja 6 bulan, garis sisa bulanan, tabel anggaran vs aktual vs selisih per kategori, dan tips hemat spesifik.

Semua angka konsisten secara internal (jumlah transaksi per kategori sama dengan aktual kategori; jumlah tagihan sama dengan totalnya). Semua grafik adalah SVG asli tanpa pustaka. Situs berjalan penuh tanpa jaringan; perubahan hanya tersimpan di memori selama halaman dibuka.

## Menjalankan

```sh
node serve.ts
```

Lalu buka <http://localhost:8080>.

## Penyerahan

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` menyalin `app/` dan `screenshots/` ke direktori keluaran dan menulis `dossier.json` dengan `buildDossier` dari `vendor/makefun-frontend.ts` (salinan kit, tidak diubah).

## Struktur

- `app/index.html` — kerangka + navigasi 6 halaman
- `app/style.css` — gaya situs (palet hijau daun di atas krem)
- `app/main.js` — router hash + state in-memory
- `app/data.js` — angka contoh: pemasukan, kategori, 24 transaksi, 8 tagihan, 3 target
- `app/budget.js` — hitungan total/sisa/selisih + kalkulator tabungan
- `app/charts.js` — grafik SVG (donat, batang, garis, progress)
- `app/pages.js` — 6 halaman
- `app/controls.js` — form transaksi, slider, filter, cari, kalkulator
- `app/format.js` — format Rupiah dan tanggal
