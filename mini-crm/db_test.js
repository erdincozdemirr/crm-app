const { Client } = require('pg');

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'mini_crm', // Correct name
    password: 'postgres',
    port: 5432,
});

client.connect()
    .then(() => {
        console.log('Connection successful to mini_crm!');
        return client.end();
    })
    .catch(err => {
        console.error('Connection failed:', err);
        process.exit(1);
    });
