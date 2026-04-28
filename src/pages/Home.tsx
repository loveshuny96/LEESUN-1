import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export default function Home() {
  const trustElements = [
    {
      title: '평균 2~3일 빠른 납기',
      desc: '신속하고 정확한 작업으로\n프로젝트 일정을 준수합니다',
    },
    {
      title: '수정 유연 대응',
      desc: '고객의 피드백을 적극 반영하여\n최상의 결과물을 만듭니다',
    },
    {
      title: '실사용 기준 섬세한 조도 & 재질 표현',
      desc: '실사용 기준의 정교한 표현으로\n설득력을 높입니다',
    },
  ];

  return (
    <div className="pt-0"> {/* Removed pt-20 to allow hero to be full screen */}
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          {/* PC Background */}
          <img 
            src="https://lh3.googleusercontent.com/d/1H-6ewYYwgassgkmCrkprb4c1ykNaxCIa" 
            alt="Background PC"
            className="hidden md:block w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          {/* Mobile Background */}
          <img 
            src="https://lh3.googleusercontent.com/d/1H-6ewYYwgassgkmCrkprb4c1ykNaxCIa" 
            alt="Background Mobile"
            className="block md:hidden w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <motion.div
          className="relative z-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-8 text-balance text-white leading-tight tracking-normal lg:tracking-tighter">
            빠르고 수정 편한 <br className="lg:hidden" /> 3D 파트너
          </h1>
          <p className="text-base sm:text-lg md:text-xl font-medium mb-12 text-neutral-200 tracking-wide">
            합리적인 비용으로 <br className="lg:hidden" /> 빠른 결과물을 제공합니다.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/portfolio"
              className="px-8 py-4 bg-white text-neutral-900 rounded-full font-medium hover:bg-neutral-100 transition-all flex items-center gap-2 group"
            >
              포트폴리오
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/contact"
              className="px-8 py-4 border border-white/30 text-white rounded-full font-medium hover:bg-white/10 transition-all"
            >
              문의하기
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Trust Section */}
      <section className="py-32 px-6 bg-neutral-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-24">
            {trustElements.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col gap-6"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={24} className="text-neutral-900" />
                  <h3 className="text-lg md:text-xl font-bold tracking-normal">{item.title}</h3>
                </div>
                <p className="text-neutral-500 leading-relaxed whitespace-pre-line text-sm md:text-base">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
