import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const SRC_IMAGES_DIR = path.join(projectRoot, 'src', 'assets', 'images');
const PUBLIC_IMAGES_DIR = path.join(projectRoot, 'public', 'images');
const OPTIMIZED_OUTPUT_DIR = path.join(projectRoot, 'public', 'optimized');
const MANIFEST_PATH = path.join(projectRoot, 'src', 'data', 'imageManifest.json');
const MANIFEST_TS_PATH = path.join(projectRoot, 'src', 'data', 'imageManifest.ts');

const TARGET_WIDTHS = [400, 800, 1200, 1600];

async function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function generateBlurLQIP(sharpInstance, isPng) {
  const buffer = await sharpInstance
    .resize(16, null, { fit: 'inside' })
    .toFormat(isPng ? 'png' : 'jpeg', { quality: 20 })
    .toBuffer();
  const mime = isPng ? 'image/png' : 'image/jpeg';
  return `data:${mime};base64,${buffer.toString('base64')}`;
}

async function getDominantColor(sharpInstance) {
  try {
    const { stats } = await sharpInstance.stats();
    if (stats && stats.channels) {
      const r = Math.round(stats.channels[0].mean);
      const g = Math.round(stats.channels[1].mean);
      const b = Math.round(stats.channels[2].mean);
      return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
    }
  } catch (e) {}
  return '#FAF2F0';
}

async function processImage(filename, inputPath) {
  const ext = path.extname(filename).toLowerCase();
  const nameWithoutExt = path.basename(filename, ext);
  const isPng = ext === '.png';

  const fileStats = fs.statSync(inputPath);
  const subDir = path.join(OPTIMIZED_OUTPUT_DIR, nameWithoutExt);
  await ensureDir(subDir);

  const rawMetadata = await sharp(inputPath).metadata();
  const origWidth = rawMetadata.width;
  const origHeight = rawMetadata.height;
  const aspectRatio = +(origWidth / origHeight).toFixed(4);

  const sharpBase = sharp(inputPath);
  const blurDataURL = await generateBlurLQIP(sharpBase.clone(), isPng);
  const dominantColor = await getDominantColor(sharpBase.clone());

  const widthsToGenerate = TARGET_WIDTHS.filter((w) => w <= origWidth + 100);
  if (widthsToGenerate.length === 0 || !widthsToGenerate.includes(origWidth)) {
    widthsToGenerate.push(origWidth);
  }
  widthsToGenerate.sort((a, b) => a - b);

  const avifSrcSetParts = [];
  const webpSrcSetParts = [];
  const fallbackSrcSetParts = [];

  let primaryFallbackSrc = '';

  for (const w of widthsToGenerate) {
    const fallbackExt = isPng ? 'png' : 'jpg';
    const avifFile = `${nameWithoutExt}-${w}w.avif`;
    const webpFile = `${nameWithoutExt}-${w}w.webp`;
    const fallbackFile = `${nameWithoutExt}-${w}w.${fallbackExt}`;

    const avifPath = path.join(subDir, avifFile);
    const webpPath = path.join(subDir, webpFile);
    const fallbackPath = path.join(subDir, fallbackFile);

    // Cache check: skip if all exist and are newer than source file
    const needAvif = !fs.existsSync(avifPath) || fs.statSync(avifPath).mtimeMs < fileStats.mtimeMs;
    const needWebp = !fs.existsSync(webpPath) || fs.statSync(webpPath).mtimeMs < fileStats.mtimeMs;
    const needFallback = !fs.existsSync(fallbackPath) || fs.statSync(fallbackPath).mtimeMs < fileStats.mtimeMs;

    if (needAvif || needWebp || needFallback) {
      console.log(`  Encoding ${filename} at ${w}w...`);
      const resized = sharpBase.clone().resize({ width: w, withoutEnlargement: true });

      if (needAvif) {
        await resized.clone().avif({ quality: 78, chromaSubsampling: '4:2:0', effort: 4 }).toFile(avifPath);
      }
      if (needWebp) {
        await resized.clone().webp({ quality: 80, effort: 4 }).toFile(webpPath);
      }
      if (needFallback) {
        if (isPng) {
          await resized.clone().png({ quality: 82, compressionLevel: 8 }).toFile(fallbackPath);
        } else {
          await resized.clone().jpeg({ quality: 80, mozjpeg: true }).toFile(fallbackPath);
        }
      }
    }

    avifSrcSetParts.push(`/optimized/${nameWithoutExt}/${avifFile} ${w}w`);
    webpSrcSetParts.push(`/optimized/${nameWithoutExt}/${webpFile} ${w}w`);
    fallbackSrcSetParts.push(`/optimized/${nameWithoutExt}/${fallbackFile} ${w}w`);

    if (w === 800 || !primaryFallbackSrc) {
      primaryFallbackSrc = `/optimized/${nameWithoutExt}/${fallbackFile}`;
    }
  }

  return {
    key: nameWithoutExt,
    originalFilename: filename,
    originalSizeKB: +(fileStats.size / 1024).toFixed(1),
    width: origWidth,
    height: origHeight,
    aspectRatio,
    blurDataURL,
    dominantColor,
    avifSrcSet: avifSrcSetParts.join(', '),
    webpSrcSet: webpSrcSetParts.join(', '),
    fallbackSrcSet: fallbackSrcSetParts.join(', '),
    fallbackSrc: primaryFallbackSrc,
  };
}

async function main() {
  await ensureDir(OPTIMIZED_OUTPUT_DIR);

  const manifest = {};
  const allImagesToProcess = [];

  if (fs.existsSync(SRC_IMAGES_DIR)) {
    const files = fs.readdirSync(SRC_IMAGES_DIR);
    for (const f of files) {
      if (f.match(/\.(jpg|jpeg|png)$/i)) {
        allImagesToProcess.push({ filename: f, path: path.join(SRC_IMAGES_DIR, f) });
      }
    }
  }

  if (fs.existsSync(PUBLIC_IMAGES_DIR)) {
    const files = fs.readdirSync(PUBLIC_IMAGES_DIR);
    for (const f of files) {
      if (f.match(/\.(jpg|jpeg|png)$/i)) {
        if (!allImagesToProcess.some((item) => item.filename === f)) {
          allImagesToProcess.push({ filename: f, path: path.join(PUBLIC_IMAGES_DIR, f) });
        }
      }
    }
  }

  console.log(`Checking ${allImagesToProcess.length} images...`);

  for (const item of allImagesToProcess) {
    try {
      const metadata = await processImage(item.filename, item.path);
      manifest[metadata.key] = metadata;
      manifest[item.filename] = metadata;
    } catch (err) {
      console.error(`Error processing ${item.filename}:`, err);
    }
  }

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), 'utf-8');
  fs.writeFileSync(
    MANIFEST_TS_PATH,
    `export interface ImageMeta {
  key: string;
  originalFilename: string;
  originalSizeKB: number;
  width: number;
  height: number;
  aspectRatio: number;
  blurDataURL: string;
  dominantColor: string;
  avifSrcSet: string;
  webpSrcSet: string;
  fallbackSrcSet: string;
  fallbackSrc: string;
}

export const imageManifest: Record<string, ImageMeta> = ${JSON.stringify(manifest, null, 2)};
export default imageManifest;
`,
    'utf-8'
  );

  console.log('Image optimization & manifest update complete!');
}

main().catch(console.error);
