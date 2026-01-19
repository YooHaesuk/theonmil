import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { pageTransition, fadeIn, slideInFromLeft, slideInFromRight } from '@/lib/animations';
import { headingClasses } from '@/lib/fonts';
import { useToast } from '@/hooks/use-toast';
import { PageSEO } from '@/components/seo/page-seo';
import { seoData } from '@/lib/seo-data';

// 기업 제휴 이미지 임포트
import partnershipImg from '@/assets/images/about/partnership.webp';

const B2B = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    message: '',
    employees: '10-50'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 입력 검증
      if (!formData.companyName || !formData.contactName || !formData.email || !formData.phone || !formData.message) {
        toast({
          title: "입력 오류",
          description: "모든 필수 항목을 입력해주세요.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // SMTP를 통해 직접 메일 전송
      const emailData = {
        to: 'yhs85844@gmail.com',
        subject: `[더 온밀 기업제휴 문의] ${formData.companyName} - ${formData.contactName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
            <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <h2 style="color: #D4AF37; text-align: center; margin-bottom: 30px;">🏢 더 온밀 기업제휴 문의</h2>

              <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h3 style="color: #333; margin-top: 0;">🏢 회사 정보</h3>
                <p><strong>회사명:</strong> ${formData.companyName}</p>
                <p><strong>담당자명:</strong> ${formData.contactName}</p>
                <p><strong>임직원 수:</strong> ${formData.employees}</p>
              </div>

              <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h3 style="color: #333; margin-top: 0;">📧 연락처 정보</h3>
                <p><strong>이메일:</strong> <a href="mailto:${formData.email}">${formData.email}</a></p>
                <p><strong>전화번호:</strong> <a href="tel:${formData.phone}">${formData.phone}</a></p>
              </div>

              <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h3 style="color: #333; margin-top: 0;">📝 문의 내용</h3>
                <div style="background-color: white; padding: 15px; border-radius: 5px; border-left: 4px solid #8B5CF6;">
                  ${formData.message.replace(/\n/g, '<br>')}
                </div>
              </div>

              <div style="text-align: center; padding: 20px; background-color: #8B5CF6; color: white; border-radius: 8px;">
                <p style="margin: 0;"><strong>문의 일시:</strong> ${new Date().toLocaleString('ko-KR')}</p>
                <p style="margin: 5px 0 0 0;"><strong>사이트:</strong> 더 온밀 기업제휴 페이지</p>
              </div>
            </div>
          </div>
        `
      };

      console.log('📧 기업제휴 문의 SMTP 전송:', emailData);

      // 백엔드 API로 메일 전송 요청
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData)
      });

      if (response.ok) {
        toast({
          title: "문의가 접수되었습니다! ✅",
          description: "빠른 시일 내에 담당자가 연락드리겠습니다.",
          variant: "default",
        });

        // 폼 초기화
        setFormData({
          companyName: '',
          contactName: '',
          email: '',
          phone: '',
          message: '',
          employees: '10-50'
        });
      } else {
        throw new Error('메일 전송 실패');
      }

    } catch (error) {
      console.error('❌ 기업제휴 문의 전송 실패:', error);
      toast({
        title: "문의 전송 실패",
        description: "다시 시도해주세요.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PageSEO
        title={seoData.b2b.title}
        description={seoData.b2b.description}
        keywords={seoData.b2b.keywords}
      />
      <motion.div
        initial="initial"
        animate="animate"
      exit="exit"
      variants={pageTransition}
      className="min-h-screen pt-40 pb-20 bg-background"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h1 variants={fadeIn} className="text-4xl font-bold font-montserrat mb-4">
            <span className="bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text">기업 제휴 안내</span>
          </motion.h1>
          <motion.p variants={fadeIn} className="font-pretendard text-lg max-w-3xl mx-auto text-muted-foreground">
            기업 행사, 케이터링, 직원 선물을 위한 대량 주문 및 정기 납품 서비스를 제공합니다.
          </motion.p>
        </div>

        <div className="flex flex-col md:flex-row items-center mb-20">
          {/* Image */}
          <motion.div
            variants={slideInFromLeft}
            className="md:w-1/2 mb-12 md:mb-0 md:pr-12"
          >
            <img
              src={partnershipImg}
              alt="기업 제휴"
              className="rounded-lg shadow-lg w-full"
            />
          </motion.div>

          {/* Text Content */}
          <motion.div variants={slideInFromRight} className="md:w-1/2">
            <h2 className="text-3xl font-bold font-montserrat mb-6 text-foreground">
              더 온밀과 특별한 <span className="bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text">비즈니스 파트너십</span>을 맺어보세요
            </h2>
            <p className="font-pretendard text-lg mb-6 text-muted-foreground">
              기업 행사, 케이터링, 직원 선물을 위한 대량 주문 및 정기 납품 서비스를 제공합니다. 더 온밀과 함께 특별한 비즈니스 파트너십을 맺어보세요.
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <i className="fa-solid fa-building bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text mt-1 mr-3 text-lg"></i>
                <span className="font-pretendard text-muted-foreground">맞춤형 기업 선물 세트 구성</span>
              </li>
              <li className="flex items-start">
                <i className="fa-solid fa-calendar-check bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text mt-1 mr-3 text-lg"></i>
                <span className="font-pretendard text-muted-foreground">정기 배송 및 일괄 배송 서비스</span>
              </li>
              <li className="flex items-start">
                <i className="fa-solid fa-handshake bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text mt-1 mr-3 text-lg"></i>
                <span className="font-pretendard text-muted-foreground">기업 로고 각인 및 맞춤 패키지 옵션</span>
              </li>
              <li className="flex items-start">
                <i className="fa-solid fa-tag bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text mt-1 mr-3 text-lg"></i>
                <span className="font-pretendard text-muted-foreground">대량 주문 할인 및 전용 견적 서비스</span>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Services Section */}
        <motion.div variants={fadeIn} className="mb-20">
          <h2 className="text-3xl font-bold font-montserrat mb-8 text-center text-foreground">
            기업 <span className="bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text">서비스 제안</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-secondary rounded-lg p-6 shadow-md text-center border border-border">
              <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mx-auto mb-4 border border-border">
                <i className="fa-solid fa-gift bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text text-2xl"></i>
              </div>
              <h3 className="font-montserrat text-xl font-semibold text-foreground mb-2">기업 선물</h3>
              <p className="font-pretendard text-muted-foreground">
                명절, 기념일 등 특별한 날에 직원 또는 고객에게 전달할 맞춤형 선물 세트를 제작합니다.
              </p>
            </div>

            <div className="bg-secondary rounded-lg p-6 shadow-md text-center border border-border">
              <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mx-auto mb-4 border border-border">
                <i className="fa-solid fa-utensils bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text text-2xl"></i>
              </div>
              <h3 className="font-montserrat text-xl font-semibold text-foreground mb-2">케이터링</h3>
              <p className="font-pretendard text-muted-foreground">
                회의, 행사, 세미나 등 기업 행사를 위한 신선한 베이커리 및 디저트 케이터링 서비스를 제공합니다.
              </p>
            </div>

            <div className="bg-secondary rounded-lg p-6 shadow-md text-center border border-border">
              <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mx-auto mb-4 border border-border">
                <i className="fa-solid fa-truck bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text text-2xl"></i>
              </div>
              <h3 className="font-montserrat text-xl font-semibold text-foreground mb-2">정기 납품</h3>
              <p className="font-pretendard text-muted-foreground">
                카페, 레스토랑, 호텔 등 외식업체에 더 온밀의 프리미엄 베이커리 제품을 정기적으로 납품합니다.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Inquiry Form */}
        <motion.div variants={fadeIn} className="bg-secondary text-foreground rounded-lg p-8 md:p-12 border border-border">
          <h2 className="text-3xl font-bold font-montserrat mb-8 text-center text-foreground">
            기업 <span className="bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text">문의하기</span>
          </h2>
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="b2bPageCompanyName" className="block text-sm font-medium text-muted-foreground mb-1">회사명</label>
                <input
                  type="text"
                  id="b2bPageCompanyName"
                  name="companyName"
                  autoComplete="organization"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                  className="w-full rounded-full bg-background border border-border text-foreground px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label htmlFor="b2bPageContactName" className="block text-sm font-medium text-muted-foreground mb-1">담당자명</label>
                <input
                  type="text"
                  id="b2bPageContactName"
                  name="contactName"
                  autoComplete="name"
                  value={formData.contactName}
                  onChange={handleChange}
                  required
                  className="w-full rounded-full bg-background border border-border text-foreground px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="b2bPageEmail" className="block text-sm font-medium text-muted-foreground mb-1">이메일</label>
                <input
                  type="email"
                  id="b2bPageEmail"
                  name="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-full bg-background border border-border text-foreground px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label htmlFor="b2bPagePhone" className="block text-sm font-medium text-muted-foreground mb-1">연락처</label>
                <input
                  type="tel"
                  id="b2bPagePhone"
                  name="phone"
                  autoComplete="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full rounded-full bg-background border border-border text-foreground px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="b2bPageEmployees" className="block text-sm font-medium text-muted-foreground mb-1">임직원 수</label>
              <select
                id="b2bPageEmployees"
                name="employees"
                autoComplete="off"
                value={formData.employees}
                onChange={handleChange}
                className="w-full rounded-full bg-background border border-border text-foreground px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
              >
                <option value="1-10">1-10명</option>
                <option value="10-50">10-50명</option>
                <option value="50-100">50-100명</option>
                <option value="100-500">100-500명</option>
                <option value="500+">500명 이상</option>
              </select>
            </div>

            <div className="mb-6">
              <label htmlFor="b2bPageMessage" className="block text-sm font-medium text-muted-foreground mb-1">문의 내용</label>
              <textarea
                id="b2bPageMessage"
                name="message"
                autoComplete="off"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                required
                className="w-full rounded-lg bg-background border border-border text-foreground px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              ></textarea>
            </div>

            <div className="text-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground font-medium py-3 px-8 rounded-full text-center transition-all duration-300 font-montserrat hover:shadow-lg hover:shadow-primary/20"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <i className="fa-solid fa-spinner fa-spin mr-2"></i> 처리 중...
                  </span>
                ) : '문의 보내기'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </motion.div>
    </>
  );
};

export default B2B;
