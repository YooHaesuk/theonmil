'use client';

import { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';

interface HtmlContentRendererProps {
  content: string;
  className?: string;
}

const HtmlContentRenderer = ({ content, className = '' }: HtmlContentRendererProps) => {
  const [sanitizedContent, setSanitizedContent] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined' && content) {
      // DOMPurify 설정
      const config = {
        ALLOWED_TAGS: [
          'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
          'p', 'br', 'strong', 'em', 'u', 's',
          'ul', 'ol', 'li',
          'blockquote', 'pre', 'code',
          'a', 'img',
          'div', 'span'
        ],
        ALLOWED_ATTR: [
          'href', 'target', 'rel',
          'src', 'alt', 'width', 'height',
          'style', 'class',
          'data-*', 'onerror'
        ],
        ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp|data):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
      };

      // HTML 새니타이징
      let clean = DOMPurify.sanitize(content, config);

      // 이미지 에러 처리 추가
      clean = clean.replace(
        /<img([^>]*?)>/g,
        '<img$1 onerror="this.style.display=\'none\'; console.error(\'이미지 로드 실패:\', this.src);">'
      );

      setSanitizedContent(clean);
    }
  }, [content]);

  if (!content) {
    return null;
  }

  return (
    <div 
      className={`html-content-renderer ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
};

export default HtmlContentRenderer;
