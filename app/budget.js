// budget.js — semua hitungan Dompet Rumah: total, sisa, selisih, dan kalkulator tabungan.
// Fungsi murni atas state (in-memory): tidak membaca atau menulis penyimpanan apa pun.

import { SEED } from './data.js';

export function totalBelanja(state) {
  return state.transaksi.reduce((jumlah, t) => jumlah + t.jumlah, 0);
}

export function belanjaPerKategori(state) {
  const hasil = {};
  for (const k of SEED.kategori) hasil[k.id] = 0;
  for (const t of state.transaksi) {
    if (hasil[t.kategori] === undefined) hasil[t.kategori] = 0;
    hasil[t.kategori] += t.jumlah;
  }
  return hasil;
}

export function totalAnggaran(state) {
  return SEED.kategori.reduce((jumlah, k) => jumlah + (state.anggaran[k.id] || 0), 0);
}

export function sisaUang(state) {
  return state.pemasukan - totalBelanja(state);
}

export function sisaAnggaran(state) {
  return state.pemasukan - totalAnggaran(state);
}

export function persenTabungan(state) {
  if (state.pemasukan <= 0) return 0;
  return (sisaUang(state) / state.pemasukan) * 100;
}

// Selisih per kategori: positif = masih ada sisa anggaran, negatif = lewat anggaran.
export function selisihKategori(state, idKategori) {
  const anggaran = state.anggaran[idKategori] || 0;
  const aktual = belanjaPerKategori(state)[idKategori] || 0;
  return anggaran - aktual;
}

export function totalTagihan(state) {
  return state.tagihan.reduce((jumlah, t) => jumlah + t.jumlah, 0);
}

export function tagihanLunas(state) {
  return state.tagihan.filter((t) => t.lunas).reduce((jumlah, t) => jumlah + t.jumlah, 0);
}

export function tagihanBelum(state) {
  return state.tagihan.filter((t) => !t.lunas).reduce((jumlah, t) => jumlah + t.jumlah, 0);
}

export function tagihanTerdekat(state, jumlah) {
  return state.tagihan
    .filter((t) => !t.lunas)
    .slice()
    .sort((a, b) => a.jatuhTempo - b.jatuhTempo)
    .slice(0, jumlah);
}

export function transaksiTerbaru(state, jumlah) {
  return state.transaksi
    .slice()
    .sort((a, b) => (a.tanggal < b.tanggal ? 1 : a.tanggal > b.tanggal ? -1 : b.id - a.id))
    .slice(0, jumlah);
}

export function persenTarget(goal) {
  if (goal.target <= 0) return 0;
  return Math.min(100, (goal.terkumpul / goal.target) * 100);
}

// Berapa bulan lagi target tercapai kalau nabung sebesar `perBulan` tiap bulan.
// Mengembalikan null kalau perBulan <= 0 (tidak pernah tercapai), 0 kalau sudah tercapai.
export function bulanMenujuTarget(goal, perBulan) {
  const kurang = goal.target - goal.terkumpul;
  if (kurang <= 0) return 0;
  if (!perBulan || perBulan <= 0) return null;
  return Math.ceil(kurang / perBulan);
}

// Sisa bulanan per bulan dari series 6 bulan (pemasukan flat dikurangi belanja).
export function sisaBulanan(state) {
  return SEED.bulanan.map((b) => ({
    bulan: b.bulan,
    pemasukan: state.pemasukan,
    belanja: b.belanja,
    sisa: state.pemasukan - b.belanja,
  }));
}

// Kategori dengan belanja terbesar, untuk tips hemat di halaman laporan.
export function kategoriTerbesar(state) {
  const perKategori = belanjaPerKategori(state);
  return SEED.kategori
    .map((k) => ({ ...k, aktual: perKategori[k.id] || 0 }))
    .sort((a, b) => b.aktual - a.aktual);
}
