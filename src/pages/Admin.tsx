import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Lock, Plus, Trash2, Edit2, Save, X, LogOut, Upload, GripVertical, Image as ImageIcon } from 'lucide-react';
import { Project, Category } from '../types';
import { CATEGORIES } from '../constants';
import { useAuth } from '../contexts/AuthContext';
import { db, storage } from '../firebase';
import { collection, onSnapshot, query, orderBy, addDoc, updateDoc, deleteDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { handleFirestoreError, OperationType } from '../lib/firestoreUtils';

export default function Admin() {
  const { user, login, logout, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Check Admin Role
  useEffect(() => {
    if (!user) {
      setIsAdmin(false);
      setCheckingAdmin(false);
      return;
    }

    const checkAdmin = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists() && userDoc.data().role === 'admin') {
          setIsAdmin(true);
        } else if (user.email === 'loveshuny96@gmail.com') {
          // Bootstrap first admin
          await setDoc(doc(db, 'users', user.uid), {
            email: user.email,
            role: 'admin',
            name: user.displayName
          });
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Admin check failed", error);
        setIsAdmin(false);
      } finally {
        setCheckingAdmin(false);
      }
    };

    checkAdmin();
  }, [user]);

  // Fetch Projects
  useEffect(() => {
    if (!isAdmin) return;

    const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const projs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
      setProjects(projs);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'projects');
    });

    return unsubscribe;
  }, [isAdmin]);

  const handleDelete = async (id: string) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      try {
        await deleteDoc(doc(db, 'projects', id));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `projects/${id}`);
      }
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !editingProject) return;

    setUploading(true);
    const fileList = Array.from(files).sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
    const base64Images: string[] = [];

    try {
      for (const file of fileList) {
        // Convert file to Base64 string
        const reader = new FileReader();
        const promise = new Promise<string>((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
        });
        reader.readAsDataURL(file);
        const base64 = await promise;
        base64Images.push(base64);
      }

      const newImages = [...(editingProject.images || []), ...base64Images];

      setEditingProject({
        ...editingProject,
        images: newImages,
        mainImage: editingProject.mainImage || newImages[0]
      });
      
      alert(`${base64Images.length}개의 이미지가 준비되었습니다. 'SAVE' 버튼을 눌러 최종 저장해주세요.`);
    } catch (error: any) {
      console.error("Image processing failed:", error);
      alert("이미지 처리에 실패했습니다.");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    if (!editingProject || !editingProject.images) return;
    const newImages = [...editingProject.images];
    const removedImage = newImages.splice(index, 1)[0];
    
    let newMainImage = editingProject.mainImage;
    if (newMainImage === removedImage) {
      newMainImage = newImages.length > 0 ? newImages[0] : '';
    }

    setEditingProject({
      ...editingProject,
      images: newImages,
      mainImage: newMainImage
    });
  };

  const moveImage = (index: number, direction: 'up' | 'down') => {
    if (!editingProject || !editingProject.images) return;
    const newImages = [...editingProject.images];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex < 0 || targetIndex >= newImages.length) return;
    
    [newImages[index], newImages[targetIndex]] = [newImages[targetIndex], newImages[index]];
    
    setEditingProject({
      ...editingProject,
      images: newImages
    });
  };

  const setAsMain = (url: string) => {
    if (!editingProject) return;
    setEditingProject({
      ...editingProject,
      mainImage: url
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    if (!editingProject.mainImage || editingProject.mainImage.trim() === '') {
      alert('대표 이미지를 업로드해 주세요.');
      return;
    }

    try {
      if (isAdding) {
        const newProject = {
          ...editingProject,
          createdAt: Date.now(),
        };
        await addDoc(collection(db, 'projects'), newProject);
      } else {
        const { id, ...data } = editingProject;
        await updateDoc(doc(db, 'projects', id!), data);
      }
      setEditingProject(null);
      setIsAdding(false);
    } catch (error) {
      handleFirestoreError(error, isAdding ? OperationType.CREATE : OperationType.UPDATE, 'projects');
    }
  };

  if (authLoading || checkingAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-12 rounded-[2rem] shadow-xl max-w-md w-full border border-neutral-100 text-center"
        >
          <div className="w-16 h-16 bg-neutral-900 text-white rounded-2xl flex items-center justify-center mx-auto mb-8">
            <Lock size={24} />
          </div>
          <h1 className="text-2xl font-bold mb-4 tracking-tight">Admin Login</h1>
          <p className="text-neutral-500 mb-8">관리자 계정으로 로그인해 주세요.</p>
          <button
            onClick={login}
            className="w-full py-4 bg-neutral-900 text-white rounded-xl font-bold hover:bg-neutral-800 transition-all flex items-center justify-center gap-3"
          >
            <img src="https://www.gstatic.com/firebase/anonymous-scan.png" className="w-5 h-5 invert" alt="" />
            Google Login
          </button>
        </motion.div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-6">
        <div className="bg-white p-12 rounded-[2rem] shadow-xl max-w-md w-full border border-neutral-100 text-center">
          <h1 className="text-2xl font-bold mb-4 tracking-tight">Access Denied</h1>
          <p className="text-neutral-500 mb-8">관리자 권한이 없습니다.</p>
          <button
            onClick={logout}
            className="w-full py-4 border border-neutral-200 rounded-xl font-bold hover:bg-neutral-50 transition-all"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-40 pb-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-16">
          <div>
            <h1 className="text-4xl font-bold tracking-tighter mb-2">Portfolio Management</h1>
            <p className="text-neutral-400 text-sm">{user.email}</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => {
                setEditingProject({
                  title: '',
                  category: 'RESIDENCE & HOTEL',
                  description: '',
                  tools: [],
                  mainImage: '',
                  images: [],
                  year: new Date().getFullYear().toString(),
                  area: '',
                });
                setIsAdding(true);
              }}
              className="flex items-center gap-2 px-6 py-3 bg-neutral-900 text-white rounded-full text-sm font-bold hover:bg-neutral-800 transition-all"
            >
              <Plus size={18} />
              Add Project
            </button>
            <button
              onClick={logout}
              className="p-3 border border-neutral-200 rounded-full hover:bg-neutral-50 transition-all"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>

        {/* Project List Table */}
        <div className="bg-white border border-neutral-100 rounded-3xl overflow-hidden shadow-sm">
          {loading ? (
            <div className="p-20 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900 mx-auto"></div>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-100">
                  <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest text-neutral-400">Project</th>
                  <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest text-neutral-400">Category</th>
                  <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest text-neutral-400">Year</th>
                  <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest text-neutral-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {projects.map((project) => (
                  <tr key={project.id} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        {project.mainImage ? (
                          <img src={project.mainImage} alt="" className="w-12 h-12 rounded-lg object-cover bg-neutral-100" />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-neutral-100 flex items-center justify-center">
                            <ImageIcon size={18} className="text-neutral-300" />
                          </div>
                        )}
                        <span className="font-bold text-neutral-800">{project.title}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-xs font-bold text-neutral-400">{project.category}</span>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-sm text-neutral-500">{project.year}</span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditingProject(project);
                            setIsAdding(false);
                          }}
                          className="p-2 text-neutral-400 hover:text-neutral-900 transition-colors"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(project.id)}
                          className="p-2 text-neutral-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Edit/Add Modal */}
        {editingProject && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/20 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] shadow-2xl p-12"
            >
              <div className="flex items-center justify-between mb-12">
                <h2 className="text-2xl font-bold tracking-tight">
                  {isAdding ? 'New Project' : 'Edit Project'}
                </h2>
                <button onClick={() => setEditingProject(null)} className="text-neutral-400 hover:text-neutral-900">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-neutral-400">Title</label>
                    <input
                      required
                      value={editingProject.title}
                      onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                      className="w-full px-6 py-4 bg-neutral-50 border border-neutral-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-neutral-400">Category</label>
                    <select
                      value={editingProject.category}
                      onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value as Category })}
                      className="w-full px-6 py-4 bg-neutral-50 border border-neutral-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                    >
                      {CATEGORIES.filter(c => c !== 'ALL').map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-neutral-400">Year</label>
                    <input
                      required
                      value={editingProject.year}
                      onChange={(e) => setEditingProject({ ...editingProject, year: e.target.value })}
                      className="w-full px-6 py-4 bg-neutral-50 border border-neutral-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-neutral-400">Area (㎡)</label>
                    <input
                      required
                      value={editingProject.area}
                      onChange={(e) => setEditingProject({ ...editingProject, area: e.target.value })}
                      className="w-full px-6 py-4 bg-neutral-50 border border-neutral-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-neutral-400">Description</label>
                  <textarea
                    required
                    rows={4}
                    value={editingProject.description}
                    onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                    className="w-full px-6 py-4 bg-neutral-50 border border-neutral-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-bold uppercase tracking-widest text-neutral-400 block">Project Images</label>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {editingProject.images?.filter(url => url && url.trim() !== '').map((url, idx) => (
                      <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200">
                        <img src={url} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                          <div className="flex gap-1">
                            <button 
                              type="button"
                              onClick={() => moveImage(idx, 'up')}
                              disabled={idx === 0}
                              className="p-1.5 bg-white rounded-lg text-neutral-900 disabled:opacity-50"
                            >
                              <GripVertical size={14} className="rotate-90" />
                            </button>
                            <button 
                              type="button"
                              onClick={() => moveImage(idx, 'down')}
                              disabled={idx === (editingProject.images?.length || 0) - 1}
                              className="p-1.5 bg-white rounded-lg text-neutral-900 disabled:opacity-50"
                            >
                              <GripVertical size={14} className="-rotate-90" />
                            </button>
                          </div>
                          
                          <button
                            type="button"
                            onClick={() => setAsMain(url)}
                            className={`px-3 py-1 rounded-full text-[10px] font-bold transition-colors ${
                              editingProject.mainImage === url 
                                ? 'bg-neutral-900 text-white' 
                                : 'bg-white text-neutral-900 hover:bg-neutral-100'
                            }`}
                          >
                            {editingProject.mainImage === url ? 'MAIN IMAGE' : 'SET AS MAIN'}
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="p-1.5 bg-red-500 rounded-lg text-white hover:bg-red-600 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>

                        {editingProject.mainImage === url && (
                          <div className="absolute top-2 left-2 px-2 py-1 bg-neutral-900 text-white text-[8px] font-bold rounded-md">
                            MAIN
                          </div>
                        )}
                      </div>
                    ))}
                    
                    <label className="aspect-square rounded-xl border-2 border-dashed border-neutral-200 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-neutral-50 transition-colors group">
                      {uploading ? (
                        <div className="flex flex-col items-center gap-2">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-neutral-900"></div>
                          <span className="text-[8px] font-bold text-neutral-400 animate-pulse">UPLOADING...</span>
                        </div>
                      ) : (
                        <>
                          <Upload size={24} className="text-neutral-300 group-hover:text-neutral-900 transition-colors" />
                          <span className="text-[10px] font-bold text-neutral-400 group-hover:text-neutral-900">UPLOAD</span>
                        </>
                      )}
                      <input 
                        type="file" 
                        multiple 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleFileUpload}
                        disabled={uploading}
                      />
                    </label>
                  </div>
                  
                  <p className="text-[10px] text-neutral-400">
                    * 첫 번째 이미지가 기본 대표 이미지로 설정됩니다. 이미지를 클릭하여 대표 이미지를 변경하거나 순서를 조정할 수 있습니다.
                  </p>
                </div>

                <div className="flex gap-4 pt-8">
                  <button
                    type="submit"
                    className="flex-grow py-4 bg-neutral-900 text-white rounded-xl font-bold hover:bg-neutral-800 transition-all flex items-center justify-center gap-2"
                  >
                    <Save size={18} />
                    Save Project
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingProject(null)}
                    className="px-12 py-4 border border-neutral-200 rounded-xl font-bold hover:bg-neutral-50 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
