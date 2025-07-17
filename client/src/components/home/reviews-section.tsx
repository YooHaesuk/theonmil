import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { headingClasses, buttonClasses } from '@/lib/fonts';
import { staggerContainer, fadeIn } from '@/lib/animations';

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
  productImage: any; // 제품 이미지
  date: string;
}

// Reviews data
const reviews: Review[] = [
  {
    id: '1',
    name: '김지영',
    rating: 5,
    text: '크로와상이 정말 바삭하고 버터향이 진해요. 아침에 커피와 함께 먹으면 하루가 행복해집니다. 정기배송 신청해서 매주 받아먹고 있어요!',
    productImage: reviewImage3, // 크로와상 이미지
    date: '2024.04.10'
  },
  {
    id: '2',
    name: '이상현',
    rating: 4.5,
    text: '아내 생일에 케이크와 꽃다발 세트로 주문했는데, 포장이 정말 고급스러웠어요. 케이크 맛도 달지 않고 부드러워서 가족 모두 만족했습니다.',
    productImage: reviewImage2, // 초콜릿 케이크 이미지
    date: '2024.04.05'
  },
  {
    id: '3',
    name: '박소연',
    rating: 5,
    text: '회사 모임에 단체 주문했어요. 직원들 모두 맛있다고 칭찬했고, 특히 통밀 식빵은 건강해 보여서 좋았어요. 다음에도 이용할 예정입니다.',
    productImage: reviewImage1, // 선물 세트 이미지
    date: '2024.03.28'
  }
];

const ReviewsSection = () => {
  return (
    <section id="reviews" className="py-20 bg-[#0F0F1A]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h2 
            className="text-4xl font-bold font-montserrat mb-4 text-white"
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            고객 <span className="bg-gradient-to-r from-[#A78BFA] to-[#EC4899] text-transparent bg-clip-text">후기</span>
          </motion.h2>
          <motion.p 
            className="font-pretendard text-lg text-gray-300 max-w-2xl mx-auto"
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            대형마트와 온라인에서 더 온밀을 만난 고객님들의 소중한 후기입니다.
          </motion.p>
        </div>
        
        {/* Reviews grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {reviews.map((review) => (
            <motion.div
              key={review.id}
              className="bg-[#111111] rounded-lg p-6 shadow-md border border-[#222222]"
              variants={fadeIn}
              whileHover={{ y: -5, transition: { duration: 0.3 } }}
            >
              <div className="mb-4">
                <div className="mb-3 rounded-lg overflow-hidden border border-[#333333]">
                  <img 
                    src={review.productImage} 
                    alt={`${review.name}님이 구매한 제품`} 
                    className="w-full h-40 object-cover"
                  />
                </div>
                <div className="flex justify-between items-center">
                  <h4 className="font-montserrat font-semibold text-white">{review.name}</h4>
                  <span className="text-sm text-gray-400 font-pretendard">{review.date}</span>
                </div>
                <div className="flex mb-2 bg-gradient-to-r from-[#A78BFA] to-[#EC4899] text-transparent bg-clip-text">
                  {[...Array(Math.floor(review.rating))].map((_, i) => (
                    <i key={i} className="fa-solid fa-star"></i>
                  ))}
                  {review.rating % 1 !== 0 && (
                    <i className="fa-solid fa-star-half-alt"></i>
                  )}
                </div>
              </div>
              <p className="font-pretendard text-gray-300">{review.text}</p>
            </motion.div>
          ))}
        </motion.div>
        
        {/* View more reviews button */}
        <motion.div 
          className="text-center mt-12"
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
        >
          <Link 
            href="/reviews" 
            className="px-6 py-3 rounded-full bg-[#11111A] border border-[#ffffff20] text-white text-sm font-medium hover:bg-[#1A1A2A] transition-all duration-300"
          >
            모든 후기 보기
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default ReviewsSection;
