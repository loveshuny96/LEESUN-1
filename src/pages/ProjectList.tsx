import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CATEGORIES } from '../constants';
import ProjectCard from '../components/ProjectCard';
import { Category, Project } from '../types';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../lib/firestoreUtils';

export default function ProjectList() {
  const [selectedCategory, setSelectedCategory] = useState<Category | 'ALL'>('ALL');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const q = query(collection(db, 'projects'), orderBy('order', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const projs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
      setProjects(projs);
      setLoading(false);
      setError(null);
    }, (err) => {
      console.error("Firestore error:", err);
      setError("데이터를 불러오는 중 오류가 발생했습니다.");
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const filteredProjects = useMemo(() => {
    if (selectedCategory === 'ALL') return projects;
    return projects.filter((p) => p.category === selectedCategory);
  }, [selectedCategory, projects]);

  return (
    <div className="pt-40 pb-32 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-16 text-center">PROJECT</h1>

          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-20">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full text-xs font-bold tracking-widest transition-all ${
                  selectedCategory === category
                    ? 'bg-neutral-900 text-white'
                    : 'bg-neutral-50 text-neutral-400 hover:bg-neutral-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Project Grid */}
          {loading ? (
            <div className="py-40 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900 mx-auto"></div>
            </div>
          ) : error ? (
            <div className="py-40 text-center">
              <p className="text-red-500 font-medium">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-4 px-6 py-2 bg-neutral-900 text-white rounded-full text-xs font-bold"
              >
                새로고침
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
              <AnimatePresence mode="popLayout">
                {filteredProjects.map((project) => (
                  <div key={project.id}>
                    <ProjectCard project={project} />
                  </div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {!loading && filteredProjects.length === 0 && (
            <div className="py-40 text-center">
              <p className="text-neutral-400 font-medium">준비 중인 프로젝트입니다.</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
