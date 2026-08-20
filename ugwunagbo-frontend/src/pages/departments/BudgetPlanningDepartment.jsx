import React, { useState, useEffect } from 'react';
import DepartmentLayout from './DepartmentLayout';
import { Link } from 'react-router-dom';
import { 
  FaClipboardList, FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, 
  FaFilePdf, FaDownload, FaEye, FaCalendarAlt, FaUsers, FaChartPie,
  FaFileUpload, FaSpinner, FaTrash, FaEdit, FaArrowRight
} from 'react-icons/fa';
import { api } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const BudgetPlanningDepartment = () => {
  const { isAuthenticated } = useAuth();
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [budgetForm, setBudgetForm] = useState({
    title: '',
    year: new Date().getFullYear().toString(),
    description: '',
    file: null
  });

  useEffect(() => {
    loadBudgets();
  }, []);

  const loadBudgets = async () => {
    try {
      setLoading(true);
      const response = await api.getBudgets();
      setBudgets(response.data || []);
    } catch (error) {
      console.error('Error loading budgets:', error);
      toast.error('Failed to load budgets');
      setBudgets([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBudgetForm({ ...budgetForm, file });
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!budgetForm.title || !budgetForm.file) {
      toast.error('Please fill in all required fields');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('title', budgetForm.title);
      formData.append('year', budgetForm.year);
      formData.append('description', budgetForm.description || '');
      formData.append('file', budgetForm.file);

      const response = await api.uploadBudget(formData);
      
      toast.success('Budget uploaded successfully!');
      setBudgets([response.data, ...budgets]);
      setBudgetForm({ title: '', year: new Date().getFullYear().toString(), description: '', file: null });
      setShowUploadForm(false);
      
      const fileInput = document.getElementById('budgetFileInput');
      if (fileInput) fileInput.value = '';
    } catch (error) {
      console.error('Error uploading budget:', error);
      toast.error(error.response?.data?.error || 'Failed to upload budget');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteBudget = async (id) => {
    if (!window.confirm('Are you sure you want to delete this budget?')) return;
    
    try {
      await api.deleteBudget(id);
      toast.success('Budget deleted successfully');
      setBudgets(budgets.filter(b => b.id !== id));
    } catch (error) {
      console.error('Error deleting budget:', error);
      toast.error('Failed to delete budget');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'N/A';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <DepartmentLayout
      title="Budget & Planning Department"
      icon={<FaClipboardList />}
      description="Strategic planning, budget preparation, and financial resource allocation for sustainable development of Ugwunagbo LGA."
      color="linear-gradient(135deg, #006400, #008000)"
    >
      <div className="space-y-6">
        {/* Department Overview */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
          <div className="bg-[#006400] text-white px-6 py-4">
            <h2 className="text-xl font-semibold">Department Overview</h2>
          </div>
          <div className="p-6">
            <p className="text-gray-600 leading-relaxed">
              The Budget & Planning Department is responsible for the preparation, coordination, 
              and monitoring of the Local Government's annual budget and development plans. 
              We ensure that financial resources are allocated efficiently to drive sustainable 
              development and improve the quality of life for all residents.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-green-50 p-4 rounded-lg text-center border border-green-200">
                <div className="text-3xl font-bold text-[#006400]">₦2.5B</div>
                <div className="text-sm text-gray-500">Annual Budget</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center border border-green-200">
                <div className="text-3xl font-bold text-[#006400]">98.5%</div>
                <div className="text-sm text-gray-500">Budget Execution</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center border border-green-200">
                <div className="text-3xl font-bold text-[#006400]">15+</div>
                <div className="text-sm text-gray-500">Departments</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center border border-green-200">
                <div className="text-3xl font-bold text-[#006400]">24h</div>
                <div className="text-sm text-gray-500">Payment Processing</div>
              </div>
            </div>
          </div>
        </div>

        {/* Budgets List */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
          <div className="bg-[#006400] text-white px-6 py-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <FaFilePdf /> Budget Documents ({budgets.length})
            </h2>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="text-center py-8">
                <FaSpinner className="text-3xl text-[#006400] animate-spin mx-auto" />
                <p className="text-gray-500 mt-2">Loading budgets...</p>
              </div>
            ) : budgets.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FaFilePdf className="text-4xl mx-auto mb-2 text-gray-300" />
                <p>No budgets uploaded yet</p>
                {isAuthenticated && (
                  <button
                    onClick={() => setShowUploadForm(true)}
                    className="mt-4 bg-[#006400] hover:bg-[#005a00] text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Upload First Budget
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {budgets.map((budget) => (
                  <div key={budget.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <Link 
                          to={`/budget/${budget.id}`}
                          className="font-semibold text-gray-800 hover:text-[#006400] transition-colors"
                        >
                          {budget.title} <FaArrowRight className="inline text-xs ml-1" />
                        </Link>
                        <p className="text-sm text-gray-600">{budget.description}</p>
                        <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <FaCalendarAlt /> {budget.year}
                          </span>
                          <span className="flex items-center gap-1">
                            <FaClock /> {formatDate(budget.uploaded_at || budget.created_at)}
                          </span>
                          <span className="flex items-center gap-1">
                            <FaFilePdf /> {formatFileSize(budget.size)}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Link
                          to={`/budget/${budget.id}`}
                          className="flex items-center gap-1 bg-[#006400] hover:bg-[#005a00] text-white px-3 py-2 rounded-lg transition-colors text-sm"
                        >
                          <FaEye /> View
                        </Link>
                        {budget.file_url && (
                          <a
                            href={budget.file_url}
                            download
                            className="flex items-center gap-1 bg-[#ffcc00] hover:bg-[#e6b800] text-[#006400] px-3 py-2 rounded-lg transition-colors text-sm font-semibold"
                          >
                            <FaDownload /> Download
                          </a>
                        )}
                        {isAuthenticated && (
                          <button
                            onClick={() => handleDeleteBudget(budget.id)}
                            className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg transition-colors text-sm"
                          >
                            <FaTrash /> Delete
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Services */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
          <div className="bg-[#006400] text-white px-6 py-4">
            <h2 className="text-xl font-semibold">Our Services</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { icon: FaFilePdf, text: 'Budget preparation and coordination' },
                { icon: FaChartPie, text: 'Resource allocation and prioritization' },
                { icon: FaCalendarAlt, text: 'Annual budget planning and review' },
                { icon: FaUsers, text: 'Stakeholder consultation and engagement' },
                { icon: FaFilePdf, text: 'Budget implementation monitoring' },
                { icon: FaFilePdf, text: 'Financial performance reporting' }
              ].map((service, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
                  <service.icon className="text-[#006400]" />
                  <span className="text-gray-600">{service.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
          <div className="bg-[#006400] text-white px-6 py-4">
            <h2 className="text-xl font-semibold">Contact Information</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-lg text-center border border-green-100">
                <FaMapMarkerAlt className="text-2xl text-[#006400] mx-auto mb-2" />
                <h4 className="font-semibold">Office Location</h4>
                <p className="text-sm text-gray-600">Budget & Planning Block, Ugwunagbo LGA Secretariat</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center border border-green-100">
                <FaPhone className="text-2xl text-[#006400] mx-auto mb-2" />
                <h4 className="font-semibold">Phone Numbers</h4>
                <p className="text-sm text-gray-600">+234 806 444 5555</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center border border-green-100">
                <FaEnvelope className="text-2xl text-[#006400] mx-auto mb-2" />
                <h4 className="font-semibold">Email Addresses</h4>
                <p className="text-sm text-gray-600">budget@ugwunagbolga.gov.ng</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center border border-green-100">
                <FaClock className="text-2xl text-[#006400] mx-auto mb-2" />
                <h4 className="font-semibold">Working Hours</h4>
                <p className="text-sm text-gray-600">Monday - Friday: 8:00 AM - 4:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DepartmentLayout>
  );
};

export default BudgetPlanningDepartment;