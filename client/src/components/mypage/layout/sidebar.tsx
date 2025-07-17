import { motion } from 'framer-motion';
import { 
  ShoppingBag, 
  Heart, 
  User, 
  MessageCircle,
  Package,
  Star,
  Settings,
  HelpCircle
} from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  description: string;
}

const menuItems: MenuItem[] = [
  {
    id: 'shopping',
    label: 'MY 쇼핑',
    icon: ShoppingBag,
    description: '주문관리'
  },
  {
    id: 'activity',
    label: 'MY 활동',
    icon: Heart,
    description: '찜/관심상품'
  },
  {
    id: 'profile',
    label: 'MY 정보',
    icon: User,
    description: '개인정보관리'
  },
  {
    id: 'support',
    label: '고객지원',
    icon: MessageCircle,
    description: '문의/도움말'
  }
];

const MyPageSidebar = ({ activeSection, onSectionChange }: SidebarProps) => {
  return (
    <motion.div
      className="bg-[#111111] rounded-lg border border-[#222222] p-6"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* 사이드바 헤더 */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-white mb-2">메뉴</h2>
        <div className="w-12 h-1 bg-gradient-to-r from-[#A78BFA] to-[#EC4899] rounded-full"></div>
      </div>

      {/* 메뉴 아이템들 */}
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <motion.button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`
                w-full flex items-center gap-4 p-4 rounded-lg text-left transition-all duration-300
                ${isActive
                  ? 'bg-gradient-to-r from-[#A78BFA] to-[#EC4899] text-white shadow-lg shadow-purple-500/25'
                  : 'text-gray-400 hover:bg-[#222222] hover:text-[#A78BFA]'
                }
              `}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className={`
                p-2 rounded-lg transition-colors duration-300
                ${isActive
                  ? 'bg-white/20'
                  : 'bg-[#222222] group-hover:bg-[#333333]'
                }
              `}>
                <Icon
                  size={20}
                  className={isActive ? 'text-white' : 'text-gray-400'}
                />
              </div>

              <div className="flex-1">
                <div className={`font-semibold ${isActive ? 'text-white' : 'text-white'}`}>
                  {item.label}
                </div>
                <div className={`text-sm ${isActive ? 'text-white/80' : 'text-gray-500'}`}>
                  {item.description}
                </div>
              </div>
            </motion.button>
          );
        })}
      </nav>

      {/* 하단 추가 정보 */}
      <div className="mt-8 pt-6 border-t border-[#222222]">
        <div className="text-center">
          <div className="text-sm text-gray-400 mb-2">더 온밀과 함께</div>
          <div className="text-xs text-gray-500">따뜻한 빵, 진심을 담아</div>
        </div>
      </div>
    </motion.div>
  );
};

export default MyPageSidebar;
