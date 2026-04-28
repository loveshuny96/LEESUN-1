import { motion } from 'motion/react';

export default function Service() {
  const services = [
    {
      title: '제공 항목',
      items: [
        '스케치업 파일 제공',
        '렌더링 컷 제한 없이 제작 (이벤트 ~2026.09)',
      ],
    },
    {
      title: '작업 진행',
      items: [
        '평면도 / 레퍼런스 기반 모델링',
        '실사용 기준 렌더링 제작',
        '평균 작업 기간 2~3일 (50py 이하)',
      ],
    },
    {
      title: '수정 안내',
      items: [
        '디테일 수정은 유연하게 대응',
        '전체 구조 변경 시 별도 안내 후 진행',
      ],
    },
  ];

  const processes = [
    '문의 및 자료 전달',
    '견적 안내, 일정 협의',
    '모델링 작업',
    '1차 시안 전달 및 피드백',
    '수정 및 보완',
    '최종 납품',
  ];

  return (
    <div className="pt-40 pb-32 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-normal md:tracking-tight lg:tracking-tighter mb-24">SERVICE</h1>

          {/* Work Info */}
          <section className="mb-40">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
              {services.map((service, idx) => (
                <div key={idx}>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-8">{service.title}</h3>
                  <ul className="space-y-4">
                    {service.items.map((item, i) => (
                      <li key={i} className="text-neutral-700 font-medium leading-relaxed">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Process */}
          <section className="mb-40">
            <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-12">Process</h2>
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-0">
              {processes.map((step, idx) => (
                <div key={idx} className="flex flex-col md:flex-row items-center flex-1">
                  <div className="px-6 py-8 bg-neutral-50 border border-neutral-100 rounded-2xl text-center w-full">
                    <span className="block text-xs text-neutral-400 mb-2">0{idx + 1}</span>
                    <span className="text-sm font-bold text-neutral-800">{step}</span>
                  </div>
                  {idx < processes.length - 1 && (
                    <div className="h-8 w-px md:h-px md:w-8 bg-neutral-200" />
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Pricing */}
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-12">Pricing</h2>
            <div className="bg-neutral-900 text-white p-12 md:p-20 rounded-[2rem]">
              <div className="max-w-2xl">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 tracking-normal md:tracking-tight">기본 정책</h3>
                <p className="text-xl md:text-2xl text-neutral-400 mb-12 leading-relaxed">
                  프로젝트 기준 견적 진행 <br />
                  참고 단가: <span className="text-white">평당 9,000원~</span>
                </p>
                <div className="space-y-4 text-neutral-500 text-sm md:text-base">
                  <p>작업 난이도, 공간 유형, 컷 수에 따라 변동됩니다.</p>
                  <p>정확한 견적은 자료 검토 후 안내드립니다.</p>
                </div>
              </div>
            </div>
          </section>
        </motion.div>
      </div>
    </div>
  );
}
