# LogiTrack — Sipariş Takip Sistemi

Müşteri siparişlerini, bakiyeleri ve günlük girişleri yönetmek için geliştirilmiş tam stack bir uygulama. Backend ASP.NET Core 8 Web API, frontend React (Vite + TypeScript) ile geliştirilmiştir; arayüz tamamen Türkçedir.

---

## 📋 İçindekiler

- [Özellikler](#-özellikler)
- [Teknoloji Yığını](#-teknoloji-yığını)
- [Proje Yapısı](#-proje-yapısı)
- [Gereksinimler](#-gereksinimler)
- [Kurulum ve Çalıştırma](#-kurulum-ve-çalıştırma)
- [API Özeti](#-api-özeti)
- [Frontend Sayfaları](#-frontend-sayfaları)

---

## ✨ Özellikler

- **Günlük giriş**: Tablo benzeri arayüzle müşteri bazlı sipariş satırları girişi, toplam hesaplama ve toplu kaydetme.
- **Sipariş geçmişi**: Tarih ve müşteriye göre filtreleme, sayfalama, CSV/Excel dışa aktarma butonları ve özet istatistikler.
- **Müşteriler**: Müşteri listesi, bakiye, son aktivite, durum etiketleri; seçili müşteri özeti ve risk/kredi bilgisi.
- **Raporlar**: KPI kartları, ciro/sipariş hacmi placeholder grafikleri, segment dağılımı, uyarılar ve en iyi ürün/hizmet tablosu.
- **Müşteri–sipariş analizi**: Müşteri bazlı sipariş analizi sayfası (frontend).
- Backend’de sipariş oluşturulduğunda müşteri bakiyesi (`CurrentBalance`) otomatik güncellenir.

---

## 🛠 Teknoloji Yığını

| Katman      | Teknolojiler |
|------------|--------------|
| **Backend** | C#, ASP.NET Core 8, Entity Framework Core 8, SQL Server, Swagger (Swashbuckle) |
| **Frontend** | React 18, TypeScript, Vite 5, React Router 6, Tailwind CSS (CDN), Material Icons |
| **Veritabanı** | SQL Server (LocalDB / SQL Express) |

---

## 📁 Proje Yapısı

```
OrderTracking/
├── OrderTracking.sln              # Çözüm dosyası (şu an sadece API projesi dahil)
├── README.md
├── OrderTracking.API/             # Backend Web API
│   ├── Controllers/
│   │   ├── CustomerController.cs  # Müşteri CRUD
│   │   ├── OrderController.cs     # Sipariş oluşturma ve sorgulama
│   │   ├── ProductsController.cs # Ürün listesi
│   │   └── WeatherForecastController.cs
│   ├── Data/
│   │   └── AppDbContext.cs        # EF Core DbContext
│   ├── DTOs/
│   │   ├── CreateOrderDTO.cs
│   │   ├── CustomerDTO.cs
│   │   └── BulkOrderDto.cs
│   ├── Models/
│   │   ├── Customer.cs
│   │   ├── Order.cs
│   │   ├── Product.cs
│   │   ├── CustomerProductPrice.cs
│   │   ├── Expense.cs
│   │   └── Payment.cs
│   ├── Services/
│   │   ├── ICustomerService.cs, CustomerService.cs
│   │   └── IOrderService.cs, OrderService.cs
│   ├── Migrations/
│   ├── Program.cs
│   └── appsettings.json
│
└── OrderTracking.Frontend/        # React SPA (Vite)
    ├── index.html
    ├── package.json
    ├── vite.config.ts             # API proxy: /api -> localhost:5249
    ├── tsconfig.json
    └── src/
        ├── main.tsx
        ├── App.tsx                # React Router tanımları
        ├── pages/
        │   ├── DailyEntryPage.tsx     # Günlük sipariş girişi
        │   ├── OrderHistoryPage.tsx   # Sipariş geçmişi
        │   ├── CustomersPage.tsx      # Müşteriler
        │   ├── ReportsPage.tsx        # Raporlar & analitik
        │   └── CustomerOrderAnalysisPage.tsx
        └── utils/
            └── dataManager.ts     # localStorage / veri yardımcıları
```

---

## 📌 Gereksinimler

- **.NET 8 SDK**
- **Node.js 18+** ve **npm**
- **SQL Server** (Express veya LocalDB); bağlantı için `appsettings.json` içindeki `DefaultConnection` kullanılır.

---

## 🚀 Kurulum ve Çalıştırma

### 1. Backend (API)

```bash
cd OrderTracking.API
dotnet restore
dotnet ef database update   # Migration ile veritabanını oluşturur
dotnet run
```

- API varsayılan olarak **http://localhost:5249** üzerinde çalışır.
- Swagger: **http://localhost:5249/swagger**

Bağlantı dizesini değiştirmek için `OrderTracking.API/appsettings.json` içindeki `ConnectionStrings:DefaultConnection` değerini düzenleyin.

### 2. Frontend (React)

```bash
cd OrderTracking.Frontend
npm install
npm run dev
```

- Uygulama **http://localhost:5173** adresinde açılır.
- Vite proxy sayesinde `/api` istekleri otomatik olarak `http://localhost:5249` API’ye yönlendirilir; geliştirme sırasında aynı origin’den istek yapılır.

### 3. Üretim build (frontend)

```bash
cd OrderTracking.Frontend
npm run build
npm run preview   # İsteğe bağlı: build çıktısını önizlemek için
```

---

## 📡 API Özeti

| Metot | Endpoint | Açıklama |
|-------|----------|----------|
| **Müşteriler** | | |
| GET | `/api/customer` | Tüm müşterileri listeler |
| GET | `/api/customer/{id}` | Tek müşteri getirir |
| POST | `/api/customer` | Yeni müşteri oluşturur (Body: `CustomerDTO`) |
| PUT | `/api/customer/{id}` | Müşteri günceller |
| DELETE | `/api/customer/{id}` | Müşteri siler |
| **Siparişler** | | |
| POST | `/api/order` | Tek sipariş oluşturur (Body: `CreateOrderDTO`: `CustomerId`, `Quantity`). Müşteri birim fiyatına göre toplam hesaplanır ve müşteri bakiyesi güncellenir. |
| GET | `/api/order` | Tüm siparişleri listeler |
| GET | `/api/order/by-date?date=...` | Belirtilen tarihteki siparişleri getirir |
| GET | `/api/order/by-customer/{customerId}` | Müşteriye göre siparişleri getirir |
| GET | `/api/order/daily-total?date=...` | Belirtilen tarihin günlük toplam cirosunu döner |
| **Ürünler** | | |
| GET | `/api/products` | Tüm ürünleri listeler (örn. Küçük, Orta, Büyük) |

**Örnek istekler (Swagger veya curl):**

- Müşteri oluşturma: `POST /api/customer` → `{ "name": "Firma Adı", "pricePerUnit": 10.50 }`
- Sipariş oluşturma: `POST /api/order` → `{ "customerId": 1, "quantity": 100 }`

---

## 🖥 Frontend Sayfaları

| Rota | Sayfa | Açıklama |
|------|--------|----------|
| `/` | Günlük Giriş | Tablo görünümünde sipariş satırları, toplam, “Satır Ekle” ve “Tüm Siparişleri Kaydet”. |
| `/history` | Sipariş Geçmişi | Tarih/müşteri filtresi, grid, sayfalama, özet kartlar (toplam miktar, ortalama sipariş, toplam ciro). |
| `/customers` | Müşteriler | Müşteri listesi, arama/filtre, bakiye ve durum etiketleri, seçili müşteri özeti ve risk/kredi kutusu. |
| `/reports` | Raporlar | KPI’lar, ciro/sipariş hacmi alanı, segment dağılımı, uyarılar, en iyi ürün/hizmet tablosu. |
| `/customer-analysis` | Müşteri Sipariş Analizi | Müşteri bazlı sipariş analizi ekranı. |

Tüm metinler Türkçe (navigasyon, başlıklar, butonlar, placeholder’lar, tablo başlıkları).

---

## 📄 Lisans ve Katkı

Bu proje eğitim / iç kullanım amaçlıdır. Değişiklik ve genişletmeler için branch açıp pull request gönderebilirsiniz.

---

*Son güncelleme: Proje incelemesine dayalı README — backend (OrderTracking.API) ve frontend (OrderTracking.Frontend) birlikte dokümante edilmiştir.*
