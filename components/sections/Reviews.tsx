'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { HiStar } from 'react-icons/hi';
import type { Review } from '@/lib/types';

const Reviews = ({ reviews }: { reviews: Review[] }) => {

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
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, index) => (
      <HiStar
        key={index}
        className={`h-5 w-5 ${
          index < rating ? 'text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <section className="py-10 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.div className="text-center mb-12" variants={itemVariants}>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              What Our <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">Customers</span> Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Don't just take our word for it - hear from thousands of satisfied customers
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {reviews.map((review, index) => (
              <motion.div
                key={review.id}
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.2 }
                }}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden">
                    <Image
                      src={review.avatar}
                      alt={review.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{review.name}</h4>
                    <p className="text-sm text-gray-600">{review.service}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 mb-4">
                  {renderStars(review.rating)}
                </div>

                <p className="text-gray-700 leading-relaxed mb-4 line-clamp-4">
                  "{review.comment}"
                </p>

                <p className="text-sm text-gray-500">
                  {new Date(review.date).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div 
            className="text-center mt-12"
            variants={itemVariants}
          >
            <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-6 py-3 rounded-full font-semibold">
              <HiStar className="h-5 w-5" />
              <span>4.9/5 rating from 10,000+ customers</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Reviews;