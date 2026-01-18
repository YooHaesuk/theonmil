import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourceImage = path.join(__dirname, '..', 'theonmil-pabicon.png');
const publicDir = path.join(__dirname, '..', 'client', 'public');

// 파비콘 크기 정의
const sizes = [
  { size: 16, name: 'favicon-16x16.png' },
  { size: 32, name: 'favicon-32x32.png' },
  { size: 48, name: 'favicon-48x48.png' },
  { size: 64, name: 'favicon-64x64.png' },
  { size: 96, name: 'favicon-96x96.png' },
  { size: 128, name: 'favicon-128x128.png' },
  { size: 192, name: 'android-chrome-192x192.png' },
  { size: 512, name: 'android-chrome-512x512.png' },
  { size: 180, name: 'apple-touch-icon.png' },
  { size: 152, name: 'apple-touch-icon-152x152.png' },
  { size: 144, name: 'apple-touch-icon-144x144.png' },
  { size: 120, name: 'apple-touch-icon-120x120.png' },
  { size: 114, name: 'apple-touch-icon-114x114.png' },
  { size: 76, name: 'apple-touch-icon-76x76.png' },
  { size: 72, name: 'apple-touch-icon-72x72.png' },
  { size: 60, name: 'apple-touch-icon-60x60.png' },
  { size: 57, name: 'apple-touch-icon-57x57.png' },
];

async function generateFavicons() {
  console.log('🎨 파비콘 생성 시작...\n');

  // 소스 이미지 확인
  if (!fs.existsSync(sourceImage)) {
    console.error('❌ 소스 이미지를 찾을 수 없습니다:', sourceImage);
    process.exit(1);
  }

  // public 디렉토리 확인
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  try {
    // PNG 파비콘들 생성
    for (const { size, name } of sizes) {
      const outputPath = path.join(publicDir, name);
      await sharp(sourceImage)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 }
        })
        .png()
        .toFile(outputPath);
      console.log(`✅ 생성 완료: ${name} (${size}x${size})`);
    }

    // favicon.ico 생성 (16x16, 32x32, 48x48 포함)
    console.log('\n🔧 favicon.ico 생성 중...');
    const icoPath = path.join(publicDir, 'favicon.ico');
    
    // ICO는 여러 크기를 포함해야 하므로 32x32를 기본으로 사용
    await sharp(sourceImage)
      .resize(32, 32, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .png()
      .toFile(icoPath);
    console.log('✅ 생성 완료: favicon.ico');

    // SVG 파비콘 복사 (있다면)
    const svgSource = path.join(__dirname, '..', 'theonmil-pabicon.svg');
    if (fs.existsSync(svgSource)) {
      const svgDest = path.join(publicDir, 'favicon.svg');
      fs.copyFileSync(svgSource, svgDest);
      console.log('✅ 복사 완료: favicon.svg');
    }

    console.log('\n🎉 모든 파비콘 생성 완료!');
    console.log(`📁 저장 위치: ${publicDir}`);
    
  } catch (error) {
    console.error('❌ 파비콘 생성 중 오류 발생:', error);
    process.exit(1);
  }
}

generateFavicons();

