const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const rootDir = path.resolve(__dirname, '..');

function readRepoFile(relativePath) {
  const fullPath = path.join(rootDir, relativePath);
  assert.ok(fs.existsSync(fullPath), `File ${relativePath} harus ada di repositori`);
  return fs.readFileSync(fullPath, 'utf8');
}

test('Semua file wajib UTS DevOps tersedia di repositori', () => {
  const requiredFiles = [
    'index.html',
    'style.css',
    'Dockerfile',
    '.dockerignore',
    'compose.yaml',
    '.env.example',
    '.gitignore',
    '.gitlab-ci.yml',
    'README.md',
    'package.json'
  ];

  for (const file of requiredFiles) {
    assert.ok(fs.existsSync(path.join(rootDir, file)), `File wajib tidak ditemukan: ${file}`);
  }
});

test('Struktur index.html valid dan memuat bagian portofolio utama', () => {
  const html = readRepoFile('index.html');
  assert.match(html, /<!DOCTYPE html>/i);
  assert.match(html, /<html lang="id">/);
  assert.match(html, /<title>Developer Portfolio<\/title>/);
  assert.match(html, /<link rel="stylesheet" href="style\.css">/);
  assert.match(html, /id="about"/);
  assert.match(html, /id="skills"/);
  assert.match(html, /id="projects"/);
  assert.match(html, /Satrio/);
  assert.match(html, /Hendrik/);
});

test('File style.css memuat selector styling utama', () => {
  const css = readRepoFile('style.css');
  assert.ok(css.trim().length > 100, 'style.css tidak boleh kosong');
  assert.match(css, /\.hero\s*\{/);
  assert.match(css, /\.skill-list\s*\{/);
  assert.match(css, /\.project-card\s*\{/);
});

test('Dockerfile menggunakan base image versi spesifik dan bukan latest', () => {
  const dockerfile = readRepoFile('Dockerfile');
  const fromMatch = dockerfile.match(/^FROM\s+([^\s]+)/m);
  assert.ok(fromMatch, 'Dockerfile harus memiliki instruksi FROM');
  const baseImage = fromMatch[1];
  assert.ok(baseImage.includes(':'), 'Base image harus memiliki tag versi');
  assert.ok(!baseImage.endsWith(':latest'), 'Base image tidak boleh memakai tag :latest');
  assert.match(dockerfile, /EXPOSE\s+80/);
  assert.match(dockerfile, /HEALTHCHECK/);
});

test('compose.yaml memiliki konfigurasi service web dengan image tag versi', () => {
  const compose = readRepoFile('compose.yaml');
  assert.match(compose, /services:/);
  assert.match(compose, /web:/);
  assert.match(compose, /image:\s*devops-v:\$\{IMAGE_TAG:-1\.0\.0\}/);
  assert.match(compose, /\$\{APP_PORT:-8080\}:80/);
});

test('Repositori tidak mengandung token atau API key sensitif', () => {
  const filesToCheck = [
    'index.html',
    'style.css',
    'Dockerfile',
    'compose.yaml',
    '.env.example',
    '.gitlab-ci.yml',
    'README.md'
  ];

  const secretPatterns = [/ghp_[A-Za-z0-9]{20,}/, /glpat-[A-Za-z0-9\-_]{15,}/, /AKIA[0-9A-Z]{16}/];

  for (const file of filesToCheck) {
    const content = readRepoFile(file);
    for (const pattern of secretPatterns) {
      assert.doesNotMatch(content, pattern, `Terdeteksi pola rahasia di ${file}`);
    }
  }
});
