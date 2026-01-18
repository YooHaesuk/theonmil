import { v2 as cloudinary } from 'cloudinary';
import { getEnv } from './lib/env';

// Cloudinary 설정
cloudinary.config({
  cloud_name: getEnv("CLOUDINARY_CLOUD_NAME"),
  api_key: getEnv("CLOUDINARY_API_KEY"),
  api_secret: getEnv("CLOUDINARY_API_SECRET"),
});

// 설정 확인 함수 (선택적)
export const checkCloudinaryConfig = () => {
  const cloudName = getEnv("CLOUDINARY_CLOUD_NAME");
  const apiKey = getEnv("CLOUDINARY_API_KEY");
  const apiSecret = getEnv("CLOUDINARY_API_SECRET");

  if (!cloudName || !apiKey || !apiSecret) {
    console.log('⚠️  Cloudinary 미설정 (로컬 개발 시 필요 시 설정)');
    return false;
  }

  console.log('✅ Cloudinary 설정 완료');
  return true;
};

// 이미지 업로드 함수
export const uploadImage = async (
  file: Buffer | string,
  options: {
    folder?: string;
    public_id?: string;
    transformation?: any;
  } = {}
) => {
  try {
    console.log('📤 Cloudinary 이미지 업로드 시작...');

    const uploadOptions = {
      folder: options.folder || 'theonmil-bakery',
      public_id: options.public_id,
      transformation: options.transformation || [
        { quality: 'auto', fetch_format: 'auto' },
        { width: 1200, height: 1200, crop: 'limit' }
      ],
      ...options
    };

    const result = await cloudinary.uploader.upload(file as string, uploadOptions);

    return {
      success: true,
      public_id: result.public_id,
      secure_url: result.secure_url,
      url: result.url,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes
    };
  } catch (error) {
    console.error('❌ 이미지 업로드 실패:', error);
    throw error;
  }
};

// 이미지 삭제 함수
export const deleteImage = async (public_id: string) => {
  try {
    const result = await cloudinary.uploader.destroy(public_id);
    return { success: result.result === 'ok', result: result.result };
  } catch (error) {
    console.error('❌ 이미지 삭제 오류:', error);
    throw error;
  }
};

// 이미지 URL 생성 함수 (변환 옵션 포함)
export const getImageUrl = (
  public_id: string,
  options: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: string;
    format?: string;
  } = {}
) => {
  try {
    const transformations = [];

    if (options.width || options.height) {
      transformations.push({
        width: options.width,
        height: options.height,
        crop: options.crop || 'fill'
      });
    }

    if (options.quality) {
      transformations.push({ quality: options.quality });
    }

    if (options.format) {
      transformations.push({ fetch_format: options.format });
    }

    return cloudinary.url(public_id, {
      transformation: transformations.length > 0 ? transformations : undefined,
      secure: true
    });
  } catch (error) {
    console.error('❌ 이미지 URL 생성 오류:', error);
    return null;
  }
};

// 여러 이미지 업로드 함수
export const uploadMultipleImages = async (
  files: (Buffer | string)[],
  options: {
    folder?: string;
    prefix?: string;
  } = {}
) => {
  try {
    const uploadPromises = files.map((file, index) =>
      uploadImage(file, {
        folder: options.folder,
        public_id: options.prefix ? `${options.prefix}_${index + 1}` : undefined
      })
    );

    const results = await Promise.all(uploadPromises);

    return {
      success: true,
      results,
      count: results.length
    };
  } catch (error) {
    console.error('❌ 일괄 이미지 업로드 실패:', error);
    throw error;
  }
};

export default cloudinary;
