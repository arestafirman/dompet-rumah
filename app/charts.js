// charts.js — semua grafik Dompet Rumah digambar sebagai SVG murni, tanpa pustaka.
// Donat, batang, garis, dan progress tabungan dihitung dari angka yang sama
// dengan yang tampil di teks, jadi grafik dan angka tidak pernah berbeda.

import { formatSingkat } from './format.js';

function koordinatPolar(cx, cy, r, sudutDerajat) {
  const sudut = ((sudutDerajat - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(sudut), cy + r * Math.sin(sudut)];
}

// Donat dari daftar {label, nilai, warna}. Lingkaran tengah menampilkan total.
export function donutChart(bagian, ukuran, tebal, labelTengah) {
  const label = labelTengah || 'terpakai';
  const total = bagian.reduce((j, b) => j + b.nilai, 0);
  const r = ukuran / 2;
  const keliling = 2 * Math.PI * (r - tebal / 2);
  let offset = 0;
  let lingkaran = '';
  for (const b of bagian) {
    if (b.nilai <= 0 || total <= 0) continue;
    const panjang = (b.nilai / total) * keliling;
    lingkaran += '<circle cx="' + r + '" cy="' + r + '" r="' + (r - tebal / 2) + '" fill="none" stroke="' + b.warna + '" stroke-width="' + tebal + '" stroke-dasharray="' + panjang.toFixed(2) + ' ' + (keliling - panjang).toFixed(2) + '" stroke-dashoffset="' + (-offset).toFixed(2) + '"/>';
    offset += panjang;
  }
  const tengah = '<text x="' + r + '" y="' + (r - 6) + '" text-anchor="middle" class="donut-total">' + formatSingkat(total) + '</text>'
    + '<text x="' + r + '" y="' + (r + 16) + '" text-anchor="middle" class="donut-label">' + label + '</text>';
  return '<svg width="' + ukuran + '" height="' + ukuran + '" viewBox="0 0 ' + ukuran + ' ' + ukuran + '" class="chart-svg" role="img" aria-label="Donat belanja per kategori, total ' + formatSingkat(total) + '">' + lingkaran + tengah + '</svg>';
}

// Batang tegak sederhana: [{label, nilai, warna}].
export function barChart(batang, lebar, tinggi, nilaiMaks) {
  const maks = nilaiMaks || Math.max.apply(null, batang.map((b) => b.nilai).concat([1]));
  const paddingBawah = 22;
  const paddingAtas = 24;
  const areaTinggi = tinggi - paddingBawah - paddingAtas;
  const slot = lebar / batang.length;
  const lebarBatang = Math.min(44, slot * 0.55);
  let isi = '';
  for (let i = 0; i < batang.length; i++) {
    const b = batang[i];
    const tinggiBatang = Math.max(2, (b.nilai / maks) * areaTinggi);
    const x = slot * i + (slot - lebarBatang) / 2;
    const y = paddingAtas + (areaTinggi - tinggiBatang);
    isi += '<rect x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + lebarBatang.toFixed(1) + '" height="' + tinggiBatang.toFixed(1) + '" rx="4" fill="' + b.warna + '"/>'
      + '<text x="' + (slot * i + slot / 2).toFixed(1) + '" y="' + (y - 6).toFixed(1) + '" text-anchor="middle" class="bar-nilai">' + formatSingkat(b.nilai) + '</text>'
      + '<text x="' + (slot * i + slot / 2).toFixed(1) + '" y="' + (tinggi - 6) + '" text-anchor="middle" class="bar-label">' + b.label + '</text>';
  }
  return '<svg viewBox="0 0 ' + lebar + ' ' + tinggi + '" class="chart-svg" role="img" aria-label="Grafik batang">' + isi + '</svg>';
}

// Batang berkelompok: dua batang per bulan (pemasukan vs belanja).
export function groupedBarChart(bulan, lebar, tinggi) {
  const maks = Math.max.apply(null, bulan.map((b) => Math.max(b.pemasukan, b.belanja)));
  const paddingBawah = 22;
  const paddingAtas = 26;
  const areaTinggi = tinggi - paddingBawah - paddingAtas;
  const slot = lebar / bulan.length;
  const lebarBatang = Math.min(26, slot * 0.28);
  let isi = '';
  for (let i = 0; i < bulan.length; i++) {
    const b = bulan[i];
    const tengah = slot * i + slot / 2;
    const tinggiMasuk = Math.max(2, (b.pemasukan / maks) * areaTinggi);
    const tinggiKeluar = Math.max(2, (b.belanja / maks) * areaTinggi);
    const yMasuk = paddingAtas + (areaTinggi - tinggiMasuk);
    const yKeluar = paddingAtas + (areaTinggi - tinggiKeluar);
    isi += '<rect x="' + (tengah - lebarBatang - 3).toFixed(1) + '" y="' + yMasuk.toFixed(1) + '" width="' + lebarBatang.toFixed(1) + '" height="' + tinggiMasuk.toFixed(1) + '" rx="3" fill="#166534"/>'
      + '<rect x="' + (tengah + 3).toFixed(1) + '" y="' + yKeluar.toFixed(1) + '" width="' + lebarBatang.toFixed(1) + '" height="' + tinggiKeluar.toFixed(1) + '" rx="3" fill="#d97706"/>'
      + '<text x="' + (tengah - lebarBatang / 2 - 3).toFixed(1) + '" y="' + (yMasuk - 6).toFixed(1) + '" text-anchor="middle" class="bar-nilai">' + formatSingkat(b.pemasukan) + '</text>'
      + '<text x="' + (tengah + lebarBatang / 2 + 3).toFixed(1) + '" y="' + (yKeluar - 6).toFixed(1) + '" text-anchor="middle" class="bar-nilai">' + formatSingkat(b.belanja) + '</text>'
      + '<text x="' + tengah.toFixed(1) + '" y="' + (tinggi - 6) + '" text-anchor="middle" class="bar-label">' + b.bulan + '</text>';
  }
  return '<svg viewBox="0 0 ' + lebar + ' ' + tinggi + '" class="chart-svg" role="img" aria-label="Grafik batang pemasukan dan belanja 6 bulan">' + isi + '</svg>';
}

// Grafik garis sisa bulanan dengan titik dan label nilai.
export function lineChart(titik, lebar, tinggi) {
  const nilai = titik.map((t) => t.nilai);
  const min = Math.min.apply(null, nilai);
  const maks = Math.max.apply(null, nilai);
  const rentang = Math.max(1, maks - min);
  const bawah = 24;
  const atas = 26;
  const areaTinggi = tinggi - bawah - atas;
  const padX = 32;
  const slot = (lebar - padX * 2) / (titik.length - 1 || 1);
  const posisi = titik.map((t, i) => {
    const x = padX + slot * i;
    const y = atas + areaTinggi * (1 - (t.nilai - min) / rentang);
    return { x, y, label: t.label, nilai: t.nilai };
  });
  const garis = posisi.map((p, i) => (i === 0 ? 'M' : 'L') + p.x.toFixed(1) + ' ' + p.y.toFixed(1)).join(' ');
  let isi = '<path d="' + garis + '" fill="none" stroke="#166534" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>';
  for (const p of posisi) {
    isi += '<circle cx="' + p.x.toFixed(1) + '" cy="' + p.y.toFixed(1) + '" r="5" fill="#faf6ee" stroke="#166534" stroke-width="3"/>'
      + '<text x="' + p.x.toFixed(1) + '" y="' + (p.y - 12).toFixed(1) + '" text-anchor="middle" class="bar-nilai">' + formatSingkat(p.nilai) + '</text>'
      + '<text x="' + p.x.toFixed(1) + '" y="' + (tinggi - 6) + '" text-anchor="middle" class="bar-label">' + p.label + '</text>';
  }
  return '<svg viewBox="0 0 ' + lebar + ' ' + tinggi + '" class="chart-svg" role="img" aria-label="Grafik garis sisa bulanan">' + isi + '</svg>';
}

// Bilah progress tabungan sebagai SVG: trek abu-abu + isi hijau sesuai persen.
export function progressChart(persen, lebar, tinggi) {
  const p = Math.max(0, Math.min(100, persen));
  const isi = (p / 100) * lebar;
  return '<svg viewBox="0 0 ' + lebar + ' ' + tinggi + '" class="chart-svg progress-svg" role="img" aria-label="Progress ' + Math.round(p) + ' persen">'
    + '<rect x="0" y="0" width="' + lebar + '" height="' + tinggi + '" rx="' + (tinggi / 2) + '" fill="#e7e0d2"/>'
    + '<rect x="0" y="0" width="' + isi.toFixed(1) + '" height="' + tinggi + '" rx="' + (tinggi / 2) + '" fill="#166534"/>'
    + '</svg>';
}

// Batang horizontal anggaran vs aktual per kategori (laporan).
export function anggaranVsAktualChart(baris, lebar) {
  const tinggiBaris = 46;
  const tinggi = baris.length * tinggiBaris + 8;
  const maks = Math.max.apply(null, baris.map((b) => Math.max(b.anggaran, b.aktual)));
  const xAwal = 190;
  const lebarMaks = lebar - xAwal - 70;
  let isi = '';
  for (let i = 0; i < baris.length; i++) {
    const b = baris[i];
    const y = 8 + i * tinggiBaris;
    const lebarAnggaran = Math.max(2, (b.anggaran / maks) * lebarMaks);
    const lebarAktual = Math.max(2, (b.aktual / maks) * lebarMaks);
    isi += '<text x="0" y="' + (y + 11) + '" class="bar-label" text-anchor="start">' + b.nama + '</text>'
      + '<rect x="' + xAwal + '" y="' + y + '" width="' + lebarAnggaran.toFixed(1) + '" height="9" rx="4" fill="#d6cdb8"/>'
      + '<rect x="' + xAwal + '" y="' + (y + 13) + '" width="' + lebarAktual.toFixed(1) + '" height="9" rx="4" fill="' + (b.aktual > b.anggaran ? '#dc2626' : '#166534') + '"/>'
      + '<text x="' + (xAwal + Math.max(lebarAnggaran, lebarAktual) + 8).toFixed(1) + '" y="' + (y + 16) + '" class="bar-nilai" text-anchor="start">' + formatSingkat(b.aktual) + '</text>';
  }
  return '<svg viewBox="0 0 ' + lebar + ' ' + tinggi + '" class="chart-svg" role="img" aria-label="Batang anggaran lawan aktual per kategori">' + isi + '</svg>';
}

export { koordinatPolar };
