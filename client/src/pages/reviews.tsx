import { useState } from 'react';
import { motion } from 'framer-motion';
import { pageTransition, fadeIn, staggerContainer } from '@/lib/animations';
import { headingClasses, buttonClasses } from '@/lib/fonts';

// Review type definition
interface Review {
  id: string;
  name: string;
  rating: number;
  text: string;
  profile: string;
  images: string[];
  date: string;
  product: string;
}

// Sample reviews data
const reviews: Review[] = [
  {
    id: '1',
    name: '김지영',
    rating: 5,
    text: '크로와상이 정말 바삭하고 버터향이 진해요. 아침에 커피와 함께 먹으면 하루가 행복해집니다. 정기배송 신청해서 매주 받아먹고 있어요!',
    profile: 'https://randomuser.me/api/portraits/women/44.jpg',
    images: [
      'https://images.unsplash.com/photo-1555507036-ab1f4038808a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1026&q=80',
      'https://images.unsplash.com/photo-1613278831678-c371b89abf47?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'
    ],
    date: '2023-05-15',
    product: '클래식 크로와상'
  },
  {
    id: '2',
    name: '이상현',
    rating: 4.5,
    text: '아내 생일에 케이크와 꽃다발 세트로 주문했는데, 포장이 정말 고급스러웠어요. 케이크 맛도 달지 않고 부드러워서 가족 모두 만족했습니다.',
    profile: 'https://randomuser.me/api/portraits/men/32.jpg',
    images: [
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1089&q=80'
    ],
    date: '2023-04-22',
    product: '스페셜 초콜릿 케이크'
  },
  {
    id: '3',
    name: '박소연',
    rating: 5,
    text: '회사 모임에 단체 주문했어요. 직원들 모두 맛있다고 칭찬했고, 특히 통밀 식빵은 건강해 보여서 좋았어요. 다음에도 이용할 예정입니다.',
    profile: 'https://randomuser.me/api/portraits/women/68.jpg',
    images: [
      'https://images.unsplash.com/photo-1513442542250-854d436a73f2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
      'https://images.unsplash.com/photo-1600326145359-3a44909d1a39?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
      'https://images.unsplash.com/photo-1610406765661-57646c40da59?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80'
    ],
    date: '2023-06-03',
    product: '통밀 식빵'
  },
  {
    id: '4',
    name: '정현우',
    rating: 5,
    text: '프렌치 바게트가 정말 맛있어요. 겉은 바삭하고 속은 쫄깃하니 식감이 완벽합니다. 여러 빵집을 다녀봤지만 여기가 최고예요.',
    profile: 'https://randomuser.me/api/portraits/men/42.jpg',
    images: [
      'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'
    ],
    date: '2023-05-28',
    product: '프렌치 바게트'
  },
  {
    id: '5',
    name: '서민지',
    rating: 4,
    text: '과일 타르트 맛있게 먹었습니다. 과일이 신선하고 크림이 너무 달지 않아서 좋았어요. 다음에는 다른 종류의 타르트도 시도해볼게요.',
    profile: 'https://randomuser.me/api/portraits/women/65.jpg',
    images: [
      'https://images.unsplash.com/photo-1565958011703-44f9829ba187?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=765&q=80',
      'https://images.unsplash.com/photo-1572897306050-9c33bf745513?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80'
    ],
    date: '2023-06-10',
    product: '신선한 과일 타르트'
  },
  {
    id: '6',
    name: '최준영',
    rating: 5,
    text: '기념일 선물 세트를 여자친구에게 보냈는데 너무 좋아했어요. 빵도 맛있고 꽃도 예쁘고 성공적인 선물이었습니다!',
    profile: 'https://randomuser.me/api/portraits/men/22.jpg',
    images: [
      'https://images.unsplash.com/photo-1627834377411-8da5f4f09de8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1901&q=80'
    ],
    date: '2023-06-15',
    product: '기념일 선물 세트'
  }
];

const Reviews = () => {
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  
  // Filter reviews based on selected rating
  const filteredReviews = selectedRating 
    ? reviews.filter(review => Math.floor(review.rating) === selectedRating) 
    : reviews;
  
  // Handle image click to open gallery
  const openGallery = (images: string[], index: number) => {
    setSelectedImages(images);
    setSelectedImageIndex(index);
  };
  
  // Close gallery
  const closeGallery = () => {
    setSelectedImageIndex(null);
    setSelectedImages([]);
  };
  
  // Next image in gallery
  const nextImage = () => {
    if (selectedImageIndex !== null && selectedImages.length > 0) {
      setSelectedImageIndex((selectedImageIndex + 1) % selectedImages.length);
    }
  };
  
  // Previous image in gallery
  const prevImage = () => {
    if (selectedImageIndex !== null && selectedImages.length > 0) {
      setSelectedImageIndex((selectedImageIndex - 1 + selectedImages.length) % selectedImages.length);
    }
  };
  
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
      className="min-h-screen pt-24 pb-20"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h1 variants={fadeIn} className={headingClasses.h1 + " text-[#1B1B1B] mb-4"}>
            고객 후기
          </motion.h1>
          <motion.p variants={fadeIn} className="font-maruburi text-lg max-w-3xl mx-auto text-[#333333]">
            대형마트와 온라인에서 빵답게를 만난 고객님들의 소중한 후기입니다.
          </motion.p>
        </div>
        
        {/* Rating Filter */}
        <motion.div variants={fadeIn} className="flex justify-center mb-12">
          <div className="inline-flex bg-[#F5F3EF] rounded-full p-1">
            <button
              onClick={() => setSelectedRating(null)}
              className={`px-4 py-2 rounded-full font-montserrat text-sm transition-colors ${
                selectedRating === null 
                  ? 'bg-[#D4AF37] text-white' 
                  : 'text-[#1B1B1B] hover:bg-[#E5E3DF]'
              }`}
            >
              전체
            </button>
            {[5, 4, 3, 2, 1].map(rating => (
              <button
                key={rating}
                onClick={() => setSelectedRating(rating)}
                className={`px-4 py-2 rounded-full font-montserrat text-sm transition-colors ${
                  selectedRating === rating 
                    ? 'bg-[#D4AF37] text-white' 
                    : 'text-[#1B1B1B] hover:bg-[#E5E3DF]'
                }`}
              >
                {rating}점
              </button>
            ))}
          </div>
        </motion.div>
        
        {/* Reviews Grid */}
        <motion.div 
          variants={staggerContainer} 
          initial="hidden" 
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {filteredReviews.map(review => (
            <motion.div
              key={review.id}
              variants={fadeIn}
              className="bg-[#F5F3EF] rounded-lg p-6 shadow-sm"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden mr-4">
                  <img src={review.profile} alt={`${review.name} 프로필`} />
                </div>
                <div>
                  <h4 className="font-montserrat font-semibold">{review.name}</h4>
                  <div className="flex text-[#D4AF37]">
                    {[...Array(Math.floor(review.rating))].map((_, i) => (
                      <i key={i} className="fa-solid fa-star"></i>
                    ))}
                    {review.rating % 1 !== 0 && (
                      <i className="fa-solid fa-star-half-alt"></i>
                    )}
                  </div>
                </div>
              </div>
              <p className="font-pretendard text-[#333333] mb-2">{review.text}</p>
              <p className="font-montserrat text-sm text-gray-500 mb-4">
                {review.product} • {new Date(review.date).toLocaleDateString()}
              </p>
              <div className="flex space-x-2">
                {review.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => openGallery(review.images, index)}
                    className="w-16 h-16 rounded object-cover overflow-hidden"
                  >
                    <img src={image} alt={`고객 후기 사진 ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Write Review CTA */}
        <motion.div 
          variants={fadeIn}
          className="mt-16 bg-white rounded-lg p-8 shadow-md text-center"
        >
          <h2 className={headingClasses.h3 + " text-[#1B1B1B] mb-4"}>
            빵답게를 경험해보셨나요?
          </h2>
          <p className="font-maruburi text-[#333333] mb-6">
            여러분의 솔직한 후기가 다른 고객들에게 큰 도움이 됩니다.
          </p>
          <button className={buttonClasses.primary}>
            후기 작성하기
          </button>
        </motion.div>
      </div>
      
      {/* Image Gallery Modal */}
      {selectedImageIndex !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <button 
            onClick={closeGallery}
            className="absolute top-4 right-4 text-white text-2xl"
            aria-label="갤러리 닫기"
          >
            <i className="fa-solid fa-times"></i>
          </button>
          <button 
            onClick={prevImage} 
            className="absolute left-4 text-white text-3xl"
            aria-label="이전 이미지"
          >
            <i className="fa-solid fa-chevron-left"></i>
          </button>
          <button 
            onClick={nextImage} 
            className="absolute right-4 text-white text-3xl"
            aria-label="다음 이미지"
          >
            <i className="fa-solid fa-chevron-right"></i>
          </button>
          
          <div className="max-w-4xl max-h-[80vh]">
            <img 
              src={selectedImages[selectedImageIndex]} 
              alt="후기 이미지 확대" 
              className="max-w-full max-h-[80vh] object-contain"
            />
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Reviews;
