---
title: Modül 3 - Nesne Yönelikli Programlama
description: Sınıflar, metodlar, kalıtım, erişim belirleyiciler, interface'ler, operatör overloading ve OOP prensipleri.
---

# Modül 3: Nesne Yönelikli Programlama

Bu modülde sınıfları (classes), arayüzleri (interfaces) ve nesne yönelimli programlama prensiplerini öğreneceksiniz.

---

## Bölüm 3.1: Sınıflar (Classes) Temelleri

### Sınıf Tanımlama

```typescript
// Basit sınıf tanımlama
class Nokta {
  // Public field'lar
  x: f64;
  y: f64;

  // Constructor
  constructor(x: f64, y: f64) {
    this.x = x;
    this.y = y;
  }

  // Metod
  bilgi(): string {
    return `(${this.x}, ${this.y})`;
  }

  // Origin'e uzaklık
  uzaklik(): f64 {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
}

// Kullanım
let p1: Nokta = new Nokta(3.0, 4.0);
console.log(p1.bilgi());        // "(3.0, 4.0)"
console.log(p1.uzaklik().toString());  // "5.0"
```

### Constructor Parametre Özellikleri

```typescript
// Kısa constructor yazımı
class Ogrenci {
  // Constructor parametreleri otomatik field olur
  constructor(
    public ad: string,
    public soyad: string,
    public yas: i32
  ) {
    // this.ad = ad otomatik yapılır
  }

  tamIsim(): string {
    return `${this.ad} ${this.soyad}`;
  }

  yasArtir(miktar: i32 = 1): void {
    this.yas += miktar;
  }
}

// Kullanım
let ogr: Ogrenci = new Ogrenci("Ahmet", "Yılmaz", 20);
console.log(ogr.tamIsim());  // "Ahmet Yılmaz"
ogr.yasArtir();
console.log(ogr.yas.toString());  // "21"
```

### Field'lar ve Default Değerler

```typescript
class Dikdortgen {
  // Field'lar varsayılan değere sahip olabilir
  genislik: f64 = 10.0;
  yukseklik: f64 = 5.0;

  constructor(genislik?: f64, yukseklik?: f64) {
    if (genislik !== undefined) {
      this.genislik = genislik;
    }
    if (yukseklik !== undefined) {
      this.yukseklik = yukseklik;
    }
  }

  alan(): f64 {
    return this.genislik * this.yukseklik;
  }

  cevre(): f64 {
    return 2 * (this.genislik + this.yukseklik);
  }
}

let d1: Dikdortgen = new Dikdortgen();           // 10x5
let d2: Dikdortgen = new Dikdortgen(20.0);      // 20x5
let d3: Dikdortgen = new Dikdortgen(15.0, 10.0); // 15x10
```

---

## Bölüm 3.2: Metod Türleri

### Instance Metodları

```typescript
class Sayac {
  private deger: i32 = 0;

  artir(miktar: i32 = 1): void {
    this.deger += miktar;
  }

  degerAl(): i32 {
    return this.deger;
  }

  sifirla(): void {
    this.deger = 0;
  }
}

let sayac: Sayac = new Sayac();
sayac.artir();
sayac.artir(5);
console.log(sayac.degerAl().toString());  // "6"
```

### Static Metodlar

```typescript
class Matematik {
  // Static metod - this kullanılmaz
  static kare(x: f64): f64 {
    return x * x;
  }

  static kup(x: f64): f64 {
    return x * x * x;
  }

  static us(taban: f64, us: i32): f64 {
    let sonuc: f64 = 1;
    for (let i: i32 = 0; i < us; i++) {
      sonuc *= taban;
    }
    return sonuc;
  }

  // Pi sabiti
  static PI: f64 = 3.141592653589793;
}

// Kullanım - new gerekmez
console.log(Matematik.kare(5).toString());      // "25"
console.log(Matematik.kup(3).toString());       // "27"
console.log(Matematik.PI.toString());          // "3.14..."
```

### Getter ve Setter

```typescript
class BankaHesabi {
  private _bakiye: f64 = 0;

  get bakiye(): f64 {
    return this._bakiye;
  }

  set bakiye(deger: f64) {
    if (deger >= 0) {
      this._bakiye = deger;
    } else {
      console.log("Bakiye negatif olamaz!");
    }
  }

  paraYatir(miktar: f64): void {
    if (miktar > 0) {
      this._bakiye += miktar;
    }
  }

  paraCek(miktar: f64): bool {
    if (miktar > 0 && this._bakiye >= miktar) {
      this._bakiye -= miktar;
      return true;
    }
    return false;
  }
}

let hesap: BankaHesabi = new BankaHesabi();
hesap.bakiye = 1000;
console.log(hesap.bakiye.toString());  // "1000"

hesap.paraCek(500);
console.log(hesap.bakiye.toString());  // "500"

hesap.paraYatir(200);
console.log(hesap.bakiye.toString());  // "700"
```

---

## Bölüm 3.3: Kalıtım (Inheritance)

### extends Anahtar Kelimesi

```typescript
// Temel sınıf
class Hayvan {
  protected isim: string;
  protected yas: i32;

  constructor(isim: string, yas: i32) {
    this.isim = isim;
    this.yas = yas;
  }

  sesCikar(): void {
    console.log("Ses çıkardım!");
  }

  bilgi(): string {
    return `${this.isim}, ${this.yas} yaşında`;
  }
}

// Alt sınıf
class Kedi extends Hayvan {
  private renk: string;

  constructor(isim: string, yas: i32, renk: string) {
    // super ile parent constructor çağrılır
    super(isim, yas);
    this.renk = renk;
  }

  // Metod override
  sesCikar(): void {
    console.log("Miyav! Miyav!");
  }

  // Yeni metod
    console.log(`${this.isim} tırmalıyor!`);
  }

  // bilgi metodunu genişlet
  detayliBilgi(): string {
    return `${super.bilgi()}, ${this.renk} renginde`;
  }
}

// Kullanım
let kedi: Kedi = new Kedi("Pamuk", 3, "beyaz");
kedi.sesCikar();              // "Miyav! Miyav!"
kedi.tirmala();               // "Pamuk tırmalıyor!"
console.log(kedi.detayliBilgi());  // "Pamuk, 3 yaşında, beyaz renginde"
```

### super Anahtar Kelimesi

```typescript
class Arac {
  protected marka: string;
  protected model: string;
  protected hiz: f64 = 0;

  constructor(marka: string, model: string) {
    this.marka = marka;
    this.model = model;
  }

  hizlan(miktar: f64): void {
    this.hiz += miktar;
  }

  bilgi(): string {
    return `${this.marka} ${this.model} - ${this.hiz} km/h`;
  }
}

class Araba extends Arac {
  private kapilar: i32;

  constructor(marka: string, model: string, kapilar: i32) {
    super(marka, model);
    this.kapilar = kapilar;
  }

  hizlan(miktar: f64): void {
    // Arabalar daha hızlı加速
    super.hizlan(miktar * 1.5);
  }

  bilgi(): string {
    // Parent bilgisini kullan
    return `${super.bilgi()} - ${this.kapilar} kapılı`;
  }

  kornaCal(): void {
    console.log("Düt düt!");
  }
}

let araba: Araba = new Araba("Toyota", "Corolla", 4);
araba.hizlan(50);
console.log(araba.bilgi());  // "Toyota Corolla - 75 km/h - 4 kapılı"
```

---

## Bölüm 3.4: Erişim Belirleyiciler

### Public, Private, Protected

```typescript
class Ornek {
  // Public - her yerden erişilebilir (varsayılan)
  public herkeseAçik: i32 = 1;

  // Private - sadece sınıf içinden erişilebilir
  private ozel: i32 = 2;

  // Protected - sınıf ve alt sınıflardan erişilebilir
  protected korunali: i32 = 3;

  // Public metod
  publicPublicMethod(): i32 {
    return this.herkeseAçik;
  }

  // Private metod
  private privateMethod(): i32 {
    return this.ozel + this.korunali;
  }

  // Protected metod
  protected protectedMethod(): i32 {
    return this.privateMethod();
  }

  // Public wrapper
  degerAl(): i32 {
    return this.privateMethod();
  }
}

class AltOrnek extends Ornek {
  kullanProtected(): i32 {
    // ✅ Protected erişilebilir
    return this.korunali + this.protectedMethod();
  }

  kullanHata(): i32 {
    // ❌ Private erişilemez
    // return this.ozel;
    return 0;
  }
}
```

### Property Encapsulation

```typescript
class Kisi {
  // Private field'lar
  private _ad: string = "";
  private _yas: i32 = 0;

  // Ad getter/setter
  get ad(): string {
    return this._ad;
  }

  set ad(deger: string) {
    if (deger.length >= 2) {
      this._ad = deger;
    } else {
      console.log("İsim en az 2 karakter olmalı!");
    }
  }

  // Yaş getter/setter
  get yas(): i32 {
    return this._yas;
  }

  set yas(deger: i32) {
    if (deger >= 0 && deger <= 150) {
      this._yas = deger;
    } else {
      console.log("Geçersiz yaş!");
    }
  }

  // Sadece getter (readonly)
  get tamIsim(): string {
    return this._ad;
  }

  // Doğum yılı hesapla
  dogumYili(): i32 {
    // Şu anki yıl 2024 varsayımıyla
    return 2024 - this._yas;
  }
}

let kisi: Kisi = new Kisi();
kisi.ad = "A";      // "İsim en az 2 karakter olmalı!"
kisi.ad = "Ahmet";  // ✅
kisi.yas = 25;      // ✅
kisi.yas = 200;     // "Geçersiz yaş!"
```

---

## Bölüm 3.5: @unmanaged Decorator

### GC Takibi Olmadan Struct

```typescript
// @unmanaged - Garbage collector takibi yok
// C-like struct davranışı
@unmanaged
class Point2D {
  x: f64;
  y: f64;

  constructor(x: f64 = 0, y: f64 = 0) {
    this.x = x;
    this.y = y;
  }
}

// Managed (normal) sınıf
class ManagedPoint {
  x: f64;
  y: f64;

  constructor(x: f64 = 0, y: f64 = 0) {
    this.x = x;
    this.y = y;
  }
}

// Farklar:
// 1. @unmanaged sınıflar GC tarafından toplanmaz
// 2. Daha az memory overhead
// 3. Dizi içinde kullanılabilir
// 4. heap.free() ile manuel serbest bırakılabilir

// @unmanaged dizi kullanımı
const NOKTA_SAYISI: i32 = 100;
// let noktalar: Point2D[] = new Array(NOKTA_SAYISI); // ✅ Çalışır
// let managed: ManagedPoint[] = new Array(NOKTA_SAYISI); // ❌ Daha karmaşık
```

---

## Bölüm 3.6: @final Decorator

### Kalıtımı Engelleme

```typescript
// Final sınıf - alt sınıf oluşturulamaz
@final
class Utility {
  static topla(a: i32, b: i32): i32 {
    return a + b;
  }
}

// ❌ Derleme hatası: Final sınıf extend edilemez
// class MyUtility extends Utility {
// }

// Final metod - override edilemez
class Base {
  @final
  finalMethod(): void {
    console.log("Bu metod override edilemez!");
  }

  normalMethod(): void {
    console.log("Bu metod override edilebilir.");
  }
}

class Derived extends Base {
  // ❌ Derleme hatası: Final metod override edilemez
  // finalMethod(): void {
  //   console.log("Deneme!");
  // }

  // ✅ Normal metod override edilebilir
  normalMethod(): void {
    console.log("Override edilmiş metod!");
  }
}
```

---

## Bölüm 3.7: Arayüzler (Interfaces)

### Interface Tanımlama

```typescript
// Interface tanımlama
interface Sekil {
  alan(): f64;
  cevre(): f64;
  bilgi(): string;
}

// Interface implementasyonu
class Daire implements Sekil {
  yaricap: f64;

  constructor(yaricap: f64) {
    this.yaricap = yaricap;
  }

  alan(): f64 {
    return 3.141592653589793 * this.yaricap * this.yaricap;
  }

  cevre(): f64 {
    return 2 * 3.141592653589793 * this.yaricap;
  }

  bilgi(): string {
    return `Daire (r=${this.yaricap})`;
  }
}

class Kare implements Sekil {
  kenar: f64;

  constructor(kenar: f64) {
    this.kenar = kenar;
  }

  alan(): f64 {
    return this.kenar * this.kenar;
  }

  cevre(): f64 {
    return 4 * this.kenar;
  }

  bilgi(): string {
    return `Kare (kenar=${this.kenar})`;
  }
}
```

### Multiple Interfaces

```typescript
interface Cizilebilir {
  ciz(): void;
}

interface HareketEdilebilir {
  hareketEt(x: f64, y: f64): void;
}

interface Boyutlandirilabilir {
  boyutAta(genislik: f64, yukseklik: f64): void;
}

// Birden fazla interface implementasyonu
class Kutu implements Cizilebilir, HareketEdilebilir, Boyutlandirilabilir {
  x: f64 = 0;
  y: f64 = 0;
  genislik: f64 = 10;
  yukseklik: f64 = 10;

  ciz(): void {
    console.log(`Kutu çizildi: ${this.bilgi()}`);
  }

  hareketEt(x: f64, y: f64): void {
    this.x = x;
    this.y = y;
    console.log(`Kutu hareket etti: (${this.x}, ${this.y})`);
  }

  boyutAta(genislik: f64, yukseklik: f64): void {
    this.genislik = genislik;
    this.yukseklik = yukseklik;
    console.log(`Boyut atandı: ${genislik}x${yukseklik}`);
  }

  private bilgi(): string {
    return `Konum:(${this.x},${this.y}) Boyut:${this.genislik}x${this.yukseklik}`;
  }
}

let kutu: Kutu = new Kutu();
kutu.ciz();                   // "Kutu çizildi..."
kutu.hareketEt(5, 10);        // "Kutu hareket etti: (5, 10)"
kutu.boyutAta(20, 15);        // "Boyut atandı: 20x15"
```

---

## Bölüm 3.8: Abstract Sınıflar

### Soyut Sınıf Kavramı

```typescript
// AssemblyScript'te doğrudan abstract yok, benzer davranış:
// Metod null döndürerek veya assert kullanarak

// Temel sınıf (soyut benzeri)
class SekilBase {
  // Soyut metod - implementasyon alt sınıfta
  alan(): f64 {
    assert(false, "Bu metod override edilmeli!");
    return 0;
  }

  cevre(): f64 {
    assert(false, "Bu metod override edilmeli!");
    return 0;
  }

  // Somut metod - tüm alt sınıflarda aynı
  karsilastir(diger: SekilBase): i32 {
    let benimAlan: f64 = this.alan();
    let digerAlan: f64 = diger.alan();

    if (benimAlan < digerAlan) return -1;
    if (benimAlan > digerAlan) return 1;
    return 0;
  }
}

class Ucgen extends SekilBase {
  a: f64;
  b: f64;
  c: f64;

  constructor(a: f64, b: f64, c: f64) {
    super();
    this.a = a;
    this.b = b;
    this.c = c;
  }

  // Override
  alan(): f64 {
    // Heron formülü
    let s: f64 = (this.a + this.b + this.c) / 2;
    return Math.sqrt(s * (s - this.a) * (s - this.b) * (s - this.c));
  }

  cevre(): f64 {
    return this.a + this.b + this.c;
  }
}
```

---

## Bölüm 3.9: Operatör Overloading

### Binary Operator Overloading

```typescript
class Complex {
  real: f64;
  imag: f64;

  constructor(real: f64 = 0, imag: f64 = 0) {
    this.real = real;
    this.imag = imag;
  }

  // Toplama operatörü
  @operator("+")
  static add(left: Complex, right: Complex): Complex {
    return new Complex(
      left.real + right.real,
      left.imag + right.imag
    );
  }

  // Çıkarma operatörü
  @operator("-")
  static sub(left: Complex, right: Complex): Complex {
    return new Complex(
      left.real - right.real,
      left.imag - right.imag
    );
  }

  // Çarpma operatörü
  @operator("*")
  static mul(left: Complex, right: Complex): Complex {
    return new Complex(
      left.real * right.real - left.imag * right.imag,
      left.real * right.imag + left.imag * right.real
    );
  }

  // Eşitlik operatörü
  @operator("==")
  static eq(left: Complex, right: Complex): bool {
    return left.real === right.real && left.imag === right.imag;
  }

  // String gösterimi
  toString(): string {
    if (this.imag >= 0) {
      return `${this.real}+${this.imag}i`;
    } else {
      return `${this.real}${this.imag}i`;
    }
  }
}

// Kullanım
let c1: Complex = new Complex(3, 4);
let c2: Complex = new Complex(1, 2);

let c3: Complex = c1 + c2;  // (4, 6)
let c4: Complex = c1 - c2;  // (2, 2)
let c5: Complex = c1 * c2;  // (-5, 10)

console.log(c3.toString());  // "4+6i"
console.log((c1 == c1).toString());  // "true"
console.log((c1 == c2).toString());  // "false"
```

### Unary Operator Overloading

```typescript
class Vector2D {
  x: f64;
  y: f64;

  constructor(x: f64 = 0, y: f64 = 0) {
    this.x = x;
    this.y = y;
  }

  // Negasyon operatörü
  @operator.prefix("-")
  static neg(v: Vector2D): Vector2D {
    return new Vector2D(-v.x, -v.y);
  }

  // Artırma operatörü (prefix)
  @operator.prefix("++")
  static inc(v: Vector2D): Vector2D {
    return new Vector2D(v.x + 1, v.y + 1);
  }

  // Indexed get
  @operator("[]")
  static get(v: Vector2D, index: i32): f64 {
    if (index === 0) return v.x;
    if (index === 1) return v.y;
    assert(false, "Geçersiz indeks");
    return 0;
  }

  // Indexed set
  @operator("{}=")
  static set(v: Vector2D, index: i32, value: f64): void {
    if (index === 0) v.x = value;
    else if (index === 1) v.y = value;
    else assert(false, "Geçersiz indeks");
  }

  toString(): string {
    return `(${this.x}, ${this.y})`;
  }
}

// Kullanım
let v: Vector2D = new Vector2D(3, 4);
console.log((-v).toString());     // "(-3, -4)"
console.log((++v).toString());     // "(4, 5)"
console.log(v[0].toString());      // "3" (getter)
v{1} = 10;                        // (setter)
```

---

## Bölüm 3.10: Pratik Örnekler

### Örnek 1: Oyun Karakter Sistemi

```typescript
// Base character class
class Character {
  protected isim: string;
  protected can: i32;
  protected saglik: i32;

  constructor(isim: string) {
    this.isim = isim;
    this.can = 100;
    this.saglik = 100;
  }

  saldir(hedef: Character): void {
    let hasar: i32 = this.hasarHesapla();
    hedef.hasarAl(hasar);
  }

  hasarAl(miktar: i32): void {
    this.saglik -= miktar;
    if (this.saglik < 0) this.saglik = 0;
  }

  hasarHesapla(): i32 {
    return 10;
  }

  hayattaMi(): bool {
    return this.saglik > 0;
  }

  bilgi(): string {
    return `${this.isim} - Can:${this.can} Sağlık:${this.saglik}`;
  }
}

class Savasci extends Character {
  private silahHasari: i32;

  constructor(isim: string, silahHasari: i32) {
    super(isim);
    this.silahHasari = silahHasari;
  }

  hasarHesapla(): i32 {
    // Çoklu hasar
    return this.silahHasari * 2;
  }

  zirhVar(): void {
    this.can += 20;
  }
}

class Buyucu extends Character {
  private mana: i32 = 100;

  constructor(isim: string) {
    super(isim);
  }

  buyuYap(hedef: Character): void {
    if (this.mana >= 20) {
      this.mana -= 20;
      let buyuHasari: i32 = 30;
      hedef.hasarAl(buyuHasari);
    }
  }

  hasarHesapla(): i32 {
    return 5;  // Fiziksel hasar düşük
  }

  manaDoldur(miktar: i32): void {
    this.mana += miktar;
  }
}

// Kullanım
let a: Savasci = new Savasci("Arthur", 15);
let b: Buyucu = new Buyucu("Merlin");

a.saldir(b);
console.log(a.bilgi());  // Arthur - Can:100 Sağlık:100
console.log(b.bilgi());  // Merlin - Can:100 Sağlık:50
```

### Örnek 2: Banka Sistemi

```typescript
interface HesapIslemi {
  islemYap(miktar: f64): bool;
  bakiyeSorgula(): f64;
}

class VadeliHesap implements HesapIslemi {
  private bakiye: f64 = 0;
  private faizOrani: f64;
  private vadeSuresi: i32;

  constructor(faizOrani: f64, vadeSuresi: i32) {
    this.faizOrani = faizOrani;
    this.vadeSuresi = vadeSuresi;
  }

  islemYap(miktar: f64): bool {
    if (miktar > 0) {
      this.bakiye += miktar;
      return true;
    }
    // Vadeli hesaptan para çekilemez
    return false;
  }

  bakiyeSorgula(): f64 {
    return this.bakiye;
  }

  faizHesapla(): f64 {
    return this.bakiye * (this.faizOrani / 100);
  }

  vadeSonuGetir(): f64 {
    return this.bakiye + this.faizHesapla();
  }
}

class VadesizHesap implements HesapIslemi {
  private bakiye: f64 = 0;
  private ekBakiye: f64 = 1000;  // Özelliğe bağlı

  islemYap(miktar: f64): bool {
    if (miktar > 0) {
      this.bakiye += miktar;
      return true;
    } else if (-miktar <= this.bakiye + this.ekBakiye) {
      this.bakiye += miktar;
      return true;
    }
    return false;
  }

  bakiyeSorgula(): f64 {
    return this.bakiye;
  }

  toplamBakiye(): f64 {
    return this.bakiye + this.ekBakiye;
  }
}
```

### Örnek 3: Matris Sınıfı

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

  get(s: i32, st: i32): f64 {
    assert(s >= 0 && s < this.satir && st >= 0 && st < this.sutun, "İndeks dışında");
    return this.veriler[s * this.sutun + st];
  }

  set(s: i32, st: i32, deger: f64): void {
    assert(s >= 0 && s < this.satir && st >= 0 && st < this.sutun, "İndeks dışında");
    this.veriler[s * this.sutun + st] = deger;
  }

  boyut(): i32[] {
    return [this.satir, this.sutun];
  }

  toString(): string {
    let sonuc: string = "";
    for (let s: i32 = 0; s < this.satir; s++) {
      for (let st: i32 = 0; st < this.sutun; st++) {
        sonuc += this.get(s, st).toString() + " ";
      }
      sonuc += "\n";
    }
    return sonuc;
  }
}

// 2x2 matris çarpımı
function matrisCarp(A: Matris, B: Matris): Matris {
  let Aboyut: i32[] = A.boyut();
  let Bboyut: i32[] = B.boyut();

  assert(Aboyut[1] === Bboyut[0], "Matris boyutları uyumsuz");

  let sonuc: Matris = new Matris(Aboyut[0], Bboyut[1]);

  for (let i: i32 = 0; i < Aboyut[0]; i++) {
    for (let j: i32 = 0; j < Bboyut[1]; j++) {
      let toplam: f64 = 0;
      for (let k: i32 = 0; k < Aboyut[1]; k++) {
        toplam += A.get(i, k) * B.get(k, j);
      }
      sonuc.set(i, j, toplam);
    }
  }

  return sonuc;
}

// Kullanım
let m1: Matris = new Matris(2, 2);
m1.set(0, 0, 1); m1.set(0, 1, 2);
m1.set(1, 0, 3); m1.set(1, 1, 4);

let m2: Matris = new Matris(2, 2);
m2.set(0, 0, 5); m2.set(0, 1, 6);
m2.set(1, 0, 7); m2.set(1, 1, 8);

let m3: Matris = matrisCarp(m1, m2);
// Sonuç: [[19, 22], [43, 50]]
```

---

## Bölüm 3.11: Modül 3 Özeti

### Öğrendiklerimiz

| Konu | Öğrenilenler |
|------|--------------|
| **Sınıflar** | Tanımlama, constructor, field'lar |
| **Metodlar** | Instance, static, getter/setter |
| **Kalıtım** | extends, super, method override |
| **Erişim** | public, private, protected |
| **Decorators** | @final, @unmanaged |
| **Interfaces** | implements, multiple interfaces |
| **Operatörler** | @operator overloading |
| **Encapsulation** | Field gizleme, property'ler |

### Önemli İpuçları

1. **Constructor parametreleri field olabilir**
   ```typescript
   constructor(public x: i32, public y: i32) { }
   ```

2. **Protected sadece sınıf ve alt sınıflarda**
   ```typescript
   protected alan: f64;  // Sadece bu sınıf ve extends edenler
   ```

3. **@unmanaged GC takibi yok (performans)**
   ```typescript
   @unmanaged struct Point2D { x: f64; y: f64; }
   ```

4. **Interface çoklu implementasyon**
   ```typescript
   class Foo implements A, B, C { }
   ```

### Alıştırmalar

1. Daire ve DaireListesi sınıfları oluşturun
2. Polymorphism ile hayvanat bahçesi sistemi
3. Matris operations için operatör overloading
4. Generic container sınıfı (Stack, Queue)
5. Observer pattern implementasyonu

### Sonraki Modül

**Modül 4: Standart Kütüphane**

Hazır mısınız? 🚀
