import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';

const PrivacyPolicy = () => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-gray-100 py-3">
        <div className="container-custom">
          <Link to="/" className="text-[#006400] hover:underline">Home</Link>
          <span className="text-gray-500 mx-2"> &gt; </span>
          <span className="text-gray-700">Privacy Policy</span>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="bg-white rounded-xl shadow-md p-6 md:p-10 max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center border-b-2 border-[#006400] pb-6 mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-[#006400] mb-3">Privacy Policy</h1>
            <p className="text-gray-500 italic">Last Updated: {currentDate}</p>
          </div>

          {/* Section 1: Introduction */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-[#006400] border-b border-gray-200 pb-2 mb-4">1. Introduction</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              Welcome to Ugwunagbo Local Government Area (LGA) official website. We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
            </p>
            <p className="text-gray-600 leading-relaxed">
              By using our website, you consent to the data practices described in this policy. If you do not agree with the terms of this privacy policy, please do not access the site.
            </p>
          </div>

          {/* Section 2: Information We Collect */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-[#006400] border-b border-gray-200 pb-2 mb-4">2. Information We Collect</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              We collect information that you voluntarily provide to us when you:
            </p>
            <ul className="list-disc pl-6 mb-3 text-gray-600 space-y-1">
              <li>Register for our services</li>
              <li>Submit forms or applications</li>
              <li>Contact us through our website</li>
              <li>Subscribe to our newsletters</li>
              <li>Participate in surveys or feedback</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mb-3">
              The personal information we collect may include:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li>Name and contact information (email, phone number, address)</li>
              <li>Demographic information</li>
              <li>Government identification details (where required for services)</li>
              <li>Payment information (for online transactions)</li>
              <li>Any other information you choose to provide</li>
            </ul>
          </div>

          {/* Section 3: How We Use Your Information */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-[#006400] border-b border-gray-200 pb-2 mb-4">3. How We Use Your Information</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              We use the information we collect for various purposes, including:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li>To provide, operate, and maintain our website</li>
              <li>To process your applications and requests</li>
              <li>To improve, personalize, and expand our services</li>
              <li>To communicate with you, including for customer service</li>
              <li>To send you administrative information and updates</li>
              <li>For legal compliance and regulatory requirements</li>
              <li>To prevent fraud and enhance security</li>
            </ul>
          </div>

          {/* Section 4: Cookies */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-[#006400] border-b border-gray-200 pb-2 mb-4">4. Cookies and Tracking Technologies</h2>
            <p className="text-gray-600 leading-relaxed">
              We may use cookies and similar tracking technologies to track activity on our website and hold certain information. Cookies are files with small amounts of data which may include an anonymous unique identifier.
            </p>
            <p className="text-gray-600 leading-relaxed mt-3">
              You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our website.
            </p>
          </div>

          {/* Section 5: Data Security */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-[#006400] border-b border-gray-200 pb-2 mb-4">5. Data Security</h2>
            <p className="text-gray-600 leading-relaxed">
              We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
            </p>
          </div>

          {/* Section 6: Data Sharing */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-[#006400] border-b border-gray-200 pb-2 mb-4">6. Data Sharing and Disclosure</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              We do not sell, trade, or rent your personal identification information to others. We may share generic aggregated demographic information not linked to any personal identification information regarding visitors and users with our partners and trusted affiliates.
            </p>
            <p className="text-gray-600 leading-relaxed mb-3">
              We may disclose your personal information only in the following circumstances:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li>To comply with legal obligations</li>
              <li>To protect and defend our rights or property</li>
              <li>To prevent or investigate possible wrongdoing in connection with the service</li>
              <li>To protect the personal safety of users of the service or the public</li>
              <li>With your consent</li>
            </ul>
          </div>

          {/* Section 7: Third-Party Services */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-[#006400] border-b border-gray-200 pb-2 mb-4">7. Third-Party Services</h2>
            <p className="text-gray-600 leading-relaxed">
              Our website may contain links to other sites that are not operated by us. If you click on a third-party link, you will be directed to that third party's site. We strongly advise you to review the privacy policy of every site you visit.
            </p>
            <p className="text-gray-600 leading-relaxed mt-3">
              We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.
            </p>
          </div>

          {/* Section 8: Children's Privacy */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-[#006400] border-b border-gray-200 pb-2 mb-4">8. Children's Privacy</h2>
            <p className="text-gray-600 leading-relaxed">
              Our website does not address anyone under the age of 13. We do not knowingly collect personally identifiable information from children under 13. If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact us.
            </p>
          </div>

          {/* Section 9: Changes */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-[#006400] border-b border-gray-200 pb-2 mb-4">9. Changes to This Privacy Policy</h2>
            <p className="text-gray-600 leading-relaxed">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
            </p>
            <p className="text-gray-600 leading-relaxed mt-3">
              You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
            </p>
          </div>

          {/* Section 10: Contact Us */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-[#006400] border-b border-gray-200 pb-2 mb-4">10. Contact Us</h2>
            <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-[#006400]">
              <p className="text-gray-600 mb-3">If you have any questions or concerns about this Privacy Policy, please contact us at:</p>
              <p className="font-semibold text-gray-800">Ugwunagbo Local Government Area</p>
              <div className="mt-3 space-y-2 text-gray-600">
                <p className="flex items-center gap-2">
                  <FaMapMarkerAlt className="text-[#006400]" />
                  Ugwunagbo Local Government Secretariat, Ugwunagbo, Abia State, Nigeria
                </p>
                <p className="flex items-center gap-2">
                  <FaPhone className="text-[#006400]" />
                  +234 7032270247
                </p>
                <p className="flex items-center gap-2">
                  <FaEnvelope className="text-[#006400]" />
                  smartdevtechs@gmail.com
                </p>
              </div>
            </div>
          </div>

          {/* Back to Home */}
          <div className="text-center mt-6">
            <Link to="/" className="inline-flex items-center gap-2 text-[#006400] hover:text-[#005a00] font-semibold transition-colors">
              <FaArrowLeft /> Back to Homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;