'use client';

import { motion } from 'framer-motion';
import { HiShieldCheck, HiThumbUp, HiLightningBolt, HiSupport } from 'react-icons/hi';

const WhyRIII = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const features = [
    {
      title: 'Background-Verified Pros',
      description:
        'All professionals are vetted and trained to deliver consistent, high‑quality service.',
      Icon: HiShieldCheck,
    },
    {
      title: 'Top-Rated Service',
      description:
        '4.8/5 average rating across thousands of bookings from happy customers.',
      Icon: HiThumbUp,
    },
    {
      title: 'Fast & Flexible',
      description:
        'Same‑day slots, clear ETAs, and seamless rescheduling that fits your day.',
      Icon: HiLightningBolt,
    },
    {
      title: '24/7 Support',
      description:
        'Friendly support before, during, and after your service—anytime you need us.',
      Icon: HiSupport,
    },
  ];

  return (
    <section className="py-10 bg-gradient-to-br from-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-120px' }}
          variants={containerVariants}
          className="text-center mb-6"
        >
          <motion.h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2" variants={itemVariants}>
            Why choose <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">RIII</span>
          </motion.h2>
          <motion.p className="text-xl text-gray-600 max-w-3xl mx-auto" variants={itemVariants}>
            Reliable professionals, transparent pricing, and delightful experiences—every single time.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={containerVariants}
          className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
        >
          {features.map(({ title, description, Icon }, index) => (
            <motion.div
              key={title}
              variants={itemVariants}
              whileHover={{ y: -6, scale: 1.02, transition: { duration: 0.2 } }}
              className="bg-white rounded-2xl p-2 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-r from-blue-600 to-teal-600 text-white shadow-md mb-2 mx-auto">
                <Icon className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1 text-center">{title}</h3>
              <p className="text-gray-600 text-center">{description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default WhyRIII;