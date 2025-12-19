#!/bin/bash

BRANCH=$(git branch --show-current)

echo "Aktif Branch: $BRANCH"

if [ "$BRANCH" = "prod" ]; then
    echo "Production ortami algilandi."
    echo "mini_crm_prod veritabani baslatiliyor..."
    docker-compose --profile prod up -d
    echo "Prod veritabani (Port 5433) aktif."
elif [ "$BRANCH" = "main" ] || [ "$BRANCH" = "test" ]; then
    echo "Test/Gelistirme ortami algilandi."
    echo "mini_crm_test veritabani baslatiliyor..."
    docker-compose --profile test up -d
    echo "Test veritabani (Port 5432) aktif."
else
    echo "Bilinmeyen branch. Varsayilan olarak Test ortami secildi."
    docker-compose --profile test up -d
    echo "Test veritabani (Port 5432) aktif."
fi

echo "Veritabaninin hazir olmasi bekleniyor..."
sleep 5

echo "Veritabani tablolari olusturuluyor (Migrations)..."
npm run migrate

echo "Ornek veriler yukleniyor (Seeding)..."
npx sequelize-cli db:seed:all

echo "Hazir! Projeyi kullanmaya baslayabilirsiniz."

