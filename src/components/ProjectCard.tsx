import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Project } from '../types';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className="group"
    >
      <Link to={`/project/${project.id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-neutral-100">
          {project.mainImage ? (
            <img
              src={project.mainImage}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-neutral-300 text-xs font-bold">NO IMAGE</span>
            </div>
          )}
          
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-center p-8 backdrop-blur-[2px]">
            <h3 className="text-white text-xl md:text-2xl font-bold tracking-tighter text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
              {project.title}
            </h3>
            <div className="w-8 h-[1px] bg-white/50 mt-4 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 delay-100" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
