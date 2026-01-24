---
title: Modül 7-8-9-10 - Derleyici, Best Practices, Projeler ve Ekosistem
description: Derleyici kullanımı, portability, performans ipuçları, pratik projeler, topluluk paketleri ve öğrenme kaynakları.
---

# Modül 7: Derleyici Kullanımı

Derleyici seçenekleri, yapılandırma dosyaları ve transform API'yi öğrenin.

---

## Bölüm 7.1: Komut Satırı Seçenekleri

```bash
# Temel kullanım
asc input.ts --output output.wasm

# Optimizasyon
asc input.ts -O                       # Varsayılan optimizasyon
asc input.ts -O3z                     # Maksimum optimizasyon
asc input.ts --optimizeLevel 3        # Seviye 3
asc input.ts --shrinkLevel 2          # Boyut küçültme

# Debug
asc input.ts --debug                  # Debug bilgisi
asc input.ts --sourceMap              # Source map oluştur
asc input.ts --sourceMap url          # Source map URL ile

# Çıktı formatları
asc input.ts --outFile out.wasm       # Binary output
asc input.ts --textFile out.wat       # Text format output

# Bindings
asc input.ts --bindings esm           # ESM bindings
asc input.ts --bindings raw           # Raw bindings

# Features
asc input.ts --enable simd            # SIMD aktifleştir
asc input.ts --enable threads         # Threading aktifleştir
asc input.ts --enable reference-types # Reference types aktifleştir
asc input.ts --disable mutable-globals # Mutable globals pasifleştir

# Runtime
asc input.ts --runtime incremental    # Default runtime
asc input.ts --runtime minimal        # Minimal runtime
asc input.ts --runtime stub           # Stub runtime (no GC)
asc input.ts --exportRuntime          # Runtime export et

# Memory
asc input.ts --importMemory           # Memory import et
asc input.ts --initialMemory 10        # 10 sayfa (640KB)
asc input.ts --maximumMemory 100       # Maksimum 100 sayfa

# Diğer
asc input.ts --noAssert               # Assertion'ları kaldır
asc input.ts --converge               # Tekrarlı optimizasyon
asc input.ts --stats                  # İstatistik yazdır
```

---

## Bölüm 7.2: asconfig.json Yapılandırması

```json
{
  "extends": "./base/asconfig.json",

  "entries": [
    "./assembly/index.ts"
  ],

  "options": {
    "target": "mvp",
    "module": "esm",
    "noEmit": false,
    "sourceMap": true,
    "optimizeLevel": 3,
    "shrinkLevel": 0,
    "converge": false,
    "noAssert": false,
    "runtime": "incremental",
    "importMemory": false,
    "exportMemory": true,
    "initialMemory": 256,
    "maximumMemory": 0,
    "memoryBase": 0,
    "tableBase": 0,
    "exportTable": false,
    "importTable": false,
    "exportStart": "",
    "binaryen": {
      "trapMode": "allow"
    }
  },

  "targets": {
    "debug": {
      "sourceMap": true,
      "optimizeLevel": 0,
      "shrinkLevel": 0,
      "debug": true,
      "noAssert": false
    },

    "release": {
      "optimizeLevel": 3,
      "shrinkLevel": 2,
      "noAssert": true,
      "converge": true
    },

    "release-simd": {
      "optimizeLevel": 3,
      "shrinkLevel": 2,
      "noAssert": true,
      "enable": ["simd"]
    },

    "debug-simd": {
      "sourceMap": true,
      "optimizeLevel": 0,
      "enable": ["simd"]
    }
  }
}
```

---

## Bölüm 7.3: Transform API

```typescript
// myTransform.ts
import { Transform } from "assemblyscript/transform";

export default class MyTransform extends Transform {
  // Parsing sonrası
  afterParse(parser: Parser): void {
    console.log("Parsing tamamlandı");
  }

  // Program başlatma sonrası
  afterInitialize(program: Program): void {
    console.log("Program başlatıldı");

    // Tüm fonksiyonları bul
    for (let [name, fn] of program.sources) {
      // ... analiz ve değişiklik
    }
  }

  // Derleme sonrası
  afterCompile(module: Module): void {
    console.log("Derleme tamamlandı");

    // Module manipulation
    // ...
  }
}
```

```bash
# Transform kullan
asc input.ts --transform ./myTransform.ts
```

---

# Modül 8: Portability ve Best Practices

Taşınabilir kod yazma ve performans optimizasyonu.

---

## Bölüm 8.1: Portable Code

```typescript
// ✅ Portable - hem AS hem TS'te çalışır
let a: i32 = 10;
let b: f64 = f64(a);  // Portable conversion

// ❌ Non-portable - sadece AS'te çalışır
let c: i32 = <i32>3.14;

// Portable overflow
function portableAdd(a: u8, b: u8): u8 {
  return u8(a + b);  // TS: (a + b) & 0xFF
}

// Portable float to int
function portableFtoI(x: f64): i32 {
  return i32(x);  // TS: x | 0
}
```

---

## Bölüm 8.2: Performance Tips

```typescript
// ✅ Hızlı - cache length
function hizli(dizi: Int32Array): i32 {
  let n: i32 = dizi.length;
  let toplam: i32 = 0;
  for (let i: i32 = 0; i < n; i++) {
    toplam += dizi[i];
  }
  return toplam;
}

// ❌ Yavaş - her iteration'da length
function yavas(dizi: Int32Array): i32 {
  let toplam: i32 = 0;
  for (let i: i32 = 0; i < dizi.length; i++) {  // Length her seferinde
    toplam += dizi[i];
  }
  return toplam;
}
```

---

## Bölüm 8.3: Memory Patterns

```typescript
// Stack allocation (hızlı, küçük)
function stackOrnek(): void {
  let buffer: Int32Array = new Int32Array(100);  // Stack'de
  // ... kullan
}

// Heap allocation (yavaş, büyük)
function heapOrnek(): usize {
  let ptr: usize = heap.alloc(sizeof<i32>() * 100);
  // ... kullan
  heap.free(ptr);
  return ptr;
}
```

---

# Modül 9: Pratik Projeler

Gerçek dünya projeleri için örnekler.

---

## Bölüm 9.1: Görüntü İşleme

```typescript
export function grayscale(
  pixels: Uint8Array,
  width: i32,
  height: i32
): void {
  for (let i: i32 = 0; i < width * height * 4; i += 4) {
    let r: f64 = f64(pixels[i]);
    let g: f64 = f64(pixels[i + 1]);
    let b: f64 = f64(pixels[i + 2]);
    let gray: u8 = u8(0.299 * r + 0.587 * g + 0.114 * b);
    pixels[i] = gray;
    pixels[i + 1] = gray;
    pixels[i + 2] = gray;
  }
}
```

---

## Bölüm 9.2: Oyun Fiziği

```typescript
class Particle {
  x: f64;
  y: f64;
  vx: f64;
  vy: f64;

  update(dt: f64, gravity: f64): void {
    this.vy += gravity * dt;
    this.x += this.vx * dt;
    this.y += this.vy * dt;
  }
}

export function updateParticles(
  particles: Particle[],
  dt: f64,
  gravity: f64
): void {
  for (let i: i32 = 0; i < particles.length; i++) {
    particles[i].update(dt, gravity);
  }
}
```

---

## Bölüm 9.3: Kriptografi

```typescript
export function crc32(data: Uint8Array): u32 {
  let crc: u32 = 0xFFFFFFFF;
  for (let i: i32 = 0; i < data.length; i++) {
    crc ^= u32(data[i]);
    for (let j: i32 = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (0xEDB88320 & -(crc & 1));
    }
  }
  return ~crc;
}
```

---

# Modül 10: Ekosistem ve Kaynaklar

Topluluk projeleri ve kaynaklar.

---

## Bölüm 10.1: Topluluk Paketleri

```
json-as           → JSON parsing
assemblyscript-regex → Regex support
as-pect           → Testing framework
asls              → Language server
```

---

## Bölüm 10.2: Öğrenme Kaynakları

- AssemblyScript Docs: https://www.assemblyscript.org
- WebAssembly Docs: https://webassembly.org
- WasmByExample: https://wasmbyexample.dev
- GitHub: https://github.com/AssemblyScript/assemblyscript

---

## Bölüm 10.3: Müfredat Sonuçları

### Modül Listesi

| Modül | Konu |
|-------|------|
| 0 | Giriş ve Hazırlık |
| 1 | Temel Sözdizimi ve Türler |
| 2 | Fonksiyonlar ve Kontrol Yapıları |
| 3 | Nesne Yönelimli Programlama |
| 4 | Standart Kütüphane |
| 5 | WebAssembly Entegrasyonu |
| 6 | İleri Seviye Özellikler |
| 7 | Derleyici Kullanımı |
| 8 | Portability ve Best Practices |
| 9 | Pratik Projeler |
| 10 | Ekosistem ve Kaynaklar |

### Tebrikler! 🎉

AssemblyScript öğrenme yolculuğunuzu tamamladınız!

Artık:
- ✅ Yüksek performanslı WebAssembly modülleri yazabilirsiniz
- ✅ JavaScript ile entegre uygulamalar geliştirebilirsiniz
- ✅ SIMD ve atomics kullanarak optimize edebilirsiniz
- ✅ Profesyonel projeler oluşturabilirsiniz

Sıradaki adım: Kendi projenizi oluşturun! 🚀
