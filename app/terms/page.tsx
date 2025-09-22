import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Terms and Conditions - RIII',
  description: 'Read the terms and conditions for using RIII home services platform.',
  robots: 'index, follow',
};

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
  <Navbar />
  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms and Conditions</h1>
      
      <div className="prose prose-lg max-w-none">
        <p className="text-gray-600 mb-6">
          <strong>Last updated:</strong> {new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
          <p className="text-gray-600 mb-4">
            Welcome to R111 (“Company,” “we,” “our,” or “us”). These Terms & Conditions (“Terms”) 
            govern your use of our services, website, and any related platforms. By accessing or 
            using our services, you agree to comply with these Terms. If you do not agree, please 
            do not use our services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Services</h2>
          <p className="text-gray-600 mb-4">
            We provide moving & shifting, home cleaning, maintenance, electrician, plumbing, and 
            painting services within the UAE. The details of each service, including pricing, scope 
            of work, and timelines, will be agreed upon prior to booking.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Bookings & Payments</h2>
          <ul className="list-disc pl-6 mb-4 text-gray-600">
            <li>All bookings must be made through our official channels (website, phone, or email).</li>
            <li>Prices are quoted in AED unless otherwise stated.</li>
            <li>Full or partial payment may be required before the service is rendered.</li>
            <li>We reserve the right to cancel or reschedule bookings due to unforeseen circumstances.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Cancellations & Refunds</h2>
          <ul className="list-disc pl-6 mb-4 text-gray-600">
            <li>Customers may cancel or reschedule up to [X hours] before the service without penalty.</li>
            <li>Late cancellations may incur a fee.</li>
            <li>Refunds, if applicable, will be processed within [X days] after approval.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Customer Responsibilities</h2>
          <ul className="list-disc pl-6 mb-4 text-gray-600">
            <li>Provide accurate information when booking a service.</li>
            <li>Ensure access to the property and availability of necessary utilities (water, electricity, etc.).</li>
            <li>Safely store valuables; we are not responsible for items not disclosed prior to service.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Liability</h2>
          <p className="text-gray-600 mb-4">
            We take reasonable steps to ensure quality service. However, we are not liable for 
            indirect or consequential losses. Any damages caused by our staff must be reported 
            immediately. Our liability is limited to the cost of the service provided or as required 
            by UAE law.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Safety & Conduct</h2>
          <p className="text-gray-600 mb-4">
            We prioritize safety and professionalism. Any unsafe working conditions may lead to 
            service cancellation or delay. Harassment or inappropriate behavior towards our staff 
            will not be tolerated.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Intellectual Property</h2>
          <p className="text-gray-600 mb-4">
            All website content, logos, and materials are owned by R111. You may not use, copy, or 
            distribute them without our written consent.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Privacy</h2>
          <p className="text-gray-600 mb-4">
            We respect your privacy and handle your data according to our [Privacy Policy]. By using 
            our services, you consent to the collection and use of your data as outlined there.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Changes to Terms</h2>
          <p className="text-gray-600 mb-4">
            We may update these Terms & Conditions from time to time. The updated version will be 
            posted on our website with the “Last Updated” date.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Governing Law</h2>
          <p className="text-gray-600 mb-4">
            These Terms & Conditions are governed by the laws of the United Arab Emirates. Any 
            disputes will be resolved in the courts of [Your Emirate, e.g., Dubai].
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Contact Us</h2>
          <div className="bg-gray-50 p-6 rounded-lg">
            <p className="text-gray-600 mb-2"><strong>Email:</strong> [Insert Email]</p>
            <p className="text-gray-600 mb-2"><strong>Phone:</strong> [Insert Number]</p>
            <p className="text-gray-600"><strong>Website:</strong> [Insert Website URL]</p>
          </div>
        </section>

        <div className="mt-12 p-6 bg-blue-50 rounded-lg border-l-4 border-blue-400">
          <p className="text-blue-800 font-medium">
            By using R111's services, you acknowledge that you have read, understood, and agree to be 
            bound by these Terms and Conditions. Thank you for choosing R111 for your service needs!
          </p>
        </div>
      </div>
    </div>
  </div>
  <Footer />
</div>

  );
}
