---
title: Modül 5 - WebAssembly Entegrasyonu
description: JavaScript ile WebAssembly arasındaki iletişim, import/export mekanizmaları, memory yönetimi ve host bindings.
---

# Modül 5: WebAssembly Entegrasyonu

Bu modülde WebAssembly ile JavaScript arasındaki iletişimi, import/export mekanizmalarını ve memory yönetimini öğreneceksiniz.

---

## Bölüm 5.1: WebAssembly Modül Yapısı

### Modül Anatomisi

```
WebAssembly Modülü
├── Imports (Dışarıdan gelen fonksiyonlar)
├── Exports (Dışa açılan fonksiyonlar)
├── Memory (Lineer bellek)
├── Table (Fonksiyon tablosu)
└── Globals (Global değişkenler)
```

### Örnek Modül Yapısı

```typescript
// assembly/index.ts

// Export edilen fonksiyon - JavaScript'ten erişilebilir
export function topla(a: i32, b: i32): i32 {
  return a + b;
}

export function carp(a: i32, b: i32): i32 {
  return a * b;
}

// Export edilen global değişken
export const SABIT_PI: f64 = 3.141592653589793;
export let sayac: i32 = 0;
```

### JavaScript Tarafı

```javascript
// JavaScript'ten modül kullanımı

// 1. Modülü yükle
const response = await fetch('build/debug.wasm');
const buffer = await response.arrayBuffer();
const module = await WebAssembly.compile(buffer);

// 2. Import'ları hazırla (opsiyonel)
const imports = {
  env: {
    memory: new WebAssembly.Memory({ initial: 1 }),
    // ... diğer import'lar
  }
};

// 3. Modülü instance oluştur
const instance = await WebAssembly.instantiate(module, imports);
const exports = instance.instance.exports;

// 4. Export'ları kullan
console.log(exports.topla(10, 20));  // 30
console.log(exports.carp(5, 4));     // 20
console.log(exports.SABIT_PI);       // 3.14...
exports.sayac++;
console.log(exports.sayac);          // 1
```

---

## Bölüm 5.2: Module Imports

### Declare ile Import

```typescript
// assembly/env.ts - Dış fonksiyonları tanımla
declare function consoleLogStr(ptr: usize, len: usize): void;
declare function consoleLogI32(value: i32): void;
declare function consoleLogF64(value: f64): void;
```

### AssemblyScript Tarafında Kullanım

```typescript
// assembly/index.ts
import { consoleLogStr, consoleLogI32, consoleLogF64 } from "./env";

export function merhaba(): void {
  consoleLogI32(42);
  consoleLogF64(3.14);
  // consoleLogStr için string pointer gerekir
}
```

### JavaScript Tarafında Implementasyon

```javascript
// index.js
const imports = {
  "assembly/env": {  // Modül yolu
    consoleLogStr(ptr, len) {
      // Memory'den string oku
      const bytes = new Uint8Array(exports.memory.buffer, ptr, len);
      const string = String.fromCharCode(...bytes);
      console.log(string);
    },
    consoleLogI32(value) {
      console.log(value);
    },
    consoleLogF64(value) {
      console.log(value);
    }
  }
};

WebAssembly.instantiateStreaming(fetch('module.wasm'), imports);
```

### @external Decorator ile Import

```typescript
// assembly/index.ts

// Modül ve eleman ismini özelleştir
@external("env", "benimLog")
declare function ozelLog(message: string): void;

export function test(): void {
  ozelLog("Merhaba!");  // env.benimLog olarak export edilir
}
```

```javascript
// JavaScript
const imports = {
  env: {
    benimLog(msg) {
      console.log("Özel log:", msg);
    }
  }
};
```

---

## Bölüm 5.3: Module Exports

### Fonksiyon Export

```typescript
// assembly/index.ts

// Basit fonksiyon export
export function kare(x: i32): i32 {
  return x * x;
}

// Karmaşık tip export
export function diziTopla(dizi: Int32Array): i32 {
  let toplam: i32 = 0;
  for (let i: i32 = 0; i < dizi.length; i++) {
    toplam += dizi[i];
  }
  return toplam;
}

// Class export (sınırlı)
export class Nokta {
  x: f64;
  y: f64;

  constructor(x: f64, y: f64) {
    this.x = x;
    this.y = y;
  }

  bilgi(): string {
    return `(${this.x}, ${this.y})`;
  }
}

// Class factory function
export function noktaOlustur(x: f64, y: f64): Nokta {
  return new Nokta(x, y);
}
```

### Global Export

```typescript
// Const global export
export const PI: f64 = 3.141592653589793;
export const MAX_SAYI: i32 = 100;

// Let global export
export let globalSayac: i32 = 0;

export function sayacArtir(): void {
  globalSayac++;
}
```

---

## Bölüm 5.4: Memory Yönetimi

### Linear Memory Kavramı

```
┌─────────────────────────────────────────────────────────────┐
│                    Linear Memory (Heap)                      │
├─────────────────────────────────────────────────────────────┤
│  0x0000 │ Static Data (sabit veriler)                      │
│  0x1000 │ Stack (yerel değişkenler)                         │
│  0x2000 │ Heap (dinamik bellek)                             │
│         │   - Managed objects (GC tarafından toplanır)      │
│         │   - Unmanaged objects (manuel serbest bırakma)    │
│  0xFFFF │                                                  │
└─────────────────────────────────────────────────────────────┘
```

### Memory Layout

```typescript
// Memory bölgeleri
const __data_end: usize;      // Static data biti
const __heap_base: usize;     // Heap başlangıcı
const memorySize: i32 = 64;   // Sayfa sayısı (64 * 64KB)
```

### Pointer İşlemleri

```typescript
// Bellekteki veriyi oku
function bellekOku(ptr: usize, boyut: usize): Int32Array {
  // ptr'ten itibaren boyut kadar i32 oku
  let sonuc: Int32Array = new Int32Array(boyut / 4);

  for (let i: i32 = 0; i < boyut / 4; i++) {
    sonuc[i] = load<i32>(ptr + i * 4);
  }

  return sonuc;
}

// Belleğe veri yaz
function bellekYaz(ptr: usize, veri: Int32Array): void {
  for (let i: i32 = 0; i < veri.length; i++) {
    store<i32>(ptr + i * 4, veri[i]);
  }
}

// Offset hesapla
function offsetHesapla(indeks: i32, turBoyutu: usize): usize {
  return usize(indeks) * turBoyutu;
}

// Kullanım
let ptr: usize = heap.alloc(sizeof<i32>() * 10);
store<i32>(ptr, 42);
let deger: i32 = load<i32>(ptr);
```

---

## Bölüm 5.5: Host Bindings

### Bindings Generation

```bash
# ESM bindings ile derle
asc assembly/index.ts --bindings esm --outFile build/module.wasm
```

Bu, otomatik olarak `build/module.js` ve `build/module.d.ts` oluşturur.

### Generated Bindings Kullanımı

```javascript
// index.js
import * as modul from './build/module.js';

// Artık doğrudan kullanabilirsiniz
const sonuc = modul.topla(10, 20);  // 30
const dizi = new Int32Array([1, 2, 3, 4, 5]);
const toplam = modul.diziTopla(dizi);  // 15

// String otomatik dönüşüm
const mesaj = modul.selamVer("Ahmet");  // String → WASM → String
```

### Raw Bindings

```bash
# Raw bindings ile derle
asc assembly/index.ts --bindings raw --outFile build/module.wasm
```

```javascript
// Raw bindings kullanımı
import { instantiate } from './build/module.js';

const module = await WebAssembly.compileStreaming(fetch('build/module.wasm'));

const imports = {
  // Custom imports
};

const exports = await instantiate(module, imports);
```

---

## Bölüm 5.6: JavaScript Interop

### Sayı Transferi

```typescript
// assembly/index.ts

// i32 transfer
export function i32Topla(a: i32, b: i32): i32 {
  return a + b;
}

// i64 transfer (BigInt)
export function i64Topla(a: i64, b: i64): i64 {
  return a + b;
}

// f64 transfer
export function f64Topla(a: f64, b: f64): f64 {
  return a + b;
}

// Bool transfer
export function boolAnd(a: bool, b: bool): bool {
  return a && b;
}
```

```javascript
// JavaScript
// i32
const i32Sonuc = exports.i32Topla(10, 20);  // 30

// i64 (BigInt)
const i64Sonuc = exports.i64Topla(1000n, 2000n);  // 3000n

// f64
const f64Sonuc = exports.f64Topla(1.5, 2.5);  // 4.0

// bool
const boolSonuc = exports.boolAnd(true, false);  // false
```

### String Transferi

```typescript
// assembly/index.ts

export function selamVer(isim: string): string {
  return `Merhaba, ${isim}!`;
}

export function birlestir(s1: string, s2: string): string {
  return s1 + s2;
}

export function uzunluk(s: string): i32 {
  return s.length;
}

export function karakterAl(s: string, indeks: i32): string {
  return s.charAt(indeks);
}
```

```javascript
// JavaScript
const selam = exports.selamVer("Ahmet");  // "Merhaba, Ahmet!"
const birlesim = exports.birlestir("Merhaba", "Dünya");  // "MerhabaDünya"
const len = exports.uzunluk("test");  // 4
const char = exports.karakterAl("Merhaba", 0);  // "M"
```

### Array Transferi

```typescript
// assembly/index.ts

export function diziTopla(dizi: Int32Array): i32 {
  let toplam: i32 = 0;
  for (let i: i32 = 0; i < dizi.length; i++) {
    toplam += dizi[i];
  }
  return toplam;
}

export function diziFiltrele(dizi: Int32Array, esik: i32): Int32Array {
  let sonuc: i32[] = [];
  for (let i: i32 = 0; i < dizi.length; i++) {
    if (dizi[i] > esik) {
      sonuc.push(dizi[i]);
    }
  }
  return sonuc as Int32Array;
}

export function diziKareAl(dizi: Int32Array): Int32Array {
  let sonuc: Int32Array = new Int32Array(dizi.length);
  for (let i: i32 = 0; i < dizi.length; i++) {
    sonuc[i] = dizi[i] * dizi[i];
  }
  return sonuc;
}
```

```javascript
// JavaScript
const dizi = new Int32Array([1, 2, 3, 4, 5]);
const toplam = exports.diziTopla(dizi);  // 15

const buyukler = exports.diziFiltrele(dizi, 2);  // Int32Array [3, 4, 5]
const kareler = exports.diziKareAl(dizi);  // Int32Array [1, 4, 9, 16, 25]
```

### Object Transferi

```typescript
// Plain object (kopyalanır)
class PlainData {
  x: i32;
  y: i32;

  constructor(x: i32, y: i32) {
    this.x = x;
    this.y = y;
  }
}

export function plainTopla(data: PlainData): i32 {
  return data.x + data.y;
}

// Complex object (referans)
class ComplexObject {
  constructor() {}  // Boş constructor = referans transferi

  deger: i32 = 0;
}

export function complexSet(obj: ComplexObject, deger: i32): void {
  obj.deger = deger;
}

export function complexGet(obj: ComplexObject): i32 {
  return obj.deger;
}
```

```javascript
// JavaScript
// Plain object
const plain = { x: 10, y: 20 };
const sonuc = exports.plainTopla(plain);  // 30

// Complex object (reference)
const complex = exports.newObject();
exports.complexSet(complex, 42);
const deger = exports.complexGet(complex);  // 42
```

---

## Bölüm 5.7: Memory Export/Import

### Memory Export

```typescript
// --exportMemory ile memory export edilir
// Varsayılan olarak export edilir
```

```javascript
// JavaScript
const memory = exports.memory;
console.log("Memory buffer:", memory.buffer);

// Memory'i oku
const bytes = new Uint8Array(memory.buffer, 0, 100);
```

### Memory Import

```bash
# --importMemory ile import edilir
asc assembly/index.ts --importMemory
```

```javascript
// JavaScript
const memory = new WebAssembly.Memory({
  initial: 10,    // 10 sayfa (640KB)
  maximum: 100    // Maksimum 100 sayfa (6.4MB)
});

const imports = {
  env: {
    memory: memory
  }
};

// Memory'e dışarıdan erişebilirsiniz
const view = new DataView(memory.buffer);
```

---

## Bölüm 5.8: Runtime Interface

### Runtime Export

```bash
# Runtime helper'ları export et
asc assembly/index.ts --exportRuntime
```

### Runtime Fonksiyonları

```typescript
// __new - Yeni managed object oluştur
export function nesneOlustur(boyut: usize, id: u32): usize {
  return __new(boyut, id);
}

// __pin - Object'i sabitle (GC'yi engelle)
export function sabitle(ptr: usize): usize {
  return __pin(ptr);
}

// __unpin - Sabitlemeyi kaldır
export function sabitlemeKaldir(ptr: usize): void {
  __unpin(ptr);
}

// __collect - GC tetikle
export function gcTetikle(): void {
  __collect();
}

// idof - Class ID al
export function classIdAl(): u32 {
  return idof<String>();
}
```

```javascript
// JavaScript
const {
  __new,
  __pin,
  __unpin,
  __collect
} = exports;

// String oluştur
const strPtr = __new(10, 2);  // 10 byte, class id 2 (String)
// ... kullan
__unpin(strPtr);  // Serbest bırak
```

---

## Bölüm 5.9: Pratik Örnekler

### Örnek 1: Resim Filtreleme

```typescript
// assembly/image.ts

export function griyeCevir(
  pikseller: Uint8Array,
  genislik: i32,
  yukseklik: i32
): void {
  for (let i: i32 = 0; i < genislik * yukseklik * 4; i += 4) {
    let r: f32 = f64(pikseller[i]);
    let g: f32 = f64(pikseller[i + 1]);
    let b: f32 = f64(pikseller[i + 2]);

    let gri: u8 = u8(0.299 * r + 0.587 * g + 0.114 * b);

    pikseller[i] = gri;
    pikseller[i + 1] = gri;
    pikseller[i + 2] = gri;
    // Alpha (i + 3) değişmez
  }
}

export function parlaklikArtir(
  pikseller: Uint8Array,
  genislik: i32,
  yukseklik: i32,
  miktar: i32
): void {
  for (let i: i32 = 0; i < genislik * yukseklik * 4; i++) {
    let deger: i32 = i32(pikseller[i]) + miktar;
    pikseller[i] = u8(clamp(deger, 0, 255));
  }
}

function clamp(value: i32, min: i32, max: i32): i32 {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}
```

```javascript
// JavaScript
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const imageData = ctx.getImageData(0, 0, width, height);

const pixels = new Uint8Array(imageData.data.buffer);

// Griye çevir
exports.griyeCevir(pixels, width, height);

// Geri yaz
ctx.putImageData(imageData, 0, 0);
```

### Örnek 2: Fizik Simülasyonu

```typescript
// assembly/physics.ts

class Cisim {
  x: f64;
  y: f64;
  vx: f64;
  vy: f64;
  kutle: f64;

  constructor(x: f64, y: f64, vx: f64, vy: f64, kutle: f64) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.kutle = kutle;
  }
}

export function cisimOlustur(
  x: f64, y: f64,
  vx: f64, vy: f64,
  kutle: f64
): Cisim {
  return new Cisim(x, y, vx, vy, kutle);
}

export function cisimHareketEttir(
  cisim: Cisim,
  dt: f64,
  g: f64
): void {
  // Yerçekimi
  cisim.vy += g * dt;

  // Pozisyon güncelle
  cisim.x += cisim.vx * dt;
  cisim.y += cisim.vy * dt;
}

export function cisimCarpisma(
  c1: Cisim,
  c2: Cisim
): bool {
  let dx: f64 = c2.x - c1.x;
  let dy: f64 = c2.y - c1.y;
  let mesafe: f64 = Math.sqrt(dx * dx + dy * dy);
  let minMesafe: f64 = 10;  // Yarıçap toplamı

  return mesafe < minMesafe;
}
```

### Örnek 3: Veri Sıkıştırma

```typescript
// assembly/compress.ts

export function runLengthEncode(veri: Uint8Array): Uint8Array {
  let sonuc: u8[] = [];

  let i: i32 = 0;
  while (i < veri.length) {
    let bayt: u8 = veri[i];
    let sayac: i32 = 1;

    while (i + sayac < veri.length && veri[i + sayac] === bayt && sayac < 255) {
      sayac++;
    }

    sonuc.push(bayt);
    sonuc.push(u8(sayac));

    i += sayac;
  }

  return sonuc as Uint8Array;
}

export function runLengthDecode(veri: Uint8Array): Uint8Array {
  let sonuc: u8[] = [];

  let i: i32 = 0;
  while (i < veri.length) {
    let bayt: u8 = veri[i];
    let sayac: i32 = i32(veri[i + 1]);

    for (let j: i32 = 0; j < sayac; j++) {
      sonuc.push(bayt);
    }

    i += 2;
  }

  return sonuc as Uint8Array;
}
```

---

## Bölüm 5.10: Modül 5 Özeti

### Öğrendiklerimiz

| Konu | Öğrenilenler |
|------|--------------|
| **Import/Export** | declare, @external, export |
| **Memory** | Linear memory, pointer işlemleri |
| **Bindings** | ESM bindings, Raw bindings |
| **Interop** | Sayı, string, dizi, object transferi |
| **Runtime** | __new, __pin, __collect |
| **Host Integration** | JavaScript iletişimi |

### Önemli İpuçları

1. **String transfer otomatik**
   ```typescript
   export function selam(s: string): string { return s; }
   ```

2. **Array buffer kopyalanır**
   ```typescript
   export function isle(arr: Int32Array): Int32Array { ... }
   ```

3. **Reference için boş constructor**
   ```typescript
   class Ref { constructor() {} }
   ```

4. **Memory import için**
   ```bash
   asc --importMemory
   ```

### Alıştırmalar

1. JavaScript'ten dizi alıp ters çeviren fonksiyon
2. Matris işlemleri için modül
3. Kriptografik hash fonksiyonu (MD5/SHA)
4. CSV parse eden modül
5. WebWorker ile iletişim kuran sistem

### Sonraki Modül

**Modül 6: İleri Seviye Özellikler**

Hazır mısınız? 🚀
