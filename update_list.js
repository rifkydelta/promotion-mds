const fs = require('fs');
const path = require('path');

function updateAllFolders() {
    const baseDir = path.join(__dirname, 'database');

    if (!fs.existsSync(baseDir)) {
        console.error("❌ Folder 'database' tidak ditemukan!");
        return;
    }

    const targetFolders = ['1', '2', '3', '4'];

    // Generate timestamp format: YYYY-MM-DD HH:mm
    const now = new Date();
    const timestamp = now.getFullYear() + '-' + 
                      String(now.getMonth() + 1).padStart(2, '0') + '-' + 
                      String(now.getDate()).padStart(2, '0') + ' ' + 
                      String(now.getHours()).padStart(2, '0') + ':' + 
                      String(now.getMinutes()).padStart(2, '0');

    targetFolders.forEach(folderName => {
        const folderPath = path.join(baseDir, folderName);
        const outputJson = path.join(folderPath, 'list_files.json');

        if (fs.existsSync(folderPath)) {
            try {
                const files = fs.readdirSync(folderPath);

                // Filter file .xlsx
                const excelFiles = files.filter(file => {
                    return path.extname(file).toLowerCase() === '.xlsx' && !file.startsWith('~$');
                });

                // Bungkus ke dalam format yang diminta
                const outputData = {
                    version: timestamp,
                    files: excelFiles
                };

                fs.writeFileSync(outputJson, JSON.stringify(outputData, null, 2));

                console.log(`✅ Update: database/${folderName}/list_files.json | ${excelFiles.length} file.`);
            } catch (err) {
                console.error(`❌ Gagal di folder ${folderName}: ${err.message}`);
            }
        }
    });

    console.log(`\n--- Selesai | Versi: ${timestamp} ---`);
}

updateAllFolders();