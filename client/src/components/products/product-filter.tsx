import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { ProductCategory, categoryDisplayNames } from '@/lib/products';

interface ProductFilterProps {
  selectedCategory: ProductCategory | '';
  setSelectedCategory: (category: ProductCategory | '') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const ProductFilter = ({
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery
}: ProductFilterProps) => {
  const [location, setLocation] = useLocation();
  const [tempSearchQuery, setTempSearchQuery] = useState(searchQuery);
  
  // Handle category change
  const handleCategoryChange = (category: ProductCategory | '') => {
    setSelectedCategory(category);
    
    // Update URL with the selected category
    if (category) {
      setLocation(`/products?category=${category}`, { replace: true });
    } else {
      setLocation('/products', { replace: true });
    }
  };
  
  // Handle search form submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(tempSearchQuery);
  };
  
  // Update tempSearchQuery when searchQuery changes
  useEffect(() => {
    setTempSearchQuery(searchQuery);
  }, [searchQuery]);
  
  return (
    <div className="mb-8">
      <div className="bg-[#111111] rounded-lg shadow-md p-6 mb-8 border border-[#222222]">
        {/* Search form */}
        <form className="mb-6" onSubmit={handleSearchSubmit}>
          <div className="relative">
            <input
              type="text"
              placeholder="제품명 또는 키워드로 검색"
              value={tempSearchQuery}
              onChange={(e) => setTempSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full bg-[#1A1A2A] border border-[#333333] text-white focus:outline-none focus:ring-2 focus:ring-[#A78BFA] focus:border-transparent"
            />
            <button
              type="submit"
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            >
              <i className="fa-solid fa-search"></i>
            </button>
            {tempSearchQuery && (
              <button
                type="button"
                onClick={() => {
                  setTempSearchQuery('');
                  setSearchQuery('');
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <i className="fa-solid fa-times"></i>
              </button>
            )}
          </div>
        </form>
        
        {/* Categories */}
        <div>
          <h3 className="font-montserrat font-semibold mb-3 text-white">카테고리</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleCategoryChange('')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === '' 
                  ? 'bg-gradient-to-r from-[#A78BFA] to-[#EC4899] text-white' 
                  : 'bg-[#1A1A2A] text-white hover:bg-[#222233]'
              }`}
            >
              전체
            </button>
            {(Object.keys(categoryDisplayNames) as ProductCategory[]).map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category 
                    ? 'bg-gradient-to-r from-[#A78BFA] to-[#EC4899] text-white' 
                    : 'bg-[#1A1A2A] text-white hover:bg-[#222233]'
                }`}
              >
                {categoryDisplayNames[category]}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Active filters indicators */}
      {(selectedCategory || searchQuery) && (
        <div className="flex items-center gap-2 mb-6">
          <span className="text-sm text-gray-500">활성 필터:</span>
          {selectedCategory && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#D4AF37] text-white">
              {categoryDisplayNames[selectedCategory]}
              <button
                onClick={() => handleCategoryChange('')}
                className="ml-1 focus:outline-none"
              >
                <i className="fa-solid fa-times"></i>
              </button>
            </span>
          )}
          {searchQuery && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#D4AF37] text-white">
              "{searchQuery}"
              <button
                onClick={() => setSearchQuery('')}
                className="ml-1 focus:outline-none"
              >
                <i className="fa-solid fa-times"></i>
              </button>
            </span>
          )}
          {(selectedCategory || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCategory('');
                setSearchQuery('');
                setLocation('/products', { replace: true });
              }}
              className="text-sm text-[#D4AF37] hover:underline ml-auto"
            >
              모든 필터 지우기
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductFilter;
