// main.ts — program penyerahan Dompet Rumah (Node 22, pustaka standar saja).
//
// Tugasnya satu: menyalin app/ dan screenshots/ dari samping file ini ke
// direktori keluaran, lalu menulis dossier.json memakai buildDossier dari
// vendor/makefun-frontend.ts (file kit yang tidak diubah). Di luar kontainer
// grader, MAKEFUN_OUTPUT_DIR menggantikan /output:
//
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
//
// Program ini berjalan dua kali di grader dan kedua jalan harus menulis
// byte yang sama: tidak ada stempel waktu, tidak ada urutan acak —
// salinannya apa adanya, dossiernya hasil buildDossier yang deterministik.

import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

// Folder repo (tempat main.ts ini berada) dan folder keluaran.
const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Batas yang sama dengan yang dipakai scorer, supaya yang ditolak di sini
// juga akan ditolak di sana: teks dossier dibatasi 160 KiB, maksimal
// 4 screenshot @ 256 KiB, app/ maksimal 993 entri dan 16 MiB.
const DOSSIER_TEXT_MAX_BYTES = 163840;
const SCREENSHOT_LIMITS = { max: 4, max_bytes: 262144 };
const APP_LIMITS = { files: 993, bytes: 16777216 };

function siapkanOutput() {
  mkdirSync(outputDir, { recursive: true });
  rmSync(join(outputDir, 'app'), { recursive: true, force: true });
  rmSync(join(outputDir, 'screenshots'), { recursive: true, force: true });
}

function salinSitus() {
  cpSync(join(repoRoot, 'app'), join(outputDir, 'app'), { recursive: true });
  mkdirSync(join(outputDir, 'screenshots'), { recursive: true });
  if (existsSync(join(repoRoot, 'screenshots'))) {
    cpSync(join(repoRoot, 'screenshots'), join(outputDir, 'screenshots'), { recursive: true });
  }
}

function tulisDossier() {
  const dossier = buildDossier(outputDir, {
    text_max_bytes: DOSSIER_TEXT_MAX_BYTES,
    screenshots: SCREENSHOT_LIMITS,
    app_max_files: APP_LIMITS.files,
    app_max_bytes: APP_LIMITS.bytes,
  });
  writeFileSync(join(outputDir, 'dossier.json'), dossier);
}

siapkanOutput();
salinSitus();
tulisDossier();
