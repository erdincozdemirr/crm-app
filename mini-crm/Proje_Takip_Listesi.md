# Proje Takip Listesi

### 1. Gereksinim Analizi ve Planlama
- [x] Belirsizliklerin tespiti ve Soru Listesi
- [x] Gereksinim Analiz Dokümanı (`Gereksinim_Analizi.txt`) oluşturulması

### 2. Mimari Tasarım
- [x] Veritabanı şema tasarımı (ER Diyagramı/Dokümanı)
- [x] API Uçları Listesi (Swagger taslağı)
- [x] UML Diyagramlarının (Class, Sequence, Use Case) hazırlanması

### 3. Proje Kurulumu ve Konfigürasyon
- [x] Eksik `config` yapısının düzeltilmesi
- [x] `package.json` scriptlerinin düzenlenmesi
- [x] Lint & Format (ESLint/Prettier) kurulumu
- [x] CI Pipeline (GitHub Actions) kurulumu

### 4. Veritabanı ve Migration
- [x] Migration dosya yapısının standartlaştırılması (`01-` formatı)
- [x] Mevcut hataların giderilmesi
- [x] Yeni tablo yapısının (Customer, Product, Order, EtlImport) migrationları
- [x] İlişkilerin kurulması (Foreign Keys) ve İndekslerin tanımlanması

### 5. Kod Geliştirme (Backend)
- [x] `Customer` Service & Controller (CRUD, Validasyonlar)
- [x] `Product` Service & Controller (Stok Takibi mantığı)
- [x] `Order` Service & Controller (Transaction, Sipariş süreçleri)

### 6. ETL (Veri Geçişi)
- [x] DB Tabanlı Dosya Yükleme (Upload & BYTEA Kayıt)
- [x] CSV okuma, parse etme ve normalize etme
- [x] Veri temizleme ve tekilleştirme mantığı
- [x] Import işleminin gerçekleştirilmesi ve kaynak temizliği

### 7. Loglama ve Hata Yönetimi
- [x] Winston entegrasyonu (Console & File log)
- [x] Trace ID (İzlenebilirlik) mekanizmasının kurulması
- [x] Global Error Handler

### 8. Test ve Kalite Güvencesi
- [x] Unit Testler (Jest)
- [x] Entegrasyon Testleri
- [x] Test Coverage (Kapsam) Raporu altyapısı

### 9. Dokümantasyon
- [x] API Dokümantasyonu (Swagger UI - Tamamlanmış Endpointler)
- [x] Readme Kurulum Kılavuzu
- [x] Kod Haritası (`Codebase_Map.md`) ve Mimari Açıklamalar
- [x] Migration Raporu (`docs/Migration_Report.md`)

### 10. Refactoring ve İyileştirmeler
- [x] Migration dosya isimlerinin düzenlenmesi (`01-`, `02-` formatı)
- [x] Kod içerisindeki yorum satırlarının temizlenmesi
- [x] Swagger UI iyileştirmeleri (Tags, Eksik Endpointler)
- [x] ETL geliştirmesi: Dosya yükleme (Upload) ve DB'ye kayıt (BYTEA)
- [x] Geçici dosyaların temizlenmesi (`uploads/` silinmesi)
