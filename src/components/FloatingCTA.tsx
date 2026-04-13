import { motion } from 'motion/react';
import { MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FloatingCTA() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-8 right-8 z-50"
    >
      <a
        href="http://pf.kakao.com/_xadvEX"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 bg-[#FEE500] text-neutral-900 px-6 py-4 rounded-full shadow-2xl hover:bg-[#FADA0A] transition-all group"
      >
        <MessageCircle size={20} fill="currentColor" className="group-hover:scale-110 transition-transform" />
        <span className="font-bold text-sm">Kakao Talk</span>
      </a>
    </motion.div>
  );
}
