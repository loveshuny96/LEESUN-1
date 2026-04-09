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
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl mb-6 bg-neutral-100">
          {project.mainImage ? (
            <img
              src={project.mainImage}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-neutral-300 text-xs font-bold">NO IMAGE</span>
            </div>
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
              {project.category}
            </span>
            <div className="flex gap-2">
              {project.tools.map((tool) => (
                <span key={tool} className="text-[10px] font-medium text-neutral-400">
                  {tool}
                </span>
              ))}
            </div>
          </div>
          <h3 className="text-lg font-bold tracking-tight group-hover:text-neutral-600 transition-colors">
            {project.title}
          </h3>
          <p className="text-sm text-neutral-500 line-clamp-1">
            {project.description}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
