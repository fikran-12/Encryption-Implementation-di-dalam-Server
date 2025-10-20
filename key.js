const crypto = require('crypto');
const fs = require('fs');

const keyOptions = {
    modulusLength: 2048, // Kekuatan kunci
    // Format Kunci Publik (WAJIB: spki)
    publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
    },
    // Format Kunci Privat (WAJIB: pkcs8)
    privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem'
    }
};

console.log("Membuat pasangan kunci RSA 2048-bit...");

// Menghasilkan pasangan kunci
const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', keyOptions);

// Menyimpan Kunci Publik (Digunakan untuk ENKRIPSI)
fs.writeFileSync('public_key.pem', publicKey);
console.log("✅ Kunci Publik tersimpan di public_key.pem");

// Menyimpan Kunci Privat (Digunakan untuk DEKRIPSI - SANGAT RAHASIA)
fs.writeFileSync('private_key.pem', privateKey);
console.log("✅ Kunci Privat tersimpan di private_key.pem");

console.log("\nProses Generate Kunci Selesai. Lanjut ke enkripsi.js.");