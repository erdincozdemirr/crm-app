# Proje Kod Haritası ve Mimari Dokümantasyon

Bu doküman, MiniCRM projesinin kod yapısını, modüllerin görevlerini ve kritik iş süreçlerinin nasıl çalıştığını açıklar. Kod içerisinde yorum satırı kullanılmadığı için referans kaynağı burasıdır.

## 1. Klasör Yapısı

*   **`src/config/`**: Uygulama ayarları.
    *   `index.js`: `.env` dosyasından değişkenleri okur (Port, DB bilgileri) ve dışarı sunar.
    *   `database.js`: Sequelize CLI için yapılandırma dosyasıdır.
*   **`src/controllers/`**: HTTP İsteklerini karşılayan katman.
    *   `customerController.js`: Müşteri oluşturma ve listeleme isteklerini işler.
    *   `productController.js`: Ürün ekleme ve stok güncelleme işlemlerini yönetir.
    *   `orderController.js`: Sipariş oluşturma isteğini alır, servis katmanına iletir.
*   **`src/models/`**: Veritabanı tablolarının Sequelize karşılıkları.
    *   `index.js`: Tüm modelleri yükler ve aralarındaki ilişkileri (Associations) kurar.
*   **`src/routes/`**: URL yönlendirmeleri.
    *   Hangi URL'in (`/api/customers` vb.) hangi Controller fonksiyonuna gideceğini belirler.
*   **`src/services/`**: İş Mantığı (Business Logic) katmanı.
    *   Veritabanı işlemleri ve kurallar burada çalışır.
*   **`src/scripts/`**: Yardımcı betikler.
    *   `etl.js`: Veri taşıma (Data Import) işlemlerini yapar.
*   **`src/utils/`**: Araçlar.
    *   `errorHandler.js`: Tüm hataları yakalayıp standart bir formatta JSON yanıtı döner.

## 2. Kritik İş Süreçleri ve Mantık

### A. Sipariş Oluşturma (`OrderService.js`)
Sipariş oluşturulurken **Veri Tutarlılığı (Consistency)** esastır. Bu yüzden `Transaction` (ACID) yapısı kullanılmıştır.

1.  **Transaction Başlatılır:** İşlem sırasında hata olursa her şey geri alınır.
2.  **Stok Kontrolü:** Sipariş edilen her ürün için `ProductService.decreaseStock` çağrılır.
    *   Eğer stok takibi açıksa (`isStockTracked: true`) ve stok yetersizse hata fırlatılır.
    *   Stok yeterliyse, veritabanından adet düşülür.
3.  **Sipariş Kaydı:** `Orders` tablosuna kayıt atılır.
4.  **Kalem Kaydı:** `OrderItems` tablosuna her bir ürün, o anki fiyatıyla (`unitPrice`) kaydedilir.
5.  **Commit/Rollback:** Her şey başarılıysa işlem onaylanır (Commit), hata varsa geri alınır (Rollback).

### B. Müşteri Oluşturma/Güncelleme (`CustomerService.js`)
Müşteri verileri mükerrer olmamalıdır. `createOrUpdate` metodu, **Upsert** (Update or Insert) mantığıyla çalışır.

1.  Gelen telefon veya e-posta adresiyle mevcut bir müşteri aranır.
2.  Kayıt varsa, gelen yeni bilgilerle güncellenir.
3.  Kayıt yoksa, yeni bir müşteri oluşturulur.

### C. Veri Aktarımı - ETL (`src/scripts/etl.js`)
Eski Excel/CSV dosyalarından veri aktarımı yapan betiktir.

1.  `mock_customers.csv` dosyasını okur.
2.  **Telefon Normalizasyonu:** Gelen telefon numaralarındaki harf ve boşlukları temizler. `+90` formatına çevirir (Örn: `0532 111` -> `+90532111`).
3.  **Hata Yönetimi:** Telefonu veya E-postası olmayan kayıtları atlar ve loglar.
4.  Her satır için `CustomerService.createOrUpdate` çağırarak veriyi içeri alır.

## 3. Loglama Yapısı
`winston` kütüphanesi kullanılır.

*   **Console:** Renkli çıktılarla anlık takip sağlar.
*   **File:** `logs/app-error.log` (sadece hatalar) ve `logs/app-combined.log` (tüm loglar) dosyalarına JSON formatında yazar.

## 4. Test Stratejisi
*   **Unit Testler:** Servis fonksiyonlarının (`services/`) mantığını izole şekilde test eder. Veritabanına gitmez, mock (taklit) nesneler kullanır.
*   **Entegrasyon Testleri:** (`tests/customers.test.js` vb.) Gerçek bir test veritabanı üzerinde API isteği atarak uçtan uca test yapar. Test bitince veritabanı temizlenir.
