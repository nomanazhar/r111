'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import type { Category } from '@/lib/types';

const Categories = ({ categories }: { categories: Category[] }) => {
  const [liveCategories, setLiveCategories] = useState<Category[]>(categories);

  useEffect(() => {
    setLiveCategories(categories);
  }, [categories]);

  useEffect(() => {
    let isCancelled = false;
    const fetchLatest = async () => {
      try {
        const res = await fetch('/api/categories', { cache: 'no-store' });
        if (!res.ok) {
          console.warn('Failed to fetch categories:', res.status, res.statusText);
          return;
        }
        const data = await res.json();
        if (!isCancelled && Array.isArray(data)) setLiveCategories(data);
      } catch (error) {
        console.warn('Error fetching categories:', error);
      }
    };
    void fetchLatest();

    const onFocus = () => void fetchLatest();
    const onVisibility = () => {
      if (document.visibilityState === 'visible') void fetchLatest();
    };
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      isCancelled = true;
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <section id="categories" className="min-h-[70vh] py-10 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="text-center mb-8"
        >
          <motion.h2 
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-2"
            variants={itemVariants}
          >
            Our <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">Categories</span>
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-600 max-w-3xl mx-auto"
            variants={itemVariants}
          >
            Choose from our wide range of professional home services
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
          className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8"
        >
          {liveCategories.map((category, index) => (
            <motion.div
              key={category.id}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.05, 
                y: -10,
                transition: { duration: 0.3 }
              }}
              className="group"
            >
              <Link href={`/categories/${category.slug}`}>
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden h-full ">
                  <div className="relative h-32 overflow-hidden">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  </div>
                  <div className="p-2">
                    <h3 className="text-xl capitalize font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                      {category.name}
                    </h3>
                    {/* <p className="text-gray-600 leading-relaxed">
                      {category.description}
                    </p> */}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Categories;