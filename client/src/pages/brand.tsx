import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { pageTransition, fadeIn, slideInFromLeft, slideInFromRight } from '@/lib/animations';
import { headingClasses, buttonClasses } from '@/lib/fonts';
import { PageSEO } from '@/components/seo/page-seo';
import { seoData } from '@/lib/seo-data';

const Brand = () => {
  return (
    <>
      <PageSEO
        title={seoData.brand.title}
        description={seoData.brand.description}
        keywords={seoData.brand.keywords}
      />
      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageTransition}
        className="min-h-screen pt-40 pb-20 bg-background"
      >
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="flex flex-col items-center text-center mb-16">
          <motion.h1 variants={fadeIn} className="text-4xl font-bold font-montserrat mb-4 text-foreground">
            <span className="bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text">브랜드 이야기</span>
          </motion.h1>
          <motion.p variants={fadeIn} className="font-pretendard text-lg max-w-3xl mx-auto mb-8 text-muted-foreground">
            더 온밀은 2023년, 단 하나의 작은 오븐으로 시작했습니다. 처음부터 우리는 '온전한 밀의 맛'이라는 단순한 철학을 고수했습니다.
          </motion.p>
        </div>

        {/* Brand Story */}
        <div className="flex flex-col md:flex-row items-center gap-12 mb-20">
          <motion.div
            variants={slideInFromLeft}
            className="md:w-1/2"
          >
            <div className="bg-gradient-to-r from-primary/80 to-accent w-full h-64 md:h-96 rounded-lg shadow-lg flex items-center justify-center">
              <p className="text-2xl md:text-3xl text-primary-foreground font-bold font-montserrat">빵 제조 과정</p>
            </div>
          </motion.div>
          <motion.div
            variants={slideInFromRight}
            className="md:w-1/2"
          >
            <h2 className="text-3xl font-bold font-montserrat mb-6 text-foreground">
              <span className="bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text">시작의 순간</span>
            </h2>
            <p className="font-pretendard text-lg mb-6 text-muted-foreground">
              더 온밀은 2023년, 단 하나의 작은 오븐으로 시작했습니다. 처음부터 우리는 '온전한 밀의 맛'이라는 단순한 철학을 고수했습니다.
            </p>
            <p className="font-pretendard text-lg mb-6 text-muted-foreground">
              국내산 밀가루, 천연 발효종, 그리고 최소한의 첨가물만을 사용해 건강하고 맛있는 빵을 굽는 것. 그 철학은 지금도 변함없이 지켜지고 있습니다.
            </p>
            <p className="font-pretendard text-lg mb-6 text-muted-foreground">
              지역 중형마트 120여 곳에서 판매되며 많은 분들의 사랑을 받고 있는 더 온밀이 이제 온라인에서도 여러분을 찾아갑니다.
            </p>
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="text-center p-4 bg-secondary rounded-lg border border-border">
                <p className="font-montserrat text-xl font-bold bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text">120+</p>
                <p className="font-pretendard text-sm text-muted-foreground">입점 매장</p>
              </div>
              <div className="text-center p-4 bg-secondary rounded-lg border border-border">
                <p className="font-montserrat text-xl font-bold bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text">30+</p>
                <p className="font-pretendard text-sm text-muted-foreground">제품 라인업</p>
              </div>
              <div className="text-center p-4 bg-secondary rounded-lg border border-border">
                <p className="font-montserrat text-xl font-bold bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text">3,000+</p>
                <p className="font-pretendard text-sm text-muted-foreground">일 생산량</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Brand Philosophy */}
        <div className="flex flex-col md:flex-row-reverse items-center gap-12 mb-20">
          <motion.div
            variants={slideInFromRight}
            className="md:w-1/2"
          >
            <div className="bg-gradient-to-r from-accent to-primary/80 w-full h-64 md:h-96 rounded-lg shadow-lg flex items-center justify-center">
              <p className="text-2xl md:text-3xl text-primary-foreground font-bold font-montserrat">천연 발효 공정</p>
            </div>
          </motion.div>
          <motion.div
            variants={slideInFromLeft}
            className="md:w-1/2"
          >
            <h2 className="text-3xl font-bold font-montserrat mb-6 text-foreground">
              <span className="bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text">브랜드 철학</span>
            </h2>
            <p className="font-pretendard text-lg mb-6 text-muted-foreground">
              더 온밀의 모든 제품은 정직한 재료와 시간으로 만들어집니다. 우리는 화학 첨가물 대신 천연 발효의 맛과 향을 담아내기 위해 긴 시간 정성을 다합니다.
            </p>
            <div className="space-y-4 mb-8">
              <div className="flex items-start">
                <i className="fa-solid fa-check text-primary mt-1 mr-3"></i>
                <span className="font-pretendard text-muted-foreground">최소한의 첨가물로 건강한 맛을 추구합니다</span>
              </div>
              <div className="flex items-start">
                <i className="fa-solid fa-check text-primary mt-1 mr-3"></i>
                <span className="font-pretendard text-muted-foreground">국내산 농산물과 엄선된 재료만을 사용합니다</span>
              </div>
              <div className="flex items-start">
                <i className="fa-solid fa-check text-primary mt-1 mr-3"></i>
                <span className="font-pretendard text-muted-foreground">장인의 정성으로 매일 신선한 빵을 굽습니다</span>
              </div>
              <div className="flex items-start">
                <i className="fa-solid fa-check text-primary mt-1 mr-3"></i>
                <span className="font-pretendard text-muted-foreground">공정무역 원료를 적극적으로 도입합니다</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Safety & Quality Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <motion.h2 variants={fadeIn} className="text-3xl font-bold font-montserrat mb-4 text-foreground">
              <span className="bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text">안심하고 드실 수 있는 정직한 약속</span>
            </motion.h2>
            <motion.p variants={fadeIn} className="font-pretendard text-lg max-w-3xl mx-auto text-muted-foreground">
              더 온밀은 내 가족이 먹는다는 마음으로, 가장 깨끗하고 안전한 환경에서 정직한 빵을 굽습니다.
            </motion.p>
          </div>

          <motion.div
            variants={fadeIn}
            className="bg-secondary text-foreground rounded-lg p-8 md:p-12 border border-border shadow-sm"
          >
            <div className="flex flex-col md:flex-row items-center gap-12">
              <motion.div
                variants={slideInFromLeft}
                className="md:w-1/2 flex justify-center"
              >
                <div className="relative group p-2 bg-white rounded-lg shadow-xl border border-border">
                  <img
                    src="/assets/haccp.webp"
                    alt="HACCP 인증서"
                    className="rounded-md max-h-[500px] w-auto cursor-pointer transition-transform duration-500 hover:scale-[1.02]"
                    onClick={() => window.open('/assets/haccp.webp', '_blank')}
                  />
                  <div className="absolute bottom-6 right-6 bg-black/60 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-2">
                    <i className="fa-solid fa-magnifying-glass-plus"></i>
                    클릭하여 크게보기
                  </div>
                </div>
              </motion.div>

              <motion.div
                variants={slideInFromRight}
                className="md:w-1/2 space-y-8"
              >
                <div>
                  <h3 className="text-2xl font-bold font-montserrat text-primary mb-4 flex items-center gap-3">
                    <i className="fa-solid fa-shield-heart"></i>
                    우리 아이도 안심하고 먹는 빵
                  </h3>
                  <p className="font-pretendard text-muted-foreground leading-relaxed text-lg">
                    식품안전관리인증기준(HACCP)을 통과한 위생적인 시설에서 생산됩니다.
                    단순한 인증을 넘어, 매일 아침 철저한 위생 관리로 부모의 마음을 담아 안전하게 만듭니다.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-6 text-left">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                      <i className="fa-solid fa-microscope text-xl"></i>
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground mb-1">철저한 이물질 검사</h4>
                      <p className="text-muted-foreground text-sm">최첨단 금속 검출 공정을 통해 눈에 보이지 않는 작은 위험 요소까지 완벽하게 차단합니다.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                      <i className="fa-solid fa-temperature-high text-xl"></i>
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground mb-1">최적의 가열 공정</h4>
                      <p className="text-muted-foreground text-sm">HACCP 기준에 따른 엄격한 온도 제어로 빵 본연의 맛을 살리면서 모든 유해 성분을 완벽히 제어합니다.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                      <i className="fa-solid fa-certificate text-xl"></i>
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground mb-1">공인된 식품 안전성</h4>
                      <p className="text-muted-foreground text-sm">한국식품안전관리인증원의 엄격한 심사를 거쳐 인증받은 믿을 수 있는 제조 공정을 자랑합니다.</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* CTA Section */}
        <motion.div
          variants={fadeIn}
          className="bg-secondary text-foreground rounded-lg p-12 text-center border border-border"
        >
          <h2 className="font-montserrat text-3xl md:text-4xl font-bold mb-6">
            더 온밀의 <span className="bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text">철학</span>, 직접 맛보세요
          </h2>
          <p className="font-pretendard text-lg mb-8 max-w-2xl mx-auto text-muted-foreground">
            정직한 재료 and 장인의 손길로 만든 더 온밀의 제품을 지금 경험해보세요.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/products" className="px-6 py-3 rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground font-medium transition-all hover:opacity-90 hover:shadow-lg hover:shadow-primary/20">
              제품 보러가기
            </Link>
            <Link href="/stores" className="px-6 py-3 rounded-full bg-background border border-border text-foreground hover:bg-secondary transition-colors">
              매장 찾기
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.div>
    </>
  );
};

export default Brand;
