const db = require('./src/config/db');
const bcrypt = require('bcrypt');

const migrate = async () => {
    try {
        const [users] = await db.query("SELECT id_user, password FROM users");
        
        console.log(`Memulai migrasi untuk ${users.length} user...`);

        for (let user of users) {
            if (!user.password.startsWith('$2b$')) {
                const saltRounds = 10;
                const hashedPassword = await bcrypt.hash(user.password, saltRounds);

                await db.query(
                    "UPDATE users SET password = ? WHERE id_user = ?",
                    [hashedPassword, user.id_user]
                );
                console.log(`✅ User ${user.id_user} berhasil di-hash.`);
            } else {
                console.log(`⏩ User ${user.id_user} sudah menggunakan hash, dilewati.`);
            }
        }
        console.log("Migrasi selesai!");
        process.exit();
    } catch (error) {
        console.error("Gagal migrasi:", error);
        process.exit(1);
    }
};

migrate();