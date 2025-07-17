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
      const formData = new FormData();
      formData.append('image', file); // 서버 API와 일치하도록 'image' 사용

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
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 rounded-lg">
          <div className="bg-[#1A1A1A] p-4 rounded-lg border border-[#333333]">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-400"></div>
              <span className="text-white">이미지 업로드 중...</span>
            </div>
          </div>
        </div>
      )}

      {/* 툴바 */}
      <div className="bg-[#1A1A1A] border border-[#333333] border-b-0 rounded-t-lg p-3">
        <div className="flex items-center space-x-2 flex-wrap gap-2">
          {/* 텍스트 스타일 */}
          <div className="flex items-center space-x-1">
            <button
              type="button"
              onClick={() => applyStyle('bold')}
              className="px-3 py-1 bg-[#333333] hover:bg-[#444444] text-white rounded text-sm transition-colors"
              title="굵게"
            >
              <strong>B</strong>
            </button>

            <button
              type="button"
              onClick={() => applyStyle('italic')}
              className="px-3 py-1 bg-[#333333] hover:bg-[#444444] text-white rounded text-sm transition-colors"
              title="기울임"
            >
              <em>I</em>
            </button>

            <button
              type="button"
              onClick={() => applyStyle('underline')}
              className="px-3 py-1 bg-[#333333] hover:bg-[#444444] text-white rounded text-sm transition-colors"
              title="밑줄"
            >
              <u>U</u>
            </button>
          </div>

          <div className="border-l border-[#555555] h-6"></div>

          {/* 제목 */}
          <div className="flex items-center space-x-1">
            <button
              type="button"
              onClick={() => applyStyle('formatBlock', 'h1')}
              className="px-2 py-1 bg-[#333333] hover:bg-[#444444] text-white rounded text-xs transition-colors"
              title="제목 1"
            >
              H1
            </button>

            <button
              type="button"
              onClick={() => applyStyle('formatBlock', 'h2')}
              className="px-2 py-1 bg-[#333333] hover:bg-[#444444] text-white rounded text-xs transition-colors"
              title="제목 2"
            >
              H2
            </button>

            <button
              type="button"
              onClick={() => applyStyle('formatBlock', 'h3')}
              className="px-2 py-1 bg-[#333333] hover:bg-[#444444] text-white rounded text-xs transition-colors"
              title="제목 3"
            >
              H3
            </button>
          </div>

          <div className="border-l border-[#555555] h-6"></div>

          {/* 리스트 */}
          <div className="flex items-center space-x-1">
            <button
              type="button"
              onClick={() => applyStyle('insertUnorderedList')}
              className="px-2 py-1 bg-[#333333] hover:bg-[#444444] text-white rounded text-xs transition-colors"
              title="순서 없는 목록"
            >
              • 목록
            </button>

            <button
              type="button"
              onClick={() => applyStyle('insertOrderedList')}
              className="px-2 py-1 bg-[#333333] hover:bg-[#444444] text-white rounded text-xs transition-colors"
              title="순서 있는 목록"
            >
              1. 목록
            </button>
          </div>

          <div className="border-l border-[#555555] h-6"></div>

          {/* 특별 요소 */}
          <div className="flex items-center space-x-1">
            <button
              type="button"
              onClick={() => applyStyle('blockquote', 'style="border-left: 4px solid #A78BFA; padding-left: 16px; margin: 16px 0; font-style: italic; color: #cccccc; background: rgba(167, 139, 250, 0.1); border-radius: 0 4px 4px 0; padding: 12px 16px;"')}
              className="px-2 py-1 bg-[#333333] hover:bg-[#444444] text-white rounded text-xs transition-colors"
              title="인용구"
            >
              " 인용
            </button>

            <button
              type="button"
              onClick={() => applyStyle('a', 'href="#" style="color: #A78BFA; text-decoration: underline;"')}
              className="px-2 py-1 bg-[#333333] hover:bg-[#444444] text-white rounded text-xs transition-colors"
              title="링크"
            >
              🔗 링크
            </button>
          </div>

          <div className="border-l border-[#555555] h-6"></div>

          {/* 이미지 업로드 */}
          <label className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm transition-colors cursor-pointer">
            <i className="fa-solid fa-image mr-1"></i>
            이미지
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

      {/* WYSIWYG 에디터 */}
      <div
        ref={editorRef}
        contentEditable
        className="wysiwyg-editor w-full bg-[#111111] border border-[#333333] border-t-0 rounded-b-lg p-4 text-white text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-400 overflow-y-auto prose prose-invert max-w-none"
        style={{
          height,
          minHeight: '200px',
          lineHeight: '1.6'
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
          color: #666;
          font-style: italic;
        }
        .wysiwyg-editor h1, .wysiwyg-editor h2, .wysiwyg-editor h3 {
          color: #ffffff !important;
          font-weight: bold;
        }
        .wysiwyg-editor p, .wysiwyg-editor li {
          color: #ffffff !important;
        }
        .wysiwyg-editor img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin: 10px 0;
        }
        .wysiwyg-editor blockquote {
          border-left: 4px solid #A78BFA;
          background: rgba(167, 139, 250, 0.1);
          color: #cccccc !important;
        }
        .wysiwyg-editor a {
          color: #A78BFA !important;
        }
        `
      }} />


    </div>
  );
};

export default AlternativeEditor;
