---
title: Modül 1 - Temel Sözdizimi ve Türler
description: AssemblyScript tür sistemi, değişkenler, operatörler, kontrol yapıları, döngüler ve tür dönüşümleri.
---

# Modül 1: Temel Sözdizimi ve Türler

Bu modülde AssemblyScript'in temel yapı taşlarını öğreneceksiniz. Türkleri, değişkenleri, operatörleri ve kontrol yapılarını detaylı şekilde inceleyeceğiz.

---

## Bölüm 1.1: TypeScript ile Benzerlikler ve Farklar

### AssemblyScript = TypeScript (Kısıtlı) + WebAssembly Türleri

AssemblyScript, TypeScript sözdizimini temel alır ancak bazı önemli farklar vardır:

#### Benzerlikler

```typescript
// Hem TypeScript hem AssemblyScript'te geçerli

// Değişken tanımlama
let x: i32 = 10;
const isim: string = "Ahmet";

// Fonksiyon tanımlama
function topla(a: i32, b: i32): i32 {
  return a + b;
}

// Ok fonksiyonu (sınırlı)
const kare = (x: i32): i32 => x * x;

// Sınıf tanımlama
class Ogrenci {
  isim: string;
  yas: i32;

  constructor(isim: string, yas: i32) {
    this.isim = isim;
    this.yas = yas;
  }

selamVer(): string {
    return `Merhaba, ben ${this.isim}`;
  }
}
```

#### Kritik Farklar

| Özellik | TypeScript | AssemblyScript |
|---------|-----------|----------------|
| **`any` tipi** | ✅ Var | ❌ Yok |
| **`undefined` tipi** | ✅ Var | ❌ Yok |
| **Union types** | ✅ `string \| number` | ❌ Sadece `T \| null` |
| **Optional params** | ✅ `function(a?, b?)` | ✅ Varsayılan değerle |
| **Type inference** | ✅ Güçlü | ⚠️ Sınırlı |
| **Numeric types** | Sadece `number` | `i32`, `i64`, `f32`, `f64`... |

### TypeScript'ten Farklı Örnekler

#### ❌ TypeScript'te Çalışır, AssemblyScript'te ÇALIŞMAZ

```typescript
// 1. any tipi YOK
function foo(x: any): any {  // ❌ HATA!
  return x + 1;
}

// 2. undefined YOK
function bar(x?: i32): i32 {  // ❌ HATA!
  return x + 1;
}

// 3. Union types YOK
function baz(x: i32 | string): void {  // ❌ HATA!
  console.log(x);
}

// 4. Dinamik obje YOK
const obj = {};  // ❌ HATA!
obj.yeniOzellik = "değer";  // ❌ HATA!

// 5. Dizi içinden tip çıkarma YOK
const sayilar = [1, 2, 3];  // ❌ HATA! Tip belirtmeli
```

#### ✅ AssemblyScript'te Doğru Yazım

```typescript
// 1. Tip belirtilmeli
function foo(x: i32): i32 {  // ✅ Doğru
  return x + 1;
}

// 2. Varsayılan değer ile optional
function bar(x: i32 = 0): i32 {  // ✅ Doğru
  return x + 1;
}

// 3. Generic ile union alternatifi
function baz<T>(x: T): void {  // ✅ Doğru
  // x: T olarak kullanılır
}

// 4. Map veya class kullanın
const obj = new Map<string, string>();  // ✅ Doğru
obj.set("yeniOzellik", "değer");

// 5. Dizi tipi belirtilmeli
const sayilar = new Array<i32>();  // ✅ Doğru
sayilar.push(1);
sayilar.push(2);
sayilar.push(3);
```

---

## Bölüm 1.2: Tür Sistemi (Detaylı)

AssemblyScript, WebAssembly'in tip sistemini doğrudan yansıtır. Her değerin açıkça tanımlanmış bir tipi olmalıdır.

### Tam Sayı Türleri (Integer Types)

#### 32-bit Tam Sayılar

```typescript
// i32 - 32-bit signed integer (-2,147,483,648 ile 2,147,483,647 arası)
let pozitif: i32 = 2147483647;
let negatif: i32 = -2147483648;
let hex: i32 = 0x7FFFFFFF;       // 2,147,483,647
let binary: i32 = 0b1111111;     // 127

// u32 - 32-bit unsigned integer (0 ile 4,294,967,295 arası)
let maksimumU32: u32 = 4294967295;
let sifir: u32 = 0;

// Uygulama örnekleri
function ortalamaHesapla(a: i32, b: i32): i32 {
  return (a + b) / 2;
}

// Renk kodları (RGBA)
let kirmizi: u32 = 0xFF0000FF;    // Kırmızı
let yesil: u32 = 0x00FF00FF;      // Yeşil
let mavi: u32 = 0x0000FFFF;       // Mavi
```

#### 64-bit Tam Sayılar

```typescript
// i64 - 64-bit signed integer
const MAX_I64: i64 = 9223372036854775807;
const MIN_I64: i64 = -9223372036854775808;

// u64 - 64-bit unsigned integer
const MAX_U64: u64 = 18446744073709551615;

// Büyük sayı hesaplamaları
function faktoriyel64(n: i64): i64 {
  if (n <= 1) return 1;
  let sonuc: i64 = 1;
  for (let i = 2; i <= n; i++) {
    sonuc *= i;
  }
  return sonuc;
}

// Timestamp örnekleri (milisaniye cinsinden)
const BIR_GUN_MS: i64 = 86400000;  // 24 * 60 * 60 * 1000
const BIR_YIL_MS: i64 = 31536000000; // 365 * 24 * 60 * 60 * 1000
```

#### Küçük Tam Sayılar (8-bit ve 16-bit)

```typescript
// i8 - 8-bit signed (-128 ile 127)
let kucuk: i8 = 127;
// kucuk = 128;  // ❌ Derleme hatası! Sığmaz

// u8 - 8-bit unsigned (0 ile 255)
let byte: u8 = 255;
// byte = 256;  // ❌ Derleme hatası!

// i16 - 16-bit signed (-32,768 ile 32,767)
let kisa: i16 = 32767;

// u16 - 16-bit unsigned (0 ile 65,535)
let kisaUnsigned: u16 = 65535;

// Uygulama: ASCII karakter işlemleri
function buyukHarfeCevir(karakter: u8): u8 {
  // 'a' (97) ile 'z' (122) arasıysa
  if (karakter >= 97 && karakter <= 122) {
    return karakter - 32;  // Küçük harften büyüğe
  }
  return karakter;
}

// Test
let harf: u8 = 97;  // 'a'
console.log(buyukHarfeCevir(harf).toString());  // 65 = 'A'
```

#### Platform Bağımlı Türler

```typescript
// isize / usize - Platform'a göre 32 veya 64-bit
// WASM32'de i32/u64, WASM64'de i64/u64 gibi davranır

function diziBoyutu(arr: Int32Array): usize {
  return usize(arr.length);
}

function bellekAdresi(ptr: usize): void {
  // Pointer işlemleri
  // ...
}
```

### Tam Sayı Türleri Karşılaştırma Tablosu

| Tür | Bit | Minimum | Maksimum | Kullanım Alanı |
|-----|-----|---------|----------|----------------|
| `i8` | 8 | -128 | 127 | ASCII, küçük sayılar |
| `u8` | 8 | 0 | 255 | Byte, RGB kanalları |
| `i16` | 16 | -32,768 | 32,767 | Ses sample'ları |
| `u16` | 16 | 0 | 65,535 | Karakter kodları |
| `i32` | 32 | -2.14 milyar | 2.14 milyar | Genel kullanım ⭐ |
| `u32` | 32 | 0 | 4.29 milyar | Sayıclar, ID'ler |
| `i64` | 64 | -9.22 quintilyon | 9.22 quintilyon | Timestamp'ler |
| `u64` | 64 | 0 | 18.44 quintilyon | Büyük sayılar |

### Kayan Nokta Türleri (Floating Point)

```typescript
// f32 - 32-bit float (single precision)
let pi32: f32 = 3.14159265;
let euler32: f32 = 2.71828183;
// Hassasiyet: ~7 basamak

// f64 - 64-bit float (double precision)
let pi64: f64 = 3.141592653589793;
let euler64: f64 = 2.718281828459045;
// Hassasiyet: ~15 basamak

// Dairenin alanı
function daireAlani(yaricap: f64): f64 {
  return 3.141592653589793 * yaricap * yaricap;
}

// Hipotenüs hesaplama
function hipotenüs(a: f64, b: f64): f64 {
  return Math.sqrt(a * a + b * b);
}

// f32 performans örneği (görüntü işleme)
function renkParlakligi(r: f32, g: f32, b: f32): f32 {
  // BT.601 standardı
  return 0.299 * r + 0.587 * g + 0.114 * b;
}
```

### Bool Türü

```typescript
// bool - 1-bit unsigned integer (aslında i32 gibi davranır)
let dogru: bool = true;
let yanlis: bool = false;

// Koşul ifadeleri
function yetiskinMi(yas: i32): bool {
  return yas >= 18;
}

function kullaniciGirisi(yapildi: bool): void {
  if (yapildi) {
    console.log("Hoş geldiniz!");
  } else {
    console.log("Lütfen giriş yapın.");
  }
}

// Bool sonuçları her zaman i32 olarak saklanır
let sonuc: i32 = 10 > 5;  // sonuc = 1 (true)
let sonuc2: i32 = 10 < 5;  // sonuc2 = 0 (false)
```

### Vektör Türü (SIMD)

```typescript
// v128 - 128-bit SIMD vektörü
// --enable simd bayrağı gerekir

// 4 tane 32-bit float'tan oluşan vektör
let vektor1: v128 = f32x4(1.0, 2.0, 3.0, 4.0);

// 16 tane 8-bit integer'dan oluşan vektör
let vektor2: v128 = i8x16(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16);

// SIMD ile hızlandırılmış toplama
function vektorTopla(a: v128, b: v128): v128 {
  return v128.add<f32>(a, b);  // 4 float aynı anda toplanır
}
```

### Void Türü

```typescript
// void - Dönüş değeri yok

function selamVer(): void {
  console.log("Merhaba!");
  // return yok
}

function hesapYap(yazdir: bool): void {
  let sonuc: i32 = 10 + 20;
  if (yazdir) {
    console.log(sonuc.toString());
  }
}
```

---

## Bölüm 1.3: Değişkenler ve Sabitler

### Var, Let ve Const

```typescript
// var - Fonksiyon scope, tekrar atama yapılabilir
function ornekVar(): void {
  var x: i32 = 10;
  console.log(x.toString());  // 10
  x = 20;  // ✅ Tekrar atama
  console.log(x.toString());  // 20
}

// let - Block scope, tekrar atama yapılabilir
function ornekLet(): void {
  if (true) {
    let y: i32 = 30;
    console.log(y.toString());  // 30
    y = 40;  // ✅ Tekrar atama
  }
  // console.log(y.toString());  // ❌ HATA! Scope dışı
}

// const - Block scope, tekrar atama YAPILAMAZ
function ornekConst(): void {
  const z: i32 = 50;
  console.log(z.toString());  // 50
  // z = 60;  // ❌ HATA! const tekrar atanamaz
}

// Dizi ve objeler const olsa da içeriği değişebilir
function ornekConstDizi(): void {
  const sayilar: Int32Array = new Int32Array(3);
  sayilar[0] = 1;  // ✅ Dizi içeriği değişebilir
  sayilar[1] = 2;
  sayilar[2] = 3;
  // sayilar = new Int32Array(5);  // ❌ HATA! Referans değişemez
}
```

### Tür Bildirimleri

```typescript
// Tür açıkça belirtilmeli
let x: i32 = 10;           // ✅
let y: f64 = 3.14;         // ✅
let z: string = "Merhaba"; // ✅

// Tür çıkarımı (sınırlı)
let a = 10;        // ✅ i32 olarak çıkar
let b = 3.14;      // ✅ f64 olarak çıkar
let c = "test";    // ✅ string olarak çıkar

// Ancak karmaşık durumlarda tür belirtmek zorunlu
let dizi = new Int32Array(5);     // ✅ Tür belli
let harita = new Map<string, i32>(); // ✅ Generic tür belirtilmeli

// Fonksiyon parametrelerinde TÜR ZORUNLU
function topla(a: i32, b: i32): i32 {
  return a + b;
}
```

### Global ve Lokal Değişkenler

```typescript
// Global değişkenler
let globalSayac: i32 = 0;

const GLOBAL_PI: f64 = 3.141592653589793;

function arttir(): void {
  globalSayac++;  // Global değişkeni değiştir
}

function kullan(): i32 {
  return globalSayac;
}

// Lokal değişkenler
function hesapla(): i32 {
  let x: i32 = 10;  // Sadece bu fonksiyonda geçerli
  let y: i32 = 20;
  return x + y;
}
// x ve y burada erişilemez
```

---

## Bölüm 1.4: Operatörler

### Aritmetik Operatörler

```typescript
// Toplama
let a: i32 = 10 + 5;        // 15

// Çıkarma
let b: i32 = 20 - 8;        // 12

// Çarpma
let c: i32 = 6 * 7;         // 42

// Bölme (tamsayı sonucu)
let d: i32 = 100 / 3;       // 33 (ondalık kısmı atılır)

// Mod (kalansız bölme)
let e: i32 = 100 % 3;       // 1

// Üs alma
let f: f64 = Math.pow(2, 10); // 1024

// Artırma / Azaltma
let g: i32 = 5;
g++;      // g = 6 (sonra artır)
++g;      // g = 7 (önce artır)
g--;      // g = 6 (sonra azalt)
--g;      // g = 5 (önce azalt)

// Atama operatörleri
let h: i32 = 10;
h += 5;   // h = 15
h -= 3;   // h = 12
h *= 2;   // h = 24
h /= 4;   // h = 6
h %= 4;   // h = 2

// Uygulama: Faktöriyel
function faktoriyel(n: i32): i32 {
  if (n <= 1) return 1;
  let sonuc: i32 = 1;
  for (let i = 2; i <= n; i++) {
    sonuc *= i;
  }
  return sonuc;
}

// Test: faktoriyel(5) = 120
```

### Bitwise Operatörler

```typescript
// AND (&)
let a: i32 = 5 & 3;   // 0101 & 0011 = 0001 = 1

// OR (|)
let b: i32 = 5 | 3;   // 0101 | 0011 = 0111 = 7

// XOR (^)
let c: i32 = 5 ^ 3;   // 0101 ^ 0011 = 0110 = 6

// NOT (~)
let d: i32 = ~5;      // ~00000101 = 11111010 = -6

// Sola kaydırma (<<)
let e: i32 = 5 << 1;  // 00000101 << 1 = 00001010 = 10

// Sağa kaydırma (>>)
let f: i32 = 10 >> 1; // 00001010 >> 1 = 00000101 = 5

// Sağa kaydırma (logical) (>>>)
let g: u32 = 4294967295 >>> 1; // 2147483647

// Uygulama: RGB renk ayrıştırma
function renkAyristir(renk: u32): string {
  let r: u32 = (renk >> 24) & 0xFF;
  let g: u32 = (renk >> 16) & 0xFF;
  let b: u32 = (renk >> 8) & 0xFF;
  let a: u32 = renk & 0xFF;

  return `R:${r} G:${g} B:${b} A:${a}`;
}

// Test: renkAyristir(0xFF0000FF) = "R:255 G:0 B:0 A:255"

// Uygulama: Bayrak (flags) sistemi
const OKU: u8 = 0b00000001;   // 1
const YAZ: u8 = 0b00000010;   // 2
const YURU: u8 = 0b00000100;  // 4

function izinVer(izinler: u8, yapilan: u8): bool {
  return (izinler & yapilan) === yapilan;
}

let kullaniciIzinleri: u8 = OKU | YAZ;  // 3
// izinVer(kullaniciIzinleri, OKU)   = true
// izinVer(kullaniciIzinleri, YAZ)   = true
// izinVer(kullaniciIzinleri, YURU)  = false
```

### Karşılaştırma Operatörleri

```typescript
// Eşitlik
let a: i32 = 10;
let b: i32 = 20;

a == b;   // false (değer eşit mi?)
a != b;   // true  (değer farklı mı?)
a === b;  // false (AssemblyScript'te == ile aynı)
a !== b;  // true  (AssemblyScript'te != ile aynı)

// Karşılaştırma
a < b;    // true  (küçük mü?)
a <= b;   // true  (küçük veya eşit mi?)
a > b;    // false (büyük mü?)
a >= b;   // false (büyük veya eşit mi?)

// Farklı türleri karşılaştıramazsınız
// let x: i32 = 10;
// let y: f64 = 10.0;
// x == y;  // ❌ Derleme hatası! Farklı türler

// Önce dönüşüm gerekir
// i32(x) == i32(y);  // ✅ Doğru
```

### Mantıksal Operatörler

```typescript
// VE (&&) - Her ikisi de true ise true
let x: bool = true && true;   // true
let y: bool = true && false;  // false

// VEYA (||) - Herhangi biri true ise true
let z: bool = true || false;  // true
let w: bool = false || false; // false

// DEĞİL (!) - Tersini alır
let v: bool = !true;   // false
let u: bool = !false;  // true

// Kısa devre (short-circuit) değerlendirmesi
function ornekKisaDevre(): void {
  let a: i32 = 0;
  let b: i32 = 10;

  // Sol taraf false ise sağ taraf değerlendirilmez
  if (a !== 0 && b / a > 5) {
    // Bu kod çalışmaz çünkü a === 0
  }

  // Sol taraf true ise sağ taraf değerlendirilmez
  let sonuc: i32 = a !== 0 || b;  // sonuc = 10
}

// Uygulama: Kullanıcı doğrulama
function kullaniciDogrula(
  yas: i32,
  emailVar: bool,
  telefonVar: bool
): bool {
  // 18 yaşından büyük VE (email VEYA telefon) var mı?
  return yas >= 18 && (emailVar || telefonVar);
}
```

### Operatör Öncelik Tablosu

| Öncelik | Operatör | İlişki |
|---------|----------|--------|
| 1 (en yüksek) | `()` `[]` `.` | Sol → Sağ |
| 2 | `!` `~` `-` `++` `--` | Sağ → Sol |
| 3 | `*` `/` `%` | Sol → Sağ |
| 4 | `+` `-` | Sol → Sağ |
| 5 | `<<` `>>` `>>>` | Sol → Sağ |
| 6 | `<` `<=` `>` `>=` | Sol → Sağ |
| 7 | `==` `!=` `===` `!==` | Sol → Sağ |
| 8 | `&` | Sol → Sağ |
| 9 | `^` | Sol → Sağ |
| 10 | `\|` | Sol → Sağ |
| 11 | `&&` | Sol → Sağ |
| 12 | `\|\|` | Sol → Sağ |
| 13 | `? :` | Sağ → Sol |
| 14 | `=` `+=` `-=` ... | Sağ → Sol |

```typescript
// Örnek
let sonuc: i32 = 2 + 3 * 4;     // 14 (önce 3*4)
let sonuc2: i32 = (2 + 3) * 4;  // 20 (önce 2+3)

// Karmaşık örnek
let x: i32 = 10;
let y: i32 = 20;
let z: i32 = x > 5 && y < 30 || x === 0;  // true && true || false = true
```

---

## Bölüm 1.5: Tür Dönüşümleri (Casting)

### Explicit Casting

AssemblyScript'te türler arası dönüşümler açıkça belirtilmelidir.

```typescript
// 1. Angle bracket syntax
let a: i32 = <i32>3.14;           // 3
let b: f64 = <f64>10;             // 10.0
let c: u8 = <u8>256;              // 0 (taşar)

// 2. as syntax
let d: i32 = 3.14 as i32;         // 3
let e: f64 = 10 as f64;           // 10.0

// 3. Portable conversion (önerilen)
let f: i32 = i32(3.14);           // 3
let g: f64 = f64(10);             // 10.0
let h: u8 = u8(256);              // 0

// Portable conversion, JavaScript'e transpile edildiğinde de doğru çalışır
// <i32>x sadece AssemblyScript'te çalışır, i32(x) her ikisinde de çalışır
```

### Tür Dönüşüm Tablosu

| Kaynak → Hedef | `i32` | `u32` | `i64` | `u64` | `f32` | `f64` |
|----------------|-------|-------|-------|-------|-------|-------|
| **`i32`** | - | ✅ | ✅ | ✅ | ✅ | ✅ |
| **`u32`** | ✅ | - | ✅ | ✅ | ✅ | ✅ |
| **`i64`** | ⚠️ | ⚠️ | - | ✅ | ✅ | ✅ |
| **`u64`** | ⚠️ | ⚠️ | ✅ | - | ✅ | ✅ |
| **`f32`** | ⚠️ | ⚠️ | ⚠️ | ⚠️ | - | ✅ |
| **`f64`** | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ✅ | - |

⚠️ = Veri kaybı olabilir

```typescript
// Float → Integer (ondalık kısmı atılır)
let x: i32 = i32(3.99);   // 3 (truncates)
let y: i32 = i32(-3.99);  // -3 (truncates towards zero)

// Integer → Float
let a: f32 = f32(42);     // 42.0
let b: f64 = f64(42);     // 42.0

// Taşma (overflow)
let c: u8 = u8(256);      // 0
let d: u8 = u8(257);      // 1
let e: i8 = i8(128);      // -128 (overflow)
```

### Portable Conversion Önemleri

```typescript
// ❌ Non-portable (sadece AssemblyScript'te çalışır)
function topla1(a: i32, b: f64): f64 {
  return a + b;  // TypeScript'te hata verir
}

// ✅ Portable (AssemblyScript ve TypeScript'te çalışır)
function topla2(a: i32, b: f64): f64 {
  return f64(a) + b;  // TypeScript: (a | 0) + b
}

// ❌ Non-portable overflow
function artir1(x: u8): u8 {
  return x + 1;  // x = 255 ise sonuç belirsiz
}

// ✅ Portable overflow
function artir2(x: u8): u8 {
  return u8(x + 1);  // TypeScript: (x + 1) & 0xFF
}
```

### reinterpret - Bit Düzeyinde Yorumlama

```typescript
// reinterpret<T>() - Bit'leri değiştirmeden türü değiştirir

// f32 bit'lerini i32 olarak oku
let f: f32 = 3.14;
let bitler: i32 = reinterpret<i32>(f);

// i32 bit'lerini f32 olarak oku
let g: f32 = reinterpret<f32>(bitler);

// Kullanım: NaN kontrolü (portable)
function isNaNCustom(x: f32): bool {
  let bits: u32 = reinterpret<u32>(x);
  // NaN: exponent tüm 1'ler, fraction 0 değil
  let exponent: u32 = (bits >> 23) & 0xFF;
  let fraction: u32 = bits & 0x007FFFFF;
  return exponent === 0xFF && fraction !== 0;
}
```

---

## Bölüm 1.6: Kontrol Akışı

### If-Else İfadeleri

```typescript
// Basit if
function mutlakDeger(x: i32): i32 {
  if (x < 0) {
    return -x;
  }
  return x;
}

// If-else
function sinifNotu(puan: i32): string {
  if (puan >= 90) {
    return "A";
  } else if (puan >= 80) {
    return "B";
  } else if (puan >= 70) {
    return "C";
  } else if (puan >= 60) {
    return "D";
  } else {
    return "F";
  }
}

// Nested if
function ucgenTipi(a: i32, b: i32, c: i32): string {
  if (a === b && b === c) {
    return "Eşkenar üçgen";
  } else if (a === b || b === c || a === c) {
    return "İkizkenar üçgen";
  } else {
    return "Çeşitkenar üçgen";
  }
}
```

### Üçlü Operatör (Ternary)

```typescript
// condition ? true_value : false_value

function min(a: i32, b: i32): i32 {
  return a < b ? a : b;
}

function max(a: i32, b: i32): i32 {
  return a > b ? a : b;
}

function mutlakDegerKisa(x: i32): i32 {
  return x < 0 ? -x : x;
}

// Nested ternary (okunabilirlik için önerilmez)
function sinifNotuKisa(puan: i32): string {
  return puan >= 90 ? "A" :
         puan >= 80 ? "B" :
         puan >= 70 ? "C" :
         puan >= 60 ? "D" : "F";
}
```

### Switch-Case

```typescript
// Gün ismi getir
function gunIsmi(gun: i32): string {
  switch (gun) {
    case 0: return "Pazar";
    case 1: return "Pazartesi";
    case 2: return "Salı";
    case 3: return "Çarşamba";
    case 4: return "Perşembe";
    case 5: return "Cuma";
    case 6: return "Cumartesi";
    default: return "Bilinmeyen gün";
  }
}

// Aylık gün sayısı
function ayGunSayisi(ay: i32, yil: i32): i32 {
  switch (ay) {
    case 1: case 3: case 5: case 7: case 8: case 10: case 12:
      return 31;
    case 4: case 6: case 9: case 11:
      return 30;
    case 2:
      // Artık yıl kontrolü
      if ((yil % 4 === 0 && yil % 100 !== 0) || yil % 400 === 0) {
        return 29;
      }
      return 28;
    default:
      return 0;
  }
}
```

---

## Bölüm 1.7: Döngüler

### While Döngüsü

```typescript
// Basit while
function besKere(): void {
  let i: i32 = 0;
  while (i < 5) {
    console.log(i.toString());
    i++;
  }
}

// Faktöriyel (iteratif)
function faktoriyelWhile(n: i32): i32 {
  if (n <= 1) return 1;

  let sonuc: i32 = 1;
  let i: i32 = 2;

  while (i <= n) {
    sonuc *= i;
    i++;
  }

  return sonuc;
}

// Üs hesaplama
function usHesapla(taban: f64, us: i32): f64 {
  let sonuc: f64 = 1;
  let i: i32 = 0;

  while (i < us) {
    sonuc *= taban;
    i++;
  }

  return sonuc;
}
```

### Do-While Döngüsü

```typescript
// En az bir kez çalışır
function kullaniciGiris(): void {
  let sifre: string = "";
  let deneme: i32 = 0;

  do {
    // Kullanıcıdan şifre al (simüle edilmiş)
    sifre = "1234"; // Örnek
    deneme++;

    if (deneme >= 3) {
      console.log("Çok fazla deneme!");
      return;
    }
  } while (sifre !== "dogru");

  console.log("Giriş başarılı!");
}

// Sayı tahmin oyunu
function tahminOyunu(hedef: i32): i32 {
  let tahmin: i32 = 0;
  let deneme: i32 = 0;

  do {
    tahmin = (hedef + 1) / 2; // Basit strateji
    deneme++;

    if (tahmin < hedef) {
      console.log("Daha büyük!");
    } else if (tahmin > hedef) {
      console.log("Daha küçük!");
    }
  } while (tahmin !== hedef);

  return deneme;
}
```

### For Döngüsü

```typescript
// Standart for döngüsü
function birdenYuze(): void {
  for (let i: i32 = 1; i <= 100; i++) {
    console.log(i.toString());
  }
}

// Dizi toplama
function diziTopla(dizi: Int32Array): i32 {
  let toplam: i32 = 0;

  for (let i: i32 = 0; i < dizi.length; i++) {
    toplam += dizi[i];
  }

  return toplam;
}

// Çarpım tablosu
function carpimTablosu(n: i32): void {
  for (let i: i32 = 1; i <= n; i++) {
    for (let j: i32 = 1; j <= n; j++) {
      console.log(`${i} x ${j} = ${i * j}`);
    }
  }
}

// Üs hesaplama (optimize)
function usHesaplaFor(taban: f64, us: i32): f64 {
  let sonuc: f64 = 1;

  for (let i: i32 = 0; i < us; i++) {
    sonuc *= taban;
  }

  return sonuc;
}
```

### Break ve Continue

```typescript
// break - Döngüyü tamamen kırar
function ilkBoluBul(dizi: Int32Array, bolen: i32): i32 {
  for (let i: i32 = 0; i < dizi.length; i++) {
    if (dizi[i] % bolen === 0) {
      return dizi[i]; // İlk bulunan değeri döndür
    }
  }
  return -1; // Bulunamadı
}

// continue - Bu turu atlar, sonraki turdan devam eder
function ciftSayilariYazdir(dizi: Int32Array): void {
  for (let i: i32 = 0; i < dizi.length; i++) {
    if (dizi[i] % 2 !== 0) {
      continue; // Tek sayıyı atla
    }
    console.log(dizi[i].toString()); // Sadece çiftler
  }
}

// Etiketli break
function ikiDonguBreak(): void {
  diski: for (let i: i32 = 0; i < 10; i++) {
    for (let j: i32 = 0; j < 10; j++) {
      if (i === 5 && j === 5) {
        break diski; // Her iki döngüyü de kır
      }
    }
  }
}
```

---

## Bölüm 1.8: Pratik Örnekler

### Örnek 1: Basit Hesap Makinesi

```typescript
// assembly/index.ts

export function topla(a: i32, b: i32): i32 {
  return a + b;
}

export function cikar(a: i32, b: i32): i32 {
  return a - b;
}

export function carp(a: i32, b: i32): i32 {
  return a * b;
}

export function bol(a: i32, b: i32): f64 {
  if (b === 0) {
    return 0; // Sıfıra bölünme
  }
  return f64(a) / f64(b);
}

export function mod(a: i32, b: i32): i32 {
  return a % b;
}

export function us(taban: f64, us: i32): f64 {
  let sonuc: f64 = 1;
  for (let i: i32 = 0; i < us; i++) {
    sonuc *= taban;
  }
  return sonuc;
}

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
```

### Örnek 2: Dizi İşlemleri

```typescript
// Dizinin en büyük elemanını bul
export function diziMax(dizi: Int32Array): i32 {
  if (dizi.length === 0) return 0;

  let max: i32 = dizi[0];
  for (let i: i32 = 1; i < dizi.length; i++) {
    if (dizi[i] > max) {
      max = dizi[i];
    }
  }
  return max;
}

// Dizinin en küçük elemanını bul
export function diziMin(dizi: Int32Array): i32 {
  if (dizi.length === 0) return 0;

  let min: i32 = dizi[0];
  for (let i: i32 = 1; i < dizi.length; i++) {
    if (dizi[i] < min) {
      min = dizi[i];
    }
  }
  return min;
}

// Dizi ortalaması
export function diziOrtalama(dizi: Int32Array): f64 {
  if (dizi.length === 0) return 0;

  let toplam: f64 = 0;
  for (let i: i32 = 0; i < dizi.length; i++) {
    toplam += f64(dizi[i]);
  }
  return toplam / f64(dizi.length);
}

// Dizi ters çevir
export function diziTers(dizi: Int32Array): void {
  let sol: i32 = 0;
  let sag: i32 = dizi.length - 1;

  while (sol < sag) {
    // Swap
    let gecici: i32 = dizi[sol];
    dizi[sol] = dizi[sag];
    dizi[sag] = gecici;

    sol++;
    sag--;
  }
}

// Dizi sırala (bubble sort)
export function diziSirala(dizi: Int32Array): void {
  let n: i32 = dizi.length;

  for (let i: i32 = 0; i < n - 1; i++) {
    for (let j: i32 = 0; j < n - i - 1; j++) {
      if (dizi[j] > dizi[j + 1]) {
        // Swap
        let gecici: i32 = dizi[j];
        dizi[j] = dizi[j + 1];
        dizi[j + 1] = gecici;
      }
    }
  }
}
```

### Örnek 3: Sayı Bulmacaları

```typescript
// Asal sayı kontrolü
export function asalMi(n: i32): bool {
  if (n <= 1) return false;
  if (n <= 3) return true;
  if (n % 2 === 0 || n % 3 === 0) return false;

  let i: i32 = 5;
  while (i * i <= n) {
    if (n % i === 0 || n % (i + 2) === 0) {
      return false;
    }
    i += 6;
  }
  return true;
}

// n. asal sayıyı bul
export function nciAsal(n: i32): i32 {
  if (n <= 0) return 0;
  if (n === 1) return 2;

  let sayac: i32 = 1;
  let sayi: i32 = 3;

  while (sayac < n) {
    if (asalMi(sayi)) {
      sayac++;
    }
    sayi += 2;
  }

  return sayi - 2;
}

// Mükemmel sayı kontrolü
// Mükemmel sayı: Kendisi hariç pozitif tam bölenlerinin toplamına eşit olan sayı
// Örnek: 6 = 1 + 2 + 3, 28 = 1 + 2 + 4 + 7 + 14
export function mukemmelMi(n: i32): bool {
  if (n <= 1) return false;

  let toplam: i32 = 1;
  for (let i: i32 = 2; i * i <= n; i++) {
    if (n % i === 0) {
      toplam += i;
      let karsilik: i32 = n / i;
      if (karsilik !== i) {
        toplam += karsilik;
      }
    }
  }
  return toplam === n;
}

// Fibonacci sayısı (iteratif - daha hızlı)
export function fibonacciIteratif(n: i32): i64 {
  if (n <= 1) return i64(n);

  let onceki: i64 = 0;
  let suanki: i64 = 1;

  for (let i: i32 = 2; i <= n; i++) {
    let sonraki: i64 = onceki + suanki;
    onceki = suanki;
    suanki = sonraki;
  }

  return suanki;
}
```

### Örnek 4: Dönüşüm Fonksiyonları

```typescript
// Saniyeyi saat:dakika:saniye formatına çevir
export function saniyeToHMS(saniye: i32): string {
  let saat: i32 = saniye / 3600;
  let dakika: i32 = (saniye % 3600) / 60;
  let sn: i32 = saniye % 60;

  return `${saat}:${dakika}:${sn}`;
}

// Dereceyi Fahrenheit'a çevir
export function dereceToFahrenheit(c: f64): f64 {
  return (c * 9 / 5) + 32;
}

// Fahrenheit'i dereceye çevir
export function fahrenheitToDerece(f: f64): f64 {
  return (f - 32) * 5 / 9;
}

// Km/h'den m/s'ye çevir
export function kmhToms(kmh: f64): f64 {
  return kmh * 1000 / 3600;
}

// m/s'den km/h'ye çevir
export function msToKmh(ms: f64): f64 {
  return ms * 3600 / 1000;
}
```

---

## Bölüm 1.9: Modül 1 Özeti

### Öğrendiklerimiz

| Konu | Öğrenilenler |
|------|--------------|
| **Tür sistemi** | i32, u32, i64, u64, f32, f64, bool, v128, void |
| **Değişkenler** | var, let, const farkları |
| **Operatörler** | Aritmetik, bitwise, karşılaştırma, mantıksal |
| **Kontrol akışı** | if-else, switch, ternary |
| **Döngüler** | while, do-while, for, break, continue |
| **Dönüşümler** | Casting, portable conversions, reinterpret |

### Önemli İpuçları

1. **Tür belirlemesi zorunludur**
   ```typescript
   let x: i32 = 10;  // ✅
   let x = 10;       // ⚠️ Sınırlı çıkarım
   ```

2. **Portable conversions kullanın**
   ```typescript
   i32(x)   // ✅ Her yerde çalışır
   <i32>x   // ⚠️ Sadece AssemblyScript
   ```

3. **Diziler için Int32Array kullanın**
   ```typescript
   const dizi = new Int32Array(5);  // ✅
   ```

### Alıştırmalar

1. Bir sayının basamak sayısını bulan fonksiyon yazın
2. İki diziyi birleştiren fonksiyon yazın
3. Bir dizideki tekrarlayan elemanları bulan fonksiyon yazın
4. Roma rakamını sayıya çeviren fonksiyon yazın
5. Sayıyı Roma rakamına çeviren fonksiyon yazın

### Sonraki Modül

**Modül 2: Fonksiyonlar ve İleri Seviye Kontrol Yapıları**

Hazır mısınız? 🚀
