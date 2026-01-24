---
title: Modül 2 - Fonksiyonlar ve Kontrol Yapıları
description: Fonksiyon tanımlama, parametreler, recursive fonksiyonlar, generic'ler, döngü optimizasyonları ve algoritmalar.
---

# Modül 2: Fonksiyonlar ve İleri Seviye Kontrol Yapıları

Bu modülde fonksiyonları derinlemesine inceleyeceğiz. Parametreler, dönüş değerleri, overloading, generic fonksiyonlar ve daha fazlasını öğreneceksiniz.

---

## Bölüm 2.1: Fonksiyon Temelleri

### Fonksiyon Tanımlama

AssemblyScript'te fonksiyonlar açıkça tip tanımlamaları gerektirir:

```typescript
// Temel fonksiyon sözdizimi
function fonksiyonAdi(param1: Tip1, param2: Tip2): DönüşTipi {
  // Fonksiyon gövdesi
  return değer;
}

// Örnek 1: Değer döndüren fonksiyon
function topla(a: i32, b: i32): i32 {
  return a + b;
}

// Örnek 2: Değer döndürmeyen fonksiyon (void)
function selamVer(isim: string): void {
  console.log(`Merhaba, ${isim}!`);
}

// Örnek 3: Parametresiz fonksiyon
function rastgeleSayi(): i32 {
  // Basit rastgele sayı üreteci
  return i32(Math.random() * 100);
}
```

### Fonksiyon Çağırma

```typescript
// Fonksiyon çağırma
let sonuc: i32 = topla(10, 20);  // sonuc = 30
selamVer("Ahmet");               // Konsola yazar
let rastgele: i32 = rastgeleSayi();

// İç içe fonksiyon çağrısı
function kare(x: i32): i32 {
  return x * x;
}

function kup(x: i32): i32 {
  return x * kare(x);  // kare fonksiyonunu çağırır
}

// let kupSonuc: i32 = kup(3);  // 27
```

### Fonksiyon Parametreleri

#### Zorunlu Parametreler

```typescript
function carpim(a: i32, b: i32): i32 {
  return a * b;
}

// Her iki parametre de zorunlu
// carpim(5);    // ❌ Derleme hatası
// carpim(5, 3); // ✅ Doğru
```

#### Varsayılan Parametre Değerleri

```typescript
// Varsayılan değer ile parametre opsiyonel olur
function selam(isim: string = "Dünya"): string {
  return `Merhaba, ${isim}!`;
}

selam();           // "Merhaba, Dünya!"
selam("Ahmet");    // "Merhaba, Ahmet!"

// Birden fazla varsayılan parametre
function bilgi(ad: string, soyad: string = "", yas: i32 = 18): string {
  let sonuc: string = ad;
  if (soyad.length > 0) {
    sonuc += " " + soyad;
  }
  sonuc += ", " + yas.toString();
  return sonuc;
}

bilgi("Ahmet");                    // "Ahmet, 18"
bilgi("Ahmet", "Yılmaz");          // "Ahmet Yılmaz, 18"
bilgi("Ahmet", "Yılmaz", 25);      // "Ahmet Yılmaz, 25"
```

#### Parametre Sırası

```typescript
// Varsayılan parametreler her zaman en sona yazılmalı
function dogru(x: i32, y: i32 = 10): i32 {  // ✅
  return x + y;
}

// function yanlis(x: i32 = 10, y: i32): i32 {  // ❌
//   return x + y;
// }
```

### Fonksiyon Dönüş Değerleri

```typescript
// Tek değer dönüşü
function karekok(n: f64): f64 {
  if (n < 0) return 0;
  return Math.sqrt(n);
}

// Early return (erken dönüş)
function bolum(a: i32, b: i32): f64 {
  if (b === 0) {
    console.log("Sıfıra bölünme hatası!");
    return 0;  // Erken dönüş
  }
  return f64(a) / f64(b);
}

// Çoklu return noktaları
function mutlakDeger(x: i32): i32 {
  if (x < 0) return -x;
  if (x > 0) return x;
  return 0;  // x === 0 durumu
}
```

### Return Türü Belirtme Zorunluluğu

```typescript
// ❌ Derleme hatası - dönüş türü belirtilmemiş
// function topla(a: i32, b: i32) {
//   return a + b;
// }

// ✅ Doğru - dönüş türü belirtilmiş
function topla(a: i32, b: i32): i32 {
  return a + b;
}

// ✅ void - dönüş yok
function yaz(mesaj: string): void {
  console.log(mesaj);
}
```

---

## Bölüm 2.2: İleri Seviye Fonksiyonlar

### Recursive Fonksiyonlar

```typescript
// Faktöriyel (recursive)
function faktoriyel(n: i32): i32 {
  if (n <= 1) return 1;  // Temel durum
  return n * faktoriyel(n - 1);  // Recursive çağrı
}

// Fibonacci (recursive - yavaş)
function fibonacci(n: i32): i32 {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// Üs hesaplama (recursive)
function usHesapla(taban: f64, us: i32): f64 {
  if (us === 0) return 1;
  if (us === 1) return taban;
  return taban * usHesapla(taban, us - 1);
}

// Optimize üs (fast exponentiation)
function usHesaplaHizli(taban: f64, us: i32): f64 {
  if (us === 0) return 1;
  if (us === 1) return taban;

  if (us % 2 === 0) {
    let yari: f64 = usHesaplaHizli(taban, us / 2);
    return yari * yari;
  } else {
    return taban * usHesaplaHizli(taban, us - 1);
  }
}

// Greatest Common Divisor (ÖBEB) - Euclidean algorithm
function obeb(a: i64, b: i64): i64 {
  if (b === 0) return a;
  return obeb(b, a % b);
}

// Least Common Multiple (OKEK)
function okek(a: i64, b: i64): i64 {
  return (a * b) / obeb(a, b);
}
```

### Memoization (Recursive Optimizasyonu)

```typescript
// Fibonacci without memoization (çok yavaş)
function fibonacciSlow(n: i32): i32 {
  if (n <= 1) return n;
  return fibonacciSlow(n - 1) + fibonacciSlow(n - 2);
}
// fibonacciSlow(40) = ~1 saniye

// Fibonacci with memoization (çok hızlı)
const FIB_CACHE_SIZE: i32 = 100;
var fibCache: Int32Array = new Int32Array(FIB_CACHE_SIZE);

// Cache'i başlat
function initFibCache(): void {
  for (let i: i32 = 0; i < FIB_CACHE_SIZE; i++) {
    fibCache[i] = -1;
  }
}

function fibonacciFast(n: i32): i32 {
  if (n <= 1) return n;
  if (n < FIB_CACHE_SIZE && fibCache[n] !== -1) {
    return fibCache[n];  // Cache'den al
  }

  let sonuc: i32 = fibonacciFast(n - 1) + fibonacciFast(n - 2);

  if (n < FIB_CACHE_SIZE) {
    fibCache[n] = sonuc;  // Cache'e kaydet
  }

  return sonuc;
}
// fibonacciFast(40) = anlık
```

### Inline Fonksiyonlar

```typescript
// @inline decorator - fonksiyon çağrısı yerine kodu yerleştirir
@inline
function minI32(a: i32, b: i32): i32 {
  return a < b ? a : b;
}

@inline
function maxI32(a: i32, b: i32): i32 {
  return a > b ? a : b;
}

// Kullanım
function clampedValue(value: i32, min: i32, max: i32): i32 {
  return maxI32(min, minI32(value, max));
}

// Not: @inline sadece bir istektir, derleyici dikkate almayabilir
```

---

## Bölüm 2.3: Generic Fonksiyonlar

### Basit Generic Fonksiyonlar

```typescript
// Generic fonksiyon tanımlama
function takas<T>(a: T, b: T): T[] {
  return [b, a];
}

// Kullanım
let sayilar = takas<i32>(10, 20);   // [20, 10]
let metinler = takas<string>("a", "b");  // ["b", "a"]
```

### Static Type Checks ile Generic'ler

```typescript
// İki değeri topla (tür bilinmezse derleme zamanında belirlenir)
function toplaGeneric<T>(a: T, b: T): T {
  // Tür kontrolü ile davranışı değiştir
  if (isInteger<T>()) {
    // Tam sayı ise
    return unchecked(a + b);
  } else if (isFloat<T>()) {
    // Float ise
    return unchecked(a + b);
  } else if (isString<T>()) {
    // String ise parseInt ile topla
    let aNum: f64 = parseFloat(a);
    let bNum: f64 = parseFloat(b);
    return changetype<T>(aNum + bNum);
  }
  return unchecked(a + b);
}

// Kullanım
let sayiSonuc: i32 = toplaGeneric<i32>(10, 20);      // 30
let floatSonuc: f64 = toplaGeneric<f64>(1.5, 2.5);   // 4.0
let stringSonuc: string = toplaGeneric<string>("10", "20");  // "30"
```

### Generic ile Tip Uyumluluğu

```typescript
// Minimum değer bul (generic)
function min<T>(a: T, b: T): T {
  return a < b ? a : b;
}

// Kullanım
let sayiMin: i32 = min<i32>(10, 5);        // 5
let floatMin: f64 = min<f64>(3.14, 2.71);  // 2.71

// Dizi toplama (generic)
function diziTopla<T>(dizi: T[]): T {
  let toplam: T = unchecked(0);

  for (let i: i32 = 0; i < dizi.length; i++) {
    toplam = unchecked(toplam + dizi[i]);
  }

  return toplam;
}

// Kullanım
let sayiDizi: i32[] = [1, 2, 3, 4, 5];
let sayiToplam: i32 = diziTopla<i32>(sayiDizi);  // 15
```

---

## Bölüm 2.4: Fonksiyon Overloading

AssemblyScript'te tam fonksiyon overloading desteği yoktur, ancak farklı isimlerle alternatifler oluşturabilirsiniz:

```typescript
// Overloading alternatifi - farklı isimler
function toplaI32(a: i32, b: i32): i32 {
  return a + b;
}

function toplaF64(a: f64, b: f64): f64 {
  return a + b;
}

function toplaDizi(dizi: Int32Array): i32 {
  let toplam: i32 = 0;
  for (let i: i32 = 0; i < dizi.length; i++) {
    toplam += dizi[i];
  }
  return toplam;
}

// Kullanım
let a: i32 = toplaI32(10, 20);       // 30
let b: f64 = toplaF64(1.5, 2.5);     // 4.0
let dizi = new Int32Array([1, 2, 3]);
let c: i32 = toplaDizi(dizi);        // 6
```

---

## Bölüm 2.5: İleri Seviye Döngüler

### İç İçe Döngüler

```typescript
// Çarpım tablosu
function carpimTablosuYazdir(boyut: i32): void {
  for (let i: i32 = 1; i <= boyut; i++) {
    for (let j: i32 = 1; j <= boyut; j++) {
      let sonuc: i32 = i * j;
      console.log(`${i} x ${j} = ${sonuc}`);
    }
    console.log("---");  // Satır arası
  }
}

// Matris toplamı
function matrisTopla(
  matris1: Int32Array,
  matris2: Int32Array,
  satir: i32,
  sutun: i32
): Int32Array {
  let sonuc: Int32Array = new Int32Array(satir * sutun);

  for (let i: i32 = 0; i < satir; i++) {
    for (let j: i32 = 0; j < sutun; j++) {
      let indeks: i32 = i * sutun + j;
      sonuc[indeks] = matris1[indeks] + matris2[indeks];
    }
  }

  return sonuc;
}
```

### Etiketli Döngüler

```typescript
// İç içe döngüden çıkma
function ara(eleman: i32): bool {
  disli:
  for (let i: i32 = 0; i < 10; i++) {
    for (let j: i32 = 0; j < 10; j++) {
      if (i * j === eleman) {
        console.log(`Bulundu: ${i} x ${j} = ${eleman}`);
        break disli;  // Her iki döngüden de çık
      }
    }
  }
  return true;
}

// Etiketli continue
function ciftleriYazdir(): void {
  disli:
  for (let i: i32 = 0; i < 5; i++) {
    for (let j: i32 = 0; j < 5; j++) {
      if (j % 2 !== 0) {
        continue;  // Sadece iç döngünün bu turunu atla
      }
      console.log(`i=${i}, j=${j}`);
    }
  }
}
```

### Döngü Performans İpuçları

```typescript
// ❌ Yavaş - Her iterasyonda dizi.length erişimi
function yavasTopla(dizi: Int32Array): i32 {
  let toplam: i32 = 0;
  for (let i: i32 = 0; i < dizi.length; i++) {
    toplam += dizi[i];
  }
  return toplam;
}

// ✅ Hızlı - length'i baştan al
function hizliTopla(dizi: Int32Array): i32 {
  let toplam: i32 = 0;
  let n: i32 = dizi.length;

  for (let i: i32 = 0; i < n; i++) {
    toplam += dizi[i];
  }
  return toplam;
}

// ✅ Daha hızlı - while döngüsü
function dahaHizliTopla(dizi: Int32Array): i32 {
  let toplam: i32 = 0;
  let i: i32 = 0;
  let n: i32 = dizi.length;

  while (i < n) {
    toplam += dizi[i];
    i++;
  }
  return toplam;
}
```

---

## Bölüm 2.6: Döngü Optimizasyonları

### Loop Unrolling (Döngü Genişletme)

```typescript
// Normal döngü
function normalTopla(dizi: Int32Array): i32 {
  let toplam: i32 = 0;
  let n: i32 = dizi.length;

  for (let i: i32 = 0; i < n; i++) {
    toplam += dizi[i];
  }
  return toplam;
}

// Unrolled döngü (4 iteration bir arada)
function unrolledTopla(dizi: Int32Array): i32 {
  let toplam: i32 = 0;
  let n: i32 = dizi.length;
  let i: i32 = 0;

  // 4'er 4'er ilerle
  while (i + 3 < n) {
    toplam += dizi[i];
    toplam += dizi[i + 1];
    toplam += dizi[i + 2];
    toplam += dizi[i + 3];
    i += 4;
  }

  // Kalan elemanları tek tek ekle
  while (i < n) {
    toplam += dizi[i];
    i++;
  }

  return toplam;
}
```

### Döngü İçi Koşulları Kaldırma

```typescript
// ❌ Yavaş - Her iteration'da kontrol
function isleYavas(dizi: Int32Array, islem: i32): Int32Array {
  let sonuc: Int32Array = new Int32Array(dizi.length);

  for (let i: i32 = 0; i < dizi.length; i++) {
    if (islem === 0) {
      sonuc[i] = dizi[i] * 2;
    } else if (islem === 1) {
      sonuc[i] = dizi[i] + 10;
    } else {
      sonuc[i] = dizi[i];
    }
  }
  return sonuc;
}

// ✅ Hızlı - Döngüden önce kontrol et
function isleHizli(dizi: Int32Array, islem: i32): Int32Array {
  let sonuc: Int32Array = new Int32Array(dizi.length);
  let n: i32 = dizi.length;

  if (islem === 0) {
    for (let i: i32 = 0; i < n; i++) {
      sonuc[i] = dizi[i] * 2;
    }
  } else if (islem === 1) {
    for (let i: i32 = 0; i < n; i++) {
      sonuc[i] = dizi[i] + 10;
    }
  } else {
    for (let i: i32 = 0; i < n; i++) {
      sonuc[i] = dizi[i];
    }
  }
  return sonuc;
}
```

---

## Bölüm 2.7: Pratik Algoritmalar

### Sıralama Algoritmaları

```typescript
// Bubble Sort
function bubbleSort(dizi: Int32Array): void {
  let n: i32 = dizi.length;

  for (let i: i32 = 0; i < n - 1; i++) {
    for (let j: i32 = 0; j < n - i - 1; j++) {
      if (dizi[j] > dizi[j + 1]) {
        // Swap
        let temp: i32 = dizi[j];
        dizi[j] = dizi[j + 1];
        dizi[j + 1] = temp;
      }
    }
  }
}

// Selection Sort
function selectionSort(dizi: Int32Array): void {
  let n: i32 = dizi.length;

  for (let i: i32 = 0; i < n - 1; i++) {
    let minIndeks: i32 = i;

    for (let j: i32 = i + 1; j < n; j++) {
      if (dizi[j] < dizi[minIndeks]) {
        minIndeks = j;
      }
    }

    // Swap
    let temp: i32 = dizi[i];
    dizi[i] = dizi[minIndeks];
    dizi[minIndeks] = temp;
  }
}

// Insertion Sort
function insertionSort(dizi: Int32Array): void {
  let n: i32 = dizi.length;

  for (let i: i32 = 1; i < n; i++) {
    let anahtar: i32 = dizi[i];
    let j: i32 = i - 1;

    while (j >= 0 && dizi[j] > anahtar) {
      dizi[j + 1] = dizi[j];
      j--;
    }
    dizi[j + 1] = anahtar;
  }
}
```

### Arama Algoritmaları

```typescript
// Linear Search
function linearSearch(dizi: Int32Array, hedef: i32): i32 {
  for (let i: i32 = 0; i < dizi.length; i++) {
    if (dizi[i] === hedef) {
      return i;  // Bulundu
    }
  }
  return -1;  // Bulunamadı
}

// Binary Search (sıralı dizi gerektirir)
function binarySearch(dizi: Int32Array, hedef: i32): i32 {
  let sol: i32 = 0;
  let sag: i32 = dizi.length - 1;

  while (sol <= sag) {
    let orta: i32 = sol + (sag - sol) / 2;

    if (dizi[orta] === hedef) {
      return orta;
    }

    if (dizi[orta] < hedef) {
      sol = orta + 1;
    } else {
      sag = orta - 1;
    }
  }

  return -1;  // Bulunamadı
}
```

### Sayısal Algoritmalar

```typescript
// Üslü sayı modüler (pow(a, b) % mod)
// Büyük sayılar için overflow önler
function usModuler(a: i64, b: i64, mod: i64): i64 {
  let sonuc: i64 = 1;
  a = a % mod;

  while (b > 0) {
    // b tek ise sonuc'a ekle
    if (b % 2 === 1) {
      sonuc = (sonuc * a) % mod;
    }

    // b'yi 2'ye böl, a'nın karesini al
    b = b / 2;
    a = (a * a) % mod;
  }

  return sonuc;
}

// Bir sayının basamak sayısını bul
function basamakSayisi(n: i32): i32 {
  if (n === 0) return 1;

  let sayac: i32 = 0;
  let sayi: i32 = abs(n);

  while (sayi > 0) {
    sayac++;
    sayi = sayi / 10;
  }

  return sayac;
}

// Bir sayının basamaklarını ters çevir
// Örnek: 1234 -> 4321
function sayiyiTersCevir(n: i32): i32 {
  let ters: i32 = 0;
  let sayi: i32 = abs(n);

  while (sayi > 0) {
    let basamak: i32 = sayi % 10;
    ters = ters * 10 + basamak;
    sayi = sayi / 10;
  }

  return n < 0 ? -ters : ters;
}

// Palindrom sayı kontrolü
function palindromMi(n: i32): bool {
  return n === sayiyiTersCevir(n);
}
```

---

## Bölüm 2.8: String İşlemleri

### String Karşılaştırma

```typescript
// String eşit mi?
function stringEsitMi(s1: string, s2: string): bool {
  if (s1.length !== s2.length) {
    return false;
  }

  for (let i: i32 = 0; i < s1.length; i++) {
    if (s1.charCodeAt(i) !== s2.charCodeAt(i)) {
      return false;
    }
  }

  return true;
}

// String karşılaştırma (sözlük sırası)
function stringKarsilastir(s1: string, s2: string): i32 {
  let minUzunluk: i32 = min(s1.length, s2.length);

  for (let i: i32 = 0; i < minUzunluk; i++) {
    let c1: i32 = s1.charCodeAt(i);
    let c2: i32 = s2.charCodeAt(i);

    if (c1 !== c2) {
      return c1 - c2;
    }
  }

  return s1.length - s2.length;
}
```

### String Dönüşümleri

```typescript
// String'i tam sayıya çevir
function stringToI32(s: string): i32 {
  let sonuc: i32 = 0;
  let isaret: i32 = 1;
  let i: i32 = 0;

  // Boşlukları atla
  while (i < s.length && s.charCodeAt(i) === 32) {
    i++;
  }

  // İşaret kontrolü
  if (i < s.length) {
    let c: i32 = s.charCodeAt(i);
    if (c === 45) {  // '-'
      isaret = -1;
      i++;
    } else if (c === 43) {  // '+'
      i++;
    }
  }

  // Rakamları oku
  while (i < s.length) {
    let c: i32 = s.charCodeAt(i);
    if (c >= 48 && c <= 57) {  // '0'-'9'
      sonuc = sonuc * 10 + (c - 48);
      i++;
    } else {
      break;
    }
  }

  return sonuc * isaret;
}

// Tam sayıyı string'e çevir
function i32ToString(n: i32): string {
  if (n === 0) return "0";

  let negatif: bool = n < 0;
  if (negatif) n = -n;

  let karakterler: string[] = [];

  while (n > 0) {
    let basamak: i32 = n % 10;
    karakterler.push(String.fromCharCode(48 + basamak));
    n = n / 10;
  }

  if (negatif) {
    karakterler.push("-");
  }

  // Ters çevir
  let sonuc: string = "";
  for (let i: i32 = karakterler.length - 1; i >= 0; i--) {
    sonuc += karakterler[i];
  }

  return sonuc;
}
```

---

## Bölüm 2.9: Hata Yönetimi

### Assert Kullanımı

```typescript
// Assertion - koşul sağlanmazsa programı durdurur
function bolum(a: i32, b: i32): f64 {
  assert(b !== 0, "Sıfıra bölünme!");  // b === 0 ise abort
  return f64(a) / f64(b);
}

// Assert with message
function diziErisim(dizi: Int32Array, indeks: i32): i32 {
  assert(
    indeks >= 0 && indeks < dizi.length,
    "Dizi indeksi dışında!"
  );
  return dizi[indeks];
}

// Assert'i devre dışı bırakma (production için)
// Derleme: asc --noAssert
function hizliBolum(a: i32, b: i32): f64 {
  // --noAssert ile bu kontrol kaldırılır
  assert(b !== 0);
  return f64(a) / f64(b);
}
```

### Hata Kodları Döndürme

```typescript
// Hata kodu tanımları
const HATA_BASARILI: i32 = 0;
const HATA_SIFIR_BOLUNME: i32 = 1;
const HATA_NEGATIF_KOK: i32 = 2;
const HATA_BOS_DIZI: i32 = 3;

function bolumHataKodlu(a: i32, b: i32, sonuc: Float64Array): i32 {
  if (b === 0) {
    return HATA_SIFIR_BOLUNME;
  }
  sonuc[0] = f64(a) / f64(b);
  return HATA_BASARILI;
}

// Kullanım
let sonuc: Float64Array = new Float64Array(1);
let hata: i32 = bolumHataKodlu(10, 0, sonuc);

if (hata === HATA_BASARILI) {
  console.log("Sonuç: " + sonuc[0].toString());
} else {
  console.log("Hata kodu: " + hata.toString());
}
```

---

## Bölüm 2.10: Modül 2 Özeti

### Öğrendiklerimiz

| Konu | Öğrenilenler |
|------|--------------|
| **Fonksiyonlar** | Tanımlama, çağırma, parametreler, dönüş değerleri |
| **Parametreler** | Zorunlu, varsayılan değerli |
| **Recursive** | Özyinelemeli fonksiyonlar, memoization |
| **Generic** | Tip parametreli fonksiyonlar |
| **Inline** | @inline decorator |
| **Döngüler** | İç içe, etiketli, optimizasyonlar |
| **Algoritmalar** | Sıralama, arama, sayısal işlemler |
| **String** | Karşılaştırma, dönüşümler |
| **Hata yönetimi** | Assert, hata kodları |

### Önemli İpuçları

1. **Her fonksiyonun dönüş türü belirtilmeli**
   ```typescript
   function foo(): i32 { return 42; }  // ✅
   ```

2. **Varsayılan parametreler en sonda**
   ```typescript
   function bar(x: i32, y: i32 = 10): i32 { ... }  // ✅
   ```

3. **Döngü optimizasyonu için length'i baştan alın**
   ```typescript
   let n: i32 = dizi.length;  // ✅
   for (let i: i32 = 0; i < n; i++) { ... }
   ```

4. **Assert ile hata kontrolü**
   ```typescript
   assert(kosul, "Hata mesajı");
   ```

### Alıştırmalar

1. Bir dizi içindeki en büyük ve en küçük elemanı bulan fonksiyon yazın
2. Quick sort algoritmasını implemente edin
3. Bir string'in palindrom olup olmadığını kontrol eden fonksiyon yazın
4. İki matrisi çarpan fonksiyon yazın
5. Bir sayının asal çarpanlarını bulan fonksiyon yazın

### Sonraki Modül

**Modül 3: Nesne Yönelimli Programlama**

Hazır mısınız? 🚀
