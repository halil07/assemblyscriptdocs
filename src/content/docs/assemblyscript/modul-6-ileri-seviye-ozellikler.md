---
title: Modül 6 - İleri Seviye Özellikler
description: Generic programlama, SIMD vektör işlemleri, atomics, operatör overloading ve tree-shaking optimizasyonları.
---

# Modül 6: İleri Seviye Özellikler

Bu modülde generic'ler, SIMD, atomics, operatör overloading gibi ileri seviye özellikleri öğreneceksiniz.

---

## Bölüm 6.1: Generic Programlama

### Generic Fonksiyonlar

```typescript
// İki değeri değiştirme (generic)
function takas<T>(a: T, b: T): T[] {
  return [b, a];
}

// Kullanım
let sayilar = takas<i32>(10, 20);    // [20, 10]
let metinler = takas<string>("a", "b"); // ["b", "a"]

// Minimum değer (generic)
function min<T>(a: T, b: T): T {
  return a < b ? a : b;
}

// Maximum değer (generic)
function max<T>(a: T, b: T): T {
  return a > b ? a : b;
}
```

### Generic Sınıflar

```typescript
// Generic container sınıfı
class Kutu<T> {
  private icerik: T;

  constructor(deger: T) {
    this.icerik = deger;
  }

  degerAl(): T {
    return this.icerik;
  }

  degerAta(deger: T): void {
    this.icerik = deger;
  }

  bosMu(): bool {
    // T referans tipi mi kontrolü
    if (isReference<T>()) {
      return changetype<usize>(this.icerik) === 0;
    }
    return false;
  }
}

// Kullanım
let sayiKutusu: Kutu<i32> = new Kutu<i32>(42);
console.log(sayiKutusu.degerAl().toString());  // "42"

let metinKutusu: Kutu<string> = new Kutu<string>("Merhaba");
console.log(metinKutusu.degerAl());  // "Merhaba"
```

### Generic ile Static Type Checks

```typescript
// Tür bilinirse derleme zamanında davranışı belirle
function islemYap<T>(a: T, b: T): T {
  if (isInteger<T>() && isSigned<T>()) {
    // Signed integer
    return unchecked(a + b);
  } else if (isFloat<T>()) {
    // Float
    return unchecked(a + b);
  } else if (isString<T>()) {
    // String - parse et ve topla
    let sayi1: f64 = parseFloat(a);
    let sayi2: f64 = parseFloat(b);
    return changetype<T>(sayi1 + sayi2);
  }
  return unchecked(a + b);
}

// Kullanım
let sonuc1: i32 = islemYap<i32>(10, 20);        // 30
let sonuc2: f64 = islemYap<f64>(1.5, 2.5);       // 4.0
let sonuc3: string = islemYap<string>("10", "20"); // "30"
```

### Generic ile Dizi İşlemleri

```typescript
// Dizi toplama (generic)
function diziTopla<T>(dizi: T[]): T {
  let toplam: T = unchecked(0);

  for (let i: i32 = 0; i < dizi.length; i++) {
    toplam = unchecked(toplam + dizi[i]);
  }

  return toplam;
}

// Dizi maksimum (generic)
function diziMax<T>(dizi: T[]): T {
  if (dizi.length === 0) return unchecked(0);

  let max: T = dizi[0];

  for (let i: i32 = 1; i < dizi.length; i++) {
    if (dizi[i] > max) {
      max = dizi[i];
    }
  }

  return max;
}

// Dizi filtreleme (generic)
function diziFiltre<T>(dizi: T[], kosul: (deger: T) => bool): T[] {
  let sonuc: T[] = [];

  for (let i: i32 = 0; i < dizi.length; i++) {
    if (kosul(dizi[i])) {
      sonuc.push(dizi[i]);
    }
  }

  return sonuc;
}

// Dizi dönüşüm (generic)
function diziMap<T, U>(dizi: T[], donusturucu: (deger: T) => U): U[] {
  let sonuc: U[] = [];

  for (let i: i32 = 0; i < dizi.length; i++) {
    sonuc.push(donusturucu(dizi[i]));
  }

  return sonuc;
}
```

---

## Bölüm 6.2: SIMD (Single Instruction Multiple Data)

### SIMD'i Aktifleştirme

```bash
# SIMD'i aktifleştir
asc assembly/index.ts --enable simd --outFile build/simd.wasm
```

### v128 Türü

```typescript
// 128-bit vektör oluşturma

// 16 x 8-bit integer
let v1: v128 = i8x16(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16);

// 8 x 16-bit integer
let v2: v128 = i16x8(100, 200, 300, 400, 500, 600, 700, 800);

// 4 x 32-bit integer
let v3: v128 = i32x4(1000, 2000, 3000, 4000);

// 2 x 64-bit integer
let v4: v128 = i64x2(1000000, 2000000);

// 4 x 32-bit float
let v5: v128 = f32x4(1.1, 2.2, 3.3, 4.4);

// 2 x 64-bit float
let v6: v128 = f64x2(1.111, 2.222);
```

### SIMD Aritmetik

```typescript
// 4 sayıyı aynı anda topla
export function vektorTopla4(
  a1: f32, a2: f32, a3: f32, a4: f32,
  b1: f32, b2: f32, b3: f32, b4: f32
): v128 {
  let va: v128 = f32x4(a1, a2, a3, a4);
  let vb: v128 = f32x4(b1, b2, b3, b4);

  // 4 float aynı anda toplanır
  return v128.add<f32>(va, vb);
}

// Skalar ile vektör toplama
export function skalarVektorTopla(
  skalar: f32,
  v1: f32, v2: f32, v3: f32, v4: f32
): v128 {
  let sv: v128 = v128.splat<f32>(skalar);
  let vv: v128 = f32x4(v1, v2, v3, v4);

  return v128.add<f32>(sv, vv);
}

// Çarpma
export function vektorCarp4(va: v128, vb: v128): v128 {
  return v128.mul<f32>(va, vb);
}
```

### SIMD Lane Operations

```typescript
// Lane'den değer okuma
export function laneOku(v: v128, indeks: i32): f32 {
  return v128.extract_lane<f32>(v, u8(indeks));
}

// Lane'e değer yazma
export function laneYaz(v: v128, indeks: i32, deger: f32): v128 {
  return v128.replace_lane<f32>(v, u8(indeks), deger);
}

// Tüm lane'leri oku
export function tumLaneler(v: v128): Float32Array {
  let sonuc: Float32Array = new Float32Array(4);

  for (let i: i32 = 0; i < 4; i++) {
    sonuc[i] = v128.extract_lane<f32>(v, u8(i));
  }

  return sonuc;
}
```

### SIMD Karşılaştırma

```typescript
// 4 değerin karşılaştırması
export function karsilastir4(va: v128, vb: v128): v128 {
  // Her lane için karşılaştırma
  return v128.lt<f32>(va, vb);
}

// Herhangi biri true mu?
export function herhangiTrue(v: v128): bool {
  return v128.any_true(v);
}

// Tümü true mu?
export function tumuTrue(v: v128): bool {
  return v128.all_true<f32>(v);
}
```

### Pratik SIMD Örneği

```typescript
// 4 sayının toplamı (SIMD ile)
export function dortluToplaSIMD(
  a1: f32, a2: f32, a3: f32, a4: f32,
  b1: f32, b2: f32, b3: f32, b4: f32
): Float32Array {
  let va: v128 = f32x4(a1, a2, a3, a4);
  let vb: v128 = f32x4(b1, b2, b3, b4);

  let sonuc: v128 = v128.add<f32>(va, vb);

  // Sonucu diziye çevir
  let dizi: Float32Array = new Float32Array(4);
  for (let i: i32 = 0; i < 4; i++) {
    dizi[i] = v128.extract_lane<f32>(sonuc, u8(i));
  }

  return dizi;
}

// 4 sayının çarpımı (SIMD ile)
export function dortluCarpSIMD(
  a1: f32, a2: f32, a3: f32, a4: f32,
  b1: f32, b2: f32, b3: f32, b4: f32
): Float32Array {
  let va: v128 = f32x4(a1, a2, a3, a4);
  let vb: v128 = f32x4(b1, b2, b3, b4);

  let sonuc: v128 = v128.mul<f32>(va, vb);

  let dizi: Float32Array = new Float32Array(4);
  for (let i: i32 = 0; i < 4; i++) {
    dizi[i] = v128.extract_lane<f32>(sonuc, u8(i));
  }

  return dizi;
}
```

---

## Bölüm 6.3: Atomics (Threading)

### Atomics'i Aktifleştirme

```bash
# Threading'i aktifleştir
asc assembly/index.ts --enable threads --outFile build/threads.wasm
```

### Atomic Load/Store

```typescript
// Atomik okuma
export function atomikOku(ptr: usize): i32 {
  return atomic.load<i32>(ptr);
}

// Atomik yazma
export function atomikYaz(ptr: usize, deger: i32): void {
  atomic.store<i32>(ptr, deger);
}
```

### Atomic Aritmetik

```typescript
// Atomik toplama (return: eski değer)
export function atomikTopla(ptr: usize, deger: i32): i32 {
  return atomic.add<i32>(ptr, deger);
}

// Atomik çıkarma
export function atomikCikar(ptr: usize, deger: i32): i32 {
  return atomic.sub<i32>(ptr, deger);
}

// Atomik AND
export function atomikAnd(ptr: usize, deger: i32): i32 {
  return atomic.and<i32>(ptr, deger);
}

// Atomik OR
export function atomikOr(ptr: usize, deger: i32): i32 {
  return atomic.or<i32>(ptr, deger);
}

// Atomik XOR
export function atomikXor(ptr: usize, deger: i32): i32 {
  return atomic.xor<i32>(ptr, deger);
}
```

### Atomic Compare-Exchange

```typescript
// Atomik karşılaştırma ve değiştir
export function atomikDegistir(
  ptr: usize,
  beklenen: i32,
  yeni: i32
): i32 {
  return atomic.cmpxchg<i32>(ptr, beklenen, yeni);
}

// Eğer ptr == beklenen ise ptr = yeni yap
// Eşleşme durumunda true döner
export function atomikKosul(
  ptr: usize,
  beklenen: i32,
  yeni: i32
): bool {
  let eski: i32 = atomic.cmpxchg<i32>(ptr, beklenen, yeni);
  return eski === beklenen;
}
```

### Atomic Wait/Notify

```typescript
// Atomik bekle (mutex benzeri)
export function atomikBekle(ptr: usize, beklenen: i32): void {
  let sonuc: AtomicWaitResult = atomic.wait<i32>(ptr, beklenen, -1);

  // sonçolar:
  // 0 = OK (daha başka bir agent uyandırdı)
  // 1 = NOT_EQUAL (değer beklenen değildi)
  // 2 = TIMED_OUT (timeout)
}

// Atomik bildir (uyandır)
export function atomikBildir(ptr: usize, sayi: i32): i32 {
  return atomic.notify(ptr, sayi);
}
```

### Pratik Atomics Örneği

```typescript
// Basit sayac (thread-safe)
class AtomicSayac {
  private ptr: usize;

  constructor(baslangic: i32) {
    this.ptr = heap.alloc(sizeof<i32>());
    store<i32>(this.ptr, baslangic);
  }

  artir(miktar: i32 = 1): i32 {
    return atomic.add<i32>(this.ptr, miktar);
  }

  deger(): i32 {
    return atomic.load<i32>(this.ptr);
  }
}
```

---

## Bölüm 6.4: Operatör Overloading

### Binary Operator Overloading

```typescript
// Vektör sınıfı
class Vec2 {
  x: f64;
  y: f64;

  constructor(x: f64, y: f64) {
    this.x = x;
    this.y = y;
  }

  // Toplama operatörü
  @operator("+")
  static add(left: Vec2, right: Vec2): Vec2 {
    return new Vec2(left.x + right.x, left.y + right.y);
  }

  // Çıkarma operatörü
  @operator("-")
  static sub(left: Vec2, right: Vec2): Vec2 {
    return new Vec2(left.x - right.x, left.y - right.y);
  }

  // Çarpma operatörü
  @operator("*")
  static mul(left: Vec2, right: Vec2): Vec2 {
    return new Vec2(left.x * right.x, left.y * right.y);
  }

  // Bölme operatörü
  @operator("/")
  static div(left: Vec2, right: Vec2): Vec2 {
    return new Vec2(left.x / right.x, left.y / right.y);
  }

  // Skaler çarpma
  skalerCarp(skalar: f64): Vec2 {
    return new Vec2(this.x * skalar, this.y * skalar);
  }

  // Dot product
  dotProduct(diğer: Vec2): f64 {
    return this.x * diğer.x + this.y * diğer.y;
  }

  // Boyut (length)
  boyut(): f64 {
    return Math.sqrt(this.dotProduct(this));
  }

  // Normalize
  normalize(): Vec2 {
    let boyut: f64 = this.boyut();
    return new Vec2(this.x / boyut, this.y / boyut);
  }

  toString(): string {
    return `Vec2(${this.x}, ${this.y})`;
  }
}

// Kullanım
let v1: Vec2 = new Vec2(3, 4);
let v2: Vec2 = new Vec2(1, 2);

let v3: Vec2 = v1 + v2;  // (4, 6)
let v4: Vec2 = v1 - v2;  // (2, 2)
let v5: Vec2 = v1 * v2;  // (3, 8)

let skalar: f64 = v1.dotProduct(v2);  // 3*1 + 4*2 = 11
let uzunluk: f64 = v1.boyut();  // 5
```

### Karşılaştırma Operatörleri

```typescript
class Vec2 {
  // ... (önceki kod)

  // Eşitlik
  @operator("==")
  static eq(left: Vec2, right: Vec2): bool {
    return left.x === right.x && left.y === right.y;
  }

  // Eşitsizlik
  @operator("!=")
  static ne(left: Vec2, right: Vec2): bool {
    return left.x !== right.x || left.y !== right.y;
  }

  // Küçüklük
  @operator("<")
  static lt(left: Vec2, right: Vec2): bool {
    return left.boyut() < right.boyut();
  }

  // Büyüklik
  @operator(">")
  static gt(left: Vec2, right: Vec2): bool {
    return left.boyut() > right.boyut();
  }
}

// Kullanım
let esitMi: bool = v1 == v2;
let farkliMi: bool = v1 != v2;
let kucukMu: bool = v1 < v2;
let buyukMu: bool = v1 > v2;
```

### Unary Operator Overloading

```typescript
class Vec2 {
  // ... (önceki kod)

  // Negasyon (unary -)
  @operator.prefix("-")
  static neg(v: Vec2): Vec2 {
    return new Vec2(-v.x, -v.y);
  }

  // Artırma (prefix ++)
  @operator.prefix("++")
  static inc(v: Vec2): Vec2 {
    return new Vec2(v.x + 1, v.y + 1);
  }

  // Azaltma (prefix --)
  @operator.prefix("--")
  static dec(v: Vec2): Vec2 {
    return new Vec2(v.x - 1, v.y - 1);
  }
}

// Kullanım
let v: Vec2 = new Vec2(3, 4);
let neg: Vec2 = -v;  // (-3, -4)
let inc: Vec2 = ++v;  // (4, 5)
```

### Indexed Access Overloading

```typescript
class Matris {
  private satir: i32;
  private sutun: i32;
  private veriler: Float64Array;

  constructor(satir: i32, sutun: i32) {
    this.satir = satir;
    this.sutun = sutun;
    this.veriler = new Float64Array(satir * sutun);
  }

  // Checked indexed get
  @operator("[]")
  static get(m: Matris, indeks: i32): f64 {
    assert(indeks >= 0 && indeks < m.veriler.length, "İndeks dışında");
    return m.veriler[indeks];
  }

  // Unchecked indexed set
  @operator("{}=")
  static set(m: Matris, indeks: i32, deger: f64): void {
    m.veriler[indeks] = deger;
  }

  // 2D indeksleme
  get2D(s: i32, st: i32): f64 {
    return this.veriler[s * this.sutun + st];
  }

  set2D(s: i32, st: i32, deger: f64): void {
    this.veriler[s * this.sutun + st] = deger;
  }
}

// Kullanım
let m: Matris = new Matris(3, 3);
m.set2D(0, 0, 1);
m.set2D(1, 1, 2);
m{5} = 3;  // unchecked set
let deger: f64 = m[2];  // checked get
```

---

## Bölüm 6.5: Tree-shaking

### Branch-Level Tree-shaking

```typescript
// Derleme zamanında dallar elenir

export function platformKodu(): i32 {
  // Bu kod, WASM32 için derlenirse
  // 32-bitlik versiyon kullanılır
  if (ASC_TARGET == 1) {
    // WASM32 kodu
    return 32;
  } else {
    // WASM64 kodu
    return 64;
  }
}

// Debug/Release kontrolü
export void debugLog(mesaj: string): void {
  if (!ASC_NO_ASSERT) {
    console.log(mesaj);
  }
}

// Feature kontrolü
export function hizliTopla(a: i32, b: i32): i32 {
  if (ASC_FEATURE_SIMD) {
    // SIMD ile hızlı toplama
    return 0;  // SIMD implementasyonu
  } else {
    // Normal toplama
    return a + b;
  }
}
```

### Compile-Time Constants

```typescript
// Derleme zamanında hesaplanan değerler

export const SABIT_DEGER: i32 = 42;
export const HESAPLANAN: i32 = 10 * 10;  // Derleme zamanında 100

export const PLATFORM: string = ASC_TARGET == 1 ? "WASM32" : "WASM64";
export const DEBUG: bool = !ASC_NO_ASSERT;
export const OPTIMIZE: i32 = ASC_OPTIMIZE_LEVEL;
```

---

## Bölüm 6.6: Modül 6 Özeti

### Öğrendiklerimiz

| Konu | Öğrenilenler |
|------|--------------|
| **Generic** | Tip parametreleri, static type checks |
| **SIMD** | v128, lane operations, vector aritmetik |
| **Atomics** | atomic.load/store, add, cmpxchg, wait/notify |
| **Operator Overload** | @operator, binary, unary, indexed |
| **Tree-shaking** | Branch-level, compile-time constants |

### Önemli İpuçları

1. **Generic'lerde isType() kullanın**
   ```typescript
   if (isInteger<T>()) { ... }
   ```

2. **SIMD için --enable simd**
   ```bash
   asc --enable simd input.ts
   ```

3. **Atomics için --enable threads**
   ```bash
   asc --enable threads input.ts
   ```

4. **Operator overloading @operator ile**
   ```typescript
   @operator("+") static add(a, b) { ... }
   ```

### Alıştırmalar

1. Generic stack sınıfı implemente edin
2. SIMD ile 8 sayının toplamı
3. Thread-safe queue implementasyonu
4. Matris operatör overloading
5. Compile-time konfigürasyon sistemi

### Sonraki Modül

**Modül 7: Derleyici Kullanımı**

Hazır mısınız? 🚀
