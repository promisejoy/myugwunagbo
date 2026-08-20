import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const DepartmentLayout = ({ title, icon, description, children, color }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Department Header */}
      <section className="py-16 text-white text-center" style={{ background: color }}>
        <div className="container-custom">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl border-2 border-white/30">
            {icon}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">{title}</h1>
          <p className="text-lg max-w-2xl mx-auto opacity-90">{description}</p>
        </div>
      </section>

      {/* Content */}
      <div className="container-custom py-8">
        {children}
        
        {/* Back Button */}
        <div className="text-center mt-8">
          <Link 
            to="/#departments" 
            className="inline-flex items-center gap-2 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition-opacity"
            style={{ background: color }}
          >
            <FaArrowLeft /> Back to All Departments
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DepartmentLayout;