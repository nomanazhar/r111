import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Service, Review } from "@/lib/types";

const reviewSchema = z.object({
  name: z.string().min(2, "Name is required"),
  service: z.string().min(1, "Service name is required"),
  rating: z.number().min(1).max(5),
  comment: z.string().min(10, "Comment must be at least 10 characters"),
  avatar: z.string().url("Invalid URL").optional().or(z.literal("")).nullable(), // Made nullable as per DB
});

type ReviewFormData = z.infer<typeof reviewSchema>;

export default function AddReviewModal({
  onClose,
  onSave,
  services,
}: {
  onClose: () => void;
  onSave: (payload: Omit<ReviewFormData, "service"> & { service: string }) => Promise<void>;
  services: Service[];
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
            <select
              id="reviewService"
              {...register("service")}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            >
              <option value="">Select a service</option>
              {services.map((s) => (
                <option key={s.id} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
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
