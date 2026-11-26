// pages.js — enam halaman Dompet Rumah sebagai string HTML.
// Setiap fungsi menerima state dan mengembalikan markup halaman itu.
// Angka dihitung lewat budget.js, grafik lewat charts.js, jadi teks dan
// grafik selalu memakai angka yang sama.

import { SEED, namaKategori } from './data.js';
import { formatRp, formatRpSigned, formatPersen, formatTanggal, formatSingkat, bulanKeDepan, escapeHtml } from './format.js';
import {
  totalBelanja, belanjaPerKategori, totalAnggaran, sisaUang, sisaAnggaran,
  persenTabungan, selisihKategori, totalTagihan, tagihanLunas, tagihanBelum,
  tagihanTerdekat, transaksiTerbaru, persenTarget, bulanMenujuTarget,
  sisaBulanan, kategoriTerbesar,
} from './budget.js';
import { donutChart, barChart, groupedBarChart, lineChart, progressChart, anggaranVsAktualChart } from './charts.js';

function kartuStat(label, nilai, sub, nada) {
  return '<div class="stat ' + (nada || '') + '"><div class="stat-label">' + label + '</div>'
    + '<div class="stat-nilai">' + nilai + '</div><div class="stat-sub">' + sub + '</div></div>';
}

function lencanaKategori(id) {
  return '<span class="chip-kat" style="--kat: ' + SEED.kategori.find((k) => k.id === id).warna + '">' + escapeHtml(namaKategori(id)) + '</span>';
}

function barisTransaksi(t) {
  return '<tr><td class="tgl">' + formatTanggal(t.tanggal) + '</td>'
    + '<td><strong>' + escapeHtml(t.deskripsi) + '</strong><span class="merchant">' + escapeHtml(t.merchant) + '</span></td>'
    + '<td>' + lencanaKategori(t.kategori) + '</td>'
    + '<td class="angka">' + formatRp(t.jumlah) + '</td>'
    + '<td class="aksi"><button type="button" class="btn-kecil" data-ubah="' + t.id + '">Ubah</button> '
    + '<button type="button" class="btn-kecil btn-hapus" data-hapus="' + t.id + '">Hapus</button></td></tr>';
}

// ---------- #/ Dashboard ----------

export function pageDashboard(state) {
  const belanja = totalBelanja(state);
  const sisa = sisaUang(state);
  const tabungan = persenTabungan(state);
  const perKategori = belanjaPerKategori(state);
  const donat = SEED.kategori.map((k) => ({ label: k.nama, nilai: perKategori[k.id] || 0, warna: k.warna }));
  const batang = SEED.bulanan.map((b) => ({ label: b.bulan, nilai: b.belanja, warna: b.bulan === 'Nov' ? '#166534' : '#a8c3ae' }));
  const terbaru = transaksiTerbaru(state, 5);
  const tagihan = tagihanTerdekat(state, 3);

  let legenda = '';
  for (const k of SEED.kategori) {
    const nilai = perKategori[k.id] || 0;
    legenda += '<li><span class="dot" style="background:' + k.warna + '"></span><span class="leg-nama">' + k.nama + '</span>'
      + '<span class="leg-nilai">' + formatRp(nilai) + '</span><span class="leg-persen">' + formatPersen((nilai / belanja) * 100) + '</span></li>';
  }

  let daftarTransaksi = '';
  for (const t of terbaru) {
    daftarTransaksi += '<li><div><strong>' + escapeHtml(t.deskripsi) + '</strong><span class="merchant">' + formatTanggal(t.tanggal) + ' • ' + escapeHtml(t.merchant) + '</span></div>'
      + '<span class="angka">' + formatRp(t.jumlah) + '</span></li>';
  }

  let daftarTagihan = '';
  for (const b of tagihan) {
    daftarTagihan += '<li><div><strong>' + escapeHtml(b.nama) + '</strong><span class="merchant">Jatuh tempo ' + b.jatuhTempo + ' Nov 2026 • belum dibayar</span></div>'
      + '<span class="angka">' + formatRp(b.jumlah) + '</span></li>';
  }

  return '<section class="page-head"><h1>Dashboard</h1>'
    + '<p>' + SEED.keluarga + ' • ' + SEED.bulan + ' • Pemasukan dari 3 sumber, 24 transaksi, 8 tagihan.</p></section>'
    + '<section class="stats">'
    + kartuStat('Pemasukan bulan ini', formatRp(state.pemasukan), 'Gaji Ayah + Gaji Ibu + usaha kue', '')
    + kartuStat('Terpakai', formatRp(belanja), formatPersen((belanja / state.pemasukan) * 100) + ' dari pemasukan', '')
    + kartuStat('Sisa untuk ditabung', formatRp(sisa), 'Sisa bulan ini, belum dibagi ke target', 'hijau')
    + kartuStat('Tingkat tabungan', formatPersen(tabungan), 'Dari setiap Rp 100 pemasukan, Rp ' + Math.round(tabungan) + ' ditabung', 'hijau')
    + '</section>'
    + '<section class="grid-2">'
    + '<div class="card"><h2>Belanja per kategori</h2><p class="card-sub">Total ' + formatRp(belanja) + ' dari 8 kategori — klik kategori di Perencana untuk mengubah anggarannya.</p>'
    + '<div class="donat-wrap">' + donutChart(donat, 200, 32) + '<ul class="legenda">' + legenda + '</ul></div></div>'
    + '<div class="card"><h2>Belanja 6 bulan terakhir</h2><p class="card-sub">September paling tinggi (' + formatRp(14200000) + ') karena ada biaya masuk sekolah. November kembali turun.</p>'
    + barChart(batang, 520, 260) + '</div>'
    + '</section>'
    + '<section class="grid-2">'
    + '<div class="card"><h2>Transaksi terbaru</h2><ul class="daftar">' + daftarTransaksi + '</ul>'
    + '<p class="card-link"><a href="#/transaksi">Lihat semua 24 transaksi →</a></p></div>'
    + '<div class="card"><h2>Tagihan terdekat</h2><p class="card-sub">3 tagihan yang belum dibayar, diurutkan dari yang paling dekat jatuh temponya.</p>'
    + '<ul class="daftar">' + daftarTagihan + '</ul>'
    + '<p class="card-link"><a href="#/tagihan">Lihat semua 8 tagihan (' + formatRp(tagihanBelum(state)) + ' belum dibayar) →</a></p></div>'
    + '</section>';
}

// ---------- #/rencana Perencana budget ----------

export function pageRencana(state) {
  const perKategori = belanjaPerKategori(state);
  const donat = SEED.kategori.map((k) => ({ label: k.nama, nilai: state.anggaran[k.id] || 0, warna: k.warna }));

  let baris = '';
  for (const k of SEED.kategori) {
    const aktual = perKategori[k.id] || 0;
    const anggaran = state.anggaran[k.id] || 0;
    const selisih = anggaran - aktual;
    const status = selisih < 0
      ? '<span class="badge merah">Lewat ' + formatRp(Math.abs(selisih)) + '</span>'
      : '<span class="badge hijau">Sisa ' + formatRp(selisih) + '</span>';
    baris += '<div class="rencana-baris" data-kat="' + k.id + '">'
      + '<div class="rencana-info"><span class="dot" style="background:' + k.warna + '"></span><div><strong>' + k.nama + '</strong>'
      + '<span class="merchant">Aktual: ' + formatRp(aktual) + ' • <span class="selisih" data-selisih="' + k.id + '">' + (selisih < 0 ? 'Lewat ' + formatRp(Math.abs(selisih)) : 'Sisa ' + formatRp(selisih)) + '</span></span></div></div>'
      + '<input type="range" min="0" max="5000000" step="50000" value="' + anggaran + '" data-slider="' + k.id + '" aria-label="Anggaran ' + k.nama + '">'
      + '<label class="rencana-input">Rp <input type="number" min="0" max="5000000" step="50000" value="' + anggaran + '" data-angka="' + k.id + '" aria-label="Anggaran ' + k.nama + ' rupiah"></label>'
      + '<span class="rencana-status" data-status="' + k.id + '">' + status + '</span></div>';
  }

  return '<section class="page-head"><h1>Perencana Budget</h1>'
    + '<p>Geser slider atau ketik angka — total anggaran, sisa uang, dan donat di bawah berubah langsung. Anggaran awal mengikuti rencana keluarga; aktual diambil dari 24 transaksi bulan ini.</p></section>'
    + '<section class="stats">'
    + kartuStat('Total anggaran', '<span id="total-anggaran">' + formatRp(totalAnggaran(state)) + '</span>', 'Dari 8 kategori', '')
    + kartuStat('Sisa dari pemasukan', '<span id="sisa-anggaran">' + formatRp(sisaAnggaran(state)) + '</span>', 'Pemasukan ' + formatRp(state.pemasukan) + ' dikurangi total anggaran', 'hijau')
    + kartuStat('Terpakai (aktual)', formatRp(totalBelanja(state)), 'Jumlah 24 transaksi bulan ini', '')
    + kartuStat('Kategori lewat anggaran', '<span id="jumlah-lewat">' + SEED.kategori.filter((k) => selisihKategori(state, k.id) < 0).length + ' kategori</span>', 'Hiburan &amp; Langganan lewat Rp 150.000', 'merah')
    + '</section>'
    + '<section class="grid-2 rencana-grid">'
    + '<div class="card"><h2>Anggaran per kategori</h2>' + baris + '</div>'
    + '<div class="card"><h2>Donat anggaran</h2><p class="card-sub">Besar potongan = besar anggaran kategori itu. Ubah slider di kiri, donat ini ikut berubah.</p>'
    + '<div class="donat-wrap donat-tengah" id="donat-rencana">' + donutChart(donat, 240, 36, 'anggaran') + '</div>'
    + '<p class="card-sub">Total anggaran <strong id="total-anggaran-2">' + formatRp(totalAnggaran(state)) + '</strong> dari pemasukan ' + formatRp(state.pemasukan) + '.</p></div>'
    + '</section>';
}

// ---------- #/transaksi Ledger ----------

export function opsiKategori(terpilih) {
  let opsi = '';
  for (const k of SEED.kategori) {
    opsi += '<option value="' + k.id + '"' + (k.id === terpilih ? ' selected' : '') + '>' + k.nama + '</option>';
  }
  return opsi;
}

export function pageTransaksi(state) {
  const belanja = totalBelanja(state);
  let chips = '<button type="button" class="chip aktif" data-filter="semua">Semua</button>';
  for (const k of SEED.kategori) {
    chips += '<button type="button" class="chip" data-filter="' + k.id + '">' + k.nama + '</button>';
  }
  return '<section class="page-head"><h1>Transaksi</h1>'
    + '<p><span id="jumlah-transaksi">' + state.transaksi.length + ' transaksi</span> • Total <span id="total-transaksi">' + formatRp(belanja) + '</span> • November 2026. Tambah transaksi baru di bawah — total, donat, dan grafik ikut berubah.</p></section>'
    + '<section class="card form-card"><h2>Tambah transaksi</h2>'
    + '<form id="form-transaksi"><div class="form-grid">'
    + '<label>Tanggal<input type="date" id="f-tanggal" value="2026-11-26" min="2026-11-01" max="2026-11-30" required></label>'
    + '<label>Deskripsi<input type="text" id="f-deskripsi" placeholder="Contoh: Belanja sayur mingguan" maxlength="80" required></label>'
    + '<label>Tempat / merchant<input type="text" id="f-merchant" placeholder="Contoh: Pasar Pagi" maxlength="60" required></label>'
    + '<label>Kategori<select id="f-kategori">' + opsiKategori('makanan') + '</select></label>'
    + '<label>Jumlah (Rp)<input type="number" id="f-jumlah" min="1000" step="1000" placeholder="250000" required></label>'
    + '</div><div class="form-aksi"><button type="submit" class="btn" id="tombol-simpan">Tambah transaksi</button>'
    + '<button type="button" class="btn btn-ghost" id="tombol-batal" hidden>Batalkan ubah</button>'
    + '<span class="form-pesan" id="pesan-form" role="status"></span></div></form></section>'
    + '<section class="card"><h2>Daftar transaksi</h2>'
    + '<div class="filter-bar"><div class="chips">' + chips + '</div>'
    + '<input type="search" id="cari-transaksi" placeholder="Cari deskripsi atau tempat…" aria-label="Cari transaksi"></div>'
    + '<div class="tabel-wrap"><table class="tabel"><thead><tr><th>Tanggal</th><th>Deskripsi</th><th>Kategori</th><th class="angka">Jumlah</th><th>Aksi</th></tr></thead>'
    + '<tbody id="ledger"></tbody></table></div>'
    + '<p class="card-sub" id="info-ledger"></p></section>';
}

export function barisLedger(state, filterKategori, kataKunci) {
  const kunci = (kataKunci || '').trim().toLowerCase();
  let daftar = state.transaksi.slice().sort((a, b) => (a.tanggal < b.tanggal ? 1 : a.tanggal > b.tanggal ? -1 : b.id - a.id));
  if (filterKategori && filterKategori !== 'semua') daftar = daftar.filter((t) => t.kategori === filterKategori);
  if (kunci) daftar = daftar.filter((t) => (t.deskripsi + ' ' + t.merchant).toLowerCase().includes(kunci));
  if (daftar.length === 0) return { html: '<tr><td colspan="5" class="kosong">Tidak ada transaksi yang cocok. Ubah filter atau kata kunci.</td></tr>', jumlah: 0 };
  return { html: daftar.map(barisTransaksi).join(''), jumlah: daftar.length };
}

// ---------- #/tagihan Tagihan ----------

export function pageTagihan(state) {
  const total = totalTagihan(state);
  const lunas = tagihanLunas(state);
  const belum = tagihanBelum(state);
  const terdekat = tagihanTerdekat(state, 1)[0];
  let baris = '';
  for (const b of state.tagihan.slice().sort((a, b2) => a.jatuhTempo - b2.jatuhTempo)) {
    baris += '<tr><td><strong>' + escapeHtml(b.nama) + '</strong></td>'
      + '<td class="tgl">' + b.jatuhTempo + ' Nov 2026</td>'
      + '<td class="angka">' + formatRp(b.jumlah) + '</td>'
      + '<td>' + (b.lunas ? '<span class="badge hijau">Lunas</span>' : '<span class="badge merah">Belum dibayar</span>') + '</td>'
      + '<td class="aksi"><button type="button" class="btn-kecil" data-tagihan="' + b.id + '">' + (b.lunas ? 'Batalkan lunas' : 'Tandai lunas') + '</button></td></tr>';
  }
  return '<section class="page-head"><h1>Tagihan</h1>'
    + '<p>8 tagihan tetap bulan ini. Tandai lunas begitu dibayar — total di bawah ikut berubah.</p></section>'
    + '<section class="stats">'
    + kartuStat('Total tagihan bulan ini', formatRp(total), '8 tagihan', '')
    + kartuStat('Sudah dibayar', formatRp(lunas), state.tagihan.filter((t) => t.lunas).length + ' dari 8 tagihan', 'hijau')
    + kartuStat('Belum dibayar', formatRp(belum), state.tagihan.filter((t) => !t.lunas).length + ' tagihan menunggu', 'merah')
    + kartuStat('Tagihan terdekat', terdekat ? terdekat.nama : 'Semua lunas', terdekat ? 'Jatuh tempo ' + terdekat.jatuhTempo + ' Nov • ' + formatRp(terdekat.jumlah) : 'Tidak ada tagihan menunggu', terdekat ? 'merah' : 'hijau')
    + '</section>'
    + '<section class="card"><h2>Semua tagihan — November 2026</h2>'
    + '<div class="tabel-wrap"><table class="tabel"><thead><tr><th>Tagihan</th><th>Jatuh tempo</th><th class="angka">Jumlah</th><th>Status</th><th>Aksi</th></tr></thead>'
    + '<tbody>' + baris + '</tbody></table></div>'
    + '<p class="card-sub">Tagihan yang sudah dibayar (' + formatRp(lunas) + ') sudah masuk ke hitungan belanja lewat transaksi. Sisa ' + formatRp(belum) + ' perlu disiapkan sebelum tanggal 25.</p></section>';
}

// ---------- #/tabungan Target tabungan ----------

export function pageTabungan(state) {
  const totalTerkumpul = state.target.reduce((j, g) => j + g.terkumpul, 0);
  const totalTarget = state.target.reduce((j, g) => j + g.target, 0);
  let kartu = '';
  for (const g of state.target) {
    const persen = persenTarget(g);
    const kurang = g.target - g.terkumpul;
    const bulan = bulanMenujuTarget(g, g.nabung);
    const kapan = bulan === null ? 'Isi jumlah nabung per bulan dulu'
      : bulan === 0 ? 'Sudah tercapai'
      : 'Tercapai sekitar ' + bulanKeDepan(bulan) + ' (' + bulan + ' bulan lagi)';
    kartu += '<div class="card goal-card"><h2>' + g.nama + '</h2>'
      + '<p class="card-sub">' + g.catatan + '</p>'
      + '<div class="goal-angka"><strong>' + formatRp(g.terkumpul) + '</strong><span> dari ' + formatRp(g.target) + ' • ' + formatPersen(persen) + '</span></div>'
      + progressChart(persen, 520, 18)
      + '<div class="kalkulator"><label>Nabung per bulan (Rp)<input type="number" min="0" step="50000" value="' + g.nabung + '" data-nabung="' + g.id + '"></label>'
      + '<p class="hasil-kalk" data-hasil="' + g.id + '">Kurang ' + formatRp(kurang) + ' lagi. ' + kapan + '.</p></div></div>';
  }
  return '<section class="page-head"><h1>Tabungan</h1>'
    + '<p>Tiga target keluarga. Ubah angka nabung per bulan — perkiraan bulan tercapai dihitung langsung.</p></section>'
    + '<section class="stats">'
    + kartuStat('Total sudah terkumpul', formatRp(totalTerkumpul), formatPersen((totalTerkumpul / totalTarget) * 100) + ' dari semua target', 'hijau')
    + kartuStat('Sisa bulan ini', formatRp(sisaUang(state)), 'Bisa dibagi ke tiga target di bawah', '')
    + kartuStat('Target paling dekat', 'Liburan keluarga', formatRp(4800000) + ' dari ' + formatRp(12000000) + ' (40%)', '')
    + kartuStat('Target paling jauh', 'DP rumah', formatRp(22000000) + ' dari ' + formatRp(200000000) + ' (11%)', '')
    + '</section>'
    + '<section class="grid-3">' + kartu + '</section>'
    + '<section class="card"><h2>Cara keluarga ini menabung</h2>'
    + '<p>Sisa ' + formatRp(sisaUang(state)) + ' bulan ini dibagi tiga: ' + formatRp(1500000) + ' ke dana darurat, ' + formatRp(800000) + ' ke liburan, dan ' + formatRp(2000000) + ' ke DP rumah. Dana darurat didahulukan — begitu mencapai ' + formatRp(50000000) + ', jatahnya dialihkan ke DP rumah.</p></section>';
}

// ---------- #/laporan Laporan bulanan ----------

const TIPS_HEMAT = [
  {
    judul: 'Makanan & Belanja Harian — Rp 3.450.000',
    isi: 'Kategori terbesar. Belanja dua kali seminggu di Pasar Pagi (2 & 18 Nov) lebih murah daripada belanja harian di minimarket. Masak bekal 4 hari seminggu bisa memangkas sekitar Rp 300.000 per bulan — hampir menutup selisih Hiburan yang lewat anggaran.',
  },
  {
    judul: 'Hiburan & Langganan — lewat Rp 150.000',
    isi: 'Satu-satunya kategori yang lewat anggaran. Paket streaming keluarga (Rp 150.000) ditambah nonton bioskop Rp 520.000 dan taman rekreasi Rp 380.000. Pilih satu langganan streaming saja dan ganti satu kali nonton bioskop dengan piknik — hemat sekitar Rp 350.000 bulan depan.',
  },
  {
    judul: 'Transportasi — Rp 1.150.000',
    isi: 'Antar-jemput anak Rp 380.000 bisa dibagi dengan tetangga yang searah, dan servis motor berkala (Rp 320.000) mencegah kerusakan besar. Target bulan depan: Rp 1.000.000.',
  },
];

export function pageLaporan(state) {
  const perKategori = belanjaPerKategori(state);
  const sisa = sisaBulanan(state);
  const garis = sisa.map((s) => ({ label: s.bulan, nilai: s.sisa }));
  const barisPerbandingan = SEED.kategori.map((k) => ({ nama: k.nama, anggaran: state.anggaran[k.id] || 0, aktual: perKategori[k.id] || 0 }));

  let barisTabel = '';
  for (const k of SEED.kategori) {
    const aktual = perKategori[k.id] || 0;
    const anggaran = state.anggaran[k.id] || 0;
    const selisih = anggaran - aktual;
    barisTabel += '<tr><td><strong>' + k.nama + '</strong></td><td class="angka">' + formatRp(anggaran) + '</td>'
      + '<td class="angka">' + formatRp(aktual) + '</td>'
      + '<td class="angka ' + (selisih < 0 ? 'merah-teks' : 'hijau-teks') + '">' + formatRpSigned(selisih) + '</td></tr>';
  }
  barisTabel += '<tr class="total-row"><td><strong>Total</strong></td><td class="angka"><strong>' + formatRp(totalAnggaran(state)) + '</strong></td>'
    + '<td class="angka"><strong>' + formatRp(totalBelanja(state)) + '</strong></td>'
    + '<td class="angka"><strong>' + formatRpSigned(totalAnggaran(state) - totalBelanja(state)) + '</strong></td></tr>';

  let tips = '';
  for (const t of TIPS_HEMAT) {
    tips += '<div class="card tip"><h3>' + t.judul + '</h3><p>' + t.isi + '</p></div>';
  }

  return '<section class="page-head"><h1>Laporan Bulanan</h1>'
    + '<p>Ringkasan Juni–November 2026: pemasukan tetap ' + formatRp(state.pemasukan) + ' per bulan, belanja naik-turun antara ' + formatRp(12800000) + ' dan ' + formatRp(14200000) + '.</p></section>'
    + '<section class="grid-2">'
    + '<div class="card"><h2>Pemasukan vs belanja — 6 bulan</h2><p class="card-sub">Hijau = pemasukan, oranye = belanja. Selisihnya adalah sisa yang ditabung.</p>'
    + groupedBarChart(sisa, 520, 280)
    + '<p class="legenda-grafik"><span class="dot" style="background:#166534"></span> Pemasukan &nbsp; <span class="dot" style="background:#d97706"></span> Belanja</p></div>'
    + '<div class="card"><h2>Sisa bulanan — 6 bulan</h2><p class="card-sub">Sisa paling kecil di September (' + formatRp(4300000) + ') saat biaya masuk sekolah jatuh. Rata-rata sisa 6 bulan: ' + formatRp(Math.round(sisa.reduce((j, s) => j + s.sisa, 0) / 6)) + '.</p>'
    + lineChart(garis, 520, 280) + '</div>'
    + '</section>'
    + '<section class="card"><h2>Anggaran vs aktual per kategori</h2><p class="card-sub">Abu-abu = anggaran, hijau = aktual dalam anggaran, merah = aktual lewat anggaran.</p>'
    + anggaranVsAktualChart(barisPerbandingan, 680)
    + '<div class="tabel-wrap"><table class="tabel"><thead><tr><th>Kategori</th><th class="angka">Anggaran</th><th class="angka">Aktual</th><th class="angka">Selisih</th></tr></thead>'
    + '<tbody>' + barisTabel + '</tbody></table></div>'
    + '<p class="card-sub">Total anggaran ' + formatRp(totalAnggaran(state)) + ' vs aktual ' + formatRp(totalBelanja(state)) + ': keluarga ini belanja ' + formatRp(totalAnggaran(state) - totalBelanja(state)) + ' di bawah anggaran — tapi satu kategori (Hiburan) tetap lewat.</p></section>'
    + '<section><h2 class="section-title">Tips hemat bulan depan</h2><div class="grid-3">' + tips + '</div></section>';
}
