import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { headingClasses, buttonClasses } from '@/lib/fonts';
import { staggerContainer, fadeIn } from '@/lib/animations';

// Review type definition
interface Review {
  id: string;
  name: string;
  rating: number;
  text: string;
  profile: string;
  images: string[];
}

// Reviews data
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
    ]
  },
  {
    id: '2',
    name: '이상현',
    rating: 4.5,
    text: '아내 생일에 케이크와 꽃다발 세트로 주문했는데, 포장이 정말 고급스러웠어요. 케이크 맛도 달지 않고 부드러워서 가족 모두 만족했습니다.',
    profile: 'https://randomuser.me/api/portraits/men/32.jpg',
    images: [
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1089&q=80'
    ]
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
    ]
  }
];

const ReviewsSection = () => {
  return (
    <section id="reviews" className="py-20 bg-[#0A0A0A]">
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
            className="font-maruburi text-lg text-gray-300 max-w-2xl mx-auto"
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            대형마트와 온라인에서 빵답게를 만난 고객님들의 소중한 후기입니다.
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
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-[#222222] overflow-hidden mr-4 border border-[#333333]">
                  <img src={review.profile} alt={`${review.name} 프로필`} />
                </div>
                <div>
                  <h4 className="font-montserrat font-semibold text-white">{review.name}</h4>
                  <div className="flex bg-gradient-to-r from-[#A78BFA] to-[#EC4899] text-transparent bg-clip-text">
                    {[...Array(Math.floor(review.rating))].map((_, i) => (
                      <i key={i} className="fa-solid fa-star"></i>
                    ))}
                    {review.rating % 1 !== 0 && (
                      <i className="fa-solid fa-star-half-alt"></i>
                    )}
                  </div>
                </div>
              </div>
              <p className="font-pretendard text-gray-300 mb-4">{review.text}</p>
              <div className="flex space-x-2">
                {review.images.map((image, index) => (
                  <motion.div 
                    key={index}
                    className="w-16 h-16 rounded-md object-cover overflow-hidden border border-[#333333]"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <img src={image} alt={`고객 후기 사진 ${index + 1}`} className="w-full h-full object-cover" />
                  </motion.div>
                ))}
              </div>
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
