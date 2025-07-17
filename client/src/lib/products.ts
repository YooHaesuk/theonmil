// Import product images
import classicalCroissantImg from '@/assets/images/products/Classical Croissant.png';
import brunchBaguetteImg from '@/assets/images/products/brunch baguette.png';
import wholeGrainBreadImg from '@/assets/images/products/whole-grain bread.png';
import specialChocolateCakeImg from '@/assets/images/products/a special chocolate cake.png';
import freshFruitTartImg from '@/assets/images/products/fresh fruit tart.png';
import anniversaryGiftSetImg from '@/assets/images/products/anniversary gift set.png';

// Product types
export interface Product {
  id: string;
  name: string;
  nameKorean: string;
  description: string;
  price: number;
  image: any; // 이미지 타입을 any로 변경
  category: ProductCategory;
  tags: string[];
  isBestseller?: boolean;
  isNew?: boolean;
  isPopular?: boolean;
  // 🆕 리치 에디터 필드 추가
  detailContent?: string; // HTML 콘텐츠
  detailImage?: string; // 기존 이미지 (마이그레이션용)
  images?: string[]; // 추가 이미지들
}

export type ProductCategory = 'regular' | 'custom' | 'gift';

export const categoryDisplayNames: Record<ProductCategory, string> = {
  regular: '상시 운영 제품',
  custom: '주문 제작 제품',
  gift: '기념일 선물 세트'
};

// Sample product data
export const products: Product[] = [
  {
    id: 'classic-croissant',
    name: 'Classic Croissant',
    nameKorean: '클래식 크로와상',
    description: '72시간 저온 발효로 완성한 바삭한 겉면과 부드러운 속',
    price: 4800,
    image: classicalCroissantImg,
    category: 'regular',
    tags: ['바삭함', '크로와상', '아침식사'],
    isBestseller: true
  },
  {
    id: 'french-baguette',
    name: 'French Baguette',
    nameKorean: '프렌치 바게트',
    description: '국내산 밀과 천연 발효종으로 프랑스 정통 방식 재현',
    price: 5200,
    image: brunchBaguetteImg,
    category: 'regular',
    tags: ['바게트', '프랑스빵', '저녁식사'],
    isPopular: true
  },
  {
    id: 'whole-wheat-bread',
    name: 'Whole Wheat Bread',
    nameKorean: '통밀 식빵',
    description: '유기농 통밀과 꿀로 만든 건강한 식빵',
    price: 6800,
    image: wholeGrainBreadImg,
    category: 'regular',
    tags: ['통밀', '건강빵', '샌드위치']
  },
  {
    id: 'chocolate-cake',
    name: 'Special Chocolate Cake',
    nameKorean: '스페셜 초콜릿 케이크',
    description: '벨기에 초콜릿을 사용한 특별한 초콜릿 케이크',
    price: 38000,
    image: specialChocolateCakeImg,
    category: 'custom',
    tags: ['케이크', '초콜릿', '생일']
  },
  {
    id: 'fruit-tart',
    name: 'Fresh Fruit Tart',
    nameKorean: '신선한 과일 타르트',
    description: '제철 과일로 장식한, 바닐라 커스터드가 가득한 타르트',
    price: 32000,
    image: freshFruitTartImg,
    category: 'custom',
    tags: ['타르트', '과일', '디저트'],
    isNew: true
  },
  {
    id: 'anniversary-set',
    name: 'Anniversary Gift Set',
    nameKorean: '기념일 선물 세트',
    description: '특별한 날을 위한 케이크와 꽃, 메시지 카드가 포함된 선물 세트',
    price: 55000,
    image: anniversaryGiftSetImg,
    category: 'gift',
    tags: ['선물', '케이크', '꽃', '기념일']
  }
];

// Function to get products by category
export const getProductsByCategory = (category: ProductCategory): Product[] => {
  return products.filter(product => product.category === category);
};

// Function to get featured products for homepage
export const getFeaturedProducts = (): Product[] => {
  return products.filter(product => product.isBestseller || product.isPopular || product.isNew).slice(0, 3);
};

// Function to get a single product by id
export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

// Format price as Korean Won
export const formatPrice = (price: number): string => {
  return `₩${price.toLocaleString()}`;
};
