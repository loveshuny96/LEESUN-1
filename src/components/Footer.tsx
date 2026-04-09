import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-neutral-50 border-t border-neutral-100 py-20 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-xl font-bold tracking-tighter mb-6">LEESUN</h2>
          <p className="text-neutral-500 text-sm leading-relaxed max-w-xs">
            협업이 편한 3D파트너 이선입니다. 단순한 이미지 제작이 아닌 실제 목적에 맞는 공간을 구현하는 것을 목표로 합니다.
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-8">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-6">Menu</h3>
            <ul className="space-y-4">
              <li><Link to="/project" className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors">Project</Link></li>
              <li><Link to="/about" className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors">About</Link></li>
              <li><Link to="/service" className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors">Service</Link></li>
              <li><Link to="/contact" className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-6">Contact</h3>
            <ul className="space-y-4">
              <li className="text-sm text-neutral-600">hshsh0230@naver.com</li>
              <li className="text-sm text-neutral-600">KaKao: LEESUN</li>
              <li><Link to="/admin" className="text-xs text-neutral-300 hover:text-neutral-500 transition-colors">Admin</Link></li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-neutral-200 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-xs text-neutral-400">© 2026 LEESUN. All rights reserved.</p>
        <p className="text-xs text-neutral-400">Designed with precision.</p>
      </div>
    </footer>
  );
}
