// data.js — angka contoh (seed) Dompet Rumah: Keluarga Mahesa, November 2026.
// Semua angka konsisten: total aktual 8 kategori = Rp 13.200.000,
// pemasukan Rp 18.500.000, sisa Rp 5.300.000, tabungan 28,6%.
// Nama warung, toko, dan merchant di bawah ini fiktif.

export const SEED = {
  keluarga: 'Keluarga Mahesa',
  bulan: 'November 2026',
  pemasukan: 18500000,
  sumberPemasukan: [
    { nama: 'Gaji Ayah (Rudi Mahesa)', jumlah: 12500000 },
    { nama: 'Gaji Ibu (Sari Mahesa)', jumlah: 5000000 },
    { nama: 'Usaha sampingan (kue kering)', jumlah: 1000000 },
  ],
  kategori: [
    { id: 'makanan', nama: 'Makanan & Belanja Harian', anggaran: 3600000, warna: '#16a34a', ikon: 'M' },
    { id: 'transportasi', nama: 'Transportasi', anggaran: 1200000, warna: '#0284c7', ikon: 'T' },
    { id: 'hunian', nama: 'Hunian', anggaran: 2400000, warna: '#b45309', ikon: 'H' },
    { id: 'pendidikan', nama: 'Pendidikan Anak', anggaran: 2800000, warna: '#7c3aed', ikon: 'P' },
    { id: 'kesehatan', nama: 'Kesehatan', anggaran: 800000, warna: '#dc2626', ikon: 'K' },
    { id: 'hiburan', nama: 'Hiburan & Langganan', anggaran: 900000, warna: '#db2777', ikon: 'L' },
    { id: 'pakaian', nama: 'Pakaian & Perawatan', anggaran: 700000, warna: '#0891b2', ikon: 'B' },
    { id: 'lain', nama: 'Lain-lain', anggaran: 1300000, warna: '#65a30d', ikon: 'X' },
  ],
  // 24 transaksi. Jumlah per kategori sama persis dengan aktual kategori:
  // Makanan 3.450.000 (6), Transportasi 1.150.000 (3), Hunian 2.350.000 (3),
  // Pendidikan 2.800.000 (3), Kesehatan 700.000 (2), Hiburan 1.050.000 (3),
  // Pakaian 550.000 (2), Lain-lain 1.150.000 (2).
  transaksi: [
    { id: 1, tanggal: '2026-11-01', deskripsi: 'Sewa rumah bulan November', merchant: 'Pemilik kontrakan', kategori: 'hunian', jumlah: 1200000 },
    { id: 2, tanggal: '2026-11-02', deskripsi: 'Belanja mingguan sayur & lauk', merchant: 'Pasar Pagi', kategori: 'makanan', jumlah: 850000 },
    { id: 3, tanggal: '2026-11-03', deskripsi: 'Bensin motor & mobil', merchant: 'SPBU Cikini', kategori: 'transportasi', jumlah: 450000 },
    { id: 4, tanggal: '2026-11-03', deskripsi: 'SPP November', merchant: 'Sekolah Cahaya Bangsa', kategori: 'pendidikan', jumlah: 1800000 },
    { id: 5, tanggal: '2026-11-05', deskripsi: 'Beras 10 kg & minyak goreng', merchant: 'Toko Bu Sari', kategori: 'makanan', jumlah: 620000 },
    { id: 6, tanggal: '2026-11-06', deskripsi: 'Periksa gigi anak', merchant: 'Klinik Sehat Keluarga', kategori: 'kesehatan', jumlah: 450000 },
    { id: 7, tanggal: '2026-11-07', deskripsi: 'Perbaiki keran bocor', merchant: 'Tukang Ledeng', kategori: 'hunian', jumlah: 750000 },
    { id: 8, tanggal: '2026-11-08', deskripsi: 'Nonton akhir pekan berempat', merchant: 'Bioskop Keluarga', kategori: 'hiburan', jumlah: 520000 },
    { id: 9, tanggal: '2026-11-09', deskripsi: 'Makan siang keluarga', merchant: 'Warung Bu Tini', kategori: 'makanan', jumlah: 540000 },
    { id: 10, tanggal: '2026-11-10', deskripsi: 'Buku & alat tulis semester', merchant: 'Toko Buku Pelajar', kategori: 'pendidikan', jumlah: 650000 },
    { id: 11, tanggal: '2026-11-11', deskripsi: 'Antar-jemput anak sekolah', merchant: 'Ojek Langganan', kategori: 'transportasi', jumlah: 380000 },
    { id: 12, tanggal: '2026-11-12', deskripsi: 'Susu, roti & camilan', merchant: 'Minimarket Sejahtera', kategori: 'makanan', jumlah: 480000 },
    { id: 13, tanggal: '2026-11-13', deskripsi: 'Seragam & kaus anak', merchant: 'Toko Baju Anak', kategori: 'pakaian', jumlah: 320000 },
    { id: 14, tanggal: '2026-11-14', deskripsi: 'Vitamin & obat flu', merchant: 'Apotek Sehat', kategori: 'kesehatan', jumlah: 250000 },
    { id: 15, tanggal: '2026-11-15', deskripsi: 'Tiket masuk & wahana', merchant: 'Taman Rekreasi', kategori: 'hiburan', jumlah: 380000 },
    { id: 16, tanggal: '2026-11-16', deskripsi: 'Cat & lampu dapur', merchant: 'Toko Bangunan Jaya', kategori: 'hunian', jumlah: 400000 },
    { id: 17, tanggal: '2026-11-17', deskripsi: 'Les matematika 4 pertemuan', merchant: 'Les Privat Bu Ratna', kategori: 'pendidikan', jumlah: 350000 },
    { id: 18, tanggal: '2026-11-18', deskripsi: 'Belanja mingguan kedua', merchant: 'Pasar Pagi', kategori: 'makanan', jumlah: 560000 },
    { id: 19, tanggal: '2026-11-19', deskripsi: 'Servis AC & isi freon', merchant: 'Teknisi AC', kategori: 'lain', jumlah: 700000 },
    { id: 20, tanggal: '2026-11-20', deskripsi: 'Ganti oli & servis ringan', merchant: 'Bengkel Pak Joko', kategori: 'transportasi', jumlah: 320000 },
    { id: 21, tanggal: '2026-11-21', deskripsi: 'Paket keluarga sebulan', merchant: 'Langganan Streaming', kategori: 'hiburan', jumlah: 150000 },
    { id: 22, tanggal: '2026-11-22', deskripsi: 'Baju kerja Ayah', merchant: 'Pasar Sandang', kategori: 'pakaian', jumlah: 230000 },
    { id: 23, tanggal: '2026-11-24', deskripsi: 'Jajan sekolah seminggu', merchant: 'Kantin Sekolah', kategori: 'makanan', jumlah: 400000 },
    { id: 24, tanggal: '2026-11-25', deskripsi: 'Amplop kondangan tetangga', merchant: 'Kondangan', kategori: 'lain', jumlah: 450000 },
  ],
  // 8 tagihan. Total Rp 4.459.000; sudah dibayar Rp 2.810.000; belum Rp 1.649.000.
  tagihan: [
    { id: 1, nama: 'SPP sekolah', jumlah: 1800000, jatuhTempo: 3, lunas: true },
    { id: 2, nama: 'Listrik', jumlah: 425000, jatuhTempo: 5, lunas: true },
    { id: 3, nama: 'Air', jumlah: 185000, jatuhTempo: 7, lunas: true },
    { id: 4, nama: 'Internet rumah', jumlah: 350000, jatuhTempo: 10, lunas: true },
    { id: 5, nama: 'Iuran RT', jumlah: 50000, jatuhTempo: 10, lunas: true },
    { id: 6, nama: 'Cicilan motor', jumlah: 850000, jatuhTempo: 15, lunas: false },
    { id: 7, nama: 'Langganan streaming', jumlah: 149000, jatuhTempo: 20, lunas: false },
    { id: 8, nama: 'Asuransi kesehatan', jumlah: 650000, jatuhTempo: 25, lunas: false },
  ],
  // Pemasukan flat Rp 18.500.000 per bulan, Juni–November 2026.
  bulanan: [
    { bulan: 'Jun', belanja: 12800000 },
    { bulan: 'Jul', belanja: 13500000 },
    { bulan: 'Agu', belanja: 13100000 },
    { bulan: 'Sep', belanja: 14200000 },
    { bulan: 'Okt', belanja: 12900000 },
    { bulan: 'Nov', belanja: 13200000 },
  ],
  target: [
    { id: 'darurat', nama: 'Dana darurat', terkumpul: 31000000, target: 50000000, nabung: 1500000, catatan: 'Untuk 3 bulan biaya hidup kalau ada keadaan mendesak.' },
    { id: 'liburan', nama: 'Liburan keluarga', terkumpul: 4800000, target: 12000000, nabung: 800000, catatan: 'Liburan akhir tahun ke pantai — tiket, hotel, dan jajan.' },
    { id: 'rumah', nama: 'DP rumah', terkumpul: 22000000, target: 200000000, nabung: 2000000, catatan: 'Uang muka rumah sendiri, dikumpul pelan-pelan tiap bulan.' },
  ],
};

export function namaKategori(id) {
  const ketemu = SEED.kategori.find((k) => k.id === id);
  return ketemu ? ketemu.nama : id;
}

export function warnaKategori(id) {
  const ketemu = SEED.kategori.find((k) => k.id === id);
  return ketemu ? ketemu.warna : '#78716c';
}
