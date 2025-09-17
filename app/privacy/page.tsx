import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Privacy Policy - RIII',
  description: 'Learn how RIII protects your privacy and handles your personal information.',
  robots: 'index, follow',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              <strong>Last updated:</strong> {new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>

            <p className="text-gray-600 mb-8">
              At RIII, we are committed to protecting your privacy and ensuring the security of your personal information. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use 
              our home services platform.
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Information We Collect</h2>
              
              <h3 className="text-xl font-medium text-gray-800 mb-3">1.1 Personal Information</h3>
              <ul className="list-disc pl-6 mb-4 text-gray-600">
                <li>Name, email address, and phone number</li>
                <li>Billing and shipping addresses</li>
                <li>Payment information (processed securely through third-party providers)</li>
                <li>Profile information and preferences</li>
                <li>Service history and booking details</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-800 mb-3">1.2 Technical Information</h3>
              <ul className="list-disc pl-6 mb-4 text-gray-600">
                <li>IP address and device information</li>
                <li>Browser type and version</li>
                <li>Operating system</li>
                <li>Pages visited and time spent on our platform</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-800 mb-3">1.3 Location Information</h3>
              <p className="text-gray-600 mb-4">
                We may collect your location information to provide location-based services, 
                match you with nearby service providers, and improve our service offerings.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. How We Use Your Information</h2>
              
              <p className="text-gray-600 mb-4">We use your information for the following purposes:</p>
              
              <ul className="list-disc pl-6 mb-4 text-gray-600">
                <li>Provide and maintain our home services platform</li>
                <li>Process bookings and facilitate service delivery</li>
                <li>Communicate with you about services, updates, and promotions</li>
                <li>Process payments and prevent fraud</li>
                <li>Improve our services and develop new features</li>
                <li>Provide customer support</li>
                <li>Comply with legal obligations</li>
                <li>Protect our rights and prevent misuse</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Information Sharing and Disclosure</h2>
              
              <p className="text-gray-600 mb-4">
                We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:
              </p>
              
              <ul className="list-disc pl-6 mb-4 text-gray-600">
                <li><strong>Service Providers:</strong> With trusted third-party service providers who assist us in operating our platform</li>
                <li><strong>Service Professionals:</strong> With verified service providers to facilitate service delivery</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
                <li><strong>Business Transfers:</strong> In connection with mergers, acquisitions, or asset sales</li>
                <li><strong>Consent:</strong> When you have given explicit consent to share your information</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Data Security</h2>
              
              <p className="text-gray-600 mb-4">
                We implement appropriate technical and organizational measures to protect your personal information against 
                unauthorized access, alteration, disclosure, or destruction. These measures include:
              </p>
              
              <ul className="list-disc pl-6 mb-4 text-gray-600">
                <li>Encryption of sensitive data in transit and at rest</li>
                <li>Regular security assessments and updates</li>
                <li>Access controls and authentication mechanisms</li>
                <li>Employee training on data protection practices</li>
                <li>Incident response procedures</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Your Rights and Choices</h2>
              
              <p className="text-gray-600 mb-4">You have the following rights regarding your personal information:</p>
              
              <ul className="list-disc pl-6 mb-4 text-gray-600">
                <li><strong>Access:</strong> Request access to your personal information</li>
                <li><strong>Correction:</strong> Request correction of inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                <li><strong>Portability:</strong> Request a copy of your data in a portable format</li>
                <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
                <li><strong>Restriction:</strong> Request restriction of processing in certain circumstances</li>
              </ul>
              
              <p className="text-gray-600 mb-4">
                To exercise these rights, please contact us using the information provided in the "Contact Us" section below.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Cookies and Tracking Technologies</h2>
              
              <p className="text-gray-600 mb-4">
                We use cookies and similar tracking technologies to enhance your experience on our platform. 
                You can control cookie settings through your browser preferences.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Data Retention</h2>
              
              <p className="text-gray-600 mb-4">
                We retain your personal information for as long as necessary to fulfill the purposes outlined in this 
                Privacy Policy, unless a longer retention period is required or permitted by law.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. International Data Transfers</h2>
              
              <p className="text-gray-600 mb-4">
                Your information may be transferred to and processed in countries other than your country of residence. 
                We ensure appropriate safeguards are in place to protect your information in accordance with this Privacy Policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Children's Privacy</h2>
              
              <p className="text-gray-600 mb-4">
                Our services are not intended for children under 13 years of age. We do not knowingly collect 
                personal information from children under 13. If you become aware that a child has provided us with 
                personal information, please contact us immediately.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Changes to This Privacy Policy</h2>
              
              <p className="text-gray-600 mb-4">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting 
                the new Privacy Policy on this page and updating the "Last updated" date. We encourage you to review 
                this Privacy Policy periodically for any changes.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Contact Us</h2>
              
              <p className="text-gray-600 mb-4">
                If you have any questions about this Privacy Policy or our privacy practices, please contact us:
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
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
