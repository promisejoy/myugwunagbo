import React from 'react';
import { FaExclamationTriangle, FaTimes, FaTrash, FaTimesCircle } from 'react-icons/fa';

const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Confirm Delete', 
  message = 'Are you sure you want to delete this item? This action cannot be undone.',
  confirmText = 'Delete',
  cancelText = 'Cancel',
  type = 'danger' // 'danger', 'warning', 'info'
}) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'danger':
        return <FaTrash className="text-red-500 text-4xl" />;
      case 'warning':
        return <FaExclamationTriangle className="text-yellow-500 text-4xl" />;
      default:
        return <FaExclamationTriangle className="text-blue-500 text-4xl" />;
    }
  };

  const getButtonColor = () => {
    switch (type) {
      case 'danger':
        return 'bg-red-600 hover:bg-red-700';
      case 'warning':
        return 'bg-yellow-600 hover:bg-yellow-700';
      default:
        return 'bg-[#006400] hover:bg-[#005a00]';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
        {/* Header */}
        <div className={`px-6 py-4 flex items-center justify-between ${
          type === 'danger' ? 'bg-red-50 border-b border-red-100' : 
          type === 'warning' ? 'bg-yellow-50 border-b border-yellow-100' : 
          'bg-gray-50 border-b border-gray-100'
        }`}>
          <div className="flex items-center gap-3">
            {getIcon()}
            <h3 className="text-lg font-bold text-gray-800">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-200 rounded-lg"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-gray-600 leading-relaxed">{message}</p>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-colors text-sm flex items-center justify-center gap-2 order-2 sm:order-1"
          >
            <FaTimesCircle className="text-sm" />
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-4 py-2.5 ${getButtonColor()} text-white font-semibold rounded-lg transition-colors text-sm flex items-center justify-center gap-2 order-1 sm:order-2`}
          >
            <FaTrash className="text-sm" />
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;