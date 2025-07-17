import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

// 환경변수 로드
dotenv.config();

// Cloudinary 설정
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 설정 확인 함수
export const checkCloudinaryConfig = () => {
  console.log('🔍 Cloudinary 설정 확인:');
  console.log('- Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME ? '✅ 설정됨' : '❌ 없음');
  console.log('- API Key:', process.env.CLOUDINARY_API_KEY ? '✅ 설정됨' : '❌ 없음');
  console.log('- API Secret:', process.env.CLOUDINARY_API_SECRET ? '✅ 설정됨' : '❌ 없음');
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
    console.log('🔍 파일 타입:', typeof file);
    console.log('🔍 파일 길이:', typeof file === 'string' ? file.length : 'Buffer');

    const uploadOptions = {
      folder: options.folder || 'theonmil-bakery',
      public_id: options.public_id,
      transformation: options.transformation || [
        { quality: 'auto', fetch_format: 'auto' },
        { width: 1200, height: 1200, crop: 'limit' }
      ],
      ...options
    };

    console.log('🔍 업로드 옵션:', uploadOptions);

    const result = await cloudinary.uploader.upload(file as string, uploadOptions);

    console.log('✅ 이미지 업로드 성공:', result.public_id);
    console.log('🔗 이미지 URL:', result.secure_url);

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
    console.error('❌ 이미지 업로드 실패 상세:', error);
    console.error('❌ 에러 타입:', error instanceof Error ? error.constructor.name : typeof error);
    console.error('❌ 에러 메시지:', error instanceof Error ? error.message : String(error));
    throw error;
  }
};

// 이미지 삭제 함수
export const deleteImage = async (public_id: string) => {
  try {
    console.log('🗑️ Cloudinary 이미지 삭제 시작:', public_id);
    
    const result = await cloudinary.uploader.destroy(public_id);
    
    if (result.result === 'ok') {
      console.log('✅ 이미지 삭제 성공:', public_id);
      return { success: true, result: result.result };
    } else {
      console.log('⚠️ 이미지 삭제 실패:', result.result);
      return { success: false, result: result.result };
    }
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

    const url = cloudinary.url(public_id, {
      transformation: transformations.length > 0 ? transformations : undefined,
      secure: true
    });

    return url;
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
    console.log(`📤 ${files.length}개 이미지 일괄 업로드 시작...`);
    
    const uploadPromises = files.map((file, index) => 
      uploadImage(file, {
        folder: options.folder,
        public_id: options.prefix ? `${options.prefix}_${index + 1}` : undefined
      })
    );

    const results = await Promise.all(uploadPromises);
    
    console.log(`✅ ${results.length}개 이미지 업로드 완료`);
    
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
