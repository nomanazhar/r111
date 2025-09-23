'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { HiArrowLeft, HiCalendar, HiHashtag, HiUser } from 'react-icons/hi';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import type { Blog } from '@/lib/types';

export default function BlogPostPageClient() {
  const params = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const slug = params.slug as string;
        const response = await fetch(`/api/blogs?slug=${slug}&published=true`);
        const data = await response.json();
        
        if (data && data.length > 0) {
          setBlog(data[0]);
        } else {
          setError('Blog post not found');
        }
      } catch (error) {
        console.error('Error fetching blog:', error);
        setError('Failed to load blog post');
      } finally {
        setLoading(false);
      }
    };

    if (params.slug) {
      fetchBlog();
    }
  }, [params.slug]);

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
            <p className="mt-4 text-gray-600">Loading blog post...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-[10vh] flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Blog post not found</h3>
            <p className="text-gray-500 mb-6">{error || 'The blog post you are looking for does not exist.'}</p>
            <Link 
              href="/blog"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <HiArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Link>
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
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        >
          {/* Back Button */}
          <motion.div variants={itemVariants} className="mb-8">
            <Link 
              href="/blog"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            >
              <HiArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Link>
          </motion.div>

          {/* Blog Post */}
          <motion.article variants={itemVariants} className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Featured Image */}
            {blog.image && (
              <div className="h-96 overflow-hidden">
                <img 
                  src={blog.image} 
                  alt={blog.title} 
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="p-8">
              {/* Meta Information */}
              <motion.div variants={itemVariants} className="flex items-center gap-4 mb-6 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <HiUser className="h-4 w-4" />
                  <span>{blog.author}</span>
                </div>
                <div className="flex items-center gap-1">
                  <HiCalendar className="h-4 w-4" />
                  <span>{blog.created_at ? new Date(blog.created_at).toLocaleDateString() : 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex flex-wrap gap-1">
                    {blog.hashtags && blog.hashtags.split(/[,#]/).map((tag, index) => {
                      const trimmedTag = tag.trim();
                      return trimmedTag ? (
                        <span key={index} className="px-2 py-0.5 text-xs bg-blue-50 text-blue-700 rounded">
                          {trimmedTag}
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>
              </motion.div>

              {/* Title */}
              <motion.h1 variants={itemVariants} className="text-4xl font-bold text-gray-900 mb-6">
                {blog.title}
              </motion.h1>


              {/* Content */}
              <motion.div 
                variants={itemVariants} 
                className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ 
                  __html: blog.content.replace(/\n/g, '<br />') 
                }}
              />
            </div>
          </motion.article>

          {/* Related Posts or Call to Action */}
          {/* <motion.div variants={itemVariants} className="mt-12 text-center">
            <div className="bg-blue-50 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Need Our Services?</h3>
              <p className="text-gray-600 mb-6">
                Discover how RIII can help you with our professional services
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/services"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  View Services
                </Link>
                <Link 
                  href="/contact"
                  className="inline-flex items-center px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </motion.div> */}
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
