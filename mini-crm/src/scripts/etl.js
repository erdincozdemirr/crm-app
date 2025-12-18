const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');
const { Customer } = require('../models');
const customerService = require('../services/customerService');
const logger = require('../lib/logger');

const log = (msg) => logger.info(`[ETL] ${msg}`);
const logError = (msg) => logger.error(`[ETL ERROR] ${msg}`);

async function normalizePhone(phone) {
    if (!phone) return null;
    const cleaned = phone.replace(/\D/g, '');

    if (cleaned.length === 10) {
        return `+90${cleaned}`;
    } if (cleaned.length === 11 && cleaned.startsWith('0')) {
        return `+90${cleaned.substring(1)}`;
    } if (cleaned.length === 12 && cleaned.startsWith('90')) {
        return `+${cleaned}`;
    }

    return null;
}

function cleanString(str) {
    if (!str) return null;
    return str.trim();
}

async function run() {
    const csvPath = path.join(__dirname, '../../mock_customers.csv');
    log(`Reading CSV from ${csvPath}`);

    if (!fs.existsSync(csvPath)) {
        logError('CSV file not found!');
        process.exit(1);
    }

    const fileContent = fs.readFileSync(csvPath, 'utf8');
    const records = parse(fileContent, {
        columns: true,
        skip_empty_lines: true,
        trim: true
    });

    log(`Found ${records.length} records. Starting processing...`);

    let successCount = 0;
    const updateCount = 0;
    let errorCount = 0;

    for (const row of records) {
        try {
            const rawName = cleanString(row['Ad Soyad']);
            const rawPhone = row.Telefon;
            const rawEmail = cleanString(row.Email);
            const address = cleanString(row.Adres);
            const notes = cleanString(row.Not);

            let firstName = rawName;
            let lastName = null;

            if (rawName && rawName.includes(' ')) {
                const parts = rawName.split(' ');
                lastName = parts.pop();
                firstName = parts.join(' ');
            }

            if (!firstName && !lastName) {
                firstName = "Bilinmeyen Müşteri";
            }

            const phone = await normalizePhone(rawPhone);

            if (!phone && !rawEmail) {
                logError(`Skipping record: No Phone or Email. Name: ${rawName}`);
                errorCount++;
                continue;
            }

            const payload = {
                firstName,
                lastName,
                phone,
                email: rawEmail,
                address,
                notes: `Imported via ETL. Original Note: ${notes || ''}`
            };

            await customerService.createOrUpdate(payload);
            successCount++;
            if (successCount % 5 === 0) process.stdout.write('.');

        } catch (err) {
            logError(`Failed to process row: ${JSON.stringify(row)}. Error: ${err.message}`);
            errorCount++;
        }
    }

    console.log('\n');
    log('------------------------------------------------');
    log(`Import Completed.`);
    log(`Processed: ${records.length}`);
    log(`Success/Updated: ${successCount}`);
    log(`Errors/Skipped: ${errorCount}`);
    log('------------------------------------------------');
}

run()
    .then(() => process.exit(0))
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
