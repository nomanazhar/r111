'use client';

import { motion } from 'framer-motion';
import { HiShieldCheck, HiThumbUp, HiLightningBolt, HiSupport } from 'react-icons/hi';
// import Image from 'next/image';

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
    <section className="py-10  flex flex-col gap-10 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-120px' }}
          variants={containerVariants}
          className="text-center mb-6"
        >
          <motion.h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2" variants={itemVariants}>
            Why choose <span className="text-[#245FE8]">RIII</span>
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
              <div className="flex items-center justify-center w-14 h-14 rounded-xl  bg-blue-600  text-white shadow-md mb-2 mx-auto">
                <Icon className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1 text-center">{title}</h3>
              <p className="text-gray-600 text-center">{description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>


      <div className="max-w-8xl h-[100%] md:h-[30vh] bg-[#38B6FF] p-4 md:px-4 flex items-center justify-center">
        <motion.div className="blue-card h-[100%] w-[100%] md:text-left text-center md:flex flex-column items-center justify-center">

          <motion.div className="w-[60%] md:w-[30%] text-center flex items-center md:m-0 m-auto justify-center">
            <motion.img src="/R111.png" alt="R111" width={100} height={100} className='mt-[5%] w-[60%] h-[60%] object-cover flex items-center justify-center' />
          </motion.div>

          <motion.div className=" w-[65%] h-[100%] flex flex-col justify-center text-white md:m-0 m-auto gap-4 sm:gap-2 overflow-hidden">
            <motion.h1 className="text-xl font-extrabold ">The Justlife Promise – Excellence in Every Home</motion.h1>
            <motion.p className='text-xxl max-w-[700px]'>At Justlife, we commit to the highest standards of home care. Our trained professionals deliver a superior service experience,  ensuring your home is in expert hands. Your peace of mind is our  promise.
            </motion.p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyRIII;