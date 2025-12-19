'use strict';

const fs = require('fs');
const path = require('path');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // ==========================================
        // 1. CUSTOMERS (FROM SCV)
        // ==========================================
        const csvPath = path.join(__dirname, '..', 'mock_customers.csv');
        let csvData = '';

        try {
            csvData = fs.readFileSync(csvPath, 'utf8');
        } catch (error) {
            console.warn("mock_customers.csv not found, skipping customer CSV seed.");
        }

        const customersToInsert = [];
        if (csvData) {
            // Simple manual CSV parsing (assuming simple format)
            // Header: Ad Soyad,Telefon,Email,Adres,Not
            const lines = csvData.split('\n');
            // Skip header (index 0)
            for (let i = 1; i < lines.length; i++) {
                const line = lines[i].trim();
                if (!line) continue;

                // Handle quoted fields basic support (splitting by regex or simple comma)
                // For this specific "Ad Soyad" CSV, let's try basic comma split first.
                let parts = line.split(',');
                // Re-join parts if address contained commas wrapped in quotes (basic heuristic)
                if (line.includes('"')) {
                    // A better approach for this specific file structure:
                    // If we see "Istanbul, Kadikoy", it splits into 2 parts.
                    // We'll use a regex for proper CSV splitting if needed, but for now let's map by index.
                    // Or simply proceed. Let's use a regex to split by comma ignoring quotes.
                    parts = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || [];
                    parts = parts.map(p => p.replace(/^"|"$/g, '').trim()); // Clean quotes
                }

                // Adjust parts array if regex failed or simple split was needed
                if (!line.includes('"')) {
                    parts = line.split(',');
                }

                if (parts.length >= 1) {
                    const fullName = parts[0] || '';
                    const phone = parts[1] || '';
                    const email = parts[2] || '';
                    const address = parts[3] ? parts[3].replace(/"/g, '') : '';
                    // parts[4] is 'Not' - ignored for now

                    // Split Ad Soyad
                    const nameParts = fullName.trim().split(' ');
                    let firstName = nameParts[0] || 'Unknown';
                    let lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : 'Doe';

                    // Basic validations/cleanups
                    // Filter out obviously bad data (like row 22 "0", row 23 "532...") if name is numeric
                    if (!isNaN(fullName.replace(/\s/g, ''))) continue;

                    customersToInsert.push({
                        first_name: firstName,
                        last_name: lastName,
                        email: email && email.includes('@') ? email : `user${i}@example.com`, // Fallback email
                        phone: phone || '',
                        address: address || 'Adres Girilmedi',
                        created_at: new Date(),
                        updated_at: new Date()
                    });
                }
            }
        }

        // Default manual customers if CSV failed or empty
        if (customersToInsert.length === 0) {
            customersToInsert.push(
                { first_name: 'Ahmet', last_name: 'Yılmaz', email: 'ahmet@example.com', address: 'Istanbul', phone: '555-111', created_at: new Date(), updated_at: new Date() },
                { first_name: 'Ayşe', last_name: 'Demir', email: 'ayse@example.com', address: 'Ankara', phone: '555-222', created_at: new Date(), updated_at: new Date() }
            );
        }

        // Assign explicit IDs
        customersToInsert.forEach((c, index) => { c.id = index + 1; });

        console.log(`Seeding ${customersToInsert.length} customers...`);
        await queryInterface.bulkInsert('customers', customersToInsert, { ignoreDuplicates: true });

        // Update sequence
        const maxCustId = customersToInsert.length + 10;
        await queryInterface.sequelize.query(`SELECT setval('customers_id_seq', ${maxCustId}, false);`);


        // ==========================================
        // 2. PRODUCTS (Generate 15 items)
        // ==========================================
        const productsToInsert = [];
        const productCategories = ['Laptop', 'Mouse', 'Keyboard', 'Monitor', 'Headset', 'Webcam', 'Charger', 'USB Hub', 'Tablet', 'Phone'];

        for (let i = 1; i <= 15; i++) {
            const category = productCategories[Math.floor(Math.random() * productCategories.length)];
            const model = `Model-${1000 + i}`;
            productsToInsert.push({
                id: i,
                name: `${category} ${model}`,
                sku: `${category.substring(0, 3).toUpperCase()}-${model}-${i}`,
                price: (Math.random() * 2000 + 100).toFixed(2), // 100 to 2100
                stock_quantity: Math.floor(Math.random() * 100) + 10,
                is_stock_tracked: true,
                created_at: new Date(),
                updated_at: new Date()
            });
        }

        console.log(`Seeding ${productsToInsert.length} products...`);
        await queryInterface.bulkInsert('products', productsToInsert, { ignoreDuplicates: true });
        await queryInterface.sequelize.query(`SELECT setval('products_id_seq', ${productsToInsert.length + 10}, false);`);


        // ==========================================
        // 3. ORDERS (Generate 20 orders)
        // ==========================================

        // Fetch actual customer IDs from DB to ensure FK validity
        // (bulkInsert with ignoreDuplicates might skip some, so we can't assume 1..N sequence)
        const existingCustomers = await queryInterface.sequelize.query(
            `SELECT id FROM customers;`,
            { type: queryInterface.sequelize.QueryTypes.SELECT }
        );
        const validCustomerIds = existingCustomers.map(c => c.id);

        if (validCustomerIds.length === 0) {
            console.error("No customers found! Skipping order generation.");
            return;
        }

        const ordersToInsert = [];
        const orderItemsToInsert = [];
        const statuses = ['PENDING', 'PREPARING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

        let orderIdCounter = 1;
        let orderItemCounter = 1;

        for (let i = 1; i <= 20; i++) {
            // Pick random customer from VALID IDs
            const randomCustId = validCustomerIds[Math.floor(Math.random() * validCustomerIds.length)];
            // Pick random status
            const status = statuses[Math.floor(Math.random() * statuses.length)];

            // Generate 1-5 items for this order
            const itemCount = Math.floor(Math.random() * 5) + 1;
            let total = 0;

            for (let j = 0; j < itemCount; j++) {
                const randomProdId = Math.floor(Math.random() * 15) + 1; // 1-15 (Products are fixed 1-15 above)
                const product = productsToInsert.find(p => p.id === randomProdId);

                // Safety check if product lookup fails (though it shouldn't for 1-15)
                if (!product) continue;

                const qty = Math.floor(Math.random() * 3) + 1;
                const unitPrice = parseFloat(product.price);

                total += (qty * unitPrice);

                orderItemsToInsert.push({
                    id: orderItemCounter++,
                    order_id: orderIdCounter,
                    product_id: randomProdId,
                    quantity: qty,
                    unit_price: unitPrice,
                    created_at: new Date(),
                    updated_at: new Date()
                });
            }

            ordersToInsert.push({
                id: orderIdCounter,
                customer_id: randomCustId,
                total_price: total.toFixed(2),
                status: status,
                shipping_address: 'Otomatik Adres, Türkiye',
                created_at: new Date(),
                updated_at: new Date()
            });

            orderIdCounter++;
        }

        console.log(`Seeding ${ordersToInsert.length} orders and ${orderItemsToInsert.length} items...`);
        await queryInterface.bulkInsert('orders', ordersToInsert, { ignoreDuplicates: true });
        await queryInterface.sequelize.query(`SELECT setval('orders_id_seq', ${ordersToInsert.length + 10}, false);`);

        await queryInterface.bulkInsert('order_items', orderItemsToInsert, { ignoreDuplicates: true });
        await queryInterface.sequelize.query(`SELECT setval('order_items_id_seq', ${orderItemsToInsert.length + 10}, false);`);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('order_items', null, {});
        await queryInterface.bulkDelete('orders', null, {});
        await queryInterface.bulkDelete('products', null, {});
        await queryInterface.bulkDelete('customers', null, {});
    }
};
