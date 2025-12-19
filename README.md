# MiniCRM Projesi

**Geliştirici:** Erdinç Özdemir

Bu proje, modern bir Müşteri İlişkileri Yönetimi (CRM) sistemidir. Proje dosyaları `mini-crm` klasörü altındadır.

## 🚀 Nasıl Çalıştırılır? (Adım Adım)

Uygulamayı sorunsuz çalıştırmak için aşağıdaki adımları sırasıyla uygulayınız.

### 1. Ön Hazırlık
Terminali açın ve proje klasörüne gidin:

```bash
cd mini-crm
```

### 2. Bağımlılıkları Yükleme
Gerekli paketleri yüklemek için:

```bash
npm install
```

### 3. Veritabanını Başlatma
Veritabanını başlatmak, tabloları oluşturmak (migration) ve örnek verileri yüklemek (seed) için tek bir komut yeterlidir:

```bash
npm run db:start
```
*Bu komut Docker üzerinden PostgreSQL veritabanını ayağa kaldırır ve gerekli tüm kurulumları otomatik yapar.*

### 4. Uygulamayı Başlatma
Server'ı başlatmak için:

```bash
npm run dev
```

Tarayıcınızda **http://localhost:3000** adresine giderek uygulamayı kullanabilirsiniz.

---

## 🌍 Test ve Production Ortamları

Sistem, bulunduğunuz **Git Branch**'ine göre otomatik olarak ortamı ayarlar:

*   **🧪 Test / Geliştirme Ortamı:**
    *   Hangi Branch: `main` veya `test`
    *   Veritabanı: `mini_crm_test` (Port 5432)
    *   *Normal kullanım ve inceleme için bu modda kalmanız önerilir.*

*   **🚀 Production Ortamı:**
    *   Hangi Branch: `prod`
    *   Veritabanı: `mini_crm_prod` (Port 5433)
    *   *Prod moduna geçmek için:*
        ```bash
        git checkout prod
        npm run db:start  # Prod veritabanını başlatır
        npm run dev
        ```

## � Dokümantasyon
Detaylı teknik dokümanlar, API testleri ve raporlar uygulamanın web arayüzünde (http://localhost:3000) mevcuttur.
