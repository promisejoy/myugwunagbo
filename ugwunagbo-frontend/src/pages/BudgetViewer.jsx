import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  FaArrowLeft, FaFilePdf, FaDownload, FaCalendarAlt, FaClock, 
  FaSpinner, FaEye, FaFileWord, FaFileAlt, FaFile 
} from 'react-icons/fa';
import { api } from '../api/client';
import toast from 'react-hot-toast';

const BudgetViewer = () => {
  const { id } = useParams();
  const [budget, setBudget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadBudget();
  }, [id]);

  const loadBudget = async () => {
    try {
      setLoading(true);
      const response = await api.getBudgets();
      const found = response.data.find(b => b.id === id);
      if (found) {
        setBudget(found);
      } else {
        toast.error('Budget document not found');
        setError('Budget document not found');
      }
    } catch (error) {
      console.error('Error loading budget:', error);
      toast.error('Failed to load budget');
      setError('Failed to load budget');
    } finally {
      setLoading(false);
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

  const getFileIcon = (url) => {
    if (!url) return FaFile;
    const ext = url.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') return FaFilePdf;
    if (['doc', 'docx'].includes(ext)) return FaFileWord;
    return FaFileAlt;
  };

  const getFileType = (url) => {
    if (!url) return 'unknown';
    const ext = url.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') return 'pdf';
    if (['doc', 'docx'].includes(ext)) return 'word';
    return 'other';
  };

  const FileIcon = budget?.file_url ? getFileIcon(budget.file_url) : FaFile;
  const fileType = budget?.file_url ? getFileType(budget.file_url) : 'unknown';

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <FaSpinner className="text-5xl text-[#006400] animate-spin" />
      </div>
    );
  }

  if (error || !budget) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-md p-8 max-w-md text-center">
          <FaFilePdf className="text-5xl text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Budget Not Found</h2>
          <p className="text-gray-500 mb-6">{error || 'The budget document you\'re looking for doesn\'t exist.'}</p>
          <Link to="/department/budget-planning" className="bg-[#006400] hover:bg-[#005a00] text-white px-6 py-2 rounded-lg transition-colors inline-flex items-center gap-2">
            <FaArrowLeft /> Back to Budget & Planning
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#006400] to-[#008000] text-white py-6">
        <div className="container-custom">
          <Link 
            to="/department/budget-planning" 
            className="inline-flex items-center gap-2 text-[#ffcc00] hover:text-white transition-colors mb-3"
          >
            <FaArrowLeft /> Back to Budget & Planning
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold">{budget.title}</h1>
          <div className="flex flex-wrap items-center gap-4 mt-2 text-[#ffcc00]/80 text-sm">
            <span className="flex items-center gap-1">
              <FaCalendarAlt /> {budget.year}
            </span>
            <span className="flex items-center gap-1">
              <FaClock /> Uploaded: {formatDate(budget.uploaded_at || budget.created_at)}
            </span>
            <span className="flex items-center gap-1">
              <FileIcon className="text-[#ffcc00]" />
              {formatFileSize(budget.size)}
            </span>
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content - Document Viewer */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <FileIcon className="text-red-500 text-xl" />
                  <span className="font-medium text-gray-700">
                    Document Viewer
                    <span className="ml-2 text-xs text-gray-400">
                      ({fileType === 'pdf' ? 'PDF' : 'Word Document'})
                    </span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={budget.file_url}
                    download
                    className="flex items-center gap-1 bg-[#ffcc00] hover:bg-[#e6b800] text-[#006400] px-3 py-1.5 rounded-lg transition-colors text-sm font-semibold"
                  >
                    <FaDownload /> Download
                  </a>
                </div>
              </div>

              <div className="p-4 bg-gray-100 min-h-[600px]">
                {budget.file_url ? (
                  fileType === 'pdf' ? (
                    // PDF Viewer - iframe
                    <div className="w-full h-[700px] bg-white rounded-lg overflow-hidden">
                      <iframe
                        src={budget.file_url}
                        className="w-full h-full border-0"
                        title={budget.title}
                        allow="fullscreen"
                        loading="lazy"
                      />
                    </div>
                  ) : fileType === 'word' ? (
                    // Word Document Viewer - Using Google Docs Viewer
                    <div className="w-full h-[700px] bg-white rounded-lg overflow-hidden">
                      <iframe
                        src={`https://docs.google.com/viewer?url=${encodeURIComponent(budget.file_url)}&embedded=true`}
                        className="w-full h-full border-0"
                        title={budget.title}
                        allow="fullscreen"
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    // Other file types - Show download message
                    <div className="flex flex-col items-center justify-center h-[700px] bg-white rounded-lg p-8 text-center">
                      <FileIcon className="text-6xl text-gray-300 mb-4" />
                      <h3 className="text-xl font-semibold text-gray-700 mb-2">Preview Not Available</h3>
                      <p className="text-gray-500 mb-6">
                        This file type cannot be previewed directly in the browser.
                        Please download the file to view it.
                      </p>
                      <a
                        href={budget.file_url}
                        download
                        className="bg-[#006400] hover:bg-[#005a00] text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
                      >
                        <FaDownload /> Download {budget.title}
                      </a>
                    </div>
                  )
                ) : (
                  <div className="text-center py-20">
                    <FaFilePdf className="text-5xl text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No document available</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md overflow-hidden sticky top-24">
              <div className="bg-[#006400] text-white px-4 py-3">
                <h3 className="font-semibold text-sm">Quick Actions</h3>
              </div>
              <div className="p-4 space-y-3">
                {budget.file_url && (
                  <>
                    <a
                      href={budget.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full bg-[#006400] hover:bg-[#005a00] text-white px-4 py-2.5 rounded-lg transition-colors text-sm"
                    >
                      <FaEye /> Open in New Tab
                    </a>
                    <a
                      href={budget.file_url}
                      download
                      className="flex items-center justify-center gap-2 w-full bg-[#ffcc00] hover:bg-[#e6b800] text-[#006400] px-4 py-2.5 rounded-lg transition-colors text-sm font-semibold"
                    >
                      <FaDownload /> Download Document
                    </a>
                  </>
                )}
                <Link
                  to="/department/budget-planning"
                  className="flex items-center justify-center gap-2 w-full bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2.5 rounded-lg transition-colors text-sm"
                >
                  <FaArrowLeft /> All Budgets
                </Link>
              </div>
            </div>

            {/* Info Card */}
            <div className="bg-gradient-to-r from-[#006400] to-[#008000] text-white rounded-xl shadow-md overflow-hidden mt-4">
              <div className="p-4 text-center">
                <div className="text-3xl mb-2">📄</div>
                <h4 className="font-bold text-sm">Budget Document</h4>
                <p className="text-xs text-[#ffcc00]/80 mt-1">
                  {budget.title} - {budget.year}
                </p>
                <p className="text-xs text-white/70 mt-1">
                  {budget.description || 'Official budget document'}
                </p>
              </div>
            </div>

            {/* Document Info */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden mt-4">
              <div className="p-4">
                <h4 className="font-semibold text-gray-700 text-sm mb-2">Document Info</h4>
                <div className="space-y-2 text-xs text-gray-600">
                  <p><span className="font-medium">Title:</span> {budget.title}</p>
                  <p><span className="font-medium">Year:</span> {budget.year}</p>
                  <p><span className="font-medium">File Type:</span> {fileType === 'pdf' ? 'PDF' : fileType === 'word' ? 'Word Document' : 'Other'}</p>
                  <p><span className="font-medium">File Size:</span> {formatFileSize(budget.size)}</p>
                  <p><span className="font-medium">Uploaded:</span> {formatDate(budget.uploaded_at || budget.created_at)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetViewer;