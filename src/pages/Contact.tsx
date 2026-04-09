import { motion } from 'motion/react';
import { Mail, MessageCircle, FileText, CheckCircle } from 'lucide-react';

export default function Contact() {
  const materials = [
    {
      title: '필수 자료',
      items: [
        { label: 'CAD 도면, 입면 (손도면 가능)', desc: '치수 필수 기입' },
        { label: '마감재 리스트', desc: '또는 레퍼런스 이미지' },
        { label: '디자인 레퍼런스 이미지', desc: '톤, 조도, 가구 등 구체적일수록 좋음' },
        { label: '필수 요소 및 요구사항', desc: '강조하고 싶은 부분' },
      ],
    },
    {
      title: '선택 자료',
      items: [
        { label: '현장 사진 또는 위치', desc: '창밖 전경 및 조도 반영 가능' },
      ],
    },
  ];

  return (
    <div className="pt-40 pb-32 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
            {/* Left Side: Info */}
            <div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-8">CONTACT</h1>
              <p className="text-xl md:text-2xl font-medium text-neutral-800 mb-12 leading-tight">
                빠른 작업 상담이 필요하신가요? <br />
                자료를 보내주시면 바로 검토 후 답변드립니다.
              </p>

              <div className="space-y-6 mb-16">
                <a
                  href="mailto:hshsh0230@naver.com"
                  className="flex items-center gap-4 p-6 border border-neutral-100 rounded-2xl hover:bg-neutral-50 transition-all group"
                >
                  <div className="w-12 h-12 bg-neutral-900 text-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Mail size={20} />
                  </div>
                  <div>
                    <span className="block text-xs text-neutral-400 font-bold uppercase tracking-widest mb-1">Email</span>
                    <span className="text-lg font-bold">hshsh0230@naver.com</span>
                  </div>
                </a>
                <div className="flex items-center gap-4 p-6 border border-neutral-100 rounded-2xl hover:bg-neutral-50 transition-all group cursor-pointer">
                  <div className="w-12 h-12 bg-[#FEE500] text-neutral-900 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <MessageCircle size={20} fill="currentColor" />
                  </div>
                  <div>
                    <span className="block text-xs text-neutral-400 font-bold uppercase tracking-widest mb-1">Kakao Channel</span>
                    <span className="text-lg font-bold">LEESUN</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side: Materials */}
            <div className="bg-neutral-50 p-10 md:p-16 rounded-[2.5rem]">
              <div className="flex items-center gap-3 mb-10">
                <FileText size={24} className="text-neutral-900" />
                <h2 className="text-2xl font-bold tracking-tight">준비 자료 안내</h2>
              </div>

              <div className="space-y-12">
                {materials.map((section, idx) => (
                  <div key={idx}>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-6 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full" />
                      {section.title}
                    </h3>
                    <ul className="space-y-6">
                      {section.items.map((item, i) => (
                        <li key={i} className="flex gap-4">
                          <CheckCircle size={18} className="text-neutral-900 shrink-0 mt-1" />
                          <div>
                            <p className="font-bold text-neutral-800 mb-1">{item.label}</p>
                            <p className="text-sm text-neutral-500">→ {item.desc}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              
              <p className="mt-16 text-sm text-neutral-400 leading-relaxed">
                위 자료를 이메일이나 카카오 채널로 보내 주시면 <br />
                견적과 일정을 검토 후 바로 답변드립니다.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
