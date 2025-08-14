'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { HiArrowLeft, HiStar, HiClock, HiLocationMarker, HiCalendar } from 'react-icons/hi';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import type { Service, Review, Order } from '@/lib/types';

const bookingSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  address: z.string().min(10, 'Address must be at least 10 characters'),
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  specialRequests: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

export default function ServicePageClient({ service, reviews = [] }: { service?: Service; reviews?: Review[] }) {
  const [isBooking, setIsBooking] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [allReviews, setAllReviews] = useState<Review[]>(reviews);
  const [bookedOrder, setBookedOrder] = useState<Order | null>(null); // New state for booked order

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
  });

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Service not found</h1>
          <Link href="/" className="text-blue-600 hover:text-blue-700">
            Go back home
          </Link>
        </div>
      </div>
    );
  }

  const onSubmit = async (data: BookingFormData) => {
    console.log('Form submitted with data:', data);
    setIsBooking(true);
    
    try {
      // Simulate processing time
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const newOrder = {
        userId: 'user-' + Date.now(),
        serviceId: String(service.id),
        status: 'pending' as const,
        customerName: data.name,
        phone: data.phone,
        address: data.address,
        date: data.date,
        time: data.time,
        total: service.price,
      };
      
      console.log('Sending order to API:', newOrder);
      
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder),
      });
      
      console.log('API response status:', res.status);
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Order creation failed:', errorData);
        setIsBooking(false);
        alert(`Failed to place order: ${errorData.error || 'Please try again.'}`);
        return;
      }
      
      const createdOrder: Order = await res.json();
      console.log('Created order:', createdOrder);
      
      setIsBooking(false);
      setBookedOrder(createdOrder);
      alert('Booking confirmed! You will receive a confirmation email shortly.');
      
    } catch (error) {
      console.error('Booking error:', error);
      setIsBooking(false);
      alert('Failed to place order. Please check your connection and try again.');
    }
  };

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

      <div className="pt-[10vh] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" animate="visible" variants={containerVariants}>
            <motion.div variants={itemVariants} className="mb-8">
              <Link href="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors">
                <HiArrowLeft className="h-5 w-5" />
                Back to Services
              </Link>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2">
                <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-lg overflow-hidden mb-4">
                  <div className="relative h-48">
                    <Image src={service.image} alt={service.name} fill className="object-cover" />
                  </div>
                  <div className="p-2">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">{service.name}</h1>
                    <p className="text-gray-600 text-lg leading-relaxed mb-6">{service.description}</p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                      <div className="flex items-center gap-3">
                        <div className="bg-green-100 p-3 rounded-full">
                          <span className="text-green-600 font-bold text-lg">${service.price}</span>
                        </div>
                        <span className="text-gray-600">Starting price</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="bg-yellow-100 p-3 rounded-full">
                          <HiStar className="h-6 w-6 text-yellow-500" />
                        </div>
                        <span className="text-gray-600">{service.rating} rating</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-3 rounded-full">
                          <HiClock className="h-6 w-6 text-blue-600" />
                        </div>
                        <span className="text-gray-600">{service.duration}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-lg p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Book This Service</h2>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                          <input {...register('name')} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Enter your full name" />
                          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                          <input {...register('phone')} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Enter your phone number" />
                          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
                        </div>
                      </div>
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                        <textarea {...register('address')} rows={3} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Enter your full address" />
                        {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Date</label>
                          <input {...register('date')} type="date" min={new Date().toISOString().split('T')[0]} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                          {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Time</label>
                          <select {...register('time')} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            <option value="">Select time</option>
                            <option value="09:00">9:00 AM</option>
                            <option value="10:00">10:00 AM</option>
                            <option value="11:00">11:00 AM</option>
                            <option value="14:00">2:00 PM</option>
                            <option value="15:00">3:00 PM</option>
                            <option value="16:00">4:00 PM</option>
                          </select>
                          {errors.time && <p className="text-red-500 text-sm mt-1">{errors.time.message}</p>}
                        </div>
                      </div>
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Special Requests (Optional)</label>
                        <textarea {...register('specialRequests')} rows={3} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Any special requirements or notes..." />
                      </div>
                    </div>

                    

                    <button type="submit" disabled={isBooking} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-4 rounded-lg font-semibold text-lg transition-colors">
                      {isBooking ? 'Processing...' : `Book Now - $${service.price}`}
                    </button>
                  </form>
                </motion.div>

                <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-lg p-8 mt-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>
                  {allReviews.length === 0 ? (
                    <p className="text-gray-600 mb-6">No reviews yet. Be the first to review this service.</p>
                  ) : (
                    <div className="space-y-4 mb-8">
                      {allReviews.map((r) => (
                        <div key={r.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="font-semibold">{r.name}</div>
                            <div className="text-yellow-500">{'★'.repeat(Math.round(r.rating))}{'☆'.repeat(5 - Math.round(r.rating))}</div>
                          </div>
                          <div className="text-sm text-gray-500">{new Date(r.date).toLocaleDateString()}</div>
                          <p className="mt-2 text-gray-700">{r.comment}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              </div>

              <div className="lg:col-span-1">
                <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Service</span>
                      <span className="font-medium">{service.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration</span>
                      <span className="font-medium">{service.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rating</span>
                      <div className="flex items-center gap-1">
                        <HiStar className="h-4 w-4 text-yellow-500" />
                        <span className="font-medium">{service.rating}</span>
                      </div>
                    </div>
                    {bookedOrder && (
                      <>
                        <hr className="my-2" />
                        <h4 className="text-md font-semibold text-gray-800 mt-4 mb-2">Customer Details</h4>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Name</span>
                          <span className="font-medium">{bookedOrder.customerName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Phone</span>
                          <span className="font-medium">{bookedOrder.phone}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Address</span>
                          <span className="font-medium text-right max-w-[60%] break-words">{bookedOrder.address}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Date</span>
                          <span className="font-medium">{bookedOrder.date}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Time</span>
                          <span className="font-medium">{bookedOrder.time}</span>
                        </div>
                      </>
                    )}
                    <hr />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-blue-600">${service.price}</span>
                    </div>
                  </div>

                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <HiLocationMarker className="h-4 w-4" />
                      <span>Available in your area</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <HiCalendar className="h-4 w-4" />
                      <span>Same day booking available</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

