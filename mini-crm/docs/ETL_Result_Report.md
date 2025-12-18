# ETL Sonuç Raporu

**Tarih:** 18 Aralık 2025
**Kaynak Dosya:** `mock_customers.csv`
**Çalıştıran Script:** `src/scripts/etl.js`

## 1. Yürütme Özeti
ETL (Extract, Transform, Load) süreci başarıyla tamamlanmıştır. Sistemdeki `mock_customers.csv` dosyası okunmuş, veriler temizlenmiş ve veritabanına aktarılmıştır.

**Komut Çıktısı:**
```text
2025-12-18T02:32:56.355Z [info] [ETL] Found 22 records. Starting processing...
......................
2025-12-18T02:32:56.451Z [error] [ETL ERROR] Skipping record: No Phone or Email. Name: 5321112233

------------------------------------------------
Import Completed.
Processed: 22
Success/Updated: 21
Errors/Skipped: 1
------------------------------------------------
```

## 2. Detaylı Metrikler

| Metrik | Değer | Açıklama |
|---|---|---|
| **Toplam Kayıt** | **22** | CSV dosyasındaki satır sayısı. |
| **Başarılı (Success)** | **21** | Veritabanına oluşturulan veya güncellenen müşteri sayısı. |
| **Hatalı (Skipped)** | **1** | Validasyon hatası (Eksik telefon/email) nedeniyle atlanan kayıt. |

## 3. Hata Analizi
*   **Hata 1:** `Skipping record: No Phone or Email. Name: 5321112233`
    *   **Sebep:** Kayıtta Telefon veya Email bilgisi bulunamadığı için müşteri oluşturulamadı.
    *   **Aksiyon:** Kaynak verideki bu satırın düzeltilmesi önerilir.

## 4. Nasıl Çalıştırılır?
Mevcut veri setini tekrar yüklemek için proje dizininde şu komutu kullanabilirsiniz:
```bash
node src/scripts/etl.js
```
