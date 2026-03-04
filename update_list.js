const fs = require('fs');
const path = require('path');

// Fungsi utama untuk memproses subfolder dalam database
function updateAllFolders() {
    const baseDir = path.join(__dirname, 'database');

    // Cek apakah folder 'database' ada
    if (!fs.existsSync(baseDir)) {
        console.error("❌ Folder 'database' tidak ditemukan!");
        return;
    }

    // List folder yang ingin diproses (1, 2, 3, 4)
    const targetFolders = ['1', '2', '3', '4'];

    targetFolders.forEach(folderName => {
        const folderPath = path.join(baseDir, folderName);
        const outputJson = path.join(folderPath, 'list_files.json');

        // Pastikan folder sub (1/2/3/4) benar-benar ada
        if (fs.existsSync(folderPath)) {
            try {
                // 1. Baca isi folder secara synchronous
                const files = fs.readdirSync(folderPath);

                // 2. Filter file .xlsx (abaikan temporary files)
                const excelFiles = files.filter(file => {
                    return path.extname(file).toLowerCase() === '.xlsx' && !file.startsWith('~$');
                });

                // 3. Tulis ke list_files.json di folder masing-masing
                fs.writeFileSync(outputJson, JSON.stringify(excelFiles, null, 2));

                console.log(`✅ Berhasil update: database/${folderName}/list_files.json (${excelFiles.length} file)`);
            } catch (err) {
                console.error(`❌ Gagal memproses folder ${folderName}: ${err.message}`);
            }
        } else {
            console.warn(`⚠️ Folder 'database/${folderName}' tidak ditemukan, dilewati.`);
        }
    });

    console.log("\n--- Selesai Memproses Semua Folder ---");
}

// Jalankan fungsi
updateAllFolders();