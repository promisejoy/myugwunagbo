import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';

import Layout from './components/Layout/Layout';

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

import ForumPage from './pages/ForumPage';
import TopicDetailPage from './pages/TopicDetailPage';

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

function SitePage({ children }) {
  return <Layout>{children}</Layout>;
}

function App() {
  return (
    <AuthProvider>
      <Router>
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
          {/* Normal website pages keep the normal Layout/footer */}
          <Route path="/" element={<SitePage><HomePage /></SitePage>} />
          <Route path="/about" element={<SitePage><AboutPage /></SitePage>} />
          <Route path="/services" element={<SitePage><ServicesPage /></SitePage>} />
          <Route path="/contact" element={<SitePage><ContactPage /></SitePage>} />
          <Route path="/apply-for-service" element={<SitePage><ApplyForService /></SitePage>} />
          <Route path="/villages" element={<SitePage><Villages /></SitePage>} />
          <Route path="/leadership-history" element={<SitePage><LeadershipHistory /></SitePage>} />
          <Route path="/news" element={<SitePage><NewsPage /></SitePage>} />
          <Route path="/news/:id" element={<SitePage><NewsDetailPage /></SitePage>} />
          <Route path="/traditional-rulers" element={<SitePage><TraditionalRulersPage /></SitePage>} />
          <Route path="/ngos" element={<SitePage><NGOsPage /></SitePage>} />
          <Route path="/academia" element={<SitePage><AcademiaPage /></SitePage>} />
          <Route path="/gallery" element={<SitePage><GalleryPage /></SitePage>} />
          <Route path="/admin" element={<SitePage><AdminPage /></SitePage>} />

          <Route path="/department/admin" element={<SitePage><AdministrationDepartment /></SitePage>} />
          <Route path="/department/budget-planning" element={<SitePage><BudgetPlanningDepartment /></SitePage>} />
          <Route path="/department/finance" element={<SitePage><FinanceDepartment /></SitePage>} />
          <Route path="/department/health" element={<SitePage><HealthDepartment /></SitePage>} />
          <Route path="/department/judiciary" element={<SitePage><JudiciaryDepartment /></SitePage>} />
          <Route path="/department/inec" element={<SitePage><INECDepartment /></SitePage>} />
          <Route path="/department/planning" element={<SitePage><PlanningDepartment /></SitePage>} />
          <Route path="/department/security" element={<SitePage><SecurityDepartment /></SitePage>} />

          <Route path="/privacy-policy" element={<SitePage><PrivacyPolicy /></SitePage>} />
          <Route path="/terms-of-service" element={<SitePage><TermsOfService /></SitePage>} />
          <Route path="/budget/:id" element={<SitePage><BudgetViewer /></SitePage>} />

          {/* Forum is intentionally OUTSIDE Layout — no website footer/header */}
          <Route path="/forum" element={<ForumPage />} />
          <Route path="/forum/topic/:id" element={<TopicDetailPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
