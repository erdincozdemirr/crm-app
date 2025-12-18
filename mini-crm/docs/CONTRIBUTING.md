# PROJE GELİŞTİRME VE KATKI REHBERİ

Bu proje, **Test Odaklı Geliştirme (TDD)** ve **Çift Branch (Dal)** stratejisi ile yönetilmektedir. En az **2 kişilik bir ekip** olarak çalıştığımız varsayılmaktadır.

## 👥 Ekip Çalışması ve Rol Tanımları

Projede herkes **Developer** rolündedir, ancak bir PR (Pull Request) açıldığında diğer ekip arkadaşı **Reviewer (Gözden Geçiren)** rolünü üstlenir.

**Temel Kural:** Kendi yazdığınız kodu `prod` veya `test` ana branch'ine **ASLA** doğrudan merge edemezsiniz. Mutlaka bir arkadaşınızın onayı (Code Review) gereklidir.

## 🌿 Branch (Dal) Stratejisi

### Ana Branchler
1.  **`test` (Geliştirme Ortamı):**
    *   Tüm `feature` ve `bugfix` branchleri buraya merge edilir.
    *   Veritabanı: `mini_crm_test`
    *   Amaç: Entegrasyon testlerinin koşulduğu, geliştiricilerin kodlarını birleştirdiği yerdir.

2.  **`prod` (Canlı Ortam):**
    *   Sadece `test` branchinden PR ile kod alır.
    *   Veritabanı: `mini_crm_prod`
    *   Amaç: Müşterinin kullandığı stabil sürümdür.

### Geçici Branch İsimlendirme Standartı
Yeni bir işe başlarken kendi branchinizi şu formatta açmalısınız:

*   Yeni özellik için: `feature/ozellik-adi` (Örn: `feature/login-screen`, `feature/export-excel`)
*   Hata düzeltmesi için: `bugfix/hata-adi` (Örn: `bugfix/stock-calculation`)
*   Refactoring için: `refactor/konu` (Örn: `refactor/db-config`)

---

## 🚀 Geliştirme Akışı (Adım Adım)

### 1. İş Başlangıcı
Terminalde `test` branchine geçin ve güncel olduğundan emin olun:
```bash
git checkout test
git pull origin test
git checkout -b feature/yeni-ozellik
```

### 2. Kodlama ve Yerel Test
Kodunuzu yazın. İşiniz bitince mutlaka mevcut testleri çalıştırın ve gerekiyorsa yenilerini yazın:
```bash
npm run lint   # Kod stilini kontrol et
npm test       # Testleri çalıştır
```

### 3. Commit ve Push
```bash
git add .
git commit -m "feat: Yeni müşteri ekleme formu yapıldı"
git push origin feature/yeni-ozellik
```

### 4. Pull Request (PR) Açma
GitHub/GitLab üzerinde `feature/yeni-ozellik` -> `test` yönünde bir PR açın.
PR Açıklamasına şunları yazın:
*   **Ne yapıldı:** (Örn: Müşteri arama fonksiyonu eklendi)
*   **Neden yapıldı:** (Örn: Müşteri talebi madde 1)
*   **Kanıt:** (Ekran görüntüsü veya log çıktısı)

### 5. Code Review (Kod İnceleme) - *Kritik Adım*
Takım arkadaşınız (Reviewer) PR'ı inceler. Şu soruları sorar:
*   [ ] Kod standartlara (Lint/Format) uygun mu?
*   [ ] Testler yazılmış mı ve geçiyor mu?
*   [ ] Mantık hatası veya güvenlik açığı var mı?
*   [ ] Gereksksiz yorum satırları silinmiş mi?

Reviewer onay verirse (`Approve`), PR merge edilir. Hata varsa yorum yazar (`Request Changes`), geliştirici düzeltip tekrar commit atar.

### 6. Canlıya Geçiş (Deployment)
Belirli periyotlarla (örn. her Cuma veya her Sprint sonu), `test` branchindeki birikmiş kodlar için `prod` branchine bir PR açılır. Bu "Release PR"ıdır ve son bir genel kontrolden sonra canlıya alınır.

---
**Özet:** Branch Aç -> Kodla -> Test Et -> PR Aç -> Review Bekle -> Merge Et -> Mutlu Son! 🎉
