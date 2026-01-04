import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { headingClasses, buttonClasses } from '@/lib/fonts';
import { slideInFromLeft, slideInFromRight } from '@/lib/animations';

// 선물 관련 이미지
import giftSetImg from '@/assets/images/products/anniversary gift set.webp';
import cakeImg from '@/assets/images/products/a special chocolate cake.webp';
import fruitTartImg from '@/assets/images/products/fresh fruit tart.webp';

const GiftSection = () => {
  return (
    <section id="gifts" className="py-20 bg-secondary overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          {/* Text content */}
          <motion.div
            className="md:w-1/2 mb-12 md:mb-0 md:pr-12"
            variants={slideInFromLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold font-montserrat mb-6 text-foreground">
              특별한 날, <span className="bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text">특별한 선물</span>
            </h2>
            <p className="font-pretendard text-lg text-muted-foreground mb-6">
              소중한 사람의 기념일에 더 온밀의 선물 세트는 어떠신가요? 케이크, 디저트와 함께 신선한 꽃다발과 마음을 담은 메시지 카드를 함께 보내드립니다.
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center text-white mt-0.5 mr-3">
                  <i className="fa-solid fa-check text-xs"></i>
                </div>
                <span className="font-pretendard text-muted-foreground">원하는 날짜에 정확한 배송</span>
              </li>
              <li className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center text-white mt-0.5 mr-3">
                  <i className="fa-solid fa-check text-xs"></i>
                </div>
                <span className="font-pretendard text-muted-foreground">전문 플로리스트가 준비한 신선한 꽃다발</span>
              </li>
              <li className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center text-white mt-0.5 mr-3">
                  <i className="fa-solid fa-check text-xs"></i>
                </div>
                <span className="font-pretendard text-muted-foreground">고급스러운 패키지와 리본 포장</span>
              </li>
              <li className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center text-white mt-0.5 mr-3">
                  <i className="fa-solid fa-check text-xs"></i>
                </div>
                <span className="font-pretendard text-muted-foreground">직접 작성한 손글씨 메시지 카드 동봉</span>
              </li>
            </ul>
            <Link
              href="/products?category=gift"
              className="px-6 py-3 rounded-full bg-gradient-to-r from-primary to-accent text-white text-sm font-medium shadow-md hover:shadow-lg hover:shadow-primary/30 hover:scale-105 transition-all duration-300"
            >
              선물 세트 보기
            </Link>
          </motion.div>

          {/* Image */}
          <motion.div
            className="md:w-1/2 relative"
            variants={slideInFromRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="bg-background border-border shadow-md border border-border">
              <img
                src={giftSetImg}
                alt="선물 세트"
                className="w-full"
              />
            </div>
            <motion.div
              className="absolute -top-6 -left-6 bg-background border border-border"
              initial={{ opacity: 0, x: -20, y: -20 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
            >
              <img
                src={fruitTartImg}
                alt="과일 타르트"
                className="w-24 h-24 object-cover rounded"
              />
            </motion.div>
            <motion.div
              className="absolute -bottom-6 -right-6 bg-background border border-border"
              initial={{ opacity: 0, x: 20, y: 20 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 }}
            >
              <img
                src={cakeImg}
                alt="초콜릿 케이크"
                className="w-24 h-24 object-cover rounded"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default GiftSection;
