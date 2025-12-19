const { execSync } = require('child_process');

function run(command) {
    try {
        execSync(command, { stdio: 'inherit', shell: true });
    } catch (error) {
        console.error(`Hata: Komut calistirilamadi: ${command}`);
        process.exit(1);
    }
}

try {
    let branch = '';
    try {
        branch = execSync('git branch --show-current').toString().trim();
    } catch (e) {
        console.log('Git branch alinamadi, varsayilan olarak test ortami kullaniliyor.');
        branch = 'test';
    }

    console.log(`Aktif Branch: ${branch}`);

    let profile = 'test';
    let dbPort = 5432;

    if (branch === 'prod') {
        console.log('Production ortami algilandi.');
        profile = 'prod';
        dbPort = 5433;
    } else if (branch === 'main' || branch === 'test') {
        console.log('Test/Gelistirme ortami algilandi.');
    } else {
        console.log('Bilinmeyen branch. Varsayilan olarak Test ortami secildi.');
    }

    console.log(`Veritabani baslatiliyor (Profil: ${profile})...`);
    run(`docker compose --profile ${profile} up -d`);

    console.log(`Veritabani (Port ${dbPort}) aktif.`);
    console.log('Veritabaninin hazir olmasi bekleniyor (5sn)...');

    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 5000);

    console.log('Veritabani tablolari olusturuluyor (Migrations)...');
    run('npm run migrate');

    console.log('Ornek veriler yukleniyor (Seeding)...');
    run('npx sequelize-cli db:seed:all');

    console.log('Hazir! Projeyi kullanmaya baslayabilirsiniz.');

} catch (err) {
    console.error('Beklenmeyen bir hata olustu:', err);
    process.exit(1);
}
