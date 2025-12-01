import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const assetsDir = path.join(__dirname, '../assets');
const srcAssetsDir = path.join(__dirname, '../src/assets');

// Create src/assets if it doesn't exist
if (!fs.existsSync(srcAssetsDir)) {
  fs.mkdirSync(srcAssetsDir, { recursive: true });
}

const imagesToConvert = [
  'sunset-coast-drive.jpg',
  'Avis.png',
  'image.png'
];

async function convertImages() {
  for (const filename of imagesToConvert) {
    const inputPath = path.join(assetsDir, filename);
    
    if (!fs.existsSync(inputPath)) {
      console.log(`Skipping ${filename} - file not found`);
      continue;
    }

    const baseName = path.parse(filename).name;
    const webpPath = path.join(srcAssetsDir, `${baseName}.webp`);

    try {
      await sharp(inputPath)
        .webp({ quality: 85 })
        .toFile(webpPath);
      
      console.log(`✓ Converted ${filename} to ${baseName}.webp`);
    } catch (error) {
      console.error(`✗ Error converting ${filename}:`, error.message);
    }
  }

  console.log('Image conversion complete!');
}

convertImages();
