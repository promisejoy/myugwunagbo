import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';

// Layout
import Layout from './components/Layout/Layout';

// Pages
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import TraditionalRulersPage from './pages/TraditionalRulersPage';
import NGOsPage from './pages/NGOsPage';
import AcademiaPage from './pages/AcademiaPage';
import GalleryPage from './pages/GalleryPage';
import ContactPage from './pages/ContactPage';
import NewsDetailPage from './pages/NewsDetailPage';
import AdminPage from './pages/AdminPage';
import ApplyForService from './pages/ApplyForService';
import Villages from './pages/Villages';
import LeadershipHistory from './pages/LeadershipHistory';
import NewsPage from './pages/NewsPage';
import BudgetViewer from './pages/BudgetViewer';

// Forum Pages
import ForumPage from './pages/ForumPage';
import TopicDetailPage from './pages/TopicDetailPage';

// Department Pages
import AdministrationDepartment from './pages/departments/AdministrationDepartment';
import BudgetPlanningDepartment from './pages/departments/BudgetPlanningDepartment';
import FinanceDepartment from './pages/departments/FinanceDepartment';
import HealthDepartment from './pages/departments/HealthDepartment';
import JudiciaryDepartment from './pages/departments/JudiciaryDepartment';
import INECDepartment from './pages/departments/INECDepartment';
import PlanningDepartment from './pages/departments/PlanningDepartment';
import SecurityDepartment from './pages/departments/SecurityDepartment';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#4ade80',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
          <Routes>
            {/* Main Pages */}
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/contact" element={<ContactPage />} />
            
            {/* Services & Applications */}
            <Route path="/apply-for-service" element={<ApplyForService />} />
            
            {/* Villages & History */}
            <Route path="/villages" element={<Villages />} />
            <Route path="/leadership-history" element={<LeadershipHistory />} />
            
            {/* News */}
            <Route path="/news" element={<NewsPage />} />
            <Route path="/news/:id" element={<NewsDetailPage />} />
            
            {/* Forum */}
            <Route path="/forum" element={<ForumPage />} />
            <Route path="/forum/topic/:id" element={<TopicDetailPage />} />
            
            {/* Special Pages */}
            <Route path="/traditional-rulers" element={<TraditionalRulersPage />} />
            <Route path="/ngos" element={<NGOsPage />} />
            <Route path="/academia" element={<AcademiaPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            
            {/* Admin */}
            <Route path="/admin" element={<AdminPage />} />
            
            {/* Department Pages */}
            <Route path="/department/admin" element={<AdministrationDepartment />} />
            <Route path="/department/budget-planning" element={<BudgetPlanningDepartment />} />
            <Route path="/department/finance" element={<FinanceDepartment />} />
            <Route path="/department/health" element={<HealthDepartment />} />
            <Route path="/department/judiciary" element={<JudiciaryDepartment />} />
            <Route path="/department/inec" element={<INECDepartment />} />
            <Route path="/department/planning" element={<PlanningDepartment />} />
            <Route path="/department/security" element={<SecurityDepartment />} />

            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
              {/* Budget Viewer */}
            <Route path="/budget/:id" element={<BudgetViewer />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;