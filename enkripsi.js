const crypto = require('crypto');
const fs = require('fs');
const readline = require('readline'); // Modul baru untuk input CLI

// --- 1. Persiapan ---
try {
    // Membaca Kunci Publik yang dibuat oleh generate_keys.js
    const publicKey = fs.readFileSync('public_key.pem', 'utf8');

    // Membuat antarmuka CLI
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    // --- 2. Fungsi Enkripsi ---
    function encryptData(message, publicKey) {
        const buffer = Buffer.from(message, 'utf8');
        const encrypted = crypto.publicEncrypt(
            {
                key: publicKey,
                padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
                oaepHash: 'sha256'
            },
            buffer
        );
        return encrypted.toString('base64');
    }

    // --- 3. Logika Input CLI ---
    rl.question('Masukkan PESAN RAHASIA yang akan dienkripsi: ', (originalMessage) => {
        rl.close(); // Tutup antarmuka readline setelah input diterima
        
        // Cek jika input kosong
        if (!originalMessage) {
            console.log("❌ Pesan tidak boleh kosong. Proses dibatalkan.");
            return;
        }

        try {
            const encryptedMessage = encryptData(originalMessage, publicKey);
            
            console.log("\n--- SERVER ENKRIPSI BERHASIL ---");
            console.log(`Pesan Asli: ${originalMessage}`);
            console.log(`Pesan terenkripsi (Base64): ${encryptedMessage}`);
            
            // Simpan pesan terenkripsi untuk Server Dekripsi
            fs.writeFileSync('encrypted_message.txt', encryptedMessage);
            console.log("✅ Pesan terenkripsi telah disimpan ke 'encrypted_message.txt'");
            
        } catch (error) {
            console.error("\nTerjadi kesalahan saat enkripsi:", error.message);
        }
    });

} catch (error) {
    // Menangkap error jika file kunci belum dibuat
    console.error(`\n❌ ERROR: ${error.code}. Pastikan Anda sudah menjalankan generate_keys.js`);
    console.error("Detail Error:", error.message);
}