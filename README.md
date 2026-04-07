# Promo Searcher - Matahari

A dynamic web application designed to manage, search, and view promotional campaign data efficiently. It allows direct, in-browser viewing of Excel files (`.xlsx`) and offers a quick search feature to easily locate specific promotions.

## 🚀 Features

- **Excel Data Viewer**: Seamlessly view the contents of promotional `.xlsx` files directly in your browser without requiring Microsoft Excel or similar software.
- **Fast Search & Barcode Scanner**: Search for specific articles via a fast text search, or use your device's camera to scan barcodes natively through the browser.
- **Category Divisions**: Organizes data into specific departments intuitively:
  - 1: Ladies 💃
  - 2: Shoes 👟
  - 3: Man 👔
  - 4: Children 👶
- **Responsive UI**: A modern, mobile-friendly interface featuring dynamic tables, status badges, highlighting, and full support for Dark Mode.
- **Local Database Indexing**: Comes with a built-in Node.js tool to rapidly scan and build an index of the available data files in your database folder.

## 📂 Project Structure

- `index.html`: The main web application interface and logic.
- `database/`: Contains categorized promotional data in `.xlsx` format, divided into subfolders (`1`, `2`, `3`, `4`).
- `update_list.js`: A Node.js utility script that recursively scans the `database` directories to update `list_files.json` for the web interface.
- `promo/`: Auxiliary folder for promo-related assets or configurations.

## 🛠️ Usage & Workflow

### 1. Adding Data
Place new promotional Excel files (`.xlsx`) anywhere within their appropriate division folders (`database/1`, `database/2`, etc.). Subdirectories are fully supported.

### 2. Updating the Index (Crucial Step)
Because the application runs in the browser, it needs an index of the files available. Whenever you add, change, or remove `.xlsx` files in the `database` folder, you must update the file layout index:

1. Ensure you have [Node.js](https://nodejs.org/) installed on your machine.
2. Open your terminal in the root of the project.
3. Run the indexing script:
   ```bash
   node update_list.js
   ```
4. Follow the interactive CLI prompts to select which divisions to update or press `a` to update all divisions at once.

### 3. Running the App
Since the application relies on fetching files (`.json` and `.xlsx`), running it by simply double-clicking `index.html` might be blocked by browser CORS security policies. 

It is recommended to run it using a local development server. For instance:
- Using [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) in VSCode.
- Or, using `serve` via Node.js:
  ```bash
  npx serve .
  ```
  Then navigating to `http://localhost:3000` in your web browser.

## 💻 Tech Stack

- **Vanilla HTML/CSS/JavaScript**: Lightweight and fast, no heavy frontend frameworks needed.
- **Node.js**: powers the background file indexing script.
- **Libraries**:
  - `xlsx.js` (SheetJS) for reading Excel sheets directly in the browser.
  - `@zxing/library` for real-time camera barcode scanning capabilities.
  - `jszip` required by SheetJS for efficient zip file extraction.
