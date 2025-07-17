import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';
import { Star, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { fadeIn } from '@/lib/animations';

interface ReviewWriteProps {
  orderId?: string;
  productName?: string;
  onClose?: () => void;
  onReviewSaved?: (review: any) => void;
}

const ReviewWrite = ({ orderId, productName, onClose, onReviewSaved }: ReviewWriteProps) => {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    console.log('🚀 리뷰 제출 시작!');
    console.log('📝 입력된 내용:', { rating, content: content.trim(), orderId, productName });

    if (!content.trim()) {
      toast({
        title: "리뷰 내용을 입력해주세요 📝",
        description: "다른 고객들에게 도움이 되는 리뷰를 작성해보세요.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // 실제 리뷰 저장 로직 (Firebase 등)
      const newReview = {
        id: `review-${Date.now()}`,
        userId: user?.uid,
        orderId,
        productId: orderId, // 임시로 orderId 사용
        productName,
        rating,
        content: content.trim(),
        createdAt: { toDate: () => new Date() },
        isEdited: false
      };

      console.log('💾 리뷰 저장 데이터:', newReview);

      // 부모 컴포넌트에 새 리뷰 전달
      if (onReviewSaved) {
        console.log('📤 부모 컴포넌트에 리뷰 전달 중...');
        onReviewSaved(newReview);
        console.log('✅ 부모 컴포넌트에 리뷰 전달 완료');
      } else {
        console.log('❌ onReviewSaved 콜백이 없습니다!');
      }

      // 성공 토스트
      toast({
        title: "리뷰가 작성되었습니다! ⭐",
        description: `${productName}에 대한 소중한 리뷰 감사합니다.`,
        variant: "default",
      });

      // 리뷰 작성 폼 닫기
      if (onClose) {
        console.log('🔚 리뷰 작성 폼 닫기');
        onClose();
      }
      
    } catch (error) {
      console.error('❌ 리뷰 저장 실패:', error);
      toast({
        title: "리뷰 저장에 실패했습니다 😞",
        description: "잠시 후 다시 시도해주세요.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (onClose) {
      onClose();
    } else {
      setLocation('/mypage/shopping');
    }
  };

  return (
    <motion.div 
      variants={fadeIn}
      initial="initial"
      animate="animate"
      className="space-y-6"
    >
      {/* 안내 문구 */}
      <div className="bg-gradient-to-r from-[#F59E0B]/20 to-[#D97706]/20 border border-[#F59E0B]/50 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-gradient-to-r from-[#F59E0B] to-[#D97706] rounded-full flex items-center justify-center">
            <span className="text-white text-sm">📝</span>
          </div>
          <h3 className="text-lg font-bold text-white">리뷰 작성 안내</h3>
        </div>
        <p className="text-gray-300 mb-2">
          <strong className="text-[#F59E0B]">구매완료된 상품에 대한 리뷰를 작성해보세요!</strong>
        </p>
        <p className="text-gray-400 text-sm">
          • MY 쇼핑에서 구매완료된 주문의 "리뷰 작성" 버튼을 클릭하세요<br />
          • 리뷰는 언제든지 작성 가능하며, 작성 후 14일 이내 수정 가능합니다
        </p>
      </div>

      {/* 리뷰 작성 폼 */}
      <div className="bg-[#0A0A0A] border border-[#333] rounded-xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={handleCancel}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-bold text-white">리뷰 작성</h2>
        </div>

        {/* 상품 정보 */}
        {productName && (
          <div className="mb-6 p-4 bg-[#111] rounded-lg border border-[#333]">
            <p className="text-gray-400 text-sm mb-1">리뷰 작성 상품</p>
            <p className="text-white font-medium">{productName}</p>
          </div>
        )}

        {/* 별점 선택 */}
        <div className="mb-6">
          <label className="block text-white font-medium mb-3">별점 평가</label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className="transition-all hover:scale-110"
              >
                <Star
                  className={`w-8 h-8 ${
                    star <= rating 
                      ? 'text-[#F59E0B] fill-current' 
                      : 'text-gray-600 hover:text-[#F59E0B]'
                  }`}
                />
              </button>
            ))}
            <span className="ml-3 text-white font-medium">
              {rating}점
            </span>
          </div>
        </div>

        {/* 리뷰 내용 */}
        <div className="mb-8">
          <label className="block text-white font-medium mb-3">리뷰 내용</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="상품에 대한 솔직한 후기를 작성해주세요. 다른 고객들에게 큰 도움이 됩니다."
            className="w-full h-32 p-4 bg-[#111] border border-[#333] rounded-lg text-white placeholder-gray-500 resize-none focus:border-[#F59E0B] focus:ring-2 focus:ring-[#F59E0B]/20 transition-all"
            maxLength={500}
          />
          <div className="flex justify-between items-center mt-2">
            <p className="text-gray-500 text-sm">최대 500자까지 입력 가능합니다.</p>
            <p className="text-gray-400 text-sm">{content.length}/500</p>
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="flex gap-4">
          <button
            onClick={handleCancel}
            className="flex-1 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
            disabled={isSubmitting}
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !content.trim()}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-[#F59E0B] to-[#D97706] hover:from-[#D97706] hover:to-[#B45309] text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? '저장 중...' : '리뷰 작성 완료'}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ReviewWrite;
