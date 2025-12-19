# MiniCRM Projesi

MiniCRM, müşteri ilişkilerini yönetmek, ürün ve stok takibi yapmak ve sipariş süreçlerini dijitalleştirmek için geliştirilmiş Node.js tabanlı, modern arayüzlü ve kapsamlı bir CRM sistemidir.

## Özellikler

*   **Müşteri Yönetimi:** Müşteri ekleme, listeleme ve güncelleme. (Telefon/Email tekilleştirme destekli)
*   **Ürün & Stok:** Stok takibi olan ve olmayan ürün yönetimi.
*   **Sipariş Yönetimi:** Stok kontrollü ve transactional (ACID) sipariş oluşturma.
*   **ETL (Veri Aktarımı):** Excel/CSV'den toplu veri aktarımı ve normalizasyon.
*   **Web Dashboard:** Proje durumunu, raporları ve test sonuçlarını gösteren modern yönetim paneli.
*   **Güvenlik & Loglama:** Winston loglama, Database Loglama (SystemLogs), Global Error Handler ve Trace ID.
*   **Test Kapsamı:** %93+ Coverage ile tam test edilmiş backend mimarisi.

---

## Hızlı Kurulum

### Seçenek 1: Docker ile (Önerilen)
Tek komutla veritabanı ve uygulamayı ayağa kaldırın.

```bash
docker compose up -d
```
Uygulama Adresi: **http://localhost:3000**

### Seçenek 2: Manuel Kurulum
Node.js (v18+) ve PostgreSQL gerektirir.

1.  Bağımlılıkları yükleyin: `npm install`
2.  `.env` dosyasını oluşturun (Örnek: `.env.example`).
3.  Veritabanını oluşturun: `npm run migrate`
4.  Uygulamayı başlatın: `npm run dev`

---

## Kullanım (Dashboard)

Tarayıcınızı açıp **http://localhost:3000** adresine gidin. Karşınıza **Proje Yönetim Paneli** çıkacaktır.

Bu panel üzerinden:
1.  **Mini CRM:** Kullanıcı Kılavuzuna ve Hızlı Başlangıça ulaşabilirsiniz.
2.  **Proje Raporları:** Gereksinim Analizi, Mimari Tasarım ve süreç raporlarını inceleyebilirsiniz.
3.  **Test Kapsamı:** Kodun ne kadarının test edildiğini (LCOV Raporu) görebilirsiniz.
4.  **API Dokümantasyonu:** Swagger UI üzerinden API uçlarını test edebilirsiniz.
5.  **Adım Adım İşlemler:** Sınav/Sunum için hazırlanan detaylı geliştirme günlüğüne bakabilirsiniz.

---

## Dokümantasyon

Tüm teknik dokümanlar `docs/` klasöründe ve Web Arayüzü içindedir:

- **[Kullanıcı Kılavuzu (User Manual)](docs/User_Manual.md)**
- **[Adım Adım Yapılan İşlemler](docs/Yapilan_Islemler_Adim_Adim.txt)**
- **[Gereksinim Analizi](docs/Gereksinim_Analizi.txt)**
- **[Mimari Tasarım](docs/Mimari_Tasarim_Dokumani.txt)**
- **[Log Örnekleri](docs/Log_Samples.md)**

## Testler

Testleri manuel çalıştırmak için:

```bash
# Tüm testleri çalıştır
npm test

# Test coverage raporunu üret
npm run test:coverage
```

## Katkıda Bulunma
Lütfen `docs/CONTRIBUTING.md` dosyasını inceleyiniz.

## Geliştirici
**Erdinç Özdemir**
