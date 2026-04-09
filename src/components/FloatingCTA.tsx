import { motion } from 'motion/react';
import { MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FloatingCTA() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-8 right-8 z-50"
    >
      <Link
        to="/contact"
        className="flex items-center gap-3 bg-neutral-900 text-white px-6 py-4 rounded-full shadow-2xl hover:bg-neutral-800 transition-all group"
      >
        <MessageSquare size={20} className="group-hover:scale-110 transition-transform" />
        <span className="font-medium text-sm">Contact</span>
      </Link>
    </motion.div>
  );
}
