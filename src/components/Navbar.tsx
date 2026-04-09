import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'PROJECT', path: '/project' },
    { name: 'ABOUT', path: '/about' },
    { name: 'SERVICE', path: '/service' },
    { name: 'CONTACT', path: '/contact' },
  ];

  const isTransparent = isHome && !isScrolled;

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
      isTransparent 
        ? 'bg-transparent border-transparent' 
        : 'bg-white/80 backdrop-blur-md border-b border-neutral-100'
    }`}>
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className={`text-xl font-bold tracking-tighter transition-colors ${
          isTransparent ? 'text-white' : 'text-neutral-900'
        }`}>
          LEESUN
        </Link>
        
        <div className="hidden md:flex items-center gap-12">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-sm font-medium transition-colors ${
                isTransparent 
                  ? 'text-white/70 hover:text-white' 
                  : location.pathname.startsWith(item.path) ? 'text-neutral-900' : 'text-neutral-400 hover:text-neutral-900'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
