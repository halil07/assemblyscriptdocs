---
title: Modül 4 - Standart Kütüphane
description: Array, String, Map, Set, Math, TypedArray, Date, console ve AssemblyScript standart kütüphanesi.
---

# Modül 4: Standart Kütüphane

Bu modülde AssemblyScript'in standart kütüphanesini detaylı şekilde inceleyeceğiz.

---

## Bölüm 4.1: Array<T> - Dinamik Diziler

### Array Oluşturma

```typescript
// Boş dizi oluşturma
let bos: Array<i32> = new Array<i32>();
let sayilar: i32[] = new Array<i32>();

// Başlangıç boyutu ile
let boyutlu: Int32Array = new Int32Array(10);

// Başlangıç değerleri ile
let degerler: i32[] = [1, 2, 3, 4, 5];
```

### Array Metodları

```typescript
// Ekleme ve çıkarma
function diziIslemleri(): void {
  let dizi: i32[] = [];

  // Sonuna ekle
  dizi.push(10);
  dizi.push(20);
  dizi.push(30);  // [10, 20, 30]

  // Sondan çıkar
  let son: i32 = dizi.pop();  // son = 30, dizi = [10, 20]

  // Başına ekle
  dizi.unshift(5);  // [5, 10, 20]

  // Baştan çıkar
  let ilk: i32 = dizi.shift();  // ilk = 5, dizi = [10, 20]

  // Uzunluk
  console.log(dizi.length.toString());  // "2"
}

// Dilimleme ve kopyalama
function dilimIslemleri(): void {
  let dizi: i32[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  // slice(start, end) - alt dizi al
  let dilim1: i32[] = dizi.slice(2, 5);   // [3, 4, 5]
  let dilim2: i32[] = dizi.slice(0, 3);   // [1, 2, 3]
  let dilim3: i32[] = dizi.slice(5);      // [6, 7, 8, 9, 10]
  let kopya: i32[] = dizi.slice();        // Tümünü kopyala

  // concat - dizileri birleştir
  let dizi2: i32[] = [20, 30];
  let birlesik: i32[] = dizi.concat(dizi2);  // [1..10, 20, 30]
}

// Arama işlemleri
function aramaIslemleri(): void {
  let dizi: string[] = ["elma", "armut", "çilek", "erik"];

  // indexOf - elemanın indeksini bul
  let indeks: i32 = dizi.indexOf("çilek");  // 2
  let yok: i32 = dizi.indexOf("muz");       // -1

  // includes - var mı kontrolü
  let varMi: bool = dizi.includes("erik");  // true
}

// Sıralama işlemleri
function siralamaIslemleri(): void {
  let sayilar: i32[] = [5, 2, 8, 1, 9, 3];

  // sort() - varsayılan sıralama
  sayilar.sort();  // [1, 2, 3, 5, 8, 9]

  // reverse() - ters çevir
  sayilar.reverse();  // [9, 8, 5, 3, 2, 1]

  // String dizisi sıralama
  let meyveler: string[] = ["çilek", "armut", "elma", "erik"];
  meyveler.sort();  // Alfabetik (Unicode sırasına göre)
}

// Dönüştürme işlemleri
function donusturmeIslemleri(): void {
  let sayilar: i32[] = [1, 2, 3, 4, 5];

  // map - her elemanı dönüştür
  let kareler: i32[] = sayilar.map(x => x * x);  // [1, 4, 9, 16, 25]

  // filter - koşula göre ele
  let ciftler: i32[] = sayilar.filter(x => x % 2 === 0);  // [2, 4]

  // reduce - tek değere indirge
  let toplam: i32 = sayilar.reduce((acc, x) => acc + x, 0);  // 15

  // forEach - her eleman için işlem
  let toplam2: i32 = 0;
  sayilar.forEach(x => toplam2 += x);  // toplam2 = 15
}
```

### Pratik Örnekler

```typescript
// İstatistiksel işlemler
export function diziIstatistik(dizi: Int32Array): Float64Array {
  if (dizi.length === 0) {
    return new Float64Array([0, 0, 0]);
  }

  let n: f64 = f64(dizi.length);
  let toplam: f64 = 0;
  let karelerToplami: f64 = 0;

  for (let i: i32 = 0; i < dizi.length; i++) {
    let deger: f64 = f64(dizi[i]);
    toplam += deger;
    karelerToplami += deger * deger;
  }

  let ortalama: f64 = toplam / n;
  let varyans: f64 = (karelerToplami / n) - (ortalama * ortalama);
  let sapma: f64 = Math.sqrt(varyans);

  return new Float64Array([ortalama, varyans, sapma]);
}

// Dizi benzersiz elemanları
export function diziBenzersiz(dizi: Int32Array): Int32Array {
  let seen: Set<i32> = new Set();
  let sonuc: i32[] = [];

  for (let i: i32 = 0; i < dizi.length; i++) {
    let eleman: i32 = dizi[i];
    if (!seen.has(eleman)) {
      seen.add(eleman);
      sonuc.push(eleman);
    }
  }

  return sonuc as Int32Array;
}

// Dizi frekans hesabı
export function diziFrekans(dizi: Int32Array): Map<i32, i32> {
  let frekans: Map<i32, i32> = new Map();

  for (let i: i32 = 0; i < dizi.length; i++) {
    let eleman: i32 = dizi[i];
    let sayac: i32 = frekans.has(eleman) ? frekans.get(eleman) : 0;
    frekans.set(eleman, sayac + 1);
  }

  return frekans;
}
```

---

## Bölüm 4.2: String - Metin İşlemleri

### String Oluşturma

```typescript
// String literal
let mesaj: string = "Merhaba Dünya!";

// Template literal (sınırlı destek)
let ad: string = "Ahmet";
let selam: string = `Merhaba ${ad}`;  // "Merhaba Ahmet"

// String concatenation
let birlesim: string = "Merhaba " + "Dünya";  // "Merhaba Dünya"
```

### String Metodları

```typescript
// Karakter erişimi
function karakterErisim(): void {
  let s: string = "Merhaba";

  // charCodeAt() - karakter kodunu al
  let kod: i32 = s.charCodeAt(0);  // 77 ('M')

  // charAt() - karakteri al (string döner)
  let karakter: string = s.charAt(0);  // "M"

  // length - uzunluk
  let uzunluk: i32 = s.length;  // 7
}

// Alt string işlemleri
function altStringIslemleri(): void {
  let s: string = "Merhaba Dünya";

  // substring - alt string al
  let alt1: string = s.substring(0, 7);  // "Merhaba"
  let alt2: string = s.substring(8);     // "Dünya"

  // indexOf - arama
  let poz: i32 = s.indexOf("Dünya");    // 8
  let yok: i32 = s.indexOf("Ayşe");     // -1

  // includes - içerir mi?
  let varMi: bool = s.includes("hab");  // true
}

// String karşılaştırma
function stringKarsilastirma(): void {
  let s1: string = "elma";
  let s2: string = "armut";
  let s3: string = "elma";

  // equals (==)
  let esit1: bool = s1 == s3;  // true
  let esit2: bool = s1 == s2;  // false

  // compareTo (benzer)
  let kiyas1: i32 = s1 < s2 ? -1 : s1 > s2 ? 1 : 0;  // -1 (elma < armut)
}

// String dönüştürme
function stringDonusturme(): void {
  let s: string = "Merhaba";

  // toUpperCase - büyük harfe çevir
  let buyuk: string = s.toUpperCase();  // "MERHABA"

  // toLowerCase - küçük harfe çevir
  let kucuk: string = s.toLowerCase();  // "merhaba"

  // trim - baş/son boşlukları at
  let bosluklu: string = "  selam  ";
  let trim: string = bosluklu.trim();  // "selam"
}
```

### Pratik String Fonksiyonları

```typescript
// Palindrom kontrolü
export function palindromMi(s: string): bool {
  let temiz: string = s.toLowerCase().trim();
  let uzunluk: i32 = temiz.length;

  for (let i: i32 = 0; i < uzunluk / 2; i++) {
    if (temiz.charCodeAt(i) !== temiz.charCodeAt(uzunluk - 1 - i)) {
      return false;
    }
  }
  return true;
}

// Kelime sayısı
export function kelimeSayisi(s: string): i32 {
  let temiz: string = s.trim();
  if (temiz.length === 0) return 0;

  let sayac: i32 = 0;
  let kelimeIci: bool = false;

  for (let i: i32 = 0; i < temiz.length; i++) {
    let kod: i32 = temiz.charCodeAt(i);

    if (kod === 32) {  // Boşluk
      kelimeIci = false;
    } else if (!kelimeIci) {
      kelimeIci = true;
      sayac++;
    }
  }

  return sayac;
}

// String'i kelime dizisine ayırma
export function kelimelereAyir(s: string): string[] {
  let kelimeler: string[] = [];
  let kelime: string = "";
  let kelimeIci: bool = false;

  for (let i: i32 = 0; i < s.length; i++) {
    let kod: i32 = s.charCodeAt(i);

    if (kod === 32) {  // Boşluk
      if (kelimeIci) {
        kelimeler.push(kelime);
        kelime = "";
        kelimeIci = false;
      }
    } else {
      kelime += String.fromCharCode(kod);
      kelimeIci = true;
    }
  }

  if (kelimeIci) {
    kelimeler.push(kelime);
  }

  return kelimeler;
}

// String ters çevir
export function stringTersCevir(s: string): string {
  let ters: string = "";

  for (let i: i32 = s.length - 1; i >= 0; i--) {
    ters += String.fromCharCode(s.charCodeAt(i));
  }

  return ters;
}
```

---

## Bölüm 4.3: Map<K,V> ve Set<T>

### Map - Anahtar-Değer Çiftleri

```typescript
// Map oluşturma
let harita: Map<string, i32> = new Map();

// Değer ekleme
harita.set("elma", 10);
harita.set("armut", 15);
harita.set("çilek", 20);

// Değer okuma
let elmaFiyat: i32 = harita.get("elma");  // 10
let meyveFiyat: i32 = harita.get("muz");  // 0 (veya hata)

// Varsa kontrol et
if (harita.has("armut")) {
  let fiyat: i32 = harita.get("armut");  // 15
}

// Boyut
console.log(harita.size.toString());  // "3"

// Silme
harita.delete("çilek");
console.log(harita.size.toString());  // "2"

// Tümünü sil
harita.clear();
console.log(harita.size.toString());  // "0"
```

### Set - Benzersiz Değerler

```typescript
// Set oluşturma
let kume: Set<i32> = new Set();

// Değer ekleme
kume.add(10);
kume.add(20);
kume.add(30);
kume.add(10);  // Tekrarlanan değer eklenmez

// Boyut
console.log(kume.size.toString());  // "3"

// Var mı kontrolü
let varMi: bool = kume.has(20);  // true
let yokMu: bool = kume.has(40);  // false

// Silme
kume.delete(20);

// Diziye çevirme
// let dizi: i32[] = kume.values();  // [10, 30]
```

### Pratik Örnekler

```typescript
// Kelime frekans sayacı
export function kelimeFrekansi(metin: string): Map<string, i32> {
  let frekans: Map<string, i32> = new Map();
  let kelimeler: string[] = kelimelereAyir(metin);

  for (let i: i32 = 0; i < kelimeler.length; i++) {
    let kelime: string = kelimeler[i].toLowerCase();
    let sayac: i32 = frekans.has(kelime) ? frekans.get(kelime) : 0;
    frekans.set(kelime, sayac + 1);
  }

  return frekans;
}

// İki dizinin kesişimi
export function diziKesisim(dizi1: Int32Array, dizi2: Int32Array): Int32Array {
  let kume: Set<i32> = new Set();
  let sonuc: i32[] = [];

  // İlk diziyi set'e ekle
  for (let i: i32 = 0; i < dizi1.length; i++) {
    kume.add(dizi1[i]);
  }

  // İkinci dizidekilerden set'te olanları al
  for (let i: i32 = 0; i < dizi2.length; i++) {
    let eleman: i32 = dizi2[i];
    if (kume.has(eleman)) {
      sonuc.push(eleman);
      kume.delete(eleman);  // Tekrarı önle
    }
  }

  return sonuc as Int32Array;
}

// İki dizinin birleşimi
export function diziBirlesim(dizi1: Int32Array, dizi2: Int32Array): Int32Array {
  let kume: Set<i32> = new Set();

  for (let i: i32 = 0; i < dizi1.length; i++) {
    kume.add(dizi1[i]);
  }

  for (let i: i32 = 0; i < dizi2.length; i++) {
    kume.add(dizi2[i]);
  }

  // Set'i diziye çevir
  let sonuc: i32[] = [];
  // Not: AssemblyScript'te Set.values() sınırlıdır
  // Manual döngü gerekebilir
  return sonuc as Int32Array;
}
```

---

## Bölüm 4.4: Math ve Mathf

### Math - Double Precision (f64)

```typescript
// Temel matematik
let mutlak: f64 = Math.abs(-5.5);        // 5.5
let us: f64 = Math.pow(2, 10);            // 1024
let kok: f64 = Math.sqrt(25);             // 5
let yuvarla: f64 = Math.round(3.7);       // 4
let tavan: f64 = Math.ceil(3.2);          // 4
let taban: f64 = Math.floor(3.9);         // 3

// Trigonometrik
let sin: f64 = Math.sin(0);               // 0
let cos: f64 = Math.cos(0);               // 1
let tan: f64 = Math.tan(0);               // 0
let asin: f64 = Math.asin(0);             // 0
let acos: f64 = Math.acos(1);             // 0
let atan: f64 = Math.atan(0);             // 0
let atan2: f64 = Math.atan2(1, 1);        // 0.785 (π/4)

// Hiperbolik
let sinh: f64 = Math.sinh(0);             // 0
let cosh: f64 = Math.cosh(0);             // 1
let tanh: f64 = Math.tanh(0);             // 0

// Logaritmik
let ln: f64 = Math.log(Math.E);           // 1 (doğal logaritma)
let log10: f64 = Math.log10(100);         // 2
let log2: f64 = Math.log2(8);             // 3
let exp: f64 = Math.exp(1);               // 2.718...

// Min/Max
let min: f64 = Math.min(5, 10);           // 5
let max: f64 = Math.max(5, 10);           // 10

// Sabitler
const PI: f64 = Math.PI;                  // 3.14159...
const E: f64 = Math.E;                    // 2.71828...
```

### Mathf - Single Precision (f32)

```typescript
// Aynı metodlar f32 için
let sinf: f32 = Mathf.sin(0);             // 0
let cosf: f32 = Mathf.cos(0);             // 1
let kokf: f32 = Mathf.sqrt(25);           // 5

// Performans kritik kodlarda f32 tercih edilir
```

### Pratik Matematik Fonksiyonları

```typescript
// Dereceyi radyana çevir
export function dereceToRadyan(derece: f64): f64 {
  return derece * Math.PI / 180;
}

// Radyanı dereceye çevir
export function radyanToDerece(radyan: f64): f64 {
  return radyan * 180 / Math.PI;
}

// Logaritma taban değiştirme
export function logTaban(x: f64, taban: f64): f64 {
  return Math.log(x) / Math.log(taban);
}

// Üstlü n! hesaplama
export function faktoriyelGamma(x: f64): f64 {
  // Gamma fonksiyonu kullanarak (x-1)!
  // Basit yaklaşım
  if (x <= 1) return 1;

  let sonuc: f64 = 1;
  for (let i: f64 = 2; i < x; i += 1) {
    sonuc *= i;
  }
  return sonuc;
}

// Kombinasyon hesaplama
export function kombinasyon(n: i32, r: i32): f64 {
  if (r < 0 || r > n) return 0;
  if (r === 0 || r === n) return 1;

  // C(n, r) = n! / (r! * (n-r)!)
  // Daha verimli yöntem:
  let sonuc: f64 = 1;
  for (let i: i32 = 0; i < r; i++) {
    sonuc *= f64(n - i) / f64(i + 1);
  }
  return sonuc;
}

// Permütasyon hesaplama
export class permutasyon(n: i32, r: i32): f64 {
  if (r < 0 || r > n) return 0;

  let sonuc: f64 = 1;
  for (let i: i32 = 0; i < r; i++) {
    sonuc *= f64(n - i);
  }
  return sonuc;
}
```

---

## Bölüm 4.5: TypedArray Türleri

### Türler ve Kullanım

```typescript
// Her typed array türü

// Int8Array - 8-bit signed
let i8: Int8Array = new Int8Array(10);
i8[0] = 127;   // Maksimum
// i8[1] = 128; // ❌ Taşar!

// Uint8Array - 8-bit unsigned
let u8: Uint8Array = new Uint8Array(10);
u8[0] = 255;   // Maksimum

// Int16Array - 16-bit signed
let i16: Int16Array = new Int16Array(10);
i16[0] = 32767; // Maksimum

// Uint16Array - 16-bit unsigned
let u16: Uint16Array = new Uint16Array(10);
u16[0] = 65535; // Maksimum

// Int32Array - 32-bit signed (en yaygın)
let i32: Int32Array = new Int32Array(10);
i32[0] = 2147483647; // Maksimum

// Uint32Array - 32-bit unsigned
let u32: Uint32Array = new Uint32Array(10);
u32[0] = 4294967295; // Maksimum

// Float32Array - 32-bit float
let f32: Float32Array = new Float32Array(10);
f32[0] = 3.14;

// Float64Array - 64-bit float
let f64: Float64Array = new Float64Array(10);
f64[0] = 3.141592653589793;
```

### ArrayBuffer ve DataView

```typescript
// Raw buffer oluşturma
let buffer: ArrayBuffer = new ArrayBuffer(1024);  // 1 KB

// DataView - esnek okuma/yazma
let view: DataView = new DataView(buffer);

// Farklı türlerle yazma
view.setInt8(0, 127);
view.setInt16(2, 1000, true);   // Little endian
view.setInt32(4, 100000, true);
view.setFloat64(8, 3.14, true);

// Okuma
let i8: i32 = view.getInt8(0);
let i16: i32 = view.getInt16(2, true);
let i32: i32 = view.getInt32(4, true);
let f64: f64 = view.getFloat64(8, true);

// BigInt ile 64-bit
let i64: i64 = view.getInt64(12, true);
let u64: u64 = view.getUint64(20, true);
```

---

## Bölüm 4.6: console ve process

### Console Çıktısı

```typescript
// String çıktısı
console.log("Merhaba Dünya!");

// Sayı çıktısı
console.log((42).toString());

// Birden fazla değer
// console.log("Değer:", x.toString()); // Sınırlı destek

// Hata çıktısı
console.error("Bir hata oluştu!");

// Uyarı çıktısı
// console.warn("Uyarı!"); // Sınırlı destek
```

### Process Bilgileri

```typescript
// Komut satırı argümanları
let args: string[] = process.argv;

// Argüman sayısı
let argCount: i32 = args.length;

// Çalışma dizini
// let cwd: string = process.cwd(); // Sınırlı destek

// Platform bilgisi
// let platform: string = process.platform; // Sınırlı destek
```

---

## Bölüm 4.7: Tarih ve Zaman (Date)

### Date Kullanımı

```typescript
// Mevcut zaman
let simdi: Date = new Date();

// Timestamp (milisaniye)
let timestamp: f64 = simdi.getTime();

// Yılı al
let yil: i32 = simdi.getFullYear();  // UTC

// Ayı al (0-11)
let ay: i32 = simdi.getMonth();

// Günü al
let gun: i32 = simdi.getDate();

// Saati al
let saat: i32 = simdi.getHours();

// Dakikayı al
let dakika: i32 = simdi.getMinutes();

// Saniyeyi al
let saniye: i32 = simdi.getSeconds();
```

### Tarih Hesaplamaları

```typescript
// İki tarih arasındaki fark (gün)
export fn tarihFarkiGun(tarih1: Date, tarih2: Date): f64 {
  let ms1: f64 = tarih1.getTime();
  let ms2: f64 = tarih2.getTime();
  let farkMs: f64 = Math.abs(ms1 - ms2);
  return farkMs / (1000 * 60 * 60 * 24);
}

// Tarihe gün ekle
export fn tariheGunEkle(tarih: Date, gun: i32): Date {
  let ms: f64 = tarih.getTime();
  let yeniMs: f64 = ms + (f64(gun) * 24 * 60 * 60 * 1000);
  let yeni: Date = new Date();
  yeni.setTime(yeniMs);
  return yeni;
}

// Haftanın günü
export fn haftaninGunu(tarih: Date): string {
  let gun: i32 = tarih.getDay();

  const GUNLER: string[] = [
    "Pazar",
    "Pazartesi",
    "Salı",
    "Çarşamba",
    "Perşembe",
    "Cuma",
    "Cumartesi"
  ];

  return GUNLER[gun];
}
```

---

## Bölüm 4.8: Modül 4 Özeti

### Öğrendiklerimiz

| Konu | Öğrenilenler |
|------|--------------|
| **Array** | push, pop, slice, map, filter, reduce |
| **String** | concat, substring, indexOf, includes |
| **Map/Set** | Anahtar-değer, benzersiz değerler |
| **Math** | Trigonometrik, logaritmik, min/max |
| **TypedArray** | Int8Array, Int32Array, Float64Array |
| **Date** | Zaman işlemleri, tarih hesaplamaları |
| **Console** | Çıktı yazma |
| **Process** | Argümanlar |

### Önemli İpuçları

1. **Array<T> yerine Int32Array kullanın**
   ```typescript
   let dizi: Int32Array = new Int32Array(10);  // ✅
   ```

2. **String birleştirme için + operatörü**
   ```typescript
   let s: string = "Merhaba " + "Dünya";  // ✅
   ```

3. **Map'te has() kontrolü unutmayın**
   ```typescript
   if (harita.has("anahtar")) {
     let deger = harita.get("anahtar");
   }
   ```

### Alıştırmalar

1. Dizi medyanı hesaplayan fonksiyon yazın
2. String içindeki ünlü harfleri sayan fonksiyon yazın
3. Map kullanarak kelime sözlüğü oluşturun
4. İki tarihin aynı gün olup olmadığını kontrol edin
5. TypedArray ile resim grayscale dönüşümü yapın

### Sonraki Modül

**Modül 5: WebAssembly Entegrasyonu**

Hazır mısınız? 🚀
