import { useState } from 'react';
import { motion } from 'framer-motion';
import { headingClasses } from '@/lib/fonts';
import { fadeIn } from '@/lib/animations';
import { useToast } from '@/hooks/use-toast';

const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email) return;

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "구독 신청 완료",
        description: "더 온밀의 소식을 이메일로 받아보실 수 있습니다.",
      });

      setEmail('');
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <section id="newsletter" className="py-16 bg-secondary">
      <div className="container mx-auto px-4">
        <motion.div
          className="max-w-3xl mx-auto text-center p-10 rounded-xl bg-background border border-border"
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold font-montserrat mb-4 text-foreground">
            더 온밀 <span className="bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text">소식 받기</span>
          </h2>
          <p className="font-pretendard text-lg text-muted-foreground mb-8">
            신제품 소식, 시즌 한정 메뉴, 특별 할인 정보를 가장 먼저 받아보세요.
          </p>
          <form
            className="flex flex-col sm:flex-row gap-4 justify-center"
            onSubmit={handleSubmit}
          >
            <input
              type="email"
              id="newsletterEmail"
              name="newsletterEmail"
              autoComplete="email"
              placeholder="이메일 주소를 입력하세요"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-grow max-w-sm rounded-full px-4 py-3 bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-primary to-accent text-white font-medium py-3 px-6 rounded-full text-center font-montserrat whitespace-nowrap disabled:opacity-70 shadow-md hover:shadow-lg hover:shadow-primary/30 hover:scale-105 transition-all duration-300"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                  처리 중...
                </span>
              ) : '구독하기'}
            </button>
          </form>
          <p className="font-pretendard text-muted-foreground text-sm mt-4">
            구독은 언제든지 취소 가능합니다. 개인정보 처리방침을 준수합니다.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default NewsletterSection;
