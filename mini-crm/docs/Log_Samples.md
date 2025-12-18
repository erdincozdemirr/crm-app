# Log Örnekleri Raporu

Sistemde yapılan işlemler hem dosyaya (`logs/app.log`) hem de veritabanına (`SystemLogs` tablosu) kaydedilmektedir. İşte canlı sistemden alınan gerçek örnekler:

## 1. Veritabanı Logları (DB - SystemLogs)
Veritabanına kaydedilen loglar SQL sorgusu ile alınabilir. Aşağıda son işlemlerin dökümü yer almaktadır:

```sql
SELECT level, message, "traceId", meta FROM "SystemLogs" ORDER BY "createdAt" DESC LIMIT 3;
```

**Gerçek Sonuç:**
```text
[ERROR] ID:15 Trace:e035d27b-5863-4c59-b9d5-78df3ba928ad Msg:notNull Violation: Customer.firstName cannot be null
   Meta: {"stack":"SequelizeValidationError: notNull Violation: Customer.firstName cannot be null...","path":"/api/customers","method":"POST","statusCode":500}
---
[INFO] ID:14 Trace:063c803c-da3c-4d9b-b50e-1865f0c50fb9 Msg:Response Sent: GET /api/customers/99999 404 - 6ms
   Meta: {"method":"GET","url":"/api/customers/99999","statusCode":404,"duration":6,"ip":"::1"}
---
[INFO] ID:13 Trace:ccd2bbdd-e87a-4a51-9628-66511474179c Msg:Response Sent: GET /api/customers 200 - 15ms
   Meta: {"method":"GET","url":"/api/customers","statusCode":200,"duration":15,"ip":"::1"}
```

## 2. Dosya Logları (File - app-combined.log)
Dosya sistemi logları JSON formatında tutulmakta olup Stack Trace gibi uzun verileri de içerir.

**Örnek Satırlar:**
```json
{"level":"info","message":"Incoming Request: GET /api/customers","service":"mini-crm","method":"GET","url":"/api/customers","ip":"::1","userAgent":"curl/8.7.1","timestamp":"2025-12-18T05:28:47.165Z"}
{"level":"info","message":"[TraceID: ccd2bbdd-e87a-4a51-9628-66511474179c] Response Sent: GET /api/customers 200 - 15ms","service":"mini-crm","method":"GET","url":"/api/customers","statusCode":200,"duration":15,"timestamp":"2025-12-18T05:28:47.181Z"}
{"level":"error","message":"[TraceID: e035d27b-5863-4c59-b9d5-78df3ba928ad] notNull Violation: Customer.firstName cannot be null","service":"mini-crm","stack":"...","traceId":"e035d27b-5863-4c59-b9d5-78df3ba928ad","timestamp":"2025-12-18T05:28:48.337Z"}
```

## 📋 Gözlem & Analiz
1.  **Trace ID Uyumu:** Hem DB hem de Dosya loglarında aynı Trace ID (`ccd2...` veya `e035...`) yer almaktadır. Bu sayede bir isteğin tüm yaşam döngüsü takip edilebilir.
2.  **Seviye Kontrolü:** Başarılı işlem (`200 OK`) `INFO`, hata (`500 Error`) ise `ERROR` seviyesinde kaydedilmiştir.
3.  **Performans:** İşlem süreleri (`15ms`, `6ms`) loglanmıştır.

Sistem denetimi başarıyla geçmiştir. ✅
