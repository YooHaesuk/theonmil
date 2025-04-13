import { motion } from 'framer-motion';
import { pageTransition } from '@/lib/animations';
import HeroSection from '@/components/home/hero-section';
import FeaturedProducts from '@/components/home/featured-products';
import AboutSection from '@/components/home/about-section';
import ProductCategories from '@/components/home/product-categories';
import ProcessSection from '@/components/home/process-section';
import ReviewsSection from '@/components/home/reviews-section';
import GiftSection from '@/components/home/gift-section';
import B2BSection from '@/components/home/b2b-section';
import StoresSection from '@/components/home/stores-section';
import NewsletterSection from '@/components/home/newsletter-section';

const Home = () => {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
    >
      <HeroSection />
      <FeaturedProducts />
      <AboutSection />
      <ProductCategories />
      <ProcessSection />
      <ReviewsSection />
      <GiftSection />
      <B2BSection />
      <StoresSection />
      <NewsletterSection />
    </motion.div>
  );
};

export default Home;
