# MiniCRM Kullanıcı Kılavuzu

Bu kılavuz, MiniCRM sisteminin temel fonksiyonlarını nasıl kullanacağınızı adım adım açıklar.

## 📚 İçindekiler
1.  [Giriş](#1-giriş)
2.  [Müşteri İşlemleri](#2-müşteri-işlemleri)
3.  [Ürün ve Stok Yönetimi](#3-ürün-ve-stok-yönetimi)
4.  [Sipariş Oluşturma](#4-sipariş-oluşturma)
5.  [Toplu Veri Yükleme (ETL)](#5-toplu-veri-yükleme-etl)
6.  [Sistem Loglarını İzleme](#6-sistem-loglarını-izleme)

---

## 1. Giriş
MiniCRM, tüm işlemlerin API (Web Servis) üzerinden yapıldığı bir sistemdir. Kullanım için [Postman](https://www.postman.com/) veya benzeri bir araç kullanabilirsiniz.
**Base URL:** `http://localhost:3000/api`

## 2. Müşteri İşlemleri

### Yeni Müşteri Ekleme
Sisteme tekil müşteri eklemek için kullanılır. Telefon numarası zorunlu ve benzersizdir.

*   **Endpoint:** `POST /customers`
*   **Örnek Veri (JSON):**
    ```json
    {
      "firstName": "Ahmet",
      "lastName": "Yılmaz",
      "phone": "+905551234567",
      "email": "ahmet@ornek.com"
    }
    ```

### Müşteri Arama
İsim veya telefon numarasına göre arama yapabilirsiniz.

*   **Endpoint:** `GET /customers?search=Ahmet`

## 3. Ürün ve Stok Yönetimi

### Ürün Ekleme
Stok takibi yapılacaksa `isStockTracked: true` olarak işaretlenmelidir.

*   **Endpoint:** `POST /products`
*   **Örnek Veri:**
    ```json
    {
      "name": "Laptop Standı",
      "sku": "STAND-001",
      "price": 150.00,
      "stockQuantity": 100,
      "isStockTracked": true
    }
    ```

### Stok Güncelleme
Mevcut stoğu değiştirmek için:

*   **Endpoint:** `PUT /products/:id/stock`
*   **Örnek Veri:** `{ "quantity": 120 }`

## 4. Sipariş Oluşturma

Sipariş verildiğinde stok otomatik düşer. Eğer müşteri kayıtlı değilse, bu aşamada otomatik oluşturulur.

*   **Endpoint:** `POST /orders`
*   **Örnek Veri:**
    ```json
    {
      "customer": {
        "firstName": "Ayşe",
        "phone": "+905559876543"
      },
      "items": [
        { "productId": 1, "quantity": 2 }
      ],
      "shippingAddress": "İstanbul, Kadıköy"
    }
    ```

## 5. Toplu Veri Yükleme (ETL)

Elinizdeki Excel veya CSV dosyasındaki müşterileri sisteme aktarmak için kullanılır.

1.  CSV dosyanızın şu kolonlara sahip olduğundan emin olun: `Ad Soyad`, `Telefon`, `Email`.
2.  Dosyayı yükleyin:

*   **Endpoint:** `POST /etl/import`
*   **Body:** `form-data` -> `file` (Dosya seçin)

## 6. Sistem Loglarını İzleme

Sistemdeki hataları veya işlem geçmişini görmek için veritabanındaki `SystemLogs` tablosunu kontrol edebilirsiniz.
Ayrıca ana dizindeki `logs/` klasöründe de metin tabanlı loglar bulunur.
