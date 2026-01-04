import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { headingClasses, buttonClasses } from '@/lib/fonts';
import { fadeIn, slideInFromLeft, slideInFromRight } from '@/lib/animations';

// 공장 이미지 임포트
import factoryImg from '@/assets/images/about/factory.png';

const AboutSection = () => {
  return (
    <section id="about" className="py-20 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-12">
          {/* Image column */}
          <motion.div
            className="md:w-1/2"
            variants={slideInFromLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="relative">
              <img
                src={factoryImg}
                alt="빵 공장 생산 현장"
                className="rounded-lg shadow-lg w-full brightness-90"
              />
              {/* 15+년 베이킹 장인 경력 버튼이 삭제되었습니다 */}
            </div>
          </motion.div>

          {/* Text column */}
          <motion.div
            className="md:w-1/2"
            variants={slideInFromRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold font-montserrat mb-6 text-foreground">
              우리가 이 <span className="bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text">빵을 만드는 이유</span>
            </h2>
            <p className="font-pretendard text-lg text-muted-foreground mb-6">
              가족에게 먹일 수 있는 가장 정직한 빵을 만들고 싶었습니다. 작은 오븐 하나로 시작했지만, '온전한 밀의 맛'을 전하겠다는 마음만은 변함없습니다.
            </p>
            <p className="font-pretendard text-lg text-muted-foreground mb-6">
              엄선된 국내산 밀가루와 천연 발효종. 타협하지 않는 건강한 재료만이 우리 아이와 가족의 식탁을 지킬 수 있다고 믿기 때문입니다.
            </p>
            <p className="font-pretendard text-lg text-muted-foreground mb-8">
              이러한 고집스러움이 수도권 120여 개 지역 마트에서 인정받은 이유입니다. 이제 온라인을 통해 더 많은 분들께 그 가치를 직접 전달하려 합니다.
            </p>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <motion.div
                className="text-center p-4 bg-background border-border rounded-lg"
                variants={fadeIn}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.8 }}
                transition={{ delay: 0.2 }}
              >
                <div className="mb-2 flex justify-center">
                  <i className="fa-solid fa-handshake text-2xl bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text"></i>
                </div>
                <p className="font-montserrat text-lg font-bold bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text">신뢰</p>
                <p className="font-pretendard text-sm text-muted-foreground mt-1">정직한 공정</p>
              </motion.div>
              <motion.div
                className="text-center p-4 bg-background border-border rounded-lg"
                variants={fadeIn}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.8 }}
                transition={{ delay: 0.4 }}
              >
                <div className="mb-2 flex justify-center">
                  <i className="fa-solid fa-shield-halved text-2xl bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text"></i>
                </div>
                <p className="font-montserrat text-lg font-bold bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text">안전</p>
                <p className="font-pretendard text-sm text-muted-foreground mt-1">HACCP 인증</p>
              </motion.div>
              <motion.div
                className="text-center p-4 bg-background border-border rounded-lg"
                variants={fadeIn}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.8 }}
                transition={{ delay: 0.6 }}
              >
                <div className="mb-2 flex justify-center">
                  <i className="fa-solid fa-utensils text-2xl bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text"></i>
                </div>
                <p className="font-montserrat text-lg font-bold bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text">맛</p>
                <p className="font-pretendard text-sm text-muted-foreground mt-1">천연 발효종</p>
              </motion.div>
            </div>

            <Link
              href="/brand"
              className="px-6 py-3 rounded-full bg-gradient-to-r from-primary to-accent text-white text-sm font-medium shadow-md hover:shadow-lg hover:shadow-primary/30 hover:scale-105 transition-all duration-300"
            >
              더 온밀의 진심 확인하기
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
