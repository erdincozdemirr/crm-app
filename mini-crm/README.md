# MiniCRM

MiniCRM, müşteri ilişkilerini yönetmek, ürün ve stok takibi yapmak ve sipariş süreçlerini dijitalleştirmek için geliştirilmiş Node.js tabanlı bir REST API projesidir.

## Özellikler

- **Müşteri Yönetimi:** Müşteri ekleme, listeleme ve güncelleme. (Telefon/Email tekilleştirme destekli)
- **Ürün & Stok:** Stok takibi olan ve olmayan ürün yönetimi.
- **Sipariş Yönetimi:** Stok kontrollü ve transactional sipariş oluşturma.
- **ETL (Veri Aktarımı):** Excel/CSV'den toplu veri aktarımı.
- **Güvenlik & Loglama:** Winston loglama, Global Error Handler.

## Kurulum ve Çalıştırma

### Gereksinimler
- Node.js (v18+)
- PostgreSQL (veya Docker)

### 1. Kurulum (Docker ile Kolay Kurulum)

En hızlı yöntem Docker kullanmaktır. Veritabanı otomatik kurulur.

```bash
# Bağımlılıkları yükle
npm install

# Veritabanını başlat
docker compose up -d

# Veritabanı tablolarını oluştur (Migration)
npm run migrate

# Uygulamayı başlat
npm run start
```

### 2. Manuel Kurulum (.env Ayarları)

Eğer kendi PostgreSQL sunucunuzu kullanacaksanız:

1.  `.env.example` dosyasını `.env` olarak kopyalayın.
2.  `DB_HOST`, `DB_USER`, `DB_PASS` bilgilerini güncelleyin.
3.  `npm run migrate` komutunu çalıştırın.
4.  `npm run dev` ile geliştirme modunda başlatın.

- **[Kullanıcı Kılavuzu (User Manual)](docs/User_Manual.md)**
- **[Gereksinim Analizi](docs/Gereksinim_Analizi.txt)**
- **[Mimari Tasarım](docs/Mimari_Tasarim_Dokumani.txt)**
- **[Kod Haritası](docs/Codebase_Map.md)**
- **[Log Örnekleri](docs/Log_Samples.md)**
- **[Katkı Rehberi](docs/CONTRIBUTING.md)**


```bash
# mock_customers.csv dosyasındaki verileri yükler
node src/scripts/etl.js
```

## Testler

Proje Unit ve Entegrasyon testlerini içerir.

```bash
npm test
```

## Dokümantasyon

- **[Kullanıcı Kılavuzu (User Manual)](docs/User_Manual.md):** Sistemin nasıl kullanılacağını anlatan detaylı rehber.
- **API Dokümantasyonu:** `docs/openapi.yaml` veya `/api-docs` (Swagger UI).


- `POST /api/customers`: Müşteri oluştur
- `GET /api/customers`: Müşterileri listele
- `POST /api/orders`: Sipariş oluştur
- `POST /api/products`: Ürün ekle

## Klasör Yapısı

- `src/controllers`: İstek karşılama katmanı
- `src/services`: İş mantığı ve veritabanı işlemleri
- `src/models`: Sequelize veritabanı modelleri
- `src/routes`: API rotaları
- `src/lib`: Yardımcı araçlar (Logger vb.)
