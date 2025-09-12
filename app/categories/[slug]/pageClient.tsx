'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { HiArrowLeft, HiStar, HiClock } from 'react-icons/hi';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import type { Category, Service, Location } from '@/lib/types';
import Locations from '@/components/sections/Locations';
import { categoryLongDescriptions } from '@/lib/categoryDescriptions';

export default function CategoryPageClient({
  category,
  services,
  locations,
}: {
  category?: Category;
  services: Service[];
  locations: Location[];
}) {
  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Category not found</h1>
          <Link href="/" className="text-blue-600 hover:text-blue-700">
            Go back home
          </Link>
        </div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <section className="pt-[10vh] pb-20 bg-gradient-to-br from-blue-900 to-purple-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" animate="visible" variants={containerVariants} className="text-center">
            <motion.div variants={itemVariants} className="mb-8">
              <Link href="/" className="inline-flex items-center gap-2 text-blue-200 hover:text-blue-100 transition-colors">
                <HiArrowLeft className="h-5 w-5" />
                Back to Home
              </Link>
            </motion.div>

            {/* Removed icon display as per new schema */}

            <motion.h1 variants={itemVariants} className="text-4xl md:text-6xl font-bold text-white mb-6">
              {category.name}
            </motion.h1>

            <motion.p variants={itemVariants} className="text-xl text-blue-100 max-w-2xl mx-auto mb-8">
              {category.description}
            </motion.p>

            <motion.div variants={itemVariants}>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105">
                View All Services
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>


      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={containerVariants}>
            <motion.div variants={itemVariants} className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Available Services</h2>
              <p className="text-gray-600">Choose from our professional {category.name.toLowerCase()} services</p>
            </motion.div>

            {services.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                {services.map((service) => (
                  <motion.div
                    key={service.id}
                    variants={itemVariants}
                    whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
                    className="bg-white rounded-xl md:rounded-2xl shadow-md md:shadow-lg hover:shadow-xl md:hover:shadow-2xl transition-all duration-300 overflow-hidden"
                  >
                    <Link href={`/services/${service.id}`}>
                      <div className="relative h-32 md:h-48">
                        <Image src={service.image} alt={service.name} fill className="object-cover hover:scale-105 transition-transform duration-300" />
                        <div className="absolute top-2 right-2 md:top-4 md:right-4 bg-green-500 text-white px-2 py-1 md:px-3 md:py-1 rounded-full font-semibold text-xs md:text-sm">SAVE {service.discount}%</div>
                      </div>
                      <div className="p-2 md:p-4">
                        <h3 className="text-sm md:text-xl font-bold text-gray-900 mb-1 md:mb-2 hover:text-blue-600 transition-colors line-clamp-1 md:line-clamp-none">{service.name}</h3>
                        <p className="text-gray-600 mb-2 leading-relaxed line-clamp-2 text-xs md:text-sm">{service.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-yellow-500">
                            <HiStar className="h-3 w-3 md:h-5 md:w-5" />
                            <span className="text-gray-700 font-medium text-xs md:text-sm">{service.rating}</span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-500">
                            <HiClock className="h-3 w-3 md:h-5 md:w-5" />
                            <span className="text-xs md:text-sm">{service.duration}</span>
                          </div>
                        </div>
                        <button className="w-full mt-2 md:mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 md:py-3 rounded-lg font-semibold transition-colors text-xs md:text-sm">Book Now</button>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div variants={itemVariants} className="text-center py-12">
                <p className="text-gray-600 text-lg">No services available in this category yet. Please check back soon!</p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>


      {/* Category long description */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={containerVariants}>
            <motion.h2 variants={itemVariants} className="text-3xl font-bold text-gray-900 mb-6">
              About {category.name}
            </motion.h2>
            <motion.div variants={itemVariants} className="prose prose-lg max-w-none text-gray-700 whitespace-pre-line">
              {categoryLongDescriptions[category.slug] || category.description || 'No description available.'}
            </motion.div>
          </motion.div>
        </div>
      </section>

     

      {/* Locations section (same as landing page) */}
      <Locations locations={locations} />

      <Footer />
    </div>
  );
}


