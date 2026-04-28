import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Project } from '../types';
import { db } from '../firebase';
import { doc, onSnapshot, collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../lib/firestoreUtils';

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState<Project | undefined>(undefined);
  const [projectImages, setProjectImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    // 1. Listen to Project Metadata
    const unsubProject = onSnapshot(doc(db, 'projects', id), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as Project;
        setProject({ id: docSnap.id, ...data });
        
        // Legacy fallback: if no separate images found yet, use images from main doc
        setProjectImages(prev => prev.length === 0 ? (data.images || []) : prev);
      } else {
        setProject(undefined);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `projects/${id}`);
      setLoading(false);
    });

    // 2. Listen to Project Images (Separate Collection)
    const q = query(
      collection(db, 'project_images'), 
      where('projectId', '==', id)
    );
    
    const unsubImages = onSnapshot(q, (snap) => {
      if (!snap.empty) {
        const docs = snap.docs.map(d => d.data());
        // Sort client-side to avoid composite index requirement
        docs.sort((a, b) => (a.order || 0) - (b.order || 0));
        const imgs = docs.map(d => d.image);
        setProjectImages(imgs);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching project images:", error);
      setLoading(false);
    });

    return () => {
      unsubProject();
      unsubImages();
    };
  }, [id]);

  if (loading) {
    return (
      <div className="pt-40 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900 mx-auto"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="pt-40 text-center">
        <p>프로젝트를 찾을 수 없습니다.</p>
        <Link to="/portfolio" className="text-neutral-500 underline mt-4 block">목록으로 돌아가기</Link>
      </div>
    );
  }

  return (
    <div className="pt-20">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <Link
          to="/portfolio"
          className="inline-flex items-center gap-2 text-sm font-medium text-neutral-400 hover:text-neutral-900 transition-colors mb-12 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          BACK TO PORTFOLIO
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Sticky Info Sidebar */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-32 space-y-12">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 block mb-4">
                  {project.category}
                </span>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tighter mb-6">
                  {project.title}
                </h1>
                <p className="text-neutral-500 leading-relaxed">
                  {project.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-8 py-8 border-y border-neutral-100">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-300 block mb-2">Year</span>
                  <span className="text-lg font-bold text-neutral-800">{project.year}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-300 block mb-2">Area</span>
                  <span className="text-lg font-bold text-neutral-800">{project.area}</span>
                </div>
              </div>

              <div>
                <div className="flex flex-wrap gap-2">
                  {project.tools?.map((tool) => (
                    <span
                      key={tool}
                      className="px-3 py-1 bg-neutral-50 text-neutral-600 text-[11px] font-bold rounded-full"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Image Gallery */}
          <div className="lg:col-span-8 space-y-8">
            {projectImages.filter(img => img && img.trim() !== '').map((img, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="rounded-3xl overflow-hidden bg-neutral-100"
              >
                <img
                  src={img}
                  alt={`${project.title} ${idx + 1}`}
                  className="w-full h-auto object-cover"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
