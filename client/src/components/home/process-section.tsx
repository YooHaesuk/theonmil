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

// Process steps data
const processSteps: ProcessStep[] = [
  {
    number: 1,
    title: '엄선된 재료',
    description: '전국 각지의 신선한 재료들을 매일 아침 직접 선별합니다.',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1172&q=80'
  },
  {
    number: 2,
    title: '천연 발효',
    description: '최소 16시간 이상 천천히 발효시켜 깊은 맛과 향을 끌어냅니다.',
    image: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'
  },
  {
    number: 3,
    title: '장인의 손길',
    description: '기계가 아닌 장인의 손으로 모양을 만들고 정성을 담습니다.',
    image: 'https://images.unsplash.com/photo-1509365465985-25d11c17e812?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'
  },
  {
    number: 4,
    title: '완벽한 굽기',
    description: '최적의 온도와 습도를 유지하며 골든 브라운 색상까지 굽습니다.',
    image: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc7c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'
  }
];

const ProcessSection = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <section id="process" className="py-20 bg-[#1B1B1B] text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2 
            className={headingClasses.h2 + " text-white mb-4"}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            우리의 제조 과정
          </motion.h2>
          <motion.p 
            className="font-maruburi text-lg max-w-2xl mx-auto text-gray-300"
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
                <div className="w-24 h-24 rounded-full bg-[#D4AF37] flex items-center justify-center text-white text-2xl font-bold mx-auto">
                  {step.number}
                </div>
                {!isMobile && index < processSteps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-[#D4AF37] transform -translate-x-6"></div>
                )}
              </div>
              <h3 className="font-playfair text-xl font-semibold mb-3">{step.title}</h3>
              <p className="font-pretendard text-gray-300">{step.description}</p>
              <motion.img 
                src={step.image} 
                alt={step.title} 
                className="mt-6 rounded-lg w-full h-40 object-cover"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              />
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
          <Link href="/brand" className={buttonClasses.primary}>
            제조 과정 자세히 보기
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default ProcessSection;
