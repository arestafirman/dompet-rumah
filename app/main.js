// main.js — router hash dan titik masuk Dompet Rumah.
// Enam rute: #/ dashboard, #/rencana, #/transaksi, #/tagihan, #/tabungan,
// #/laporan. State dibuat sekali dari SEED (data.js) dan hidup di memori
// selama halaman dibuka; menutup halaman mengulang dari angka contoh.
//
// window.__shotReady bernilai false saat halaman dirender dan true sesudahnya,
// supaya skrip screenshot tahu kapan halaman siap dipotret.

import { SEED } from './data.js';
import { pageDashboard, pageRencana, pageTransaksi, pageTagihan, pageTabungan, pageLaporan } from './pages.js';
import { bindRencana, bindTransaksi, bindTagihan, bindTabungan } from './controls.js';

const app = document.getElementById('app');
const navLinks = Array.from(document.querySelectorAll('[data-route]'));

const state = {
  pemasukan: SEED.pemasukan,
  anggaran: Object.fromEntries(SEED.kategori.map((k) => [k.id, k.anggaran])),
  transaksi: JSON.parse(JSON.stringify(SEED.transaksi)),
  tagihan: JSON.parse(JSON.stringify(SEED.tagihan)),
  target: JSON.parse(JSON.stringify(SEED.target)),
};

const RUTE = {
  '': { judul: 'Dashboard | Dompet Rumah', gambar: pageDashboard, ikat: null },
  rencana: { judul: 'Perencana Budget | Dompet Rumah', gambar: pageRencana, ikat: bindRencana },
  transaksi: { judul: 'Transaksi | Dompet Rumah', gambar: pageTransaksi, ikat: bindTransaksi },
  tagihan: { judul: 'Tagihan | Dompet Rumah', gambar: pageTagihan, ikat: bindTagihan },
  tabungan: { judul: 'Tabungan | Dompet Rumah', gambar: pageTabungan, ikat: bindTabungan },
  laporan: { judul: 'Laporan Bulanan | Dompet Rumah', gambar: pageLaporan, ikat: null },
};

function ruteAktif() {
  const hash = location.hash.replace(/^#\/?/, '').split('/')[0];
  return RUTE[hash] ? hash : '';
}

function render() {
  window.__shotReady = false;
  const kunci = ruteAktif();
  const rute = RUTE[kunci];
  document.title = rute.judul;
  for (const tautan of navLinks) {
    tautan.classList.toggle('aktif', tautan.getAttribute('data-route') === kunci);
    if (tautan.getAttribute('data-route') === kunci) tautan.setAttribute('aria-current', 'page');
    else tautan.removeAttribute('aria-current');
  }
  app.innerHTML = rute.gambar(state);
  if (rute.ikat) rute.ikat(state, render);
  window.scrollTo(0, 0);
  window.__shotReady = true;
}

window.addEventListener('hashchange', render);
render();
