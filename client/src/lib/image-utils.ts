/**
 * 이미지 최적화를 위한 유틸리티 함수 모음
 */

/**
 * 모바일 화면에 맞는 이미지 URL 생성
 * @param originalUrl 원본 이미지 URL
 * @param width 원하는 너비
 * @returns 최적화된 이미지 URL
 */
export function getOptimizedImageUrl(originalUrl: string, width: number = 640): string {
  // 이미 최적화된 URL이거나 외부 URL인 경우 그대로 반환
  if (originalUrl.includes('?w=') || originalUrl.startsWith('http')) {
    return originalUrl;
  }
  
  // 이미지 크기 파라미터 추가
  return `${originalUrl}?w=${width}&q=75&format=webp`;
}

/**
 * 이미지 사전 로딩 함수
 * @param urls 사전 로딩할 이미지 URL 배열
 */
export function preloadImages(urls: string[]): void {
  urls.forEach(url => {
    const img = new Image();
    img.src = url;
  });
}

/**
 * 이미지 크기에 따른 srcset 문자열 생성
 * @param url 원본 이미지 URL
 * @returns srcset 문자열
 */
export function generateSrcSet(url: string): string {
  const widths = [320, 640, 768, 1024, 1280];
  
  return widths
    .map(width => `${getOptimizedImageUrl(url, width)} ${width}w`)
    .join(', ');
}

/**
 * 이미지 로딩 상태 관리를 위한 함수
 * @param url 이미지 URL
 * @returns 로딩 상태 객체
 */
export function checkImageLoaded(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
}

/**
 * 이미지 파일 확장자에 따른 MIME 타입 반환
 * @param url 이미지 URL
 * @returns MIME 타입 문자열
 */
export function getImageMimeType(url: string): string {
  const extension = url.split('.').pop()?.toLowerCase();
  
  switch (extension) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'webp':
      return 'image/webp';
    case 'avif':
      return 'image/avif';
    case 'gif':
      return 'image/gif';
    default:
      return 'image/jpeg';
  }
}
