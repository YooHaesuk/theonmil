import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { headingClasses, buttonClasses } from '@/lib/fonts';
import { useMediaQuery } from '@/hooks/use-mobile';

// Process step type definition
interface ProcessStep {
  number: number;
  title: string;
  description: string;
  image: string;
}

// 이미지 임포트
import process1 from '@/assets/images/process/process_step1.png';
import process2 from '@/assets/images/process/process_step2.png';
import process3 from '@/assets/images/process/process_step3.png';
import process4 from '@/assets/images/process/process_step4.png';

// Process steps data
const processSteps: ProcessStep[] = [
  {
    number: 1,
    title: '엄선된 재료',
    description: '전국 각지의 신선한 재료들을 매일 아침 직접 선별합니다.',
    image: process1
  },
  {
    number: 2,
    title: '천연 발효',
    description: '최소 16시간 이상 천천히 발효시켜 깊은 맛과 향을 끌어냅니다.',
    image: process2
  },
  {
    number: 3,
    title: '장인의 손길',
    description: '기계가 아닌 장인의 손으로 모양을 만들고 정성을 담습니다.',
    image: process3
  },
  {
    number: 4,
    title: '완벽한 굽기',
    description: '최적의 온도와 습도를 유지하며 골든 브라운 색상까지 굽습니다.',
    image: process4
  }
];

const ProcessSection = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <section id="process" className="py-20 bg-[#0A0A0A] text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-4xl font-bold font-montserrat mb-4 text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            우리의 <span className="bg-gradient-to-r from-[#A78BFA] to-[#EC4899] text-transparent bg-clip-text">제조 과정</span>
          </motion.h2>
          <motion.p 
            className="font-pretendard text-lg max-w-2xl mx-auto text-gray-300"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            모든 빵은 정직한 재료와 전통적인 방식으로 만들어집니다.
          </motion.p>
        </div>
        
        {/* Process steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {processSteps.map((step, index) => (
            <motion.div 
              key={step.number}
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <div className="relative mb-6 mx-auto">
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-[#A78BFA] to-[#EC4899] flex items-center justify-center text-white text-2xl font-bold mx-auto">
                  {step.number}
                </div>

              </div>
              <h3 className="font-montserrat text-xl font-semibold mb-3 text-white">{step.title}</h3>
              <p className="font-pretendard text-gray-300">{step.description}</p>
              <div className="mt-6 rounded-lg overflow-hidden bg-[#111111] border border-[#222222]">
                <motion.img 
                  src={step.image} 
                  alt={step.title} 
                  className="w-full h-60 object-cover"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* CTA */}
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Link 
            href="/brand" 
            className="px-6 py-3 rounded-full bg-gradient-to-r from-[#A78BFA] to-[#EC4899] text-white text-sm font-medium hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
          >
            제조 과정 자세히 보기
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default ProcessSection;
