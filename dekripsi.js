const crypto = require('crypto');
const fs = require('fs');
const readline = require('readline'); // Modul untuk input CLI

try {
    // 1. Membaca Kunci Privat (Harus ada untuk dekripsi)
    const privateKey = fs.readFileSync('private_key.pem', 'utf8');

    // 2. Fungsi Dekripsi Inti
    function decryptData(encryptedMessageBase64, privateKey) {
        // Konversi Base64 string kembali ke Buffer
        const buffer = Buffer.from(encryptedMessageBase64, 'base64');
        
        // Operasi Dekripsi Asimetris
        const decrypted = crypto.privateDecrypt(
            {
                key: privateKey,
                padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
                oaepHash: 'sha256'
            },
            buffer
        );
        // Mengembalikan pesan asli
        return decrypted.toString('utf8');
    }

    // --- 3. Logika Input CLI ---
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question('Langkah Dekripsi: Paste PESAN TERENKRIPSI (Base64) di sini: \n', async (encryptedMessageBase64) => {
        rl.close(); 

        if (!encryptedMessageBase64) {
            console.log("❌ Input pesan terenkripsi kosong. Proses dibatalkan.");
            return;
        }

        try {
            const decryptedMessage = decryptData(encryptedMessageBase64, privateKey);
            
            console.log("\n--- SERVER DEKRIPSI BERHASIL ---");
            console.log(`Pesan Terenkripsi yang Didekripsi: ${encryptedMessageBase64.substring(0, 50)}...`);
            console.log(`Pesan Asli Ditemukan: ${decryptedMessage}`);
            
        } catch (error) {
            console.error("\n❌ GAGAL DEKRIPSI.");
            console.error("Kesalahan: Pesan yang dimasukkan salah, format kunci rusak, atau kunci tidak cocok.");
            // Error Detail: console.error("Detail Error:", error.message);
        }
    });

} catch (error) {
    // Menangkap error jika file kunci privat belum dibuat
    console.error(`\n❌ ERROR: ${error.code}. Pastikan private_key.pem ada di folder.`);
    console.error("Detail Error:", error.message);
}