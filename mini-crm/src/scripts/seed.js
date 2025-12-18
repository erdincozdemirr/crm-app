const { Sequelize } = require('sequelize');
const config = require('../config/index');
const { Customer, Product } = require('../models');

async function seed() {
    console.log('Seeding data...');

    // Products
    const products = [
        { name: 'Laptop Pro X1', sku: 'LP-001', price: 25000, stockQuantity: 15 },
        { name: 'Kablosuz Mouse', sku: 'MS-002', price: 450, stockQuantity: 50 },
        { name: 'Mekanik Klavye', sku: 'KB-003', price: 1200, stockQuantity: 30 },
        { name: '27" 4K Monitör', sku: 'MN-004', price: 8500, stockQuantity: 10 },
        { name: 'USB-C Hub', sku: 'HB-005', price: 300, stockQuantity: 100 },
        { name: 'Gaming Kulaklık', sku: 'HS-006', price: 1500, stockQuantity: 25 },
        { name: 'Webcam 1080p', sku: 'WC-007', price: 900, stockQuantity: 40 },
        { name: 'Ergonomik Koltuk', sku: 'CH-008', price: 5500, stockQuantity: 5 },
        { name: 'Akıllı Saat', sku: 'SW-009', price: 3200, stockQuantity: 20 },
        { name: 'Tablet 10"', sku: 'TB-010', price: 4500, stockQuantity: 12 }
    ];

    // Customers
    const customers = [
        { firstName: 'Ahmet', lastName: 'Yılmaz', phone: '5551112233', email: 'ahmet@example.com', notes: 'Sadık müşteri' },
        { firstName: 'Ayşe', lastName: 'Demir', phone: '5554445566', email: 'ayse@example.com', notes: 'Yeni kayıt' },
        { firstName: 'Mehmet', lastName: 'Kaya', phone: '5557778899', email: 'mehmet@example.com', notes: 'Kurumsal' },
        { firstName: 'Zeynep', lastName: 'Çelik', phone: '5550001122', email: 'zeynep@example.com', notes: '' },
        { firstName: 'Ali', lastName: 'Vural', phone: '5559998877', email: 'ali@example.com', notes: 'Ödeme sorunu yaşadı' }
    ];

    try {
        for (const p of products) {
            await Product.create(p).catch(err => console.log(`Skipped product ${p.sku}: ${err.message}`));
        }

        for (const c of customers) {
            await Customer.create(c).catch(err => console.log(`Skipped customer ${c.email}: ${err.message}`));
        }

        console.log('Seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
}

seed();
