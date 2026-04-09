export type Category = 'ALL' | 'RESIDENCE & HOTEL' | 'PUBLIC & OFFICE' | 'COMMERCIAL' | 'OTHERS';

export interface Project {
  id: string;
  title: string;
  category: Category;
  description: string;
  tools: string[];
  mainImage: string;
  images: string[];
  year: string;
  area: string;
  createdAt: number;
  order: number;
}
