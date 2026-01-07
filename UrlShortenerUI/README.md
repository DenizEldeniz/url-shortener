## URL Kısaltıcı (Full Stack) — ASP.NET Core + MongoDB + React (Vite)

Bu repo, **kısa link üretme** ve **kısa linkten orijinal linke yönlendirme** yapan basit ama “gerçek proje” gibi çalışan bir URL kısaltıcı içerir:

- **Backend**: ASP.NET Core Web API (`UrlShortenerApi`) + **MongoDB**
- **Frontend**: React + Vite (`UrlShortenerUI`) — **koyu temalı** arayüz, **Tailwind kullanılmıyor** (tamamen normal CSS)

---

## Özellikler

- **URL kısaltma**: Uzun URL → kısa kod üretir (`POST /api/shorten`)
- **Yönlendirme (redirect)**: Kısa kod ile orijinal URL’e yönlendirir (`GET /api/{code}`)
- **MongoDB kayıtları**:
  - Database: `UrlShortenerDb`
  - Collection: `Urls`
- **Click sayacı**: Redirect sırasında `ClickCount` alanını artırır
- **Çakışma (collision) yönetimi**: ShortCode unique index; çakışmada otomatik retry (maks. 10 deneme)
- **Frontend**:
  - URL input + “Kısalt” butonu
  - Kısaltılmış linki gösterir
  - Kopyala butonu + “Kopyalandı” feedback’i
  - Sağ altta sosyal ikonlar + imza

---

## Proje Yapısı

```
Url_Kısaltıcı/
  UrlShortenerApi/           # ASP.NET Core Web API + MongoDB
    Controllers/
    Dtos/
    Models/
    Services/
    Program.cs
    appsettings.json
    UrlShortenerApi.http

  UrlShortenerUI/            # React (Vite) Frontend (Tailwind yok)
    public/
      logo.svg
    src/
      App.jsx
      App.css
      index.css
      main.jsx
    index.html
    vite.config.js
    package.json
```

---

## Gereksinimler

- **.NET SDK** (projede `TargetFramework` olarak `net10.0` kullanılıyor)
- **Node.js + npm**
- **MongoDB** (lokal) + opsiyonel **MongoDB Compass**

---

## Backend (API) Kurulumu ve Çalıştırma

### 1) MongoDB’yi çalıştır

MongoDB lokalde `27017` portunda çalışmalı.

Compass kullanıyorsan bağlantı:
- `mongodb://localhost:27017`

### 2) Connection string’i kontrol et

`UrlShortenerApi/appsettings.json`:

```json
{
  "ConnectionStrings": {
    "MongoDb": "mongodb://localhost:27017"
  }
}
```

### 3) API’yi çalıştır

```bash
cd UrlShortenerApi
dotnet run
```

`launchSettings.json` varsayılan olarak şunları kullanır:
- `http://localhost:5072`

---

## Frontend (UI) Kurulumu ve Çalıştırma

### 1) Bağımlılıkları yükle

```bash
cd UrlShortenerUI
npm install
```

### 2) Uygulamayı çalıştır

```bash
npm run dev
```

Varsayılan:
- UI: `http://localhost:3000`

> Not: UI şu anda API’ye doğrudan `http://localhost:5072/api/shorten` ile istek atıyor.

---

## API Endpoint’leri

### URL kısalt (Shorten)

- **POST** `/api/shorten`
- Body:

```json
{
  "url": "https://example.com/uzun-bir-link"
}
```

- Başarılı cevap örneği:

```json
{
  "originalUrl": "https://example.com/uzun-bir-link",
  "shortUrl": "http://localhost:5072/api/Ab12Cd",
  "shortCode": "Ab12Cd"
}
```

> Backend DTO property’si `Url` olduğu için JSON’da `url` gönderimi ASP.NET model binding ile çalışır.

### Redirect

- **GET** `/api/{code}`
- Örnek:
  - `/api/Ab12Cd` → orijinal URL’e yönlendirir

---

## MongoDB’de Veriler Nerede?

Bu proje şuraya yazar:
- **Database**: `UrlShortenerDb`
- **Collection**: `Urls`

Compass’ta:
1. `mongodb://localhost:27017` bağlantısı
2. Databases → `UrlShortenerDb`
3. Collections → `Urls`

---

## Test Etme (HTTP dosyası)

`UrlShortenerApi/UrlShortenerApi.http` içinde örnek bir istek bulunur.
IDE üzerinden bu request’i gönderebilirsin.

---

## Sık Karşılaşılan Sorunlar

### “DB’de görünmüyor”

- Compass’ta **yanlış instance/cluster**’a bağlı olabilirsin
- Yanlış DB/collection’a bakıyor olabilirsin
  - Doğru yer: `UrlShortenerDb` → `Urls`
- API çağrısını en az 1 kez yapıp Compass’ta **Refresh** et

### “CORS hatası”

API’de CORS şu an **AllowAnyOrigin** (geliştirme için yeterli).
Prod ortamda mutlaka spesifik origin ver.

### “Kısa kod çakıştı”

`ShortCode` alanı için unique index var.
Çakışma olursa servis otomatik **yeniden kod üretip tekrar dener** (maks. 10).

---

## Güvenlik / Prod Notları

- **AllowAnyOrigin** prod için uygun değil.
- Rate limiting / abuse koruması eklemek iyi olur.
- Daha sağlam shortCode üretimi (ör. Base62 + time-based id) düşünülebilir.

---

## Geliştirme Fikirleri (Opsiyonel)

- Aynı URL için aynı shortCode dönme (dedup)
- Admin panel / link listesi
- QR code üretme
- Custom alias (kullanıcının kod belirlemesi)
- Expiration (link süresi)

---

## Lisans

Bu proje eğitim/ödev amaçlıdır. İstersen lisans ekleyebiliriz.

