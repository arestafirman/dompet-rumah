// controls.js — semua kontrol interaktif Dompet Rumah: slider perencana,
// form tambah/ubah/hapus transaksi, filter + cari, tandai lunas tagihan,
// dan kalkulator tabungan. State hanya in-memory; tidak ada yang disimpan.

import { SEED } from './data.js';
import { formatRp, formatTanggal, bulanKeDepan } from './format.js';
import { totalBelanja, belanjaPerKategori, totalAnggaran, sisaAnggaran, selisihKategori, bulanMenujuTarget } from './budget.js';
import { donutChart } from './charts.js';
import { barisLedger, opsiKategori } from './pages.js';

// ---------- Perencana: slider + angka, semua berubah live tanpa render ulang ----------

export function bindRencana(state) {
  const perKategori = belanjaPerKategori(state);

  function perbaruiRingkasan() {
    const total = totalAnggaran(state);
    const sisa = sisaAnggaran(state);
    const lewat = SEED.kategori.filter((k) => selisihKategori(state, k.id) < 0).length;
    const elTotal = document.getElementById('total-anggaran');
    const elSisa = document.getElementById('sisa-anggaran');
    const elTotal2 = document.getElementById('total-anggaran-2');
    const elLewat = document.getElementById('jumlah-lewat');
    if (elTotal) elTotal.textContent = formatRp(total);
    if (elSisa) elSisa.textContent = formatRp(sisa);
    if (elTotal2) elTotal2.textContent = formatRp(total);
    if (elLewat) elLewat.textContent = lewat + ' kategori';
    const donat = document.getElementById('donat-rencana');
    if (donat) {
      const bagian = SEED.kategori.map((k) => ({ label: k.nama, nilai: state.anggaran[k.id] || 0, warna: k.warna }));
      donat.innerHTML = donutChart(bagian, 240, 36, 'anggaran');
    }
  }

  function perbaruiBaris(id) {
    const aktual = perKategori[id] || 0;
    const anggaran = state.anggaran[id] || 0;
    const selisih = anggaran - aktual;
    const teksSelisih = document.querySelector('[data-selisih="' + id + '"]');
    if (teksSelisih) teksSelisih.textContent = selisih < 0 ? 'Lewat ' + formatRp(Math.abs(selisih)) : 'Sisa ' + formatRp(selisih);
    const status = document.querySelector('[data-status="' + id + '"]');
    if (status) {
      status.innerHTML = selisih < 0
        ? '<span class="badge merah">Lewat ' + formatRp(Math.abs(selisih)) + '</span>'
        : '<span class="badge hijau">Sisa ' + formatRp(selisih) + '</span>';
    }
  }

  function terapkan(id, nilai) {
    const dibatasi = Math.max(0, Math.min(5000000, Math.round(nilai / 50000) * 50000));
    state.anggaran[id] = dibatasi;
    const slider = document.querySelector('[data-slider="' + id + '"]');
    const angka = document.querySelector('[data-angka="' + id + '"]');
    if (slider && Number(slider.value) !== dibatasi) slider.value = String(dibatasi);
    if (angka && Number(angka.value) !== dibatasi) angka.value = String(dibatasi);
    perbaruiBaris(id);
    perbaruiRingkasan();
  }

  document.querySelectorAll('[data-slider]').forEach((slider) => {
    slider.addEventListener('input', () => terapkan(slider.getAttribute('data-slider'), Number(slider.value)));
  });
  document.querySelectorAll('[data-angka]').forEach((input) => {
    input.addEventListener('change', () => terapkan(input.getAttribute('data-angka'), Number(input.value) || 0));
  });
}

// ---------- Transaksi: tambah, ubah, hapus, filter, cari ----------

let filterKategori = 'semua';
let kataKunci = '';
let idDiubah = null;

export function bindTransaksi(state, renderUlang) {
  const ledger = document.getElementById('ledger');
  const info = document.getElementById('info-ledger');

  function gambarLedger() {
    if (!ledger) return;
    const hasil = barisLedger(state, filterKategori, kataKunci);
    ledger.innerHTML = hasil.html;
    if (info) info.textContent = 'Menampilkan ' + hasil.jumlah + ' dari ' + state.transaksi.length + ' transaksi.';
    const elJumlah = document.getElementById('jumlah-transaksi');
    const elTotal = document.getElementById('total-transaksi');
    if (elJumlah) elJumlah.textContent = state.transaksi.length + ' transaksi';
    if (elTotal) elTotal.textContent = formatRp(totalBelanja(state));
    ledger.querySelectorAll('[data-hapus]').forEach((tombol) => {
      tombol.addEventListener('click', () => {
        const id = Number(tombol.getAttribute('data-hapus'));
        state.transaksi = state.transaksi.filter((t) => t.id !== id);
        if (idDiubah === id) batalUbah();
        gambarLedger();
      });
    });
    ledger.querySelectorAll('[data-ubah]').forEach((tombol) => {
      tombol.addEventListener('click', () => {
        const id = Number(tombol.getAttribute('data-ubah'));
        const t = state.transaksi.find((x) => x.id === id);
        if (!t) return;
        idDiubah = id;
        document.getElementById('f-tanggal').value = t.tanggal;
        document.getElementById('f-deskripsi').value = t.deskripsi;
        document.getElementById('f-merchant').value = t.merchant;
        document.getElementById('f-kategori').value = t.kategori;
        document.getElementById('f-jumlah').value = String(t.jumlah);
        document.getElementById('tombol-simpan').textContent = 'Simpan perubahan';
        document.getElementById('tombol-batal').hidden = false;
        document.getElementById('pesan-form').textContent = 'Mengubah transaksi ' + formatTanggal(t.tanggal) + ' — ' + t.deskripsi + '.';
        document.getElementById('form-transaksi').scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    });
  }

  function batalUbah() {
    idDiubah = null;
    const form = document.getElementById('form-transaksi');
    if (form) form.reset();
    document.getElementById('f-tanggal').value = '2026-11-26';
    document.getElementById('tombol-simpan').textContent = 'Tambah transaksi';
    document.getElementById('tombol-batal').hidden = true;
    document.getElementById('pesan-form').textContent = '';
  }

  const form = document.getElementById('form-transaksi');
  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const tanggal = document.getElementById('f-tanggal').value;
      const deskripsi = document.getElementById('f-deskripsi').value.trim();
      const merchant = document.getElementById('f-merchant').value.trim();
      const kategori = document.getElementById('f-kategori').value;
      const jumlah = Math.round(Number(document.getElementById('f-jumlah').value) || 0);
      const pesan = document.getElementById('pesan-form');
      if (!tanggal || !deskripsi || !merchant || jumlah < 1000) {
        pesan.textContent = 'Lengkapi semua isian — jumlah minimal Rp 1.000.';
        return;
      }
      if (idDiubah !== null) {
        const t = state.transaksi.find((x) => x.id === idDiubah);
        if (t) {
          t.tanggal = tanggal;
          t.deskripsi = deskripsi;
          t.merchant = merchant;
          t.kategori = kategori;
          t.jumlah = jumlah;
        }
        pesan.textContent = 'Transaksi diperbarui: ' + deskripsi + ' (' + formatRp(jumlah) + ').';
        batalUbah();
      } else {
        const idBaru = state.transaksi.reduce((m, t) => Math.max(m, t.id), 0) + 1;
        state.transaksi.push({ id: idBaru, tanggal, deskripsi, merchant, kategori, jumlah });
        pesan.textContent = 'Ditambahkan: ' + deskripsi + ' (' + formatRp(jumlah) + '). Total belanja sekarang ' + formatRp(totalBelanja(state)) + '.';
        form.reset();
        document.getElementById('f-tanggal').value = '2026-11-26';
      }
      filterKategori = 'semua';
      kataKunci = '';
      const cari = document.getElementById('cari-transaksi');
      if (cari) cari.value = '';
      document.querySelectorAll('.chip').forEach((c) => c.classList.toggle('aktif', c.getAttribute('data-filter') === 'semua'));
      gambarLedger();
    });
    document.getElementById('tombol-batal').addEventListener('click', batalUbah);
  }

  document.querySelectorAll('.chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      filterKategori = chip.getAttribute('data-filter');
      document.querySelectorAll('.chip').forEach((c) => c.classList.toggle('aktif', c === chip));
      gambarLedger();
    });
  });

  const cari = document.getElementById('cari-transaksi');
  if (cari) {
    cari.addEventListener('input', () => {
      kataKunci = cari.value;
      gambarLedger();
    });
  }

  gambarLedger();
}

// ---------- Tagihan: tandai lunas / batalkan ----------

export function bindTagihan(state, renderUlang) {
  document.querySelectorAll('[data-tagihan]').forEach((tombol) => {
    tombol.addEventListener('click', () => {
      const id = Number(tombol.getAttribute('data-tagihan'));
      const b = state.tagihan.find((x) => x.id === id);
      if (!b) return;
      b.lunas = !b.lunas;
      renderUlang();
    });
  });
}

// ---------- Tabungan: kalkulator "nabung X per bulan" ----------

export function bindTabungan(state) {
  document.querySelectorAll('[data-nabung]').forEach((input) => {
    input.addEventListener('input', () => {
      const id = input.getAttribute('data-nabung');
      const goal = state.target.find((g) => g.id === id);
      if (!goal) return;
      const perBulan = Math.max(0, Math.round(Number(input.value) || 0));
      goal.nabung = perBulan;
      const kurang = goal.target - goal.terkumpul;
      const bulan = bulanMenujuTarget(goal, perBulan);
      const kapan = bulan === null ? 'Isi jumlah nabung per bulan dulu'
        : bulan === 0 ? 'Sudah tercapai'
        : 'Tercapai sekitar ' + bulanKeDepan(bulan) + ' (' + bulan + ' bulan lagi)';
      const hasil = document.querySelector('[data-hasil="' + id + '"]');
      if (hasil) hasil.textContent = 'Kurang ' + formatRp(kurang) + ' lagi. ' + kapan + '.';
    });
  });
}
