import { motion } from 'motion/react';

export default function About() {
  const programs = ['Sketchup', 'Enscape', 'Photoshop'];

  return (
    <div className="pt-40 pb-32 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-normal md:tracking-tight lg:tracking-tighter mb-16">ABOUT</h1>
          
          <div className="space-y-12 mb-24">
            <p className="text-xl sm:text-2xl md:text-3xl leading-snug tracking-normal md:tracking-tight text-neutral-800">
              협업이 편한 3D 파트너 <br className="md:hidden" /> 이선입니다.
            </p>
            <p className="text-lg md:text-xl leading-relaxed text-neutral-500 max-w-2xl">
              단순한 이미지 제작이 아닌 실제 목적에 맞는 공간을 구현하는 것을 목표로 합니다. 
              공간의 설계 의도와 방향을 충분히 고려하며 클라이언트와 함께 결과를 만들어나갑니다.
            </p>
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-8">Software</h2>
            <div className="flex flex-wrap gap-4">
              {programs.map((program) => (
                <div
                  key={program}
                  className="px-6 py-3 border border-neutral-200 rounded-full text-sm font-medium text-neutral-600"
                >
                  {program}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
