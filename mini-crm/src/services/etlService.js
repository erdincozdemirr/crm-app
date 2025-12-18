const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');
const { EtlImport } = require('../models');
const customerService = require('./customerService');
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

class EtlService {
    async runImport(fileBuffer, filename) {
        log(`Processing import for: ${filename || 'Mock File'}`);

        let content;
        let etlRecord = null;

        if (fileBuffer) {
            // Save to DB first
            try {
                etlRecord = await EtlImport.create({
                    filename,
                    fileContent: fileBuffer,
                    status: 'PROCESSING'
                });
                log(`File saved to DB. ID: ${etlRecord.id}`);
                content = fileBuffer.toString('utf8');
            } catch (dbErr) {
                logError(`Failed to save file to DB: ${dbErr.message}`);
                throw new Error('Database save failed');
            }
        } else {
            // Fallback for mock (if needed, though controller now enforces file)
            const csvPath = path.join(__dirname, '../../mock_customers.csv');
            if (fs.existsSync(csvPath)) {
                content = fs.readFileSync(csvPath, 'utf8');
            } else {
                throw new Error('No input file provided');
            }
        }

        const records = parse(content, {
            columns: true,
            skip_empty_lines: true,
            trim: true
        });

        log(`Found ${records.length} records. Starting processing...`);

        let successCount = 0;
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

            } catch (err) {
                logError(`Failed to process row: ${JSON.stringify(row)}. Error: ${err.message}`);
                errorCount++;
            }
        }

        // Update DB Record
        if (etlRecord) {
            await etlRecord.update({
                status: 'COMPLETED',
                processedCount: successCount,
                errorCount
            });
        }

        return { successCount, errorCount, total: records.length, importId: etlRecord ? etlRecord.id : null };
    }
}

module.exports = new EtlService();
