import { Project } from './types';

export const INITIAL_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Modern Residence A',
    category: 'RESIDENCE & HOTEL',
    description: '실사용 기준의 정교한 표현으로 설득력을 높인 주거 공간 프로젝트입니다.',
    tools: ['Sketchup', 'Enscape'],
    mainImage: 'https://picsum.photos/seed/res1/1200/800',
    images: [
      'https://picsum.photos/seed/res1-1/1200/800',
      'https://picsum.photos/seed/res1-2/1200/800'
    ],
    year: '2024',
    area: '120㎡',
    createdAt: Date.now()
  },
  {
    id: '2',
    title: 'Urban Office Space',
    category: 'PUBLIC & OFFICE',
    description: '공간의 설계 의도와 방향을 충분히 고려한 오피스 인테리어 3D 작업입니다.',
    tools: ['Sketchup', 'Enscape', 'Photoshop'],
    mainImage: 'https://picsum.photos/seed/off1/1200/800',
    images: [
      'https://picsum.photos/seed/off1-1/1200/800'
    ],
    year: '2023',
    area: '250㎡',
    createdAt: Date.now() - 10000
  }
];

export const CATEGORIES = ['ALL', 'RESIDENCE & HOTEL', 'PUBLIC & OFFICE', 'COMMERCIAL', 'OTHERS'] as const;
