Nama : Muhamad Satrio Kalbe Technical Test

Tech yang digunakan adalah Typescript, NodeJS Express, PostgreSQL, dan Sequelize, Berikut adalah cara menjalankannya:

Dokumentasi API: https://documenter.getpostman.com/view/29490220/2sA3Qv8WBP

Cara penggunaan API:

1. Clone repository
2. Jalankan di terminal “npm install” untuk instal dependencies yang ada
3. silahkan ubah nama.env.example menjadi .env dan kemudian isi host, port, username, password, dan db name sesuai data connection database postgreSQL yang anda miliki.
4. Jalankan kode berikut untuk membuat database “npx sequelize-cli db:create”
5. Jalankan kode migration untuk migrate tabel “npx sequelize-cli db:migrate”
6. Jalankan kode untuk memasukkan data seeders yang sudah ada “npx sequelize-cli db:seed:all” (berisi data role dummy)
7. Jalankan di terminal “npm run dev”
8. Buka Postman (Dokumentasi API link diatas) dan coba jalankan sesuai tes yang ada.


Hal yang perlu diperhatikan:

1. Perlu register SignUp > Login > Refresh Token (ambli token yang akan digunakan untuk mengakses API lainnya)
2. Cara penggunakan bearer token yaitu tinggal kebagian authorization postman kemudian pilih type "Bearer Token" kemudian masukkan token yang telah kita ambil sebelumnya.
2. Bagian API yang terdapat params silahkan ikuti sesuai yang ada pada postman
3. API tugas yaitu API Postman dengan nama "get driver salary" dengan alamat http://localhost:7000/driver/salary?driver_code=DRIVER012&current=1&name=Driver Name 12&page_size=10&year=2024&month=3