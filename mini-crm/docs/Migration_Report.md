# Migration Raporu

## Özet
Projenin veritabanı şeması, PostgreSQL üzerinde Sequelize ORM kullanılarak yönetilmektedir. Başlangıçtaki eksik ve hatalı yapı, versiyonlu migration sistemiyle tamamen düzeltilmiş ve modüler hale getirilmiştir.

## Migration Dosyaları ve İşlevleri

### 1. `01-create-customer.js` (Müşteriler)
*   **Tablo:** `customers`
*   **Amaç:** Müşteri bilgilerini saklar.
*   **Kritik Alanlar:**
    *   `phone`: Unique (Tekil). Müşteri tekilleştirme için birincil anahtar gibidir.
    *   `email`: Unique (Tekil).
    *   `notes`: Müşteriyle ilgili serbest metin notları.
*   **İndeksler:** Telefon ve Email üzerinde arama performansı için indeksler oluşturulmuştur.

### 2. `02-create-product.js` (Ürünler)
*   **Tablo:** `products`
*   **Amaç:** Ürün envanterini yönetir.
*   **Kritik Alanlar:**
    *   `sku`: Stok Kod (Unique).
    *   `price`: Birim fiyat (`DECIMAL(10,2)`).
    *   `stock_quantity`: Mevcut stok adedi.
    *   `is_stock_tracked`: Stok takibi yapılıp yapılmayacağını belirten bayrak.

### 3. `03-create-order.js` (Siparişler)
*   **Tablo:** `orders`
*   **Amaç:** Müşteri siparişlerinin başlık (header) bilgilerini tutar.
*   **Kritik Alanlar:**
    *   `customer_id`: Foreign Key -> `customers.id`. (Müşteri silinirse sipariş silinmez - RESTRICT/SET NULL stratejisi).
    *   `status`: Sipariş durumu (ENUM: PENDING, PREPARING, SHIPPED, DELIVERED, CANCELLED).
    *   `total_price`: Siparişin toplam tutarı.

### 4. `04-create-order-items.js` (Sipariş Detayları)
*   **Tablo:** `order_items`
*   **Amaç:** Siparişin içindeki ürün kalemlerini tutar.
*   **Kritik Alanlar:**
    *   `order_id`: Bağlı olduğu sipariş.
    *   `product_id`: Bağlı olduğu ürün.
    *   `quantity`: Adet.
    *   `unit_price`: O anki satış fiyatı (Ürün fiyatı değişse bile siparişteki fiyat sabit kalır).
*   **Kısıtlamalar:** Siparişi olan ürün silinemez (`RESTRICT`).

### 5. `05-create-etl-imports.js` (Veri Aktarımı Geçmişi)
*   **Tablo:** `etl_imports`
*   **Amaç:** Yüklenen Excel/CSV dosyalarını ve işlem durumlarını saklar.
*   **Kritik Alanlar:**
    *   `file_content`: Dosyanın ikili (binary) hali (`BYTEA`). Disk kullanımı yerine veritabanında güvenli saklama.
    *   `status`: İşlem durumu (PENDING, PROCESSING, COMPLETED, FAILED).

## Veritabanı Şema Değişiklik Stratejisi
*   Tüm değişiklikler `sequelize-cli` ile oluşturulan **timestamp** veya **sıralı (01, 02...)** migration dosyalarıyla yapılır.
*   Geri alma (Rollback) senaryoları (`down` metodu) her migration için tanımlanmıştır.
*   Canlı ortama geçişte veri kaybını önlemek için `.sync({ force: true })` **ASLA** kullanılmaz; sadece `db:migrate` kullanılır.
