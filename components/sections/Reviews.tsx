'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { HiStar } from 'react-icons/hi';
import type { Review, Service } from '@/lib/types';

import { useEffect, useState } from "react";
import { HiPlus } from "react-icons/hi";
import AddReviewModal from "@/components/AddReviewModal"; // New import path

const Reviews = ({ reviews }: { reviews: Review[] }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allReviews, setAllReviews] = useState(reviews);
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch('/api/services');
        if (!res.ok) {
          console.warn('Failed to fetch services:', res.status, res.statusText);
          setServices([]);
          return;
        }
        const data = await res.json();
        setServices(data || []);
      } catch (error) {
        console.warn('Error fetching services:', error);
        setServices([]);
      }
    };
    void fetchServices(); // Use void to ignore the Promise
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
          <motion.div className="text-center mb-2" variants={itemVariants}>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
              What Our <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">Customers</span> Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Don't just take our word for it - hear from thousands of satisfied customers
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="text-center mb-6">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium flex items-center gap-2 mx-auto transition-colors hidden"
            >
              <HiPlus className="h-5 w-5" />
              Add a Review
            </button>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {allReviews.map((review, index) => (
              <motion.div
                key={review.id}
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.2 }
                }}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-2 border border-gray-100"
              >
                <div className="flex items-center gap-3 mb-1">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden">
                    <Image
                      src={
                        review.avatar && review.avatar.length > 0
                          ? review.avatar
                          : 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48"><rect width="100%" height="100%" fill="%23e5e7eb"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="16" fill="%236b7280">👤</text></svg>'
                      }
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

                <div className="flex items-center gap-1 mb-2">
                  {renderStars(review.rating)}
                </div>

                <p className="text-gray-700 leading-relaxed mb-2 line-clamp-4">
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
            className="text-center mt-6"
            variants={itemVariants}
          >
            <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-6 py-3 rounded-full font-semibold">
              <HiStar className="h-5 w-5" />
              <span>4.9/5 rating from 10,000+ customers</span>
            </div>
          </motion.div>

          {isModalOpen && (
            <AddReviewModal
              services={services} // Pass services to the modal
              onClose={() => setIsModalOpen(false)}
              onSave={async (payload) => {
                try {
                  const res = await fetch('/api/reviews', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                  });
                  if (!res.ok) {
                    const errorData = await res.json().catch(() => ({ error: 'Unknown error' }));
                    alert(`Failed to submit review: ${errorData.error || 'Please try again.'}`);
                    return;
                  }
                  const newReview: Review = await res.json();
                  setAllReviews((prev) => [newReview, ...prev]);
                  setIsModalOpen(false);
                  alert('Review submitted successfully!');
                } catch (error) {
                  console.error('Review submission error:', error);
                  alert('Failed to submit review. Please check your connection and try again.');
                }
              }}
            />
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default Reviews;