import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaPhone, FaFileAlt, FaClipboardList, FaSpinner, FaCheckCircle, FaPaperPlane, FaUpload, FaFile, FaTrash } from 'react-icons/fa';
import { api } from '../api/client';
import toast from 'react-hot-toast';

const ApplyForService = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [applicationId, setApplicationId] = useState('');
  const [servicePrices, setServicePrices] = useState({});
  const [pricesLoading, setPricesLoading] = useState(true);
  const [priceError, setPriceError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service_type: '',
    description: '',
    traditional_ruler_name: '',
    traditional_ruler_title: '',
    authorization_file: null,
    authorization_file_name: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedServicePrice, setSelectedServicePrice] = useState(0);
  const [submittedServiceType, setSubmittedServiceType] = useState('');
  const [submittedServicePrice, setSubmittedServicePrice] = useState(null);

  const serviceTypes = [
    'Birth Certificate',
    'Marriage Certificate',
    'Local Government of Origin',
    'Business Permit',
    'Building Plan Approval',
    'Tax Clearance Certificate',
    'Market Stall Permit',
    'Social Welfare',
    'Other'
  ];

  // Fetch service prices from backend
  useEffect(() => {
    let mounted = true;

    const fetchPrices = async () => {
      setPricesLoading(true);
      setPriceError('');

      try {
        const response = await api.getServicePrices();
        const prices = response.data?.data;

        if (!prices || typeof prices !== 'object') {
          throw new Error('The service price list is unavailable.');
        }

        if (mounted) setServicePrices(prices);
      } catch (error) {
        console.error('❌ Error fetching service prices:', error);
        if (mounted) {
          setServicePrices({});
          setPriceError(
            error.response?.data?.error ||
            'Service prices could not be loaded. Please try again.'
          );
        }
      } finally {
        if (mounted) setPricesLoading(false);
      }
    };

    fetchPrices();

    return () => {
      mounted = false;
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Update selected price when service type changes
    if (name === 'service_type') {
      const price = getServicePrice(value);
      setSelectedServicePrice(price);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        e.target.value = '';
        return;
      }
      
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please upload a JPEG, PNG, or PDF file');
        e.target.value = '';
        return;
      }

      setFormData({
        ...formData,
        authorization_file: file,
        authorization_file_name: file.name
      });
      setSelectedFile(file);
    }
  };

  const removeFile = () => {
    setFormData({
      ...formData,
      authorization_file: null,
      authorization_file_name: ''
    });
    setSelectedFile(null);
    const fileInput = document.getElementById('authorizationFile');
    if (fileInput) fileInput.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.service_type) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.service_type === 'Local Government of Origin') {
      if (!formData.traditional_ruler_name) {
        toast.error('Please provide the Traditional Ruler\'s name');
        return;
      }
      if (!formData.traditional_ruler_title) {
        toast.error('Please provide the Traditional Ruler\'s title');
        return;
      }
      if (!formData.authorization_file) {
        toast.error('Please upload the Traditional Ruler\'s authorization letter');
        return;
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    // ✅ Store the service type and price before submitting
    setSubmittedServiceType(formData.service_type);
    
    // ✅ Get the final price for the selected service
    const finalPrice = getServicePrice(formData.service_type);

    if (finalPrice === null) {
      toast.error('This service does not currently have a price configured by the administrator.');
      return;
    }

    setSelectedServicePrice(finalPrice);
    setSubmitting(true);
    try {
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('email', formData.email);
      submitData.append('phone', formData.phone || '');
      submitData.append('service_type', formData.service_type);
      submitData.append('description', formData.description || '');
      submitData.append('traditional_ruler_name', formData.traditional_ruler_name || '');
      submitData.append('traditional_ruler_title', formData.traditional_ruler_title || '');
      
      if (formData.authorization_file) {
        submitData.append('authorization_file', formData.authorization_file);
      }

      const response = await api.submitApplicationWithFile(submitData);
      console.log('Application response:', response.data);
      
      const savedApplication = response.data?.data || response.data;
      const appId = response.data?.application_id || savedApplication?.application_id || savedApplication?.id || generateApplicationId();
      const savedPrice = Number(savedApplication?.service_price);

      setApplicationId(appId);
      setSubmittedServicePrice(Number.isFinite(savedPrice) ? savedPrice : finalPrice);
      setSubmitted(true);
      toast.success('Application submitted successfully!');
      
      setFormData({
        name: '',
        email: '',
        phone: '',
        service_type: '',
        description: '',
        traditional_ruler_name: '',
        traditional_ruler_title: '',
        authorization_file: null,
        authorization_file_name: ''
      });
      setSelectedFile(null);
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error(error.response?.data?.error || 'Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const generateApplicationId = () => {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `UGW-${timestamp}-${random}`.toUpperCase();
  };

  const getServicePrice = (serviceType) => {
    if (!serviceType) return null;

    const price = servicePrices?.[serviceType]?.amount;
    const numericPrice = Number(price);

    return Number.isFinite(numericPrice) ? numericPrice : null;
  };

  // Update price when service type changes in dropdown
  useEffect(() => {
    if (formData.service_type) {
      const price = getServicePrice(formData.service_type);
      setSelectedServicePrice(price);
    }
  }, [formData.service_type, servicePrices]);

  if (submitted) {
    // ✅ Use the stored price for display
    const displayPrice = submittedServicePrice ?? selectedServicePrice ?? getServicePrice(submittedServiceType);
    
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaCheckCircle className="text-5xl text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Application Submitted!</h2>
          <p className="text-gray-600 mb-4">
            Your application has been received. You will be contacted shortly.
          </p>
          {applicationId && (
            <div className="bg-[#006400] text-white p-3 rounded-lg mb-4">
              <p className="text-sm font-semibold">Application ID:</p>
              <p className="text-lg font-mono">{applicationId}</p>
              <p className="text-xs text-[#ffcc00] mt-1">Please use this ID for payment reference</p>
            </div>
          )}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-left">
            <h4 className="font-semibold text-yellow-800 mb-2">Payment Instructions:</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Bank: First Bank of Nigeria</li>
              <li>• Account: Ugwunagbo Local Government</li>
              <li>• Account Number: 3112345678</li>
              <li>• <span className="font-bold">Amount: ₦{displayPrice.toLocaleString()}</span></li>
              <li>• Reference: Use your Application ID above</li>
            </ul>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate('/services')}
              className="flex-1 bg-[#006400] hover:bg-[#005a00] text-white font-semibold py-2 px-6 rounded-lg transition-colors"
            >
              Back to Services
            </button>
            <button
              onClick={() => window.print()}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
            >
              Print Instructions
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isLGA = formData.service_type === 'Local Government of Origin';
  const servicePrice = getServicePrice(formData.service_type);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom max-w-2xl">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-[#006400] to-[#008000] p-6 text-white">
            <h1 className="text-2xl font-bold flex items-center">
              <FaClipboardList className="mr-3" />
              Apply for Service
            </h1>
            <p className="text-[#ffcc00]/80 text-sm mt-1">
              Fill in the form below to apply for any of our services
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800">
              Service fees are controlled by the administrator and are updated from the official service pricing system.
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <FaUser className="inline mr-2 text-[#006400]" />
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006400] focus:border-transparent outline-none transition-all"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <FaEnvelope className="inline mr-2 text-[#006400]" />
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006400] focus:border-transparent outline-none transition-all"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <FaPhone className="inline mr-2 text-[#006400]" />
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006400] focus:border-transparent outline-none transition-all"
                placeholder="Enter your phone number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <FaFileAlt className="inline mr-2 text-[#006400]" />
                Service Type *
              </label>
              <select
                name="service_type"
                value={formData.service_type}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006400] focus:border-transparent outline-none transition-all bg-white"
                required
              >
                <option value="">Select a service</option>
                {serviceTypes.map((service) => {
                  const price = getServicePrice(service);
                  return (
                    <option key={service} value={service}>
                      {service} {price > 0 ? `(₦${price.toLocaleString()})` : ''}
                    </option>
                  );
                })}
              </select>
              {pricesLoading ? (
                <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-500">
                  Loading current service prices…
                </div>
              ) : priceError ? (
                <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                  {priceError}
                </div>
              ) : servicePrice !== null ? (
                <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-700">
                    <span className="font-semibold">Current service fee:</span> ₦{servicePrice.toLocaleString()}
                  </p>
                  <p className="text-xs text-green-600 mt-1">This amount is set by the administrator.</p>
                </div>
              ) : formData.service_type ? (
                <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-700">
                  This service has not been configured for payment yet.
                </div>
              ) : null}
            </div>

            {isLGA && (
              <div className="border border-[#006400] rounded-xl p-4 bg-gray-50">
                <h4 className="font-semibold text-[#006400] mb-3 flex items-center">
                  <FaClipboardList className="mr-2" />
                  Traditional Ruler Authorization
                </h4>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Traditional Ruler Name *
                    </label>
                    <input
                      type="text"
                      name="traditional_ruler_name"
                      value={formData.traditional_ruler_name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006400] focus:border-transparent outline-none transition-all"
                      placeholder="Enter the Traditional Ruler's full name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Traditional Ruler Title *
                    </label>
                    <input
                      type="text"
                      name="traditional_ruler_title"
                      value={formData.traditional_ruler_title}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006400] focus:border-transparent outline-none transition-all"
                      placeholder="e.g., HRH, Eze, Chief"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <FaUpload className="inline mr-2 text-[#006400]" />
                      Authorization Letter *
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-[#006400] transition-colors">
                      <input
                        id="authorizationFile"
                        type="file"
                        accept=".jpg,.jpeg,.png,.pdf"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      {selectedFile ? (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <FaFile className="text-[#006400] text-2xl" />
                            <div className="text-left">
                              <p className="text-sm font-medium text-gray-700">{selectedFile.name}</p>
                              <p className="text-xs text-gray-500">
                                {(selectedFile.size / 1024).toFixed(2)} KB
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={removeFile}
                            className="text-red-600 hover:text-red-800"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      ) : (
                        <label
                          htmlFor="authorizationFile"
                          className="cursor-pointer block"
                        >
                          <FaUpload className="text-3xl text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-500">
                            Click to upload authorization letter
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            JPEG, PNG, or PDF (Max 5MB)
                          </p>
                        </label>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      * Required for Local Government of Origin applications
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006400] focus:border-transparent outline-none transition-all resize-y"
                placeholder="Provide details about your application"
              />
            </div>

            <div className="flex flex-wrap gap-3 pt-4">
              <button
                type="submit"
                disabled={submitting || pricesLoading || !formData.service_type || servicePrice === null}
                className="flex-1 bg-[#006400] hover:bg-[#005a00] text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-[#006400]/30 disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {submitting ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <FaPaperPlane />
                    <span>Submit Application</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate('/services')}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-xl transition-all duration-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ApplyForService;