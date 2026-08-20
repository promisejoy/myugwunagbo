import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';

const TermsOfService = () => {
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
          <span className="text-gray-700">Terms of Service</span>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="bg-white rounded-xl shadow-md p-6 md:p-10 max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center border-b-2 border-[#006400] pb-6 mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-[#006400] mb-3">Terms of Service</h1>
            <p className="text-gray-500 italic">Last Updated: {currentDate}</p>
          </div>

          {/* Important Notice */}
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded mb-8">
            <p className="text-yellow-800">
              <strong>Important:</strong> Please read these Terms of Service carefully before using the Ugwunagbo LGA official website. Your access to and use of the website is conditioned on your acceptance of and compliance with these Terms.
            </p>
          </div>

          {/* Section 1: Acceptance */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-[#006400] border-b border-gray-200 pb-2 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-600 leading-relaxed">
              By accessing and using the Ugwunagbo Local Government Area (LGA) official website, you accept and agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
            </p>
          </div>

          {/* Section 2: Use License */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-[#006400] border-b border-gray-200 pb-2 mb-4">2. Use License</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              Permission is granted to temporarily access the materials (information or software) on Ugwunagbo LGA's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose</li>
              <li>Attempt to decompile or reverse engineer any software contained on the website</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
              <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-3">
              This license shall automatically terminate if you violate any of these restrictions and may be terminated by Ugwunagbo LGA at any time.
            </p>
          </div>

          {/* Section 3: Disclaimer */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-[#006400] border-b border-gray-200 pb-2 mb-4">3. Disclaimer</h2>
            <p className="text-gray-600 leading-relaxed">
              The materials on Ugwunagbo LGA's website are provided on an 'as is' basis. Ugwunagbo LGA makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
            <p className="text-gray-600 leading-relaxed mt-3">
              Further, Ugwunagbo LGA does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on its website or otherwise relating to such materials or on any sites linked to this site.
            </p>
          </div>

          {/* Section 4: Limitations */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-[#006400] border-b border-gray-200 pb-2 mb-4">4. Limitations</h2>
            <p className="text-gray-600 leading-relaxed">
              In no event shall Ugwunagbo LGA or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Ugwunagbo LGA's website, even if Ugwunagbo LGA or an authorized representative has been notified orally or in writing of the possibility of such damage.
            </p>
          </div>

          {/* Section 5: Accuracy */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-[#006400] border-b border-gray-200 pb-2 mb-4">5. Accuracy of Materials</h2>
            <p className="text-gray-600 leading-relaxed">
              The materials appearing on Ugwunagbo LGA's website could include technical, typographical, or photographic errors. Ugwunagbo LGA does not warrant that any of the materials on its website are accurate, complete or current. Ugwunagbo LGA may make changes to the materials contained on its website at any time without notice.
            </p>
          </div>

          {/* Section 6: Links */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-[#006400] border-b border-gray-200 pb-2 mb-4">6. Links</h2>
            <p className="text-gray-600 leading-relaxed">
              Ugwunagbo LGA has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Ugwunagbo LGA of the site. Use of any such linked website is at the user's own risk.
            </p>
          </div>

          {/* Section 7: Modifications */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-[#006400] border-b border-gray-200 pb-2 mb-4">7. Modifications</h2>
            <p className="text-gray-600 leading-relaxed">
              Ugwunagbo LGA may revise these Terms of Service for its website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these Terms of Service.
            </p>
          </div>

          {/* Section 8: Governing Law */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-[#006400] border-b border-gray-200 pb-2 mb-4">8. Governing Law</h2>
            <p className="text-gray-600 leading-relaxed">
              These terms and conditions are governed by and construed in accordance with the laws of Nigeria and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
            </p>
          </div>

          {/* Section 9: User Responsibilities */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-[#006400] border-b border-gray-200 pb-2 mb-4">9. User Responsibilities</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              As a user of our website, you agree to:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li>Provide accurate and complete information when required</li>
              <li>Maintain the confidentiality of your account credentials</li>
              <li>Not use the website for any unlawful purpose</li>
              <li>Not interfere with or disrupt the website or servers</li>
              <li>Not attempt to gain unauthorized access to any portion of the website</li>
              <li>Respect the intellectual property rights of Ugwunagbo LGA</li>
            </ul>
          </div>

          {/* Section 10: Service Availability */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-[#006400] border-b border-gray-200 pb-2 mb-4">10. Service Availability</h2>
            <p className="text-gray-600 leading-relaxed">
              We strive to ensure the website is available 24/7, but we do not guarantee uninterrupted access. We may need to perform maintenance or updates, which may result in temporary unavailability.
            </p>
          </div>

          {/* Section 11: Contact */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-[#006400] border-b border-gray-200 pb-2 mb-4">11. Contact Information</h2>
            <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-[#006400]">
              <p className="text-gray-600 mb-3">If you have any questions about these Terms of Service, please contact us at:</p>
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

export default TermsOfService;