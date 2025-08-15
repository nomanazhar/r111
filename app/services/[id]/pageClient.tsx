'use client';

import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { HiOutlineArrowNarrowLeft, HiCheckCircle } from 'react-icons/hi';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Service, Order, Review } from '@/lib/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import AddReviewModal from '@/components/AddReviewModal';
import html2canvas from 'html2canvas';

const bookingSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address').min(1, 'Email is required'),
  phone: z.string().min(1, 'Phone number is required'),
  address: z.string().min(1, 'Address is required'),
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  // paymentMethod: z.string().min(1, 'Payment method is required'),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

export default function ServiceDetailPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showBookingConfirmation, setShowBookingConfirmation] = useState(false);
  const [bookedOrder, setBookedOrder] = useState<Order | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [services, setServices] = useState<Service[]>([]); // For the review form service dropdown
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
  });

  useEffect(() => {
    async function fetchService() {
      try {
        const res = await fetch(`/api/services?id=${id}`);
        if (!res.ok) {
          throw new Error(`Failed to fetch service: ${res.statusText}`);
        }
        const data = await res.json();
        if (data && data.length > 0) {
          setService(data[0]);
        } else {
          setError('Service not found');
        }
      } catch (err: any) {
        setError(err.message || 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    }
    if (id) {
      void fetchService();
    }
  }, [id]);

  const onSubmit = handleSubmit(async (data) => {
    if (!service) return;

    console.log('Booking form submitted:', data);

    try {
      // Generate a simple unique user ID for this example. In a real app, this would come from an authentication system.
      const newOrder = {
        userid: 'user-' + Date.now(),
        serviceid: String(service.id),
        status: 'pending' as const,
        customer_name: data.name,
        email: data.email,
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

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: 'Unknown error during order placement.' }));
        console.error('Failed to place order:', errorData);
        alert(`Failed to place order: ${errorData.error || 'Unknown error'}`);
        return;
      }

      const createdOrder = await res.json();
      console.log('Order placed successfully:', createdOrder);
      setBookedOrder(createdOrder);
      setShowBookingConfirmation(true);
      reset(); // Reset form after successful submission
    } catch (e: any) {
      console.error('Error placing order:', e);
      alert(`Error placing order: ${e.message || 'An unexpected error occurred.'}`);
    }
  });

  const handleAddReview = async (reviewData: Omit<Review, 'id' | 'date'>) => {
    setIsSubmittingReview(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData),
      });
      if (!res.ok) {
        const errorBody = await res.json();
        throw new Error(errorBody.error || 'Failed to submit review.');
      }
      alert('Review submitted successfully!');
      setIsReviewModalOpen(false);
    } catch (error: any) {
      console.error('Failed to submit review:', error);
      alert(`Failed to submit review: ${error.message}`);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleDownloadSummary = () => {
    const card = document.getElementById('order-summary-card');
    if (card) {
      html2canvas(card, { scale: 2 }).then(canvas => {
        const link = document.createElement('a');
        link.download = 'order-summary.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-xl text-gray-700">Loading service details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <p className="text-xl text-red-500">Error: {error}</p>
        <button onClick={() => window.history.back()} className="mt-4 text-blue-600 hover:underline flex items-center">
          <HiOutlineArrowNarrowLeft className="mr-2" /> Back to Services
        </button>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <p className="text-xl text-gray-700">Service details not available.</p>
        <button onClick={() => window.history.back()} className="mt-4 text-blue-600 hover:underline flex items-center">
          <HiOutlineArrowNarrowLeft className="mr-2" /> Back to Services
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <button onClick={() => window.history.back()} className="text-blue-600 hover:underline flex items-center mb-6">
          <HiOutlineArrowNarrowLeft className="mr-2" /> Back to Services
        </button>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden md:flex mb-6 p-2">
          <div className="md:w-1/3 flex justify-center items-center p-2">
            <motion.img
              src={service.image}
              alt={service.name}
              className="w-full h-72 object-cover rounded-lg shadow-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            />
          </div>
          <div className="md:w-1/2 p-8 flex flex-col justify-center">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{service.name}</h1>
            <p className="text-gray-600 mb-4 text-lg leading-relaxed">{service.description}</p>
            <div className="flex items-center mb-4">
              <span className="text-3xl font-bold text-green-600 mr-4">${service.price}</span>
              <span className="text-yellow-500 flex items-center text-lg">
                ⭐ {service.rating} ({service.rating > 4 ? 'Excellent' : 'Good'})
              </span>
            </div>
            <div className="text-gray-700 text-lg mb-6">
              <p>Duration: {service.duration}</p>
              <p>Category: <span className="font-medium capitalize">{service.category.replace('-', ' ')}</span></p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            className="lg:col-span-2 bg-white rounded-xl shadow-lg p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Book This Service</h2>
            <form onSubmit={onSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Your Name</label>
                <input type="text" id="name" {...register('name')} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3" />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                <input type="email" id="email" {...register('email')} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3" />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input type="tel" id="phone" {...register('phone')} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3" />
                {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
              </div>
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">Your Address</label>
                <textarea id="address" {...register('address')} rows={3} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3"></textarea>
                {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700">Preferred Date</label>
                  <input type="date" id="date" {...register('date')} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3" />
                  {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>}
                </div>
                <div>
                  <label htmlFor="time" className="block text-sm font-medium text-gray-700">Preferred Time</label>
                  <input type="time" id="time" {...register('time')} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3" />
                  {errors.time && <p className="mt-1 text-sm text-red-600">{errors.time.message}</p>}
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-semibold"
              >
                Book Now
              </button>
            </form>
          </motion.div>

          <motion.div
            id="order-summary-card"
            className="lg:col-span-1 bg-white rounded-xl shadow-lg p-8 h-fit"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Order Summary</h2>
            <div className="space-y-4 text-lg text-gray-800">
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
                <span className="font-medium">⭐ {service.rating}</span>
              </div>
              {bookedOrder && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.5 }}
                  className="pt-4 mt-4 border-t border-gray-200 space-y-4"
                >
                  <h3 className="text-xl font-bold text-gray-900">Customer Details</h3>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name</span>
                    <span className="font-medium">{bookedOrder.customer_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone</span>
                    <span className="font-medium">{bookedOrder.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Address</span>
                    <span className="font-medium">{bookedOrder.address}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date</span>
                    <span className="font-medium">{bookedOrder.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time</span>
                    <span className="font-medium">{bookedOrder.time}</span>
                  </div>
                  <div className="flex justify-between text-2xl font-bold text-blue-600 pt-4 border-t border-gray-200">
                    <span>Total</span>
                    <span>${bookedOrder.total}</span>
                  </div>
                </motion.div>
              )}
            </div>
            {bookedOrder && (
              <button
                onClick={handleDownloadSummary}
                className="mt-6 w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors font-semibold"
              >
                Download Summary
              </button>
            )}
          </motion.div>
        </div>
      </div>
      <Footer />
      {showBookingConfirmation && bookedOrder && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full text-center"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <HiCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h3>
            <p className="text-gray-600 mb-4">Your order #{bookedOrder.id} has been successfully placed.</p>
            <button
              onClick={() => setShowBookingConfirmation(false)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
      {isReviewModalOpen && (
        <AddReviewModal
          services={services} // Pass services to the modal
          onClose={() => setIsReviewModalOpen(false)}
          onSave={handleAddReview}
        />
      )}
    </div>
  );
}

