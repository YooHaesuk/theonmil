import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { fadeIn, slideInFromBottom } from '@/lib/animations';
import AlternativeEditor from './alternative-editor';


interface ProductFormData {
  name: string;
  nameKorean: string;
  description: string;
  price: number;
  category: 'regular' | 'custom' | 'gift';
  tags: string[];
  image?: string;
  images?: string[]; // 추가 상품 이미지들
  detailImage?: string; // 기존 이미지 (마이그레이션용)
  detailContent?: string; // 🚀 강화된 에디터 HTML 콘텐츠
}

interface UploadedImage {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
}

const ProductManagement = () => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 상태 관리
  const [mode, setMode] = useState<'list' | 'create' | 'edit'>('list');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    nameKorean: '',
    description: '',
    price: 0,
    category: 'regular',
    tags: [],
    image: '',
    images: [],
    detailImage: '',
    detailContent: '' // 🚀 강화된 에디터 초기값
  });

  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null);
  const [uploadedGalleryImages, setUploadedGalleryImages] = useState<UploadedImage[]>([]);
  const [uploadedDetailImage, setUploadedDetailImage] = useState<UploadedImage | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [uploadingDetail, setUploadingDetail] = useState(false);
  const [tagInput, setTagInput] = useState('');



  // 📝 강화된 에디터만 사용

  // 상품 목록 가져오기
  useEffect(() => {
    fetchProducts();
  }, []);



  const fetchProducts = async () => {
    try {
      console.log('📦 관리자: 상품 목록 가져오는 중...');
      const response = await fetch('/api/products');
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();

      setProducts(data);
      console.log('✅ 관리자: 상품 목록 가져오기 성공:', data.length, '개');
    } catch (error) {
      console.error('❌ 관리자: 상품 목록 가져오기 오류:', error);
      toast({
        title: "오류",
        description: "상품 목록을 불러오는데 실패했습니다.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // 모드 전환 함수들
  const handleCreateNew = () => {
    setMode('create');
    setSelectedProduct(null);
    setFormData({
      name: '',
      nameKorean: '',
      description: '',
      price: 0,
      category: 'regular',
      tags: [],
      image: '',
      images: [],
      detailImage: ''
    });
    setUploadedImage(null);
    setUploadedGalleryImages([]);
    setUploadedDetailImage(null);
    setTagInput('');
  };

  const handleEditProduct = (product: any) => {
    setMode('edit');
    setSelectedProduct(product);

    console.log('🔍 수정할 상품 데이터:', product);
    console.log('🔍 기존 detailContent:', product.detailContent);

    setFormData({
      name: product.name || '',
      nameKorean: product.nameKorean || '',
      description: product.description || '',
      price: product.price || 0,
      category: product.category || 'regular',
      tags: Array.isArray(product.tags) ? product.tags : [],
      image: product.image || '',
      images: Array.isArray(product.images) ? product.images : [],
      detailImage: product.detailImage || '',
      detailContent: product.detailContent || '' // ✅ 누락된 detailContent 추가!
    });
    setUploadedImage(product.image ? {
      public_id: extractPublicIdFromUrl(product.image),
      secure_url: product.image,
      width: 0,
      height: 0
    } : null);
    setUploadedGalleryImages(
      Array.isArray(product.images)
        ? product.images.map((url: string) => ({
          public_id: extractPublicIdFromUrl(url),
          secure_url: url,
          width: 0,
          height: 0
        }))
        : []
    );
    setUploadedDetailImage(product.detailImage ? {
      public_id: extractPublicIdFromUrl(product.detailImage),
      secure_url: product.detailImage,
      width: 0,
      height: 0
    } : null);
    setTagInput('');
  };

  const handleBackToList = () => {
    setMode('list');
    setSelectedProduct(null);
    fetchProducts(); // 목록 새로고침
  };

  // 🖼️ 이미지 업로드 핸들러
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 파일 크기 체크 (5MB 제한)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "오류",
        description: "파일 크기는 5MB 이하여야 합니다.",
        variant: "destructive"
      });
      return;
    }

    // 파일 타입 체크
    if (!file.type.startsWith('image/')) {
      toast({
        title: "오류",
        description: "이미지 파일만 업로드 가능합니다.",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/images/upload', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (result.success) {
        setUploadedImage(result.data);
        setFormData(prev => ({ ...prev, image: result.data.secure_url }));

        toast({
          title: "성공",
          description: "이미지가 성공적으로 업로드되었습니다.",
        });
      } else {
        throw new Error(result.message || '업로드 실패');
      }
    } catch (error) {
      console.error('이미지 업로드 오류:', error);
      toast({
        title: "오류",
        description: "이미지 업로드에 실패했습니다.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  // 🗑️ 이미지 삭제 핸들러
  const handleImageDelete = async () => {
    if (!uploadedImage) return;

    try {
      // public_id가 없으면 URL에서 추출
      const publicId = uploadedImage.public_id || extractPublicIdFromUrl(uploadedImage.secure_url);

      console.log('🗑️ 삭제할 대표이미지 public_id:', publicId);

      if (!publicId) {
        throw new Error('public_id를 찾을 수 없습니다.');
      }

      // URL 인코딩 (슬래시 때문에)
      const encodedPublicId = encodeURIComponent(publicId);

      const response = await fetch(`/api/images/${encodedPublicId}`, {
        method: 'DELETE'
      });

      const result = await response.json();

      if (result.success) {
        setUploadedImage(null);
        setFormData(prev => ({ ...prev, image: '' }));

        toast({
          title: "성공",
          description: "대표 이미지가 삭제되었습니다.",
        });
      } else {
        throw new Error(result.message || '삭제 실패');
      }
    } catch (error) {
      console.error('대표 이미지 삭제 오류:', error);
      toast({
        title: "오류",
        description: "대표 이미지 삭제에 실패했습니다.",
        variant: "destructive"
      });
    }
  };

  // 🖼️ 상품 이미지 업로드 핸들러
  const handleGalleryImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    // 최대 4개까지만 허용 (대표 이미지 + 상품 이미지 4개 = 총 5개)
    if (uploadedGalleryImages.length + files.length > 4) {
      toast({
        title: "오류",
        description: "상품 이미지는 최대 4개까지 업로드 가능합니다.",
        variant: "destructive"
      });
      return;
    }

    setUploadingGallery(true);

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        // 파일 크기 체크 (5MB 제한)
        if (file.size > 5 * 1024 * 1024) {
          throw new Error(`${file.name}: 파일 크기가 5MB를 초과합니다.`);
        }

        // 파일 타입 체크
        if (!file.type.startsWith('image/')) {
          throw new Error(`${file.name}: 이미지 파일만 업로드 가능합니다.`);
        }

        const formData = new FormData();
        formData.append('image', file);

        const response = await fetch('/api/images/upload', {
          method: 'POST',
          body: formData
        });

        const result = await response.json();
        if (!result.success) {
          throw new Error(`${file.name}: 업로드 실패`);
        }

        return result.data;
      });

      const uploadedImages = await Promise.all(uploadPromises);

      setUploadedGalleryImages(prev => [...prev, ...uploadedImages]);
      setFormData(prev => ({
        ...prev,
        images: [...(prev.images || []), ...uploadedImages.map(img => img.secure_url)]
      }));

      toast({
        title: "성공",
        description: `${uploadedImages.length}개의 상품 이미지가 업로드되었습니다.`,
      });

    } catch (error: any) {
      toast({
        title: "오류",
        description: error.message || "이미지 업로드 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    } finally {
      setUploadingGallery(false);
      // 파일 입력 초기화
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  // 🗑️ 상품 이미지 삭제 핸들러
  const handleGalleryImageDelete = async (index: number) => {
    const imageToDelete = uploadedGalleryImages[index];
    if (!imageToDelete) return;

    try {
      const publicId = imageToDelete.public_id || extractPublicIdFromUrl(imageToDelete.secure_url);
      const encodedPublicId = encodeURIComponent(publicId);

      const response = await fetch(`/api/images/${encodedPublicId}`, {
        method: 'DELETE'
      });

      const result = await response.json();

      if (result.success) {
        setUploadedGalleryImages(prev => prev.filter((_, i) => i !== index));
        setFormData(prev => ({
          ...prev,
          images: prev.images?.filter((_, i) => i !== index) || []
        }));

        toast({
          title: "성공",
          description: "상품 이미지가 삭제되었습니다.",
        });
      } else {
        throw new Error(result.error || '삭제 실패');
      }
    } catch (error: any) {
      toast({
        title: "오류",
        description: error.message || "이미지 삭제 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    }
  };

  // 🖼️ 상세 이미지 업로드 핸들러
  const handleDetailImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 파일 크기 체크 (5MB 제한)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "오류",
        description: "파일 크기는 5MB 이하여야 합니다.",
        variant: "destructive"
      });
      return;
    }

    // 파일 타입 체크
    if (!file.type.startsWith('image/')) {
      toast({
        title: "오류",
        description: "이미지 파일만 업로드 가능합니다.",
        variant: "destructive"
      });
      return;
    }

    setUploadingDetail(true);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/images/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setUploadedDetailImage(result.data);
        setFormData(prev => ({ ...prev, detailImage: result.data.secure_url }));

        toast({
          title: "성공",
          description: "상세페이지 이미지가 성공적으로 업로드되었습니다.",
        });
      } else {
        throw new Error(result.message || '업로드 실패');
      }
    } catch (error) {
      console.error('상세 이미지 업로드 오류:', error);
      toast({
        title: "오류",
        description: "상세페이지 이미지 업로드에 실패했습니다.",
        variant: "destructive"
      });
    } finally {
      setUploadingDetail(false);
    }
  };

  // Cloudinary URL에서 public_id 추출
  const extractPublicIdFromUrl = (url: string): string => {
    try {
      // URL 예시: https://res.cloudinary.com/dnu0dq7hs/image/upload/v1752349376/theonmil-bakery/products/product_1752349374637.webp
      const parts = url.split('/');
      const filename = parts[parts.length - 1]; // product_1752349374637.webp
      const publicId = filename.split('.')[0]; // product_1752349374637
      return `theonmil-bakery/products/${publicId}`;
    } catch (error) {
      console.error('public_id 추출 오류:', error);
      return '';
    }
  };

  // 상세 이미지 삭제
  const handleDetailImageDelete = async () => {
    if (!uploadedDetailImage) return;

    try {
      // public_id가 없으면 URL에서 추출
      const publicId = uploadedDetailImage.public_id || extractPublicIdFromUrl(uploadedDetailImage.secure_url);

      console.log('🗑️ 삭제할 public_id:', publicId);

      // URL 인코딩 (슬래시 때문에)
      const encodedPublicId = encodeURIComponent(publicId);

      const response = await fetch(`/api/images/${encodedPublicId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        setUploadedDetailImage(null);
        setFormData(prev => ({ ...prev, detailImage: '' }));

        toast({
          title: "성공",
          description: "상세페이지 이미지가 삭제되었습니다.",
        });
      } else {
        throw new Error(result.message || '삭제 실패');
      }
    } catch (error) {
      console.error('상세 이미지 삭제 오류:', error);
      toast({
        title: "오류",
        description: "상세페이지 이미지 삭제에 실패했습니다.",
        variant: "destructive"
      });
    }
  };

  // 태그 추가
  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim()) && formData.tags.length < 5) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    } else if (formData.tags.length >= 5) {
      toast({
        title: "태그 제한",
        description: "태그는 최대 5개까지만 추가할 수 있습니다.",
        variant: "destructive"
      });
    }
  };

  // 태그 제거
  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // 폼 제출 (등록/수정)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nameKorean || !formData.description || !formData.price || !formData.image) {
      toast({
        title: "오류",
        description: "모든 필수 필드를 입력해주세요.",
        variant: "destructive"
      });
      return;
    }

    try {
      const isEdit = mode === 'edit' && selectedProduct;
      console.log(`📦 상품 ${isEdit ? '수정' : '등록'} 시작:`, formData);

      if (isEdit) {
        // 상품 수정
        const response = await fetch(`/api/products/${selectedProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            nameKorean: formData.nameKorean,
            description: formData.description,
            price: formData.price,
            category: formData.category,
            tags: formData.tags,
            image: formData.image,
            images: formData.images,
            detailImage: formData.detailImage,
            detailContent: formData.detailContent,
            isBestseller: false,
            isNew: false,
            isPopular: false
          })
        });
        if (!response.ok) throw new Error('Failed to update product');
      } else {
        // 상품 등록
        const response = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            nameKorean: formData.nameKorean,
            description: formData.description,
            price: formData.price,
            category: formData.category,
            tags: formData.tags,
            image: formData.image,
            images: formData.images,
            detailImage: formData.detailImage,
            detailContent: formData.detailContent,
            isBestseller: false,
            isNew: false,
            isPopular: false
          })
        });
        if (!response.ok) throw new Error('Failed to create product');
      }

      toast({
        title: "성공",
        description: `상품이 성공적으로 ${isEdit ? '수정' : '등록'}되었습니다.`,
      });

      console.log(`✅ 상품 ${isEdit ? '수정' : '등록'} 완료`);

      // 목록으로 돌아가기
      handleBackToList();
    } catch (error) {
      console.error(`❌ 상품 ${mode === 'edit' ? '수정' : '등록'} 오류:`, error);
      toast({
        title: "오류",
        description: `상품 ${mode === 'edit' ? '수정' : '등록'}에 실패했습니다.`,
        variant: "destructive"
      });
    }
  };

  // 상품 목록 렌더링
  const renderProductList = () => (
    <motion.div variants={fadeIn} className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">상품 관리</h2>
        <div className="flex space-x-3">


          <button
            onClick={handleCreateNew}
            className="bg-gradient-to-r from-[#A78BFA] to-[#EC4899] text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            <i className="fa-solid fa-plus mr-2"></i>
            상품 등록
          </button>
        </div>
      </div>



      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A78BFA] mx-auto mb-4"></div>
          <p className="text-gray-400">상품 목록을 불러오는 중...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <motion.div
              key={product.id}
              variants={slideInFromBottom}
              className="bg-[#0A0A0A] rounded-lg border border-[#333333] overflow-hidden hover:border-[#A78BFA] transition-colors cursor-pointer"
              onClick={() => handleEditProduct(product)}
            >
              <div className="aspect-video bg-[#222222] relative">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.nameKorean}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <i className="fa-solid fa-image text-gray-500 text-3xl"></i>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{product.nameKorean}</h3>
                <p className="text-gray-400 text-sm mb-3 line-clamp-2">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-[#A78BFA] font-bold">{product.price?.toLocaleString()}원</span>
                  <span className="text-xs bg-[#333333] px-2 py-1 rounded">{product.category}</span>
                </div>
                {Array.isArray(product.tags) && product.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {product.tags.slice(0, 3).map((tag: string, index: number) => (
                      <span key={index} className="text-xs bg-[#222222] text-gray-300 px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                    {product.tags.length > 3 && (
                      <span className="text-xs text-gray-500">+{product.tags.length - 3}</span>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );

  return (
    <motion.div
      variants={fadeIn}
      className="bg-[#111111] rounded-lg p-6 border border-[#222222]"
    >
      {mode === 'list' ? renderProductList() : (
        <div>
          <div className="flex items-center mb-6">
            <button
              onClick={handleBackToList}
              className="mr-4 text-gray-400 hover:text-white transition-colors"
            >
              <i className="fa-solid fa-arrow-left text-xl"></i>
            </button>
            <h2 className="text-2xl font-bold">
              {mode === 'create' ? '상품 등록' : '상품 수정'}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 이미지 업로드 */}
            <motion.div variants={slideInFromBottom} className="space-y-4">
              <label className="block text-sm font-medium text-gray-300">
                대표 이미지 *
              </label>

              {uploadedImage ? (
                <div className="relative">
                  <img
                    src={uploadedImage.secure_url}
                    alt="업로드된 이미지"
                    className="w-full max-w-md h-64 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={handleImageDelete}
                    className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition-colors"
                  >
                    <i className="fa-solid fa-trash text-sm"></i>
                  </button>
                  <div className="mt-2 text-sm text-gray-400">
                    크기: {uploadedImage.width} × {uploadedImage.height}px
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-[#333333] rounded-lg p-8 text-center">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors"
                  >
                    {uploading ? (
                      <>
                        <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                        업로드 중...
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-cloud-upload-alt mr-2"></i>
                        이미지 선택
                      </>
                    )}
                  </button>
                  <p className="text-gray-400 text-sm mt-2">
                    JPG, PNG, GIF 파일 (최대 5MB)
                  </p>
                </div>
              )}
            </motion.div>

            {/* 🖼️ 상품 이미지 업로드 */}
            <motion.div variants={slideInFromBottom}>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                상품 이미지
                <span className="text-xs text-gray-500 ml-2">
                  (선택사항 - 상품 상세페이지 썸네일용, 최대 4개)
                </span>
              </label>

              {/* 상품 이미지 목록 */}
              {uploadedGalleryImages.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {uploadedGalleryImages.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image.secure_url}
                        alt={`상품 이미지 ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border border-[#333333]"
                      />
                      <button
                        type="button"
                        onClick={() => handleGalleryImageDelete(index)}
                        className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white w-6 h-6 rounded-full flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
                        title="이미지 삭제"
                      >
                        <i className="fa-solid fa-times text-xs"></i>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* 상품 이미지 업로드 버튼 */}
              {uploadedGalleryImages.length < 4 && (
                <div className="border-2 border-dashed border-[#333333] rounded-lg p-6 text-center hover:border-[#555555] transition-colors">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleGalleryImageUpload}
                    className="hidden"
                    id="gallery-upload-input"
                  />
                  <div className="space-y-2">
                    <i className="fa-solid fa-images text-4xl text-gray-500"></i>
                    <p className="text-gray-400">
                      상품 이미지를 업로드하세요 ({uploadedGalleryImages.length}/4)
                    </p>
                    <p className="text-xs text-gray-500">
                      여러 파일 선택 가능 | 각 파일 최대 5MB
                    </p>
                    <button
                      type="button"
                      onClick={() => document.getElementById('gallery-upload-input')?.click()}
                      disabled={uploadingGallery}
                      className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      {uploadingGallery ? (
                        <>
                          <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                          업로드 중...
                        </>
                      ) : (
                        <>
                          <i className="fa-solid fa-upload mr-2"></i>
                          상품 이미지 선택
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>

            {/* 상품 정보 입력 필드들 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  영문명
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-[#1A1A1A] border border-[#333333] rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
                  placeholder="Classic Croissant"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  한글명 *
                </label>
                <input
                  type="text"
                  value={formData.nameKorean}
                  onChange={(e) => setFormData(prev => ({ ...prev, nameKorean: e.target.value }))}
                  className="w-full bg-[#1A1A1A] border border-[#333333] rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
                  placeholder="클래식 크로와상"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                상품 설명 *
                <span className="text-xs text-gray-500 ml-2">
                  ({formData.description.length}/80자 - 간단하고 명확하게 작성해주세요)
                </span>
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => {
                  if (e.target.value.length <= 80) {
                    setFormData(prev => ({ ...prev, description: e.target.value }));
                  }
                }}
                className={`w-full bg-[#1A1A1A] border rounded-lg px-4 py-3 text-white focus:outline-none transition-colors ${formData.description.length > 70
                    ? 'border-yellow-500 focus:border-yellow-400'
                    : formData.description.length > 60
                      ? 'border-orange-500 focus:border-orange-400'
                      : 'border-[#333333] focus:border-purple-500'
                  }`}
                placeholder="예: 72시간 저온 발효로 완성한 바삭한 겉면과 부드러운 속 (80자 이내)"
                required
              />
              {formData.description.length > 60 && (
                <p className={`text-xs mt-1 ${formData.description.length > 70 ? 'text-yellow-400' : 'text-orange-400'
                  }`}>
                  {formData.description.length > 70
                    ? '⚠️ 거의 다 찼습니다! 간결하게 작성해주세요.'
                    : '💡 조금 더 간결하게 작성하면 좋겠어요.'}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  가격 (원) *
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                  className="w-full bg-[#1A1A1A] border border-[#333333] rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
                  placeholder="4800"
                  min="0"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  카테고리 *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as any }))}
                  className="w-full bg-[#1A1A1A] border border-[#333333] rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
                  required
                >
                  <option value="regular">상시 운영 제품</option>
                  <option value="custom">주문 제작 제품</option>
                  <option value="gift">기념일 선물 세트</option>
                </select>
              </div>
            </div>

            {/* 태그 입력 */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                태그
                <span className="text-xs text-gray-500 ml-2">
                  ({formData.tags.length}/5개 - 상품의 특징을 간단히 표현해주세요)
                </span>
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  disabled={formData.tags.length >= 5}
                  className={`flex-1 bg-[#1A1A1A] border rounded-lg px-4 py-2 text-white focus:outline-none transition-colors ${formData.tags.length >= 5
                      ? 'border-gray-600 bg-gray-800 cursor-not-allowed'
                      : formData.tags.length >= 4
                        ? 'border-yellow-500 focus:border-yellow-400'
                        : 'border-[#333333] focus:border-purple-500'
                    }`}
                  placeholder={formData.tags.length >= 5 ? "태그가 가득 찼습니다" : "예: 바삭함, 부드러움, 아침식사 (엔터로 추가)"}
                />
                <button
                  type="button"
                  onClick={addTag}
                  disabled={formData.tags.length >= 5 || !tagInput.trim()}
                  className={`px-4 py-2 rounded-lg transition-colors ${formData.tags.length >= 5 || !tagInput.trim()
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      : 'bg-purple-600 hover:bg-purple-700 text-white'
                    }`}
                >
                  추가
                </button>
              </div>

              {/* 태그 개수 안내 */}
              {formData.tags.length >= 4 && (
                <p className={`text-xs mb-2 ${formData.tags.length >= 5 ? 'text-red-400' : 'text-yellow-400'
                  }`}>
                  {formData.tags.length >= 5
                    ? '🚫 태그가 가득 찼습니다. 기존 태그를 삭제하고 새로 추가하세요.'
                    : '⚠️ 태그를 1개 더 추가할 수 있습니다.'}
                </p>
              )}

              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-[#333333] hover:bg-[#444444] text-white px-3 py-1 rounded-full text-sm flex items-center gap-2 transition-colors"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-full w-4 h-4 flex items-center justify-center text-xs"
                      title="태그 삭제"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* 📄 상세페이지 콘텐츠 에디터 */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                상세페이지 콘텐츠
                <span className="text-xs text-gray-500 ml-2">
                  (선택사항 - 상품 상세페이지에 표시될 내용)
                </span>
                <div className="text-xs text-green-400 mt-1 bg-green-400/10 p-2 rounded border border-green-400/20">
                  🚀 <strong>강화된 에디터:</strong> 텍스트와 이미지를 자유롭게 편집하여 상세페이지를 구성하세요
                </div>
              </label>

              {/* 🚀 강화된 에디터 */}
              <AlternativeEditor
                value={formData.detailContent || ''}
                onChange={(value) => setFormData(prev => ({ ...prev, detailContent: value }))}
                placeholder="상품 상세 정보를 입력하세요. 툴바 버튼으로 스타일을 적용하거나 HTML을 직접 편집하세요."
                height="500px"
              />
            </div>

            {/* 제출 버튼 */}
            <motion.button
              type="submit"
              variants={slideInFromBottom}
              className="w-full bg-gradient-to-r from-[#A78BFA] to-[#EC4899] text-white py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/20 transition-all"
            >
              {mode === 'create' ? '상품 등록' : '상품 수정'}
            </motion.button>
          </form>
        </div>
      )}
    </motion.div>
  );
};

export default ProductManagement;
