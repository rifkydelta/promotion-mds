const fs = require("fs");
const path = require("path");
const readline = require("readline");

const ALL_FOLDERS = ["1", "2", "3", "4"];
const FOLDER_LABELS = {
  1: "Divisi 1 - Ladies 💃",
  2: "Divisi 2 - Shoes 👟",
  3: "Divisi 3 - Man 👔",
  4: "Divisi 4 - Children 👶",
};

function generateTimestamp() {
  const now = new Date();
  return (
    now.getFullYear() +
    "-" +
    String(now.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(now.getDate()).padStart(2, "0") +
    " " +
    String(now.getHours()).padStart(2, "0") +
    ":" +
    String(now.getMinutes()).padStart(2, "0")
  );
}

function updateFolder(baseDir, folderName, timestamp) {
  const folderPath = path.join(baseDir, folderName);
  const outputJson = path.join(folderPath, "list_files.json");

  if (!fs.existsSync(folderPath)) {
    console.warn(
      `⚠️  Folder database/${folderName} tidak ditemukan, dilewati.`,
    );
    return;
  }

  try {
    function getAllExcelFiles(currentDir, basePath = "") {
      let results = [];
      const items = fs.readdirSync(currentDir, { withFileTypes: true });

      for (const item of items) {
        if (item.isDirectory()) {
          const newBasePath = basePath ? `${basePath}/${item.name}` : item.name;
          results = results.concat(
            getAllExcelFiles(path.join(currentDir, item.name), newBasePath)
          );
        } else if (item.isFile()) {
          const ext = path.extname(item.name).toLowerCase();
          if (ext === ".xlsx" && !item.name.startsWith("~$")) {
            results.push(basePath ? `${basePath}/${item.name}` : item.name);
          }
        }
      }
      return results;
    }

    const excelFiles = getAllExcelFiles(folderPath);

    const outputData = {
      version: timestamp,
      files: excelFiles,
    };

    fs.writeFileSync(outputJson, JSON.stringify(outputData, null, 2));

    console.log(
      `✅ Update: database/${folderName}/list_files.json | ${excelFiles.length} file.`
    );
  } catch (err) {
    console.error(`❌ Gagal di folder ${folderName}: ${err.message}`);
  }
}

function showMenu() {
  console.log("\n========================================");
  console.log("   UPDATE LIST FILES - Matahari Promo   ");
  console.log("========================================");
  console.log("Pilih folder yang ingin diupdate:\n");
  ALL_FOLDERS.forEach((f) => {
    console.log(`  [${f}] ${FOLDER_LABELS[f]}`);
  });
  console.log("  [a] Semua folder sekaligus");
  console.log("  [x] Keluar");
  console.log("----------------------------------------");
}

function parseInput(input) {
  const trimmed = input.trim().toLowerCase();

  if (trimmed === "x") return null;
  if (trimmed === "a") return ALL_FOLDERS;

  // Bisa input lebih dari satu, misal "1 3" atau "1,3"
  const picked = trimmed.split(/[\s,]+/).filter((v) => ALL_FOLDERS.includes(v));

  if (picked.length === 0) return undefined; // invalid
  return [...new Set(picked)]; // hapus duplikat
}

async function main() {
  const baseDir = path.join(__dirname, "database");

  if (!fs.existsSync(baseDir)) {
    console.error("❌ Folder 'database' tidak ditemukan!");
    process.exit(1);
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const ask = (question) =>
    new Promise((resolve) => rl.question(question, resolve));

  showMenu();

  while (true) {
    const input = await ask("\nPilihan kamu: ");
    const selected = parseInput(input);

    if (selected === null) {
      console.log("\n👋 Keluar.");
      rl.close();
      break;
    }

    if (selected === undefined) {
      console.log(
        '❗ Pilihan tidak valid. Masukkan angka 1-4, "a" untuk semua, atau "x" untuk keluar.',
      );
      continue;
    }

    const timestamp = generateTimestamp();
    console.log(
      `\n🔄 Memperbarui ${
        selected.length === ALL_FOLDERS.length
          ? "semua folder"
          : `folder: ${selected.join(", ")}`
      }...\n`,
    );

    selected.forEach((folderName) =>
      updateFolder(baseDir, folderName, timestamp),
    );

    console.log(`\n--- Selesai | Versi: ${timestamp} ---`);

    const again = await ask("\nUpdate folder lain? (y/n): ");
    if (again.trim().toLowerCase() !== "y") {
      console.log("\n👋 Keluar.");
      rl.close();
      break;
    }

    showMenu();
  }
}

main();
