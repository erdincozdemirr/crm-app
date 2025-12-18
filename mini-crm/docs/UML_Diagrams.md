# UML Diyagramları

## 1. Class Diagram (Sınıf Diyagramı)
Sistemin veri modelleri ve aralarındaki ilişkileri gösterir.

```mermaid
classDiagram
    class Customer {
        +Integer id
        +String firstName
        +String lastName
        +String phone
        +String email
        +String address
        +String notes
        +createOrUpdate()
    }

    class Product {
        +Integer id
        +String name
        +String sku
        +Decimal price
        +Integer stockQuantity
        +Boolean isStockTracked
        +checkStock()
        +decreaseStock()
    }

    class Order {
        +Integer id
        +Integer customerId
        +Decimal totalPrice
        +Enum status
        +Date createdAt
        +createOrder()
        +updateStatus()
    }

    class OrderItem {
        +Integer id
        +Integer orderId
        +Integer productId
        +Integer quantity
        +Decimal unitPrice
    }

    class EtlImport {
        +Integer id
        +String filename
        +Blob fileContent
        +String status
        +Integer processedCount
    }

    Customer "1" -- "0..*" Order : places
    Order "1" *-- "1..*" OrderItem : contains
    Product "1" -- "0..*" OrderItem : part_of
```

## 2. Sequence Diagram (Sipariş Oluşturma Senaryosu)
Bir siparişin API'den veritabanına kadar olan akışını ve stok kontrolünü gösterir.

```mermaid
sequenceDiagram
    participant Client
    participant API as API (OrderController)
    participant Service as OrderService
    participant Product as ProductService
    participant DB as Database (Transaction)

    Client->>API: POST /api/orders (customerId, items)
    API->>Service: createOrder(customerId, items)
    
    Service->>DB: Start Transaction (t)
    
    loop For Each Item
        Service->>Product: checkStock(productId, quantity)
        alt Stock Insufficient
            Product-->>Service: Error (Insufficient Stock)
            Service->>DB: Rollback
            Service-->>API: Error Message
            API-->>Client: 400 Bad Request
        else Stock OK
            Product->>DB: decreaseStock(productId, quantity)
        end
    end

    Service->>DB: Insert Order
    Service->>DB: Insert OrderItems
    
    Service->>DB: Commit Transaction
    Service-->>API: Order Object
    API-->>Client: 201 Created (Order Details)
```

## 3. Use Case Diagram (Kullanım Durumları)
Sitemdeki aktörlerin (Admin/Kullanıcı) yapabileceği temel işlemleri gösterir.

```mermaid
useCaseDiagram
    actor Admin as "Yönetici / Personel"

    package "MiniCRM System" {
        usecase "Müşteri Ekle/Güncelle" as UC1
        usecase "Müşteri Ara" as UC2
        usecase "Ürün Ekle" as UC3
        usecase "Stok Güncelle" as UC4
        usecase "Sipariş Oluştur" as UC5
        usecase "Sipariş Durumu Değiştir" as UC6
        usecase "Toplu Veri Yükle (ETL)" as UC7
        usecase "Raporları Görüntüle" as UC8
    }

    Admin --> UC1
    Admin --> UC2
    Admin --> UC3
    Admin --> UC4
    Admin --> UC5
    Admin --> UC6
    Admin --> UC7
    Admin --> UC8
```
