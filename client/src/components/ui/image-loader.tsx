import { useState, useEffect } from 'react';
import { getOptimizedImageUrl, generateSrcSet, getImageMimeType } from '@/lib/image-utils';

interface ImageLoaderProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  sizes?: string;
}

const ImageLoader = ({
  src,
  alt,
  className = '',
  width,
  height,
  sizes
}: ImageLoaderProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState('');

  useEffect(() => {
    // 이미지 미리 로드
    const img = new Image();
    img.src = getOptimizedImageUrl(src);
    img.onload = () => {
      setImageSrc(getOptimizedImageUrl(src));
      setIsLoaded(true);
    };
  }, [src]);

  // 이미지 URL에서 확장자 추출
  const getImageFormat = (url: string) => {
    return getImageMimeType(url);
  };

  // 이미지 타입 결정
  const imageType = getImageFormat(src);

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ aspectRatio: width && height ? `${width}/${height}` : 'auto' }}>
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-800 animate-pulse"></div>
      )}
      
      <picture>
        {/* WebP 형식 지원 (더 작은 파일 크기) */}
        <source srcSet={generateSrcSet(src)} type="image/webp" />
        
        {/* 원본 이미지 */}
        <img
          src={imageSrc || getOptimizedImageUrl(src, 640)}
          alt={alt}
          loading="lazy"
          width={width}
          height={height}
          sizes={sizes || "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"}
          className={`w-full h-full object-cover transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setIsLoaded(true)}
        />
      </picture>
    </div>
  );
};

export default ImageLoader;
