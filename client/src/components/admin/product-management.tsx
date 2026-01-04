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

    // 최대 5개까지만 허용 (대표 이미지 + 상품 이미지 5개 = 총 6개)
    if (uploadedGalleryImages.length + files.length > 5) {
      toast({
        title: "오류",
        description: "상품 이미지는 최대 5개까지 업로드 가능합니다.",
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
  // 이미지 URL에서 public_id(또는 R2 key) 추출
  const extractPublicIdFromUrl = (url: string): string => {
    if (!url) return '';
    try {
      // Cloudinary와 R2 모두 대응
      const parts = url.split('/');
      const filename = parts[parts.length - 1]; // 파일명 추출

      // R2 URL인 경우 (products/... 형식)
      if (url.includes('.r2.dev/') || url.includes('/products/')) {
        return `products/${filename}`;
      }

      // Cloudinary인 경우 (기존 방식 유지)
      const publicId = filename.split('.')[0];
      return `theonmil-bakery/products/${publicId}`;
    } catch (error) {
      console.error('ID 추출 오류:', error);
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

  // 태그 추가 (지능형 콤마 분리 입력)
  const addTag = () => {
    if (!tagInput.trim()) return;

    // 콤마나 공백으로 분리하여 배열 생성 (공백 지원 추가)
    const newTagsRaw = tagInput.split(/[,\s]+/).map(t => t.trim().replace(/^#/, '')).filter(t => t !== '');

    // 기존 태그와 합치기 (중복 제거)
    const currentTags = [...formData.tags];
    let addedCount = 0;

    newTagsRaw.forEach(tag => {
      if (!currentTags.includes(tag) && currentTags.length < 30) {
        currentTags.push(tag);
        addedCount++;
      }
    });

    if (addedCount > 0) {
      setFormData(prev => ({
        ...prev,
        tags: currentTags
      }));
      setTagInput('');
    } else if (formData.tags.length >= 30) {
      toast({
        title: "태그 제한",
        description: "태그는 최대 30개까지만 추가할 수 있습니다.",
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
            className="flex items-center gap-2 px-8 py-3.5 bg-primary hover:bg-[#9a700a] text-white rounded-2xl font-black transition-all shadow-xl shadow-primary/20 active:scale-95 group"
          >
            <i className="fa-solid fa-plus text-lg group-hover:rotate-90 transition-transform duration-300"></i>
            <span>신규 상품 등록</span>
          </button>
        </div>
      </div>



      {loading ? (
        <div className="text-center py-24 bg-secondary/20 rounded-3xl border border-dashed border-border/50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground font-pretendard">상품 목록을 완벽하게 불러오는 중...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <motion.div
              key={product.id}
              variants={slideInFromBottom}
              className="bg-white rounded-3xl border border-border/50 overflow-hidden hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5 transition-all cursor-pointer group"
              onClick={() => handleEditProduct(product)}
            >
              <div className="aspect-[4/3] bg-secondary/30 relative overflow-hidden">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.nameKorean}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <i className="fa-solid fa-image text-muted-foreground/20 text-4xl"></i>
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full border border-border/50 shadow-sm">
                  <span className="text-[10px] font-black text-primary uppercase">{product.category}</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-xl text-foreground mb-2 group-hover:text-primary transition-colors">{product.nameKorean}</h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2 leading-relaxed">{product.description}</p>
                <div className="flex justify-between items-center pt-4 border-t border-border/30">
                  <span className="text-primary font-black text-lg">{product.price?.toLocaleString()}원</span>
                  <div className="w-8 h-8 rounded-full bg-secondary/50 flex items-center justify-center text-muted-foreground text-xs group-hover:bg-primary group-hover:text-white transition-all">
                    <i className="fa-solid fa-pen"></i>
                  </div>
                </div>
                {Array.isArray(product.tags) && product.tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {product.tags.slice(0, 3).map((tag: string, index: number) => (
                      <span key={index} className="text-[10px] bg-secondary/50 text-muted-foreground px-2.5 py-1 rounded-full font-bold">
                        #{tag}
                      </span>
                    ))}
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
      className="bg-card/30 rounded-3xl p-8 border border-border/50 shadow-inner"
    >
      {mode === 'list' ? renderProductList() : (
        <div className="font-pretendard">
          <div className="flex items-center mb-10 pb-6 border-b border-border/30">
            <button
              onClick={handleBackToList}
              className="mr-6 w-12 h-12 bg-white border border-border/50 rounded-2xl flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all shadow-sm active:scale-95"
            >
              <i className="fa-solid fa-arrow-left text-lg"></i>
            </button>
            <div>
              <h2 className="text-3xl font-black text-foreground tracking-tight">
                {mode === 'create' ? '신규 상품 등록' : '상품 정보 수정'}
              </h2>
              <p className="text-muted-foreground text-sm font-medium mt-1">
                {mode === 'create' ? '브랜드의 새로운 가치를 담은 상품을 등록합니다.' : '기존 상품의 정보를 최신으로 업데이트합니다.'}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-12 max-w-5xl">
            {/* 대표 이미지 섹션 */}
            <motion.div variants={slideInFromBottom} className="space-y-5">
              <label className="text-lg font-bold text-foreground flex items-center gap-2">
                <div className="w-1.5 h-5 bg-primary rounded-full"></div>
                대표이미지!(1장) <span className="text-primary">*</span>
              </label>

              {uploadedImage ? (
                <div className="relative group max-w-2xl overflow-hidden rounded-[2rem] border-2 border-primary/20 shadow-2xl">
                  <img
                    src={uploadedImage.secure_url}
                    alt="업로드된 이미지"
                    className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={handleImageDelete}
                      className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-full font-black shadow-xl transition-all transform hover:scale-110 active:scale-90"
                    >
                      <i className="fa-solid fa-trash mr-2"></i> 이미지 삭제
                    </button>
                  </div>
                </div>
              ) : (
                <div className="border-3 border-dashed border-border/60 py-24 rounded-[2rem] text-center bg-white/50 hover:bg-white hover:border-primary/50 transition-all group overflow-hidden relative">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <div className="flex flex-col items-center gap-6">
                    <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                      <i className="fa-solid fa-camera-retro text-4xl text-primary/40"></i>
                    </div>
                    <div>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="bg-primary hover:bg-[#9a700a] disabled:bg-muted text-white px-12 py-4 rounded-2xl font-black text-lg transition-all shadow-xl shadow-primary/20"
                      >
                        {uploading ? (
                          <><i className="fa-solid fa-spinner fa-spin mr-2"></i> 업로드 중...</>
                        ) : "대표 사진 선택하기"}
                      </button>
                      <p className="text-muted-foreground text-sm mt-4">JPG, PNG, WEBP (최대 5MB 제한)</p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>

            {/* 기본 정보 그리드 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-3">
                <label className="text-sm font-black text-muted-foreground ml-1 uppercase tracking-widest">상품 영문 명칭</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-white border border-border/80 rounded-[1.25rem] px-6 py-5 text-foreground font-bold focus:border-primary focus:ring-4 focus:ring-primary/5 focus:outline-none transition-all shadow-sm"
                  placeholder="예: Handmade Sourdough"
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-black text-muted-foreground ml-1 uppercase tracking-widest">상품 국문 명칭 *</label>
                <input
                  type="text"
                  value={formData.nameKorean}
                  onChange={(e) => setFormData(prev => ({ ...prev, nameKorean: e.target.value }))}
                  className="w-full bg-white border border-border/80 rounded-[1.25rem] px-6 py-5 text-foreground font-bold focus:border-primary focus:ring-4 focus:ring-primary/5 focus:outline-none transition-all shadow-sm"
                  placeholder="예: 수제 사워도우 브레드"
                  required
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-sm font-black text-muted-foreground ml-1 uppercase tracking-widest">상품 한 줄 설명 *</label>
              <textarea
                value={formData.description}
                onChange={(e) => {
                  if (e.target.value.length <= 80) {
                    setFormData(prev => ({ ...prev, description: e.target.value }));
                  }
                }}
                rows={3}
                className="w-full bg-white border border-border/80 rounded-[1.5rem] px-6 py-5 text-foreground font-medium focus:border-primary focus:ring-4 focus:ring-primary/5 focus:outline-none transition-all resize-none shadow-sm leading-relaxed"
                placeholder="상품의 핵심 매력을 짧고 강력하게 설명해주세요. (80자 이내)"
                required
              />
              <div className="flex justify-end pr-2 text-[10px] font-black tracking-widest">
                <span className={formData.description.length > 70 ? 'text-primary' : 'text-muted-foreground/40'}>
                  {formData.description.length} / 80
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-3">
                <label className="text-sm font-black text-muted-foreground ml-1 uppercase tracking-widest">판매 가격 (KRW) *</label>
                <div className="relative">
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                    className="w-full bg-white border border-border/80 rounded-[1.25rem] px-6 py-5 text-primary font-black text-2xl focus:border-primary focus:ring-4 focus:ring-primary/5 focus:outline-none transition-all shadow-sm"
                    placeholder="4800"
                    min="0"
                    required
                  />
                  <span className="absolute right-6 top-1/2 -translate-y-1/2 font-black text-muted-foreground/30">원</span>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-black text-muted-foreground ml-1 uppercase tracking-widest">상품 카테고리 설정 *</label>
                <div className="relative">
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as any }))}
                    className="w-full bg-white border border-border/80 rounded-[1.25rem] px-6 py-5 text-foreground font-bold focus:border-primary focus:ring-4 focus:ring-primary/5 focus:outline-none transition-all shadow-sm appearance-none cursor-pointer"
                    required
                  >
                    <option value="regular">🍞 상시 운영 제품</option>
                    <option value="custom">🎂 주문 제작 제품</option>
                    <option value="gift">🎁 기념일 이벤트 제품</option>
                  </select>
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground/40">
                    <i className="fa-solid fa-chevron-down text-sm"></i>
                  </div>
                </div>
              </div>
            </div>

            {/* 태그 & 추가 이미지 */}
            <div className="space-y-10 bg-secondary/20 p-8 rounded-[2rem] border border-border/50">
              <div className="space-y-4">
                <label className="text-sm font-black text-primary/70 ml-1 uppercase tracking-widest">상품 특징 태그 (최대 30개)</label>
                <div className="flex gap-4">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    disabled={formData.tags.length >= 30}
                    className="flex-1 bg-white border border-border/60 rounded-xl px-5 py-4 text-foreground font-bold focus:border-primary focus:outline-none transition-all disabled:bg-muted/50"
                    placeholder="키워드, 키워드, 키워드 식으로 입력 후 엔터"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    disabled={formData.tags.length >= 30 || !tagInput.trim()}
                    className="px-8 bg-primary/10 border-2 border-primary/20 text-primary rounded-xl font-black hover:bg-primary hover:text-white transition-all active:scale-95 disabled:bg-muted/50"
                  >
                    추가
                  </button>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {formData.tags.map((tag, index) => (
                    <span key={index} className="bg-white text-primary border border-primary/20 px-4 py-2 rounded-lg text-xs font-black flex items-center gap-2 group/tag shadow-sm">
                      #{tag}
                      <button type="button" onClick={() => removeTag(tag)} className="text-primary/20 hover:text-red-500 transition-colors">
                        <i className="fa-solid fa-circle-xmark"></i>
                      </button>
                    </span>
                  ))}
                  {formData.tags.length === 0 && <p className="text-muted-foreground/40 text-xs italic ml-1">아직 등록된 태그가 없습니다.</p>}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-black text-primary/70 ml-1 uppercase tracking-widest">상품이미지!(5장)</label>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {uploadedGalleryImages.map((image, index) => (
                    <div key={index} className="relative group aspect-square rounded-2xl overflow-hidden border-2 border-white shadow-md">
                      <img src={image.secure_url} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                      <button
                        type="button"
                        onClick={() => handleGalleryImageDelete(index)}
                        className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                      >
                        <i className="fa-solid fa-xmark text-xs font-black"></i>
                      </button>
                    </div>
                  ))}
                  {uploadedGalleryImages.length < 5 && (
                    <button
                      type="button"
                      onClick={() => document.getElementById('gallery-upload-input')?.click()}
                      className="aspect-square bg-white border-2 border-dashed border-primary/20 rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-primary/5 hover:border-primary/40 transition-all text-primary group"
                    >
                      <i className="fa-solid fa-plus text-xl group-hover:scale-125 transition-transform"></i>
                      <span className="text-[10px] font-black">사진 {uploadedGalleryImages.length + 1} 추가</span>
                      <input
                        type="file"
                        id="gallery-upload-input"
                        multiple
                        accept="image/*"
                        onChange={handleGalleryImageUpload}
                        className="hidden"
                      />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* 📄 상세 에디터 섹션 */}
            <div className="space-y-6 pt-10 border-t border-border/30">
              <label className="text-xl font-bold text-foreground flex items-center gap-2">
                <div className="w-1.5 h-6 bg-accent rounded-full"></div>
                상품 상세 스토리텔링
              </label>

              <div className="bg-white rounded-[2.5rem] border border-border/50 shadow-2xl shadow-primary/5 overflow-hidden p-1.5 ring-1 ring-primary/5">
                <AlternativeEditor
                  value={formData.detailContent || ''}
                  onChange={(value) => setFormData(prev => ({ ...prev, detailContent: value }))}
                  placeholder="장인의 손길이 닿은 상품의 특별한 이야기를 들려주세요..."
                  height="600px"
                />
              </div>
            </div>

            {/* 최종 제출 버튼 */}
            <div className="pt-20 pb-10">
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-primary via-accent to-emerald-500 text-white py-6 rounded-[2.5rem] font-black text-2xl shadow-2xl shadow-primary/30 transition-all flex items-center justify-center gap-4 group"
              >
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform">
                  <i className={`fa-solid ${mode === 'create' ? 'fa-rocket' : 'fa-wand-magic-sparkles'} text-xl`}></i>
                </div>
                {mode === 'create' ? '브랜드 신규 상품으로 출시하기' : '상품 변경사항 최종 반영하기'}
              </motion.button>
              <p className="text-center text-muted-foreground/40 text-xs mt-6 font-medium tracking-widest">THEONMIL PREMIUM BAKERY ADMIN SYSTEM</p>
            </div>
          </form>
        </div>
      )}
    </motion.div>
  );
};

export default ProductManagement;
