'use client';

import { useState } from 'react';
import type { Blog } from '@/lib/types';

export default function AddBlogModal({
  isSaving,
  onClose,
  onSave,
}: {
  isSaving: boolean;
  onClose: () => void;
  onSave: (form: Partial<Blog>) => void;
}) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [author, setAuthor] = useState('RIII Team');
  const [published, setPublished] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hashtags, setHashtags] = useState('');
  async function uploadSelected(file: File, folder: string) {
    const form = new FormData();
    form.append('file', file);
    form.append('folder', folder);
    const res = await fetch('/api/upload', { method: 'POST', body: form });
    if (!res.ok) throw new Error((await res.json()).error || 'Upload failed');
    const data = await res.json();
    return data.url as string;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Add Blog Post</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              className="w-full px-3 py-2 border rounded-lg" 
              placeholder="Enter blog title"
            />
          </div>
          
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Content *</label>
            <textarea 
              value={content} 
              onChange={(e) => setContent(e.target.value)} 
              className="w-full px-3 py-2 border rounded-lg" 
              rows={8}
              placeholder="Enter blog content"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image (upload) *</label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={(e) => setImageFile(e.target.files?.[0] || null)} 
              className="w-full" 
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4 ">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
              <input 
                value={author} 
                onChange={(e) => setAuthor(e.target.value)} 
                className="w-full px-3 py-2 border rounded-lg" 
                placeholder="Author name"
              />
            </div>
            <div >
              <label className='block text-sm font-medium text-gray-700 mb-1'>hashtags</label>
              <input 
                value={hashtags} 
                onChange={(e) => setHashtags(e.target.value)} 
                className="w-full px-3 py-2 border rounded-lg" 
                placeholder="Enter hashtags"
              />
            </div>
          </div>
          
          <div className="flex gap-4">
            <label className="flex items-center">
              <input 
                type="checkbox" 
                checked={published} 
                onChange={(e) => setPublished(e.target.checked)} 
                className="mr-2" 
              />
              <span className="text-sm font-medium text-gray-700">Published</span>
            </label>
          </div>
          
          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border">Cancel</button>
          <button
            disabled={isSaving}
            onClick={async () => {
              try {
                setError(null);
                if (!title || !content) {
                  setError('Title and content are required');
                  return;
                }
                
                let imageUrl = image;
                if (imageFile) {
                  imageUrl = await uploadSelected(imageFile, 'blogs/images');
                }
                
                await onSave({ 
                  title, 
                  content, 
                  image: imageUrl, 
                  author, 
                  published,
                  hashtags
                } as Partial<Blog>);
              } catch (e: any) {
                setError(e?.message || 'Failed to save');
              }
            }}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white disabled:bg-gray-400"
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}
