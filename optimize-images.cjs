const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const TARGET_DIRS = [
    './client/public/assets',
    './client/public/images',
    './client/src/assets/images'
];

async function optimize() {
    console.log("🚀 Starting global WebP conversion...");

    for (const dir of TARGET_DIRS) {
        await scanAndProcess(path.resolve(dir));
    }
    console.log("✅ Global transformation complete!");
}

async function scanAndProcess(dirPath) {
    if (!fs.existsSync(dirPath)) return;

    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);
        if (entry.isDirectory()) {
            await scanAndProcess(fullPath);
        } else if (entry.isFile() && entry.name.match(/\.(jpg|jpeg|png)$/i)) {
            await processFile(dirPath, entry.name);
        }
    }
}

async function processFile(dir, file) {
    const filePath = path.join(dir, file);
    const ext = path.extname(file).toLowerCase();
    const baseName = path.basename(file, ext);
    const webpPath = path.join(dir, baseName + '.webp');

    console.log(`📉 Converting ${file} to WebP...`);

    try {
        let pipeline = sharp(filePath);

        const metadata = await pipeline.metadata();

        if (metadata.width > 1920) {
            console.log(`   Resizing width from ${metadata.width} to 1920...`);
            pipeline = pipeline.resize({ width: 1920, withoutEnlargement: true });
        }

        // Always convert to webp with high quality/compression balance
        await pipeline.webp({ quality: 75, effort: 6 }).toFile(webpPath);

        const oldStat = fs.statSync(filePath);
        const newStat = fs.statSync(webpPath);
        const oldSizeMB = oldStat.size / (1024 * 1024);
        const newSizeMB = newStat.size / (1024 * 1024);

        console.log(`   ✅ Created ${baseName}.webp (${newSizeMB.toFixed(2)} MB vs ${oldSizeMB.toFixed(2)} MB)`);

        // Delete original only if it was large (>500KB) and we are confident
        if (oldSizeMB > 0.1) {
            fs.unlinkSync(filePath);
            console.log(`   🗑️ Deleted original ${file}`);
        }
    } catch (err) {
        console.error(`   ❌ Error processing ${file}:`, err);
    }
}

optimize();
