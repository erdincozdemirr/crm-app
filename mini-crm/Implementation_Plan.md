# Mimari Tasarım ve Uygulama Planı

Bu belge, "Gereksinim Analizi" aşamasında netleşen kuralların teknik olarak nasıl hayata geçirileceğini açıklar.

## 1. Veritabanı Şeması (PostgreSQL)

### Tablo: Customers
| Sütun | Tip | Kısıtlamalar | Açıklama |
|---|---|---|---|
| `id` | INTEGER | PK, AutoIncrement | Müşteri ID |
| `firstName` | STRING | NOT NULL | Ad |
| `lastName` | STRING | NULL | Soyad |
| `phone` | STRING | UNIQUE (Normalize) | Telefon (+90...) |
| `email` | STRING | UNIQUE, NULL | E-posta |
| `address` | TEXT | NULL | Genel adres |
| `notes` | TEXT | NULL | Notlar |
| `createdAt` | DATE | DEFAULT NOW | Oluşturulma |
| `updatedAt` | DATE | DEFAULT NOW | Güncellenme |

### Tablo: Products
| Sütun | Tip | Kısıtlamalar | Açıklama |
|---|---|---|---|
| `id` | INTEGER | PK, AutoIncrement | Ürün ID |
| `name` | STRING | NOT NULL | Ürün Adı |
| `sku` | STRING | UNIQUE, NOT NULL | Stok Kodu |
| `price` | DECIMAL | NOT NULL | Birim Fiyat |
| `stockQuantity` | INTEGER | DEFAULT 0 | Stok Adedi |
| `isStockTracked`| BOOLEAN | DEFAULT true | Stok Takibi Var mı? |

### Tablo: Orders
| Sütun | Tip | Kısıtlamalar | Açıklama |
|---|---|---|---|
| `id` | INTEGER | PK, AutoIncrement | Sipariş ID |
| `customerId` | INTEGER | FK (Customers) | Müşteri |
| `totalPrice` | DECIMAL | NOT NULL | Toplam Tutar |
| `status` | ENUM | PENDING, PREPARING... | Sipariş Durumu |
| `shippingAddress`| TEXT | NOT NULL | Teslimat Adresi |

### Tablo: OrderItems
| Sütun | Tip | Kısıtlamalar | Açıklama |
|---|---|---|---|
| `id` | INTEGER | PK, AutoIncrement | Kalem ID |
| `orderId` | INTEGER | FK (Orders) | Sipariş ID |
| `productId` | INTEGER | FK (Products) | Ürün ID |
| `quantity` | INTEGER | NOT NULL | Adet |
| `unitPrice` | DECIMAL | NOT NULL | Satış Anındaki Fiyat |

---

## 2. API Endpoint Listesi (REST)

### Customers
- `POST /api/customers` (Yeni Müşteri)
- `GET /api/customers` (Listeleme & Arama)
- `GET /api/customers/:id` (Detay)
- `PUT /api/customers/:id` (Güncelleme)

### Products
- `POST /api/products` (Yeni Ürün)
- `GET /api/products` (Stok ve Fiyat Listesi)
- `PUT /api/products/:id/stock` (Stok Güncelleme)

### Orders
- `POST /api/orders` (Sipariş Oluştur - Stok düşümü burada yapılır)
- `GET /api/orders/:id` (Sipariş Detayı)
- `PATCH /api/orders/:id/status` (Durum Güncelleme)

### ETL
- `POST /api/etl/import` (Excel dosyasını yükle ve işlemi başlat)

---

## 3. Klasör Yapısı (Refactoring)
Mevcut yapı standartlara uygundur ancak eksikler tamamlanacaktır:

```
src/
  config/         # Veritabanı ve env ayarları (Düzeltilecek)
  controllers/    # Request/Response yönetimi (Yeni)
  models/         # Sequelize Modelleri (Güncellenecek)
  routes/         # API rotaları (Eksikler tamamlanacak)
  services/       # İş mantığı (Stok kontrolü, hesaplama) (Yeni)
  utils/          # Yardımcılar (Logger, ErrorHandler)
  app.js          # Express uygulaması
  server.js       # Sunucu başlatma
```

---

## 4. Verification Plan

### Automated Tests
- **Unit Tests:** `jest` kullanarak Service katmanı test edilecek.
    - `npm test` komutu ile çalıştırılacak.
    - Özellikle `Stok Kontrolü` mantığı test edilecek.
- **Integration Tests:** API uçları `supertest` ile test edilecek.

### Manual Verification
- **Postman:** Hazırlanacak API'lerin (Create Order, Customer Import) Postman üzerinden istek atılarak test edilmesi.
- **Database Check:** Sipariş sonrası `Products` tablosundaki `stockQuantity` alanının düştüğünün veritabanından teyit edilmesi.
