# URL Kısaltma Projesi (URL Shortener)

Bu proje, uzun ve karmaşık web adreslerini (URL) daha kısa, paylaşılabilir ve yönetilebilir hale getiren modern bir web uygulamasıdır. Kullanıcılar linklerini kısaltabilir, kopyalayabilir ve linklerin kaç kez tıklandığını gerçek zamanlı olarak takip edebilirler.

## 🎯 Projenin Amacı

Projenin temel amacı, kullanıcı deneyimini ön planda tutan, hızlı ve güvenilir bir URL kısaltma hizmeti sunmaktır.
- **Hız**: Minimum gecikme ile anında URL kısaltma ve yönlendirme.
- **Analiz**: Kısaltılan her link için tıklanma istatistiklerini sağlama.
- **Kullanılabilirlik**: Modern, şık ve mobil uyumlu bir arayüz ile kolay kullanım.

### 🎨 Frontend (Arayüz)
- **React.js**: Dinamik ve hızlı kullanıcı etkileşimi için.
- **Vite**: Modern bir geliştirme ortamı ve hızlı yapılandırma.
- **Custom CSS**: Glassmorphism ve dark mode efektleri içeren, premium bir tasarım.
- **Lucide Icons**: Sade ve açıklayıcı ikon kütüphanesi.

### ⚙️ Backend (Sunucu)
- **.NET 10 (ASP.NET Core Web API)**: Yüksek performanslı ve ölçeklenebilir backend mimarisi.
- **C#**: Güçlü ve tip güvenli programlama dili.
- **MongoDB**: Hızlı veri okuma/yazma işlemleri için NoSQL veritabanı.
- **RESTful API**: Standartlara uygun API uç noktaları.

## ✨ Öne Çıkan Özellikler

- **Unique Code Generation**: Her link için benzersiz 6 haneli kısa kodlar.
- **Real-time Click Tracking**: Linklerin tıklanma sayılarını otomatik yenilenen istatistiklerle izleme.
- **Responsive Design**: Masaüstü, tablet ve mobil cihazlarla tam uyum.
- **Clipboard Integration**: Kısaltılan linki tek tıkla kopyalama özelliği.

## 🛠️ Kurulum ve Çalıştırma

1. **Gereksinimler**: .NET 10 SDK, Node.js, MongoDB
2. **Backend**: `UrlShortenerApi` klasörüne gidin ve `dotnet run` komutunu çalıştırın.
3. **Frontend**: `UrlShortenerUI` klasörüne gidin, `npm install` ve ardından `npm run dev` komutlarını çalıştırın. 
