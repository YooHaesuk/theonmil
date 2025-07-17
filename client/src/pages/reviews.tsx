import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';
import { pageTransition, fadeIn, staggerContainer } from '@/lib/animations';
import { headingClasses, buttonClasses } from '@/lib/fonts';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

// 리뷰 이미지 가져오기
import reviewImage1 from '@/assets/images/reviews/review_image1.png';
import reviewImage2 from '@/assets/images/reviews/review_image2.png';
import reviewImage3 from '@/assets/images/reviews/review_image3.png';
import reviewImage4 from '@/assets/images/reviews/review_image4.png';
import reviewImage5 from '@/assets/images/reviews/review_image5.png';

// Review type definition
interface Review {
  id: string;
  name: string;
  rating: number;
  text: string;
  productImage: any; // 제품 이미지로 변경
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
    productImage: reviewImage3,
    date: '2024-04-10',
    product: '클래식 크로와상'
  },
  {
    id: '2',
    name: '이상현',
    rating: 4.5,
    text: '아내 생일에 케이크와 꽃다발 세트로 주문했는데, 포장이 정말 고급스러웠어요. 케이크 맛도 달지 않고 부드러워서 가족 모두 만족했습니다.',
    productImage: reviewImage2,
    date: '2024-04-05',
    product: '스페셜 초콜릿 케이크'
  },
  {
    id: '3',
    name: '박소연',
    rating: 5,
    text: '회사 모임에 단체 주문했어요. 직원들 모두 맛있다고 칭찬했고, 특히 통밀 식빵은 건강해 보여서 좋았어요. 다음에도 이용할 예정입니다.',
    productImage: reviewImage5,
    date: '2024-03-28',
    product: '브런치 바게트'
  },
  {
    id: '4',
    name: '정현우',
    rating: 5,
    text: '프렌치 바게트가 정말 맛있어요. 겉은 바삭하고 속은 쫄깃하니 식감이 완벽합니다. 여러 빵집을 다녀봤지만 여기가 최고예요.',
    productImage: reviewImage5,
    date: '2024-03-25',
    product: '프렌치 바게트'
  },
  {
    id: '5',
    name: '서민지',
    rating: 4,
    text: '과일 타르트 맛있게 먹었습니다. 과일이 신선하고 크림이 너무 달지 않아서 좋았어요. 다음에는 다른 종류의 타르트도 시도해볼게요.',
    productImage: reviewImage4,
    date: '2024-03-20',
    product: '신선한 과일 타르트'
  },
  {
    id: '6',
    name: '최준영',
    rating: 5,
    text: '기념일 선물 세트를 여자친구에게 보냈는데 너무 좋아했어요. 빵도 맛있고 꽃도 예쁘고 성공적인 선물이었습니다!',
    productImage: reviewImage1,
    date: '2024-03-15',
    product: '기념일 선물 세트'
  }
];

const Reviews = () => {
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();

  // 리뷰 작성하기 버튼 클릭 핸들러
  const handleWriteReview = () => {
    if (!user) {
      toast({
        title: "로그인이 필요합니다 🔐",
        description: "리뷰를 작성하려면 먼저 로그인해주세요.",
        variant: "destructive",
      });
      setLocation('/login');
      return;
    }

    // 구매 완료 고객만 리뷰 작성 가능
    toast({
      title: "마이페이지로 이동합니다 📝",
      description: "구매완료된 상품에 한해서 리뷰를 작성할 수 있습니다!",
      variant: "default",
    });

    // MY 쇼핑 탭으로 이동 (구매완료 상품 확인)
    setLocation('/mypage/shopping?from=review');
  };

  // Filter reviews based on selected rating
  const filteredReviews = selectedRating 
    ? reviews.filter(review => Math.floor(review.rating) === selectedRating) 
    : reviews;
  
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
      className="min-h-screen pt-24 pb-20 bg-[#0A0A0A]"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h1 variants={fadeIn} className="text-4xl font-bold font-montserrat mb-4">
            <span className="bg-gradient-to-r from-[#A78BFA] to-[#EC4899] text-transparent bg-clip-text">고객 리뷰</span>
          </motion.h1>
          <motion.p variants={fadeIn} className="font-pretendard text-lg max-w-3xl mx-auto text-gray-300">
            대형마트와 온라인에서 더 온밀을 만난 고객님들의 소중한 리뷰입니다.
          </motion.p>
        </div>
        
        {/* Rating Filter */}
        <motion.div variants={fadeIn} className="flex justify-center mb-12">
          <div className="inline-flex bg-[#111111] rounded-full p-1 border border-[#222222]">
            <button
              onClick={() => setSelectedRating(null)}
              className={`px-4 py-2 rounded-full font-montserrat text-sm transition-colors ${
                selectedRating === null 
                  ? 'bg-gradient-to-r from-[#A78BFA] to-[#EC4899] text-white' 
                  : 'text-white hover:bg-[#1A1A2A]'
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
                    ? 'bg-gradient-to-r from-[#A78BFA] to-[#EC4899] text-white' 
                    : 'text-white hover:bg-[#1A1A2A]'
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
              className="bg-[#111111] rounded-lg p-6 shadow-md border border-[#222222]"
            >
              <div className="mb-6">
                <div className="mb-3 rounded-lg overflow-hidden border border-[#333333]">
                  <img 
                    src={review.productImage} 
                    alt={`${review.product}`} 
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-montserrat font-semibold text-white">{review.name}</h4>
                  <span className="text-sm text-gray-400 font-pretendard">
                    {new Date(review.date).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex mb-2 bg-gradient-to-r from-[#A78BFA] to-[#EC4899] text-transparent bg-clip-text">
                  {[...Array(Math.floor(review.rating))].map((_, i) => (
                    <i key={i} className="fa-solid fa-star"></i>
                  ))}
                  {review.rating % 1 !== 0 && (
                    <i className="fa-solid fa-star-half-alt"></i>
                  )}
                </div>
                <p className="font-montserrat text-sm text-gray-400 mb-3 font-medium">
                  {review.product}
                </p>
                <p className="font-pretendard text-gray-300">{review.text}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Write Review CTA */}
        <motion.div 
          variants={fadeIn}
          className="mt-16 bg-[#0F0F1A] rounded-lg p-8 shadow-md text-center border border-[#222222]"
        >
          <h2 className="text-2xl font-bold font-montserrat mb-4 text-white">
            더 온밀을 <span className="bg-gradient-to-r from-[#A78BFA] to-[#EC4899] text-transparent bg-clip-text">경험</span>해보셨나요?
          </h2>
          <p className="font-pretendard text-gray-300 mb-6">
            여러분의 솔직한 리뷰가 다른 고객들에게 큰 도움이 됩니다.
          </p>
          <button
            onClick={handleWriteReview}
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#A78BFA] to-[#EC4899] hover:from-[#9333EA] hover:to-[#DB2777] text-white font-medium transition-all transform hover:scale-105 shadow-lg hover:shadow-[#A78BFA]/30"
          >
            📝 리뷰 작성하기
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Reviews;
