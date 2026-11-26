// format.js — semua pemformatan angka dan tanggal untuk Dompet Rumah.
// Satu tugas saja: mengubah angka mentah menjadi teks Rupiah yang enak dibaca.

export function formatRp(n) {
  const num = Math.round(Number(n) || 0);
  const sign = num < 0 ? '-' : '';
  const abs = Math.abs(num).toString();
  const grouped = abs.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return sign + 'Rp ' + grouped;
}

export function formatRpSigned(n) {
  const num = Math.round(Number(n) || 0);
  if (num > 0) return '+' + formatRp(num);
  if (num < 0) return '-' + formatRp(Math.abs(num));
  return formatRp(0);
}

// Versi singkat untuk label grafik: 18500000 -> "18,5 jt", 450000 -> "450 rb".
export function formatSingkat(n) {
  const num = Math.round(Number(n) || 0);
  if (Math.abs(num) >= 1000000) {
    const jt = num / 1000000;
    const teks = (Math.round(jt * 10) / 10).toString().replace('.', ',');
    return teks + ' jt';
  }
  if (Math.abs(num) >= 1000) {
    const rb = num / 1000;
    const teks = (Math.round(rb * 10) / 10).toString().replace('.', ',');
    return teks + ' rb';
  }
  return String(num);
}

export function formatPersen(n, desimal) {
  const d = desimal === undefined ? 1 : desimal;
  return (Math.round(n * Math.pow(10, d)) / Math.pow(10, d)).toString().replace('.', ',') + '%';
}

const NAMA_BULAN = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

const BULAN_SINGKAT = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

// "2026-11-02" -> "2 Nov 2026"
export function formatTanggal(iso) {
  const parts = iso.split('-');
  const tahun = Number(parts[0]);
  const bulan = Number(parts[1]);
  const hari = Number(parts[2]);
  return hari + ' ' + BULAN_SINGKAT[bulan - 1] + ' ' + tahun;
}

// "2026-11-02" -> "2 November 2026"
export function formatTanggalPanjang(iso) {
  const parts = iso.split('-');
  return Number(parts[2]) + ' ' + NAMA_BULAN[Number(parts[1]) - 1] + ' ' + parts[0];
}

// Bulan ke-n dari November 2026 (n=1 -> Desember 2026): "Des 2027".
export function bulanKeDepan(n) {
  const total = (2026 * 12 + 10) + n;
  const tahun = Math.floor(total / 12);
  const bulan = total % 12;
  return BULAN_SINGKAT[bulan] + ' ' + tahun;
}

export function escapeHtml(teks) {
  return String(teks)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
