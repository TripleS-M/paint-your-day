import { motion } from 'motion/react';
import { Grid3x3, Palette, Sparkles, Sun } from 'lucide-react';

interface NavigationProps {
  activeScreen: string;
  onScreenChange: (screen: string) => void;
}

export function Navigation({ activeScreen, onScreenChange }: NavigationProps) {
  const navItems = [
    { id: 'today', icon: Sun, label: 'Today' },
    { id: 'mosaic', icon: Grid3x3, label: 'Mosaic' },
    { id: 'categories', icon: Palette, label: 'Categories' },
    { id: 'insights', icon: Sparkles, label: 'Insights' },
  ];

  return (
    <nav className="bg-white border-t border-gray-200">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeScreen === item.id;
          
          return (
            <motion.button
              key={item.id}
              onClick={() => onScreenChange(item.id)}
              className="flex flex-col items-center justify-center gap-1 p-2 relative"
              whileTap={{ scale: 0.9 }}
            >
              <Icon
                className="w-5 h-5"
                style={{
                  color: isActive ? '#000' : '#9CA3AF',
                  strokeWidth: isActive ? 2.5 : 2,
                }}
              />
              <span
                className="text-xs"
                style={{
                  color: isActive ? '#000' : '#9CA3AF',
                  fontWeight: isActive ? 600 : 400,
                }}
              >
                {item.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-1 h-1 bg-black rounded-full"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}