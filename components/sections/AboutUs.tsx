'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function AboutUs() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
  } as const;

  const itemVariants = { 
    hidden: { opacity: 0, y: 20 }, 
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } 
  } as const;

  return (
    <section id="about" className="py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true }}
          variants={containerVariants}
          className="text-center mb-16"
        >
          <motion.h2 
            variants={itemVariants}
            className="text-4xl font-bold text-gray-900 mb-4"
          >
            About <span className="text-[#245FE8]">RIII</span>  Movers
          </motion.h2>
          <motion.p 
            variants={itemVariants}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Your trusted partner for professional home services across the UAE
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div 
            variants={itemVariants}
            className="space-y-6"
          >
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed mb-6">
                <span className="font-semibold text-blue-600">RIII Movers</span> is a trusted UAE-based company providing professional Home Maintenance, Painting, and Cleaning services designed to meet international standards.
              </p>
              
              <p className="text-gray-700 leading-relaxed mb-6">
                With a strong commitment to quality and reliability, we deliver tailored solutions that ensure your home or workplace remains spotless, well-maintained, and beautifully finished.
              </p>
              
              <p className="text-gray-700 leading-relaxed mb-6">
                Our expert team combines advanced techniques with eco-friendly practices to provide seamless services across <span className="font-semibold text-blue-600">Dubai, Abu Dhabi, and Sharjah</span>.
              </p>
              
              <p className="text-gray-700 leading-relaxed mb-6">
                Whether you need comprehensive deep cleaning, expert painting, or reliable home maintenance, RIII Movers is your go-to partner for convenience and excellence.
              </p>
              
              <p className="text-gray-700 leading-relaxed">
                We take pride in building long-term client relationships through transparent pricing, timely service, and customer satisfaction. At RIII Movers, our mission is simple—making your spaces cleaner, safer, and more comfortable while giving you peace of mind.
              </p>
            </div>

            <div className="pt-6">
              <Link 
                href="/about" 
                className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                Learn more about our story
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </motion.div>

          {/* Visual Elements */}
          <motion.div 
            variants={itemVariants}
            className="relative"
          >
            <div className="grid grid-cols-2 gap-6">
              {/* Service Cards */}
              <div className="space-y-6">
                <div className="bg-blue-50 rounded-2xl p-6 text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Quality Assured</h3>
                  <p className="text-sm text-gray-600">International standards with local expertise</p>
                </div>

                <div className="bg-green-50 rounded-2xl p-6 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Eco-Friendly</h3>
                  <p className="text-sm text-gray-600">Sustainable practices for a better future</p>
                </div>
              </div>

              <div className="space-y-6 mt-12">
                <div className="bg-purple-50 rounded-2xl p-6 text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Timely Service</h3>
                  <p className="text-sm text-gray-600">Always on time, every time</p>
                </div>

                <div className="bg-orange-50 rounded-2xl p-6 text-center">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Expert Team</h3>
                  <p className="text-sm text-gray-600">Professional and experienced staff</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
