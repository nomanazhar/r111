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

            <p className="text-gray-600 mb-8">
              Welcome to RIII! These Terms and Conditions ("Terms") govern your use of our home services platform 
              and the services provided through our website and mobile applications. By accessing or using our 
              services, you agree to be bound by these Terms.
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              
              <p className="text-gray-600 mb-4">
                By accessing, browsing, or using the RIII platform, you acknowledge that you have read, understood, 
                and agree to be bound by these Terms and our Privacy Policy. If you do not agree to these Terms, 
                please do not use our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
              
              <p className="text-gray-600 mb-4">
                RIII is a platform that connects customers with verified service providers for various home services 
                including but not limited to:
              </p>
              
              <ul className="list-disc pl-6 mb-4 text-gray-600">
                <li>Home cleaning and maintenance</li>
                <li>PC repair and technical support</li>
                <li>Beauty and wellness services</li>
                <li>Home improvement and repairs</li>
                <li>Other professional services as available</li>
              </ul>
              
              <p className="text-gray-600 mb-4">
                RIII acts as an intermediary platform and does not directly provide these services. 
                Service providers are independent contractors, not employees of RIII.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. User Accounts</h2>
              
              <h3 className="text-xl font-medium text-gray-800 mb-3">3.1 Account Creation</h3>
              <p className="text-gray-600 mb-4">
                To use certain features of our platform, you must create an account. You agree to provide accurate, 
                current, and complete information during registration and to update such information to keep it accurate, 
                current, and complete.
              </p>
              
              <h3 className="text-xl font-medium text-gray-800 mb-3">3.2 Account Security</h3>
              <p className="text-gray-600 mb-4">
                You are responsible for maintaining the confidentiality of your account credentials and for all 
                activities that occur under your account. You agree to notify us immediately of any unauthorized 
                use of your account.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Booking and Payment</h2>
              
              <h3 className="text-xl font-medium text-gray-800 mb-3">4.1 Service Bookings</h3>
              <p className="text-gray-600 mb-4">
                When you book a service through our platform, you enter into a direct agreement with the service provider. 
                RIII facilitates the connection but is not a party to the service agreement.
              </p>
              
              <h3 className="text-xl font-medium text-gray-800 mb-3">4.2 Payment Terms</h3>
              <ul className="list-disc pl-6 mb-4 text-gray-600">
                <li>Payment is required at the time of booking or upon service completion</li>
                <li>We accept various payment methods as displayed on our platform</li>
                <li>All payments are processed securely through third-party payment processors</li>
                <li>Prices are subject to change without notice</li>
                <li>Additional charges may apply for extra services or materials</li>
              </ul>
              
              <h3 className="text-xl font-medium text-gray-800 mb-3">4.3 Cancellation and Refunds</h3>
              <p className="text-gray-600 mb-4">
                Cancellation and refund policies vary by service provider and service type. Please review the 
                specific cancellation policy for your booking. RIII reserves the right to charge cancellation 
                fees as outlined in our cancellation policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. User Conduct</h2>
              
              <p className="text-gray-600 mb-4">You agree not to:</p>
              
              <ul className="list-disc pl-6 mb-4 text-gray-600">
                <li>Use the platform for any unlawful purpose or in violation of any applicable laws</li>
                <li>Provide false, misleading, or inaccurate information</li>
                <li>Interfere with or disrupt the platform's functionality</li>
                <li>Attempt to gain unauthorized access to any part of the platform</li>
                <li>Use automated systems to access the platform without permission</li>
                <li>Harass, abuse, or harm other users or service providers</li>
                <li>Violate any intellectual property rights</li>
                <li>Post or transmit any harmful, offensive, or inappropriate content</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Service Provider Relationships</h2>
              
              <p className="text-gray-600 mb-4">
                Service providers on our platform are independent contractors. RIII does not:
              </p>
              
              <ul className="list-disc pl-6 mb-4 text-gray-600">
                <li>Employ service providers or control their work methods</li>
                <li>Guarantee the quality, safety, or legality of services provided</li>
                <li>Provide insurance coverage for service providers</li>
                <li>Assume liability for service provider actions or omissions</li>
              </ul>
              
              <p className="text-gray-600 mb-4">
                We conduct background checks and verification processes for service providers, but we cannot 
                guarantee their performance or conduct.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Disclaimers and Limitations of Liability</h2>
              
              <h3 className="text-xl font-medium text-gray-800 mb-3">7.1 Service Disclaimer</h3>
              <p className="text-gray-600 mb-4">
                THE PLATFORM AND SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, 
                EITHER EXPRESS OR IMPLIED. RIII DISCLAIMS ALL WARRANTIES, INCLUDING BUT NOT LIMITED TO IMPLIED 
                WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
              </p>
              
              <h3 className="text-xl font-medium text-gray-800 mb-3">7.2 Limitation of Liability</h3>
              <p className="text-gray-600 mb-4">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, RIII SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, 
                SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, 
                DATA, OR USE, ARISING OUT OF OR RELATING TO YOUR USE OF THE PLATFORM.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Intellectual Property</h2>
              
              <p className="text-gray-600 mb-4">
                The RIII platform, including its design, functionality, and content, is protected by intellectual 
                property laws. You may not copy, modify, distribute, or create derivative works based on our 
                platform without our express written permission.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Privacy and Data Protection</h2>
              
              <p className="text-gray-600 mb-4">
                Your privacy is important to us. Please review our Privacy Policy to understand how we collect, 
                use, and protect your personal information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Termination</h2>
              
              <p className="text-gray-600 mb-4">
                We may terminate or suspend your account and access to the platform at any time, with or without 
                notice, for any reason, including violation of these Terms. You may also terminate your account 
                at any time by contacting us.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Dispute Resolution</h2>
              
              <h3 className="text-xl font-medium text-gray-800 mb-3">11.1 Governing Law</h3>
              <p className="text-gray-600 mb-4">
                These Terms shall be governed by and construed in accordance with the laws of the United Arab Emirates, 
                without regard to conflict of law principles.
              </p>
              
              <h3 className="text-xl font-medium text-gray-800 mb-3">11.2 Dispute Resolution Process</h3>
              <p className="text-gray-600 mb-4">
                Any disputes arising from these Terms or your use of the platform shall be resolved through binding 
                arbitration in accordance with the rules of the Dubai International Arbitration Centre (DIAC).
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Modifications to Terms</h2>
              
              <p className="text-gray-600 mb-4">
                We reserve the right to modify these Terms at any time. We will notify users of any material 
                changes by posting the updated Terms on our platform. Your continued use of the platform after 
                such modifications constitutes acceptance of the updated Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Severability</h2>
              
              <p className="text-gray-600 mb-4">
                If any provision of these Terms is found to be unenforceable or invalid, the remaining provisions 
                shall remain in full force and effect.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">14. Contact Information</h2>
              
              <p className="text-gray-600 mb-4">
                If you have any questions about these Terms and Conditions, please contact us:
              </p>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-600 mb-2">
                  <strong>Email:</strong> r111movers@gmail.com
                </p>
                <p className="text-gray-600 mb-2">
                  <strong>Phone:</strong> +971 52 528 8716
                </p>
                <p className="text-gray-600 text-capitalize">
                  <strong>Address:</strong> 31 floor Api Tower sheikh Zayed road
                </p>
              </div>
            </section>

            <div className="mt-12 p-6 bg-blue-50 rounded-lg border-l-4 border-blue-400">
              <p className="text-blue-800 font-medium">
                By using RIII's services, you acknowledge that you have read, understood, and agree to be bound by 
                these Terms and Conditions. Thank you for choosing RIII for your home service needs!
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
