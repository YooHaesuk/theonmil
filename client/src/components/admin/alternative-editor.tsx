'use client';

import { useState, useRef, useEffect } from 'react';
import DOMPurify from 'dompurify';
import { toast } from '@/hooks/use-toast';

interface AlternativeEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: string;
}

const AlternativeEditor = ({
  value,
  onChange,
  placeholder = "상품 상세 정보를 입력하세요...",
  height = "400px"
}: AlternativeEditorProps) => {
  const [uploading, setUploading] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);

  // 🪄 이미지 자동 압축 및 WebP 변환 함수
  const compressImage = (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // 최대 1200px 제한 (화질 유지하며 리사이징)
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          // WebP 형식으로 압축 (품질 0.8 / 80%)
          canvas.toBlob(
            (blob) => {
              if (blob) resolve(blob);
              else reject(new Error('Canvas to Blob conversion failed'));
            },
            'image/webp',
            0.8
          );
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  // 이미지 업로드 핸들러
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "오류",
        description: "이미지 크기는 5MB 이하여야 합니다.",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);

    try {
      // 🚀 이미지 자동 최적화 적용
      const optimizedBlob = await compressImage(file);
      const optimizedFile = new File([optimizedBlob], `${file.name.split('.')[0]}.webp`, { type: 'image/webp' });

      console.log(`📉 에디터 이미지 최적화 완료: ${(file.size / 1024).toFixed(1)}KB -> ${(optimizedFile.size / 1024).toFixed(1)}KB`);

      const formData = new FormData();
      formData.append('image', optimizedFile); // 서버 API와 일치하도록 'image' 사용

      const response = await fetch('/api/images/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.success && result.data?.secure_url) {
        const imageUrl = result.data.secure_url;
        const imageHtml = `<img src="${imageUrl}" alt="상품 이미지" style="max-width: 100%; height: auto; border-radius: 8px; margin: 10px 0;" />`;

        // WYSIWYG 에디터에 이미지 삽입
        insertElement(imageHtml);

        toast({
          title: "성공",
          description: "이미지가 업로드되었습니다.",
        });
      } else {
        throw new Error(result.message || '업로드 결과가 올바르지 않습니다');
      }
    } catch (error) {
      console.error('이미지 업로드 오류:', error);
      toast({
        title: "오류",
        description: "이미지 업로드에 실패했습니다.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  // WYSIWYG 스타일 적용
  const applyStyle = (command: string, value?: string) => {
    if (!editorRef.current) return;

    editorRef.current.focus();
    document.execCommand(command, false, value);
    updateContent();
  };

  // 에디터 내용 업데이트
  const updateContent = () => {
    if (!editorRef.current) return;

    const content = editorRef.current.innerHTML;
    onChange(content);
  };

  // 에디터 초기화
  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = DOMPurify.sanitize(value);
    }
  }, [value]);

  // 특별한 요소 삽입
  const insertElement = (element: string) => {
    if (!editorRef.current) return;

    editorRef.current.focus();
    document.execCommand('insertHTML', false, element);
    updateContent();
  };

  return (
    <div className="relative">
      {/* 업로드 로딩 오버레이 */}
      {uploading && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-50 rounded-3xl">
          <div className="bg-white p-6 rounded-2xl border border-primary/20 shadow-2xl">
            <div className="flex flex-col items-center space-y-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="text-primary font-black text-sm">이미지 업로드 중...</span>
            </div>
          </div>
        </div>
      )}

      {/* 툴바 */}
      <div className="bg-secondary/30 border border-border/50 border-b-0 rounded-t-[2rem] p-4">
        <div className="flex items-center space-x-2 flex-wrap gap-2">
          {/* 텍스트 스타일 */}
          <div className="flex items-center p-1.5 bg-white/50 rounded-xl space-x-1 border border-border/30">
            <button
              type="button"
              onClick={() => applyStyle('bold')}
              className="w-10 h-10 flex items-center justify-center hover:bg-[#9a700a] hover:text-white text-muted-foreground rounded-lg transition-all"
              title="굵게"
            >
              <i className="fa-solid fa-bold text-sm"></i>
            </button>

            <button
              type="button"
              onClick={() => applyStyle('italic')}
              className="w-10 h-10 flex items-center justify-center hover:bg-[#9a700a] hover:text-white text-muted-foreground rounded-lg transition-all"
              title="기울임"
            >
              <i className="fa-solid fa-italic text-sm"></i>
            </button>

            <button
              type="button"
              onClick={() => applyStyle('underline')}
              className="w-10 h-10 flex items-center justify-center hover:bg-[#9a700a] hover:text-white text-muted-foreground rounded-lg transition-all"
              title="밑줄"
            >
              <i className="fa-solid fa-underline text-sm"></i>
            </button>
          </div>

          {/* 정렬 */}
          <div className="flex items-center p-1.5 bg-white/50 rounded-xl space-x-1 border border-border/30">
            <button
              type="button"
              onClick={() => applyStyle('justifyLeft')}
              className="w-10 h-10 flex items-center justify-center hover:bg-[#9a700a] hover:text-white text-muted-foreground rounded-lg transition-all"
              title="왼쪽 정렬"
            >
              <i className="fa-solid fa-align-left text-sm"></i>
            </button>

            <button
              type="button"
              onClick={() => applyStyle('justifyCenter')}
              className="w-10 h-10 flex items-center justify-center hover:bg-[#9a700a] hover:text-white text-muted-foreground rounded-lg transition-all"
              title="가운데 정렬"
            >
              <i className="fa-solid fa-align-center text-sm"></i>
            </button>

            <button
              type="button"
              onClick={() => applyStyle('justifyRight')}
              className="w-10 h-10 flex items-center justify-center hover:bg-[#9a700a] hover:text-white text-muted-foreground rounded-lg transition-all"
              title="오른쪽 정렬"
            >
              <i className="fa-solid fa-align-right text-sm"></i>
            </button>
          </div>

          {/* 제목 단계 */}
          <div className="flex items-center p-1.5 bg-white/50 rounded-xl space-x-1 border border-border/30">
            {['H1', 'H2', 'H3'].map((h) => (
              <button
                key={h}
                type="button"
                onClick={() => applyStyle('formatBlock', h.toLowerCase())}
                className="w-10 h-10 flex items-center justify-center hover:bg-[#9a700a] hover:text-white text-muted-foreground font-black text-xs rounded-lg transition-all"
                title={`제목 ${h.slice(1)}`}
              >
                {h}
              </button>
            ))}
          </div>

          {/* 목록 */}
          <div className="flex items-center p-1.5 bg-white/50 rounded-xl space-x-1 border border-border/30">
            <button
              type="button"
              onClick={() => applyStyle('insertUnorderedList')}
              className="w-10 h-10 flex items-center justify-center hover:bg-[#9a700a] hover:text-white text-muted-foreground rounded-lg transition-all"
              title="불렛 목록"
            >
              <i className="fa-solid fa-list-ul text-sm"></i>
            </button>

            <button
              type="button"
              onClick={() => applyStyle('insertOrderedList')}
              className="w-10 h-10 flex items-center justify-center hover:bg-[#9a700a] hover:text-white text-muted-foreground rounded-lg transition-all"
              title="숫자 목록"
            >
              <i className="fa-solid fa-list-ol text-sm"></i>
            </button>
          </div>

          {/* 특수 효과 */}
          <div className="flex items-center p-1.5 bg-white/50 rounded-xl space-x-1 border border-border/30">
            <button
              type="button"
              onClick={() => insertElement('<blockquote style="border-left: 5px solid #EAB308; padding: 1.5rem; margin: 1.5rem 0; background-color: #FEF9C3; border-radius: 0 1.5rem 1.5rem 0; font-style: italic; color: #854D0E;">인용구를 입력하세요.</blockquote>')}
              className="w-10 h-10 flex items-center justify-center hover:bg-[#9a700a] hover:text-white text-muted-foreground rounded-lg transition-all"
              title="인용구"
            >
              <i className="fa-solid fa-quote-left text-sm"></i>
            </button>

            <button
              type="button"
              onClick={() => applyStyle('createLink', prompt('링크 URL을 입력하세요:', 'https://'))}
              className="w-10 h-10 flex items-center justify-center hover:bg-[#9a700a] hover:text-white text-muted-foreground rounded-lg transition-all"
              title="링크"
            >
              <i className="fa-solid fa-link text-sm"></i>
            </button>
          </div>

          <div className="flex-1"></div>

          {/* 이미지 업로드 */}
          <label className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:scale-105 active:scale-95 text-white rounded-xl text-sm font-black transition-all cursor-pointer shadow-lg shadow-primary/20">
            <i className="fa-solid fa-image text-lg"></i>
            <span>이미지 삽입</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              disabled={uploading}
            />
          </label>
        </div>
      </div>

      {/* WYSIWYG 에디터 본문 */}
      <div
        ref={editorRef}
        contentEditable
        className="wysiwyg-editor w-full bg-white border border-border/50 border-t-0 rounded-b-[2rem] p-8 text-foreground text-base resize-none focus:outline-none focus:ring-4 focus:ring-primary/5 overflow-y-auto prose max-w-none transition-all"
        style={{
          height,
          minHeight: '300px',
          lineHeight: '1.8'
        }}
        onInput={updateContent}
        onFocus={() => setIsEditing(true)}
        onBlur={() => setIsEditing(false)}
        suppressContentEditableWarning={true}
        data-placeholder={placeholder}
      />

      <style dangerouslySetInnerHTML={{
        __html: `
        .wysiwyg-editor:empty:before {
          content: attr(data-placeholder);
          color: #adb5bd;
          font-style: italic;
        }
        .wysiwyg-editor h1 { font-size: 2.5rem; font-weight: 900; margin-bottom: 1.5rem; color: #1a1a1a; letter-spacing: -0.05em; }
        .wysiwyg-editor h2 { font-size: 2rem; font-weight: 800; margin-top: 2rem; margin-bottom: 1rem; color: #2a2a2a; border-left: 4px solid #EAB308; padding-left: 1rem; }
        .wysiwyg-editor h3 { font-size: 1.5rem; font-weight: 700; margin-top: 1.5rem; margin-bottom: 0.75rem; color: #3a3a3a; }
        .wysiwyg-editor p { margin-bottom: 1.25rem; color: #4a4a4a; line-height: 1.8; }
        .wysiwyg-editor ul { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 1.25rem; }
        .wysiwyg-editor ol { list-style-type: decimal; padding-left: 1.5rem; margin-bottom: 1.25rem; }
        .wysiwyg-editor li { margin-bottom: 0.5rem; color: #4a4a4a; }
        .wysiwyg-editor img {
          max-width: 100%;
          height: auto;
          border-radius: 1.5rem;
          margin: 2rem 0;
          box-shadow: 0 10px 30px rgba(0,0,0,0.05);
          border: 1px solid rgba(0,0,0,0.05);
        }
        .wysiwyg-editor blockquote {
          border-left: 5px solid #EAB308;
          background: #FEF9C3;
          padding: 1.5rem !important;
          margin: 2rem 0 !important;
          border-radius: 0 1.5rem 1.5rem 0;
          font-style: italic;
          color: #854D0E !important;
        }
        .wysiwyg-editor a {
          color: #EAB308 !important;
          font-weight: 700;
          text-decoration: underline;
        }
        `
      }} />
    </div>
  );
};

export default AlternativeEditor;
