---
title: Modül 0 - Giriş ve Hazırlık
description: AssemblyScript'e giriş, WebAssembly temelleri, geliştirme ortamı kurulumu ve ilk projenizi oluşturma adımları.
---

# Modül 0: Giriş ve Hazırlık

AssemblyScript öğrenme yolculuğunuza hoş geldiniz! Bu modülde, AssemblyScript'in ne olduğunu, neden önemli olduğunu ve geliştirme ortamınızı nasıl hazırlayacağınızı öğreneceksiniz.

---

## Bölüm 0.1: AssemblyScript Nedir?

### WebAssembly'in Doğuşu

Web modern web uygulamaları için gittikçe daha karmaşık hale geliyor. JavaScript, yıllarca web'in tek dili olarak hizmet etti ancak performans gerektiren işlemlerde sınırlamaları vardı. İşte bu noktada **WebAssembly (Wasm)** devreye girdi.

**WebAssembly:**
- Tarayıcıda çalışan düşük seviyeli bir assembly dili
- C, C++, Rust gibi dillerden derlenebilir
- JavaScript'e göre neredeyse native performans sunar
- Boyutu küçük ve yüklenme süresi hızlıdır

### AssemblyScript'in Yeri

AssemblyScript, WebAssembly'e derlenen **TypeScript benzeri** bir dildir. Bu iki özelliği birleştirmek müthiş bir güç verir:

```typescript
// AssemblyScript kodu - TypeScript'e çok benzer!
export function topla(a: i32, b: i32): i32 {
  return a + b;
}

export function fibonacci(n: i32): i32 {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}
```

Bu kod WebAssembly binary'sine derlenir ve tarayıcıda native performansla çalışır!

### AssemblyScript vs TypeScript vs JavaScript

| Özellik | JavaScript | TypeScript | AssemblyScript |
|---------|-----------|------------|----------------|
| **Derleme** | JIT (çalışma anı) | Transpile → JS | AOT → WebAssembly |
| **Tür sistemi** | Dynamic | Static (opsiyonel) | Static (zorunlu) |
| **Performans** | Orta | Orta (JS olduğu için) | Yüksek (native yakın) |
| **Boyut** | Küçük | Küçük-Büyük | Çok küçük |
| **Başlangıç** | Anında | Hızlı | Orta (derleme gerekir) |
| **Memory yönetimi** | GC | GC | Manuel/Linear Memory |

### AssemblyScript Neden Kullanmalıyım?

#### ✅ Kullanım Alanları

1. **Görüntü İşleme (Image Processing)**
   ```typescript
   // Piksel manipülasyonu - JavaScript'ten 10-100x daha hızlı
   export function griyeCevir(pixels: Uint8Array, width: i32, height: i32): void {
     for (let i = 0; i < width * height * 4; i += 4) {
       let gri: f32 = (pixels[i] * 0.299 + pixels[i + 1] * 0.587 + pixels[i + 2] * 0.114);
       pixels[i] = gri;     // R
       pixels[i + 1] = gri; // G
       pixels[i + 2] = gri; // B
     }
   }
   ```

2. **Oyun Mantığı (Game Physics)**
   ```typescript
   // Fizik hesaplamaları
   export function cisimHareketEttir(
     x: f64, y: f64,
     vx: f64, vy: f64,
     dt: f64
   ): f64 {
     // Yerçekimi ivmesi
     const g: f64 = 9.81;
     // Yeni pozisyon
     let yeniY: f64 = y + vy * dt + 0.5 * g * dt * dt;
     return yeniY;
   }
   ```

3. **Kriptografi ve Hash Algoritmaları**
   ```typescript
   // MD5, SHA-256 gibi hash fonksiyonları
   export function CRC32Hesapla(data: Uint8Array): u32 {
     let crc: u32 = 0xFFFFFFFF;
     for (let i = 0; i < data.length; i++) {
       crc ^= unchecked(data[i]);
       for (let j = 0; j < 8; j++) {
         crc = (crc >>> 1) ^ (0xEDB88320 & -(crc & 1));
       }
     }
     return ~crc;
   }
   ```

4. **Veri Sıkıştırma**
   ```typescript
   // LZ77, Huffman, DEFLATE algoritmaları
   export const SÖZLÜK_BOYUTU: u32 = 32768;
   // ... sıkıştırma implementasyonu
   ```

5. **Emülatörler ve Sanal Makineler**
   - Game Boy emülatörleri
   - CPU simülasyonları
   - Bytecode interpreter'ları

6. **Derleyiciler ve Transpiler'lar**
   - AssemblyScript'in kendisi AssemblyScript ile yazıldı!

### AssemblyScript Ne Zaman Kullanılmamalı?

#### ❌ Kullanmamanız Gereken Durumlar

1. **Basit DOM manipülasyonları**
   ```javascript
   // Bunu JavaScript ile yapın - AssemblyScript overhead'i gereksiz
   document.getElementById("btn").addEventListener("click", () => {
     console.log("Tıklandı!");
   });
   ```

2. **API çağrıları ve I/O işlemleri**
   - WebAssembly I/O için JavaScript'e ihtiyaç duyar
   - Network istekleri JS üzerinden yapılmalı

3. **Küçük, bir kerelik işlemler**
   - Derleme overhead'i işlem süresinden uzun olabilir

### Derleyici Mimarisi

```
┌─────────────────────────────────────────────────────────────┐
│                    AssemblyScript Kaynak Kodu                │
│                       (.ts dosyaları)                        │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                   AssemblyScript Compiler (asc)              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  1. Parser & Type Checker                             │  │
│  │  2. AST → Intermediate Representation (IR)           │  │
│  │  3. Optimizations                                     │  │
│  │  4. Binaryen Code Generation                          │  │
│  └───────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                      WebAssembly Binary                       │
│                         (.wasm dosyası)                       │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Type Section    │  Function Section │  Memory Section │  │
│  │  Global Section  │  Export Section   │  Code Section   │  │
│  └───────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                    Tarayıcı / Node.js Runtime                 │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Wasm Virtual Machine (Wasm VM)                       │  │
│  │  Native Code Execution                                │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## Bölüm 0.2: Geliştirme Ortamı Kurulumu

### Adım 1: Node.js ve npm Yükleme

AssemblyScript, Node.js ekosisteminde çalışır. İlk olarak Node.js'in kurulu olup olmadığını kontrol edelim:

```bash
# Node.js versiyonu kontrol et
node --version
# v18.x.x veya üzeri önerilir

# npm versiyonu kontrol et
npm --version
# 9.x.x veya üzeri önerilir
```

Eğer kurulu değilse:

**Windows:**
1. [nodejs.org](https://nodejs.org/) adresine gidin
2. LTS (Long Term Support) versiyonunu indirin
3. Installer'ı çalıştırın

**macOS (Homebrew ile):**
```bash
brew install node
```

**Linux (Ubuntu/Debian):**
```bash
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Adım 2: Proje Klasörü Oluşturma

Terminalinizi açın ve yeni bir proje klasörü oluşturun:

```bash
# Proje klasörü oluştur
mkdir ilk-assemblyscript-projem
cd ilk-assemblyscript-projem

# npm projesi başlat
npm init -y
```

Bu işlem `package.json` dosyasını oluşturur:

```json
{
  "name": "ilk-assemblyscript-projem",
  "version": "1.0.0",
  "description": "İlk AssemblyScript projem",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

### Adım 3: AssemblyScript Derleyicisini Yükleme

```bash
# Derleyiciyi development dependency olarak yükle
npm install --save-dev assemblyscript
```

Bu şunları yapar:
- `assemblyscript` paketini `node_modules/` klasörüne indirir
- `package.json` dosyasını günceller:

```json
{
  "devDependencies": {
    "assemblyscript": "^0.27.x"
  }
}
```

### Adım 4: Proje İskeleti Oluşturma (`asinit`)

AssemblyScript, `asinit` adında pratik bir araç sunar. Bu araç, tüm proje yapısını otomatik oluşturur:

```bash
# Proje iskeleti oluştur (mevcut dizinde)
npx asinit .

# Çıktı:
# Created: assembly/
# Created: assembly/tsconfig.json
# Created: assembly/index.ts
# Created: build/
# Created: build/.gitignore
# Created: asconfig.json
# Created: package.json (updated)
# Created: tests/index.js
# Created: index.html
```

### Adım 5: Oluşturulan Yapıyı Anlama

#### Proje Klasör Yapısı

```
ilk-assemblyscript-projem/
├── assembly/              # AssemblyScript kaynak kodları
│   ├── index.ts          # Ana giriş dosyası
│   └── tsconfig.json     # TypeScript yapılandırması
├── build/                # Derlenmiş .wasm dosyaları
│   └── .gitignore        # Git için ignore kuralları
├── tests/                # Test dosyaları
│   └── index.js          # Örnek test
├── asconfig.json         # AssemblyScript derleyici yapılandırması
├── index.html            # Tarayıcı için örnek HTML
├── package.json          # NPM paket bilgileri
└── node_modules/         # NPM paketleri (yüklendikçe)
```

#### `assembly/index.ts` - Ana Kaynak Dosya

```typescript
// assembly/index.ts
// Export edilen fonksiyonlar WebAssembly modülünden erişilebilir olur

export function add(a: i32, b: i32): i32 {
  return a + b;
}
```

#### `asconfig.json` - Derleyici Yapılandırması

```json
{
  "include": [
    "./assembly/**/*.ts"
  ],
  "exclude": [
    "./node_modules"
  ],
  "extends": "assemblyscript/std/assembly.json",
  "options": {
    "module": "esm",
    "target": "mvp",
    "noEmit": false,
    "sourceMap": true,
    "optimizeLevel": 3,
    "shrinkLevel": 0,
    "converge": false,
    "noAssert": false
  },
  "targets": {
    "debug": {
      "sourceMap": true,
      "optimizeLevel": 0,
      "shrinkLevel": 0
    },
    "release": {
      "noAssert": true,
      "optimizeLevel": 3,
      "shrinkLevel": 2
    }
  }
}
```

#### `package.json` - NPM Script'leri

```json
{
  "name": "ilk-assemblyscript-projem",
  "version": "1.0.0",
  "scripts": {
    "asbuild": "npm run asbuild:debug && npm run asbuild:release",
    "asbuild:debug": "asc assembly/index.ts --target debug --outFile build/debug.wasm --sourceMap --optimizeLevel 0",
    "asbuild:release": "asc assembly/index.ts --target release --outFile build/release.wasm --optimizeLevel 3 --shrinkLevel 2 --noAssert",
    "asbuild:sim": "asc assembly/index.ts --target debug --outFile build/sim.wasm --sourceMap --optimizeLevel 0 --runtime stub",
    "test": "node tests/index.js",
    "start": "npx serve ."
  },
  "devDependencies": {
    "assemblyscript": "^0.27.x"
  }
}
```

### Adım 6: İlk Derleme

Şimdi projemizi derleyelim:

```bash
# Debug build (geliştirme için)
npm run asbuild:debug

# Release build (production için)
npm run asbuild:release

# Her ikisini birden
npm run asbuild
```

Başarılı derleme sonrası `build/` klasöründe:

```
build/
├── debug.wasm         # Debug build
├── debug.wasm.map     # Source map
├── release.wasm       # Release build (daha küçük ve hızlı)
└── release.wasm.map   # Release source map
```

### Adım 7: Test Etme

#### Node.js ile Test

```bash
npm test
```

Bu `tests/index.js` dosyasını çalıştırır:

```javascript
// tests/index.js
const fs = require("fs");
const path = require("path");

// WebAssembly modülünü yükle
const wasmPath = path.join(__dirname, "..", "build", "debug.wasm");
const wasmBuffer = fs.readFileSync(wasmPath);

async function main() {
  const module = await WebAssembly.instantiate(wasmBuffer);
  const exports = module.instance.exports;

  // add fonksiyonunu test et
  const result = exports.add(10, 20);
  console.log("10 + 20 =", result); // 10 + 20 = 30
}

main().catch(console.error);
```

#### Tarayıcı ile Test

```bash
# Basit HTTP server başlat
npm start
```

Sonra tarayıcınızda `http://localhost:3000` adresine gidin.

`index.html` dosyası:

```html
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <title>AssemblyScript Test</title>
</head>
<body>
  <h1>AssemblyScript Test</h1>
  <p>Sonuç: <span id="sonuc">Yükleniyor...</span></p>

  <script type="module">
    // WebAssembly modülünü yükle
    const response = await fetch('build/debug.wasm');
    const buffer = await response.arrayBuffer();
    const module = await WebAssembly.instantiate(buffer);
    const exports = module.instance.exports;

    // add fonksiyonunu çağır
    const sonuc = exports.add(10, 20);
    document.getElementById('sonuc').textContent = sonuc;
  </script>
</body>
</html>
```

---

## Bölüm 0.3: VS Code Geliştirme Ortamı

### VS Code Eklentileri

AssemblyScript geliştirmesi için önerilen eklentiler:

1. **AssemblyScript** (Microsoft)
   - Sözdizimi vurgulama
   - Otomatik tamamlama
   - Hata kontrolü

2. **WebAssembly** (Wabt Team)
   - `.wasm` ve `.wat` dosyaları için destek

3. **Code Runner** (Jun Han)
   - Hızlı kod çalıştırma

### VS Code Ayarları (`.vscode/settings.json`)

```json
{
  "files.associations": {
    "*.ts": "typescript"
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "vscode.typescript-language-features",
  "_assemblyscript.config": {
    "imports": {
      "env": "assembly/env"
    }
  }
}
```

### VS Code Tasks (`.vscode/tasks.json`)

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "AS: Debug Build",
      "type": "shell",
      "command": "npm run asbuild:debug",
      "group": {
        "kind": "build",
        "isDefault": false
      },
      "problemMatcher": ["$tsc"]
    },
    {
      "label": "AS: Release Build",
      "type": "shell",
      "command": "npm run asbuild:release",
      "group": {
        "kind": "build",
        "isDefault": true
      },
      "problemMatcher": ["$tsc"]
    },
    {
      "label": "AS: Test",
      "type": "shell",
      "command": "npm test",
      "group": {
        "kind": "test",
        "isDefault": true
      }
    }
  ]
}
```

Kısayollar:
- `Ctrl+Shift+B` (Windows/Linux) veya `Cmd+Shift+B` (macOS) - Build
- `Ctrl+;` (Windows/Linux) veya `Cmd+;` (macOS) - Test

---

## Bölüm 0.4: İlk Pratik Örnek

Şimdi öğrendiklerimizi pratiğe dökelim. Basit bir hesap makinesi modülü yazalım.

### Adım 1: `assembly/index.ts` Dosyasını Güncelleme

```typescript
// assembly/index.ts

/**
 * İki tam sayıyı toplar
 * @param a - İlk sayı
 * @param b - İkinci sayı
 * @returns Toplam
 */
export function topla(a: i32, b: i32): i32 {
  return a + b;
}

/**
 * İki tam sayıyı çıkarır
 */
export function cikar(a: i32, b: i32): i32 {
  return a - b;
}

/**
 * İki tam sayıyı çarpar
 */
export function carp(a: i32, b: i32): i32 {
  return a * b;
}

/**
 * İki tam sayıyı böler
 * Not: Bölme işlemi tamsayı sonucu verir
 */
export function bol(a: i32, b: i32): i32 {
  if (b === 0) {
    return 0; // Sıfıra bölme hatası
  }
  return a / b;
}

/**
 * Faktöriyel hesaplar
 * Örnek: faktoriyel(5) = 5 * 4 * 3 * 2 * 1 = 120
 */
export function faktoriyel(n: i32): i32 {
  if (n <= 1) return 1;
  let sonuc: i32 = 1;
  for (let i = i32(2); i <= n; i++) {
    sonuc *= i;
  }
  return sonuc;
}

/**
 * Fibonacci sayısını hesaplar (recursive)
 * Örnek: fibonacci(10) = 55
 */
export function fibonacci(n: i32): i32 {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

/**
 * Bir sayının karekökünü hesaplar (yaklaşık)
 * Newton-Raphson metodu
 */
export function karekok(n: f64): f64 {
  if (n < 0) return 0;
  if (n === 0) return 0;

  let x: f64 = n;
  let epsilon: f64 = 0.00001;

  while (true) {
    let yeniX: f64 = 0.5 * (x + n / x);
    if (Math.abs(yeniX - x) < epsilon) {
      return yeniX;
    }
    x = yeniX;
  }
}

/**
 * Dizideki en büyük sayıyı bulur
 */
export function enBuyuk(sayilar: Int32Array): i32 {
  if (sayilar.length === 0) return 0;

  let max: i32 = sayilar[0];
  for (let i = 1; i < sayilar.length; i++) {
    if (sayilar[i] > max) {
      max = sayilar[i];
    }
  }
  return max;
}

/**
 * Dizideki sayıların ortalamasını hesaplar
 */
export function ortalama(sayilar: Int32Array): f64 {
  if (sayilar.length === 0) return 0;

  let toplam: f64 = 0;
  for (let i = 0; i < sayilar.length; i++) {
    toplam += f64(sayilar[i]);
  }
  return toplam / f64(sayilar.length);
}
```

### Adım 2: Test Dosyası Yazma

`tests/hesap-makinesi.test.js` oluşturun:

```javascript
// tests/hesap-makinesi.test.js
const fs = require("fs");
const path = require("path");

async function test() {
  console.log("=== AssemblyScript Hesap Makinesi Testi ===\n");

  // WebAssembly modülünü yükle
  const wasmPath = path.join(__dirname, "..", "build", "debug.wasm");
  const wasmBuffer = fs.readFileSync(wasmPath);
  const module = await WebAssembly.instantiate(wasmBuffer);
  const { topla, cikar, carp, bol, faktoriyel, fibonacci, karekok, enBuyuk, ortalama } = module.instance.exports;

  // Testleri tanımla
  const tests = [
    { name: "topla(10, 20)", fn: () => topla(10, 20), expected: 30 },
    { name: "cikar(50, 25)", fn: () => cikar(50, 25), expected: 25 },
    { name: "carp(7, 8)", fn: () => carp(7, 8), expected: 56 },
    { name: "bol(100, 4)", fn: () => bol(100, 4), expected: 25 },
    { name: "faktoriyel(5)", fn: () => faktoriyel(5), expected: 120 },
    { name: "faktoriyel(0)", fn: () => faktoriyel(0), expected: 1 },
    { name: "fibonacci(10)", fn: () => fibonacci(10), expected: 55 },
    { name: "fibonacci(0)", fn: () => fibonacci(0), expected: 0 },
    { name: "karekok(16)", fn: () => karekok(16), expected: 4 },
    { name: "karekok(2)", fn: () => Math.abs(karekok(2) - 1.4142) < 0.001, expected: true }
  ];

  // Testleri çalıştır
  let gecilen = 0;
  let kalinan = 0;

  for (const test of tests) {
    try {
      const result = test.fn();
      const passed = result === test.expected;

      if (passed) {
        console.log(`✅ ${test.name} = ${result}`);
        gecilen++;
      } else {
        console.log(`❌ ${test.name} = ${result} (beklenen: ${test.expected})`);
        kalinan++;
      }
    } catch (error) {
      console.log(`💥 ${test.name} HATA: ${error.message}`);
      kalinan++;
    }
  }

  // Dizi testleri
  console.log("\n=== Dizi Testleri ===");

  // enBuyuk testi
  const dizi = new Int32Array([5, 12, 8, 23, 1, 34]);
  const maxResult = enBuyuk(dizi);
  console.log(`${maxResult === 34 ? "✅" : "❌"} enBuyuk([5,12,8,23,1,34]) = ${maxResult} (beklenen: 34)`);

  // ortalama testi
  const avgResult = ortalama(dizi);
  const avgExpected = (5 + 12 + 8 + 23 + 1 + 34) / 6;
  console.log(`${Math.abs(avgResult - avgExpected) < 0.001 ? "✅" : "❌"} ortalama([5,12,8,23,1,34]) = ${avgResult.toFixed(2)} (beklenen: ${avgExpected.toFixed(2)})`);

  console.log(`\n=== Özet ===`);
  console.log(`Geçilen: ${gecilen}`);
  console.log(`Kalan: ${kalinan}`);
  console.log(`Toplam: ${gecilen + kalinan}`);
}

test().catch(console.error);
```

### Adım 3: Çalıştırma

```bash
# Derle
npm run asbuild:debug

# Test çalıştır
node tests/hesap-makinesi.test.js
```

Beklenen çıktı:

```
=== AssemblyScript Hesap Makinesi Testi ===

✅ topla(10, 20) = 30
✅ cikar(50, 25) = 25
✅ carp(7, 8) = 56
✅ bol(100, 4) = 25
✅ faktoriyel(5) = 120
✅ faktoriyel(0) = 1
✅ fibonacci(10) = 55
✅ fibonacci(0) = 0
✅ karekok(16) = 4
✅ karekok(2) = 1.4142135623749998

=== Dizi Testleri ===
✅ enBuyuk([5,12,8,23,1,34]) = 34 (beklenen: 34)
✅ ortalama([5,12,8,23,1,34]) = 13.83 (beklenen: 13.83)

=== Özet ===
Geçilen: 12
Kalan: 0
Toplam: 12
```

---

## Bölüm 0.5: Modül 0 Özeti

### Öğrendiklerimiz

| Konu | Açıklama |
|------|----------|
| **WebAssembly** | Tarayıcıda çalışan düşük seviyeli, yüksek performanslı bytecode |
| **AssemblyScript** | TypeScript'e benzeyen, WebAssembly'e derlenen bir dil |
| **Kullanım alanları** | Görüntü işleme, oyun fizikleri, kriptografi, veri sıkıştırma |
| **Proje yapısı** | `assembly/`, `build/`, `tests/`, `asconfig.json` |
| **Derleme komutları** | `npm run asbuild:debug`, `npm run asbuild:release` |
| **Test etme** | Node.js veya tarayıcı üzerinden Wasm modülünü çağırma |

### Temel Komutlar

```bash
# Proje oluştur
mkdir projem && cd projem
npm init -y
npm install --save-dev assemblyscript
npx asinit .

# Derle
npm run asbuild:debug
npm run asbuild:release
npm run asbuild

# Test et
npm test

# Tarayıcıda test et
npm start
```

### Sık Kullanılan Dosyalar

| Dosya | Amaç |
|-------|------|
| `assembly/index.ts` | Ana kaynak kod dosyası |
| `asconfig.json` | Derleyici yapılandırması |
| `package.json` | NPM script'leri |
| `build/*.wasm` | Derlenmiş WebAssembly modülleri |
| `tests/*.js` | Test dosyaları |

### Sonraki Modül

**Modül 1: Temel Sözdizimi ve Türler**

Bir sonraki modülde:
- AssemblyScript tür sistemi detaylı olarak incelenecek
- Değişkenler, sabitler ve operatörler
- Koşullu ifadeler ve döngüler
- Fonksiyonlar ve parametreler

Hazır mısınız? 🚀
