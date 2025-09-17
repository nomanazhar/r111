'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import type { Blog } from '@/lib/types';

export default function BlogPageClient() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const allBlogsRes = await fetch('/api/blogs?published=true');
        const allBlogs = await allBlogsRes.json();
        
        setBlogs(allBlogs || []);
      } catch (error) {
        console.error('Error fetching blogs:', error);
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
  } as const;
  
  const itemVariants = { 
    hidden: { opacity: 0, y: 20 }, 
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } 
  } as const;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-[10vh] flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading blog posts...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-[10vh]">
        <motion.div 
          initial="hidden" 
          animate="visible" 
          variants={containerVariants}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Blog</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Stay updated with the latest news, tips, and insights from RIII
            </p>
          </motion.div>

          {/* All Blogs */}
          <motion.div variants={itemVariants}>
            <h2 className="text-2xl font-bold text-gray-900 mb-8">All Posts</h2>
            {blogs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogs.map((blog) => (
                  <Link key={blog.id} href={`/blog/${blog.slug}`}>
                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                    >
                      {blog.image && (
                        <div className="h-48 overflow-hidden">
                          <img 
                            src={blog.image} 
                            alt={blog.title} 
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-sm text-gray-500">
                            {blog.created_at ? new Date(blog.created_at).toLocaleDateString() : 'N/A'}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2">
                          {blog.title}
                        </h3>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">By {blog.author}</span>
                          <span className="text-sm text-gray-500">{blog.hashtags}</span>
                          <span className="text-blue-600 font-medium">Read more →</span>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No blog posts yet</h3>
                <p className="text-gray-500">Check back soon for new content!</p>
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
