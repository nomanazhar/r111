'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { HiStar, HiClock, HiArrowRight } from 'react-icons/hi';
import type { Service, Category } from '@/lib/types';

const Services = ({ services, categories }: { services: Service[]; categories: Category[] }) => {
  const [liveServices, setLiveServices] = useState<Service[]>(services);
  const [liveCategories, setLiveCategories] = useState<Category[]>(categories);

  useEffect(() => {
    setLiveServices(services);
  }, [services]);
  useEffect(() => {
    setLiveCategories(categories);
  }, [categories]);

  useEffect(() => {
    let isCancelled = false;
    const fetchLatest = async () => {
      try {
        const [s, c] = await Promise.all([
          fetch('/api/services', { cache: 'no-store' }).then((r) => r.json()),
          fetch('/api/categories', { cache: 'no-store' }).then((r) => r.json()),
        ]);
        if (!isCancelled && Array.isArray(s)) setLiveServices(s);
        if (!isCancelled && Array.isArray(c)) setLiveCategories(c);
      } catch {}
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
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.5 }
    }
  };

  const getServicesByCategory = (categorySlug: string) => {
    return liveServices.filter(service => service.category === categorySlug);
  };

  return (
    <section id="services" className="py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="text-center mb-10"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            Popular <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">Services</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Book our most requested services from verified professionals
          </p>
        </motion.div>

        <div className="space-y-2">
          {liveCategories.slice(0, 3).map((category) => {
            const categoryServices = getServicesByCategory(category.slug);
            
            if (categoryServices.length === 0) return null;

            return (
              <motion.div
                key={category.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={containerVariants}
                className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-3xl p-8"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                  <div className="flex items-center gap-4 mb-4 sm:mb-0">
                    
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{category.name}</h3>
                      <p className="text-gray-600">{category.description}</p>
                    </div>
                  </div>
                  <Link
                    href={`/categories/${category.slug}`}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold group transition-colors"
                  >
                    View All
                    <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoryServices.slice(0, 3).map((service) => (
                    <motion.div
                      key={service.id}
                      variants={itemVariants}
                      whileHover={{ 
                        scale: 1.03,
                        transition: { duration: 0.2 }
                      }}
                      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
                    >
                      <Link href={`/services/${service.id}`}>
                        <div className="relative h-44">
                          <Image
                            src={service.image}
                            alt={service.name}
                            fill
                            className="object-cover hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-2 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-sm font-semibold">
                            ${service.price}
                          </div>
                        </div>
                        <div className="p-2">
                          <h4 className="font-bold text-gray-900 mb-2  hover:text-blue-600 transition-colors">
                            {service.name}
                          </h4>
                          <p className="text-gray-600 text-sm mb-1 line-clamp-2">
                            {service.description}
                          </p>
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-1 text-yellow-500">
                              <HiStar className="h-4 w-4" />
                              <span className="text-gray-700 font-medium">{service.rating}</span>
                            </div>
                            <div className="flex items-center gap-1 text-gray-500">
                              <HiClock className="h-4 w-4" />
                              <span>{service.duration}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;