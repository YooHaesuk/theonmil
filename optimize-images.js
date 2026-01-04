
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const param = process.argv[2];
// Usage: vite-node scripts/optimize-images.js -- force
// or just node if compiled. We will use node with type module or ES launch.
// Since package.json has "type": "module", we can run this directly with node.

const TARGET_DIRS = [
    './client/public/assets',
    './client/public/images'
];

async function optimize() {
    console.log("🚀 Starting image optimization...");

    for (const dir of TARGET_DIRS) {
        const fullPath = path.resolve(dir);
        if (!fs.existsSync(fullPath)) {
            console.log(`Skipping ${dir}, not found.`);
            continue;
        }

        const files = fs.readdirSync(fullPath);
        for (const file of files) {
            if (file.match(/\.(jpg|jpeg|png)$/i)) {
                await processFile(fullPath, file);
            }
        }
    }
    console.log("✅ Optimization complete!");
}

async function processFile(dir, file) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    const sizeMB = stat.size / (1024 * 1024);

    if (sizeMB < 0.5) {
        console.log(`Skipping ${file} (${sizeMB.toFixed(2)} MB) - already small.`);
        return;
    }

    console.log(`📉 Optimizing ${file} (${sizeMB.toFixed(2)} MB)...`);

    const tempPath = filePath + '.temp';
    const ext = path.extname(file).toLowerCase();

    try {
        let pipeline = sharp(filePath);

        // Metadata retention is usually not needed for web and adds size.
        // We will resize if too big.
        const metadata = await pipeline.metadata();

        if (metadata.width > 1920) {
            console.log(`   Resizing width from ${metadata.width} to 1920...`);
            pipeline = pipeline.resize({ width: 1920, withoutEnlargement: true });
        }

        if (ext === '.png') {
            // PNG compression
            await pipeline.png({ quality: 80, compressionLevel: 9 }).toFile(tempPath);
        } else {
            // JPG compression
            await pipeline.jpeg({ quality: 80, mozjpeg: true }).toFile(tempPath);
        }

        // Check if size actually decreased
        const newStat = fs.statSync(tempPath);
        const newSizeMB = newStat.size / (1024 * 1024);

        if (newSizeMB < sizeMB) {
            fs.unlinkSync(filePath);
            fs.renameSync(tempPath, filePath);
            console.log(`   ✅ Reduced to ${newSizeMB.toFixed(2)} MB (${Math.round((1 - newSizeMB / sizeMB) * 100)}% savings)`);
        } else {
            console.log(`   ⚠️ Optimization didn't help (size increased or same). Keeping original.`);
            fs.unlinkSync(tempPath);
        }
    } catch (err) {
        console.error(`   ❌ Error processing ${file}:`, err);
        if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
    }
}

optimize();
