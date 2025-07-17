import { motion } from 'framer-motion';
import { 
  ShoppingBag, 
  Heart, 
  User, 
  MessageCircle
} from 'lucide-react';

interface MobileNavProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  shortLabel: string;
}

const menuItems: MenuItem[] = [
  {
    id: 'shopping',
    label: 'MY 쇼핑',
    icon: ShoppingBag,
    shortLabel: '쇼핑'
  },
  {
    id: 'activity',
    label: 'MY 활동',
    icon: Heart,
    shortLabel: '활동'
  },
  {
    id: 'profile',
    label: 'MY 정보',
    icon: User,
    shortLabel: '정보'
  },
  {
    id: 'support',
    label: '고객지원',
    icon: MessageCircle,
    shortLabel: '지원'
  }
];

const MyPageMobileNav = ({ activeSection, onSectionChange }: MobileNavProps) => {
  return (
    <motion.div
      className="bg-[#111111] rounded-lg border border-[#222222] p-2"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* 탭 네비게이션 */}
      <div className="flex">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <motion.button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`
                flex-1 flex flex-col items-center gap-2 p-3 rounded-lg transition-all duration-300
                ${isActive
                  ? 'bg-gradient-to-r from-[#A78BFA] to-[#EC4899] text-white'
                  : 'text-gray-400 hover:bg-[#222222] hover:text-[#A78BFA]'
                }
              `}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className={`
                p-2 rounded-lg transition-colors duration-300
                ${isActive
                  ? 'bg-white/20'
                  : 'bg-[#222222]'
                }
              `}>
                <Icon
                  size={18}
                  className={isActive ? 'text-white' : 'text-gray-400'}
                />
              </div>

              <span className={`
                text-xs font-medium
                ${isActive ? 'text-white' : 'text-gray-400'}
              `}>
                {item.shortLabel}
              </span>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
};

export default MyPageMobileNav;
