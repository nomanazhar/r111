'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { HiStar } from 'react-icons/hi';
import type { Review } from '@/lib/types';

import { useState } from "react";
import { HiPlus } from "react-icons/hi";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const Reviews = ({ reviews }: { reviews: Review[] }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allReviews, setAllReviews] = useState(reviews);

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

          <motion.div variants={itemVariants} className="text-center mb-12">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 mx-auto transition-colors"
            >
              <HiPlus className="h-5 w-5" />
              Add a Review
            </button>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {allReviews.map((review, index) => (
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

          {isModalOpen && (
            <AddReviewModal
              onClose={() => setIsModalOpen(false)}
              onSave={async (payload) => {
                const res = await fetch('/api/reviews', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(payload),
                });
                if (!res.ok) {
                  alert("Failed to submit review.");
                  return;
                }
                const newReview: Review = await res.json();
                setAllReviews((prev) => [newReview, ...prev]);
                setIsModalOpen(false);
              }}
            />
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default Reviews;

const reviewSchema = z.object({
  name: z.string().min(2, "Name is required"),
  service: z.string().min(1, "Service name is required"),
  rating: z.number().min(1).max(5),
  comment: z.string().min(10, "Comment must be at least 10 characters"),
  avatar: z.string().url("Invalid URL").optional().or(z.literal("")),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

function AddReviewModal({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (payload: Omit<ReviewFormData, "service"> & { service: string }) => Promise<void>;
}) {
  const { register, handleSubmit, formState: { errors } } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: ReviewFormData) => {
    setIsSubmitting(true);
    await onSave(data);
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Add Your Review</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="reviewName" className="block text-sm font-medium text-gray-700">Your Name</label>
            <input
              type="text"
              id="reviewName"
              {...register("name")}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label htmlFor="reviewService" className="block text-sm font-medium text-gray-700">Service Name</label>
            <input
              type="text"
              id="reviewService"
              {...register("service")}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
            {errors.service && <p className="text-red-500 text-sm mt-1">{errors.service.message}</p>}
          </div>
          <div>
            <label htmlFor="reviewRating" className="block text-sm font-medium text-gray-700">Rating</label>
            <select
              id="reviewRating"
              {...register("rating", { valueAsNumber: true })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            >
              {[5, 4, 3, 2, 1].map((num) => (
                <option key={num} value={num}>{num} Stars</option>
              ))}
            </select>
            {errors.rating && <p className="text-red-500 text-sm mt-1">{errors.rating.message}</p>}
          </div>
          <div>
            <label htmlFor="reviewComment" className="block text-sm font-medium text-gray-700">Comment</label>
            <textarea
              id="reviewComment"
              {...register("comment")}
              rows={4}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            ></textarea>
            {errors.comment && <p className="text-red-500 text-sm mt-1">{errors.comment.message}</p>}
          </div>
          <div>
            <label htmlFor="reviewAvatar" className="block text-sm font-medium text-gray-700">Avatar URL (Optional)</label>
            <input
              type="url"
              id="reviewAvatar"
              {...register("avatar")}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              placeholder="e.g., https://example.com/your-avatar.jpg"
            />
            {errors.avatar && <p className="text-red-500 text-sm mt-1">{errors.avatar.message}</p>}
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}