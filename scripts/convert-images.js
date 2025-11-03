import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const input = path.resolve(__dirname, '..', 'assets', 'bb9c668f-beb0-42e8-b6d9-be055222c9e9.jpg')
if (!fs.existsSync(input)) {
  console.error('Input file not found:', input)
  process.exit(1)
}

const outDir = path.resolve(__dirname, '..', 'assets')
const sizes = [1600, 800, 400]

try {
  for (const size of sizes) {
    const webpOut = path.join(outDir, `bg-${size}.webp`)
    const avifOut = path.join(outDir, `bg-${size}.avif`)

    console.log(`Generating ${webpOut} and ${avifOut}...`)

    await sharp(input).resize(size).webp({ quality: size >= 1600 ? 80 : 70 }).toFile(webpOut)
    await sharp(input).resize(size).avif({ quality: size >= 1600 ? 60 : 50 }).toFile(avifOut)
  }

  console.log('All conversions complete.')
} catch (err) {
  console.error('Conversion error:', err)
  process.exit(1)
}
