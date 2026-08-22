import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ConfirmModal from '../components/common/ConfirmModal';
import {
  FaUserCog, FaUsers, FaNewspaper, FaHome, FaEnvelope,
  FaFileAlt, FaComments, FaCrown, FaHandsHelping, FaGraduationCap,
  FaPhotoVideo, FaHistory, FaBell, FaUpload, FaEdit, FaTrash,
  FaPlus, FaSave, FaTimesCircle, FaCheckCircle, FaSpinner,
  FaUserShield, FaChartLine, FaCalendarAlt, FaPhone, FaMapMarkerAlt,
  FaArrowRight, FaImage, FaVideo, FaFile, FaDownload, FaEye,
  FaLock, FaUser, FaKey, FaSignOutAlt, FaFilePdf, FaClock,
  FaMoneyBillWave
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import toast from 'react-hot-toast';

const AdminPage = () => {
  const { user, login, isAuthenticated, updateUser, logout } = useAuth();

  // Only administrator accounts are allowed into the dashboard.
  const isAdmin =
    user?.role === 'admin' ||
    user?.role === 'administrator' ||
    user?.is_admin === true ||
    user?.isAdmin === true;
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  
  const [data, setData] = useState({
    governor: null,
    leaders: [],
    news: [],
    villages: [],
    contacts: [],
    applications: [],
    traditionalRulers: [],
    ngos: [],
    academia: [],
    gallery: [],
    leadershipHistory: [],
    notifications: [],
    budgets: []
  });
  const [stats, setStats] = useState({
    totalLeaders: 0,
    totalNews: 0,
    totalContacts: 0,
    totalApplications: 0,
    totalVillages: 0,
    unreadNotifications: 0
  });

  // Form States
  const [governorForm, setGovernorForm] = useState({
    name: '',
    bio: '',
    title: 'Executive Governor',
    vision: '',
    mission: '',
    achievements: '',
    image: null,
    existingImage: null
  });
  
  const [leaderForm, setLeaderForm] = useState({
    id: '',
    name: '',
    position: '',
    bio: '',
    image: null,
    existingImage: null,
    email: '',
    phone: '',
    twitter: '',
    facebook: '',
    linkedin: ''
  });
  
  const [newsForm, setNewsForm] = useState({
    id: '',
    title: '',
    content: '',
    image: null,
    existingImage: null,
    date: '',
    category: 'General',
    author: 'Admin',
    status: 'published'
  });
  
  const [villageForm, setVillageForm] = useState({
    name: '',
    description: '',
    population: '',
    ward: ''
  });

  const [traditionalRulerForm, setTraditionalRulerForm] = useState({
    id: '',
    name: '',
    title: '',
    role: '',
    village: '',
    year: '',
    bio: '',
    phone: '',
    email: '',
    image: null,
    existingImage: null
  });

  const [ngoForm, setNgoForm] = useState({
    id: '',
    name: '',
    type: '',
    description: '',
    location: '',
    yearFounded: '',
    focusArea: '',
    projects: '',
    website: '',
    email: '',
    phone: '',
    image: null,
    existingImage: null
  });

  const [academiaForm, setAcademiaForm] = useState({
    id: '',
    full_name: '',
    title: '',
    village: '',
    qualification: '',
    image: null,
    existingImage: null
  });

  const [galleryForm, setGalleryForm] = useState({
    id: '',
    title: '',
    description: '',
    type: 'image',
    category: 'General',
    file: null,
    existingImage: null
  });

  const [profileForm, setProfileForm] = useState({
    username: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: 'Confirm Delete',
    message: 'Are you sure you want to delete this item? This action cannot be undone.',
    confirmText: 'Delete',
    type: 'danger',
    onConfirm: null
  });
  
  // ---------- SERVICE PRICES MANAGEMENT ----------
  const [servicePrices, setServicePrices] = useState({});
  const [priceForm, setPriceForm] = useState({
    service_type: '',
    amount: '',
    currency: 'NGN',
    description: ''
  });
  
  const serviceTypes = [
    'Birth Certificate',
    'Marriage Certificate',
    'Local Government of Origin',
    'Business Permit',
    'Building Plan Approval',
    'Tax Clearance Certificate',
    'Market Stall Permit',
    'Social Welfare',
    'Village Directory',
    'Other'
  ];

  // Fetch service prices
  const loadServicePrices = async () => {
    try {
      const response = await api.getServicePrices();
      const prices = response.data?.data || {};
      setServicePrices(prices);
    } catch (error) {
      console.error('Error loading service prices:', error);
    }
  };

  // Update service price
  const handlePriceUpdate = async (e) => {
    e.preventDefault();
    if (!priceForm.service_type || priceForm.amount === '') {
      toast.error('Please select a service and enter an amount');
      return;
    }

    const amount = Number(priceForm.amount);
    if (!Number.isFinite(amount) || amount < 0) {
      toast.error('Enter a valid service price of 0 or more.');
      return;
    }
    
    setLoading(true);
    try {
      await api.updateServicePrice(priceForm.service_type, {
        amount,
        currency: priceForm.currency,
        description: priceForm.description
      });
      toast.success('Service price updated successfully!');
      setPriceForm({ service_type: '', amount: '', currency: 'NGN', description: '' });
      await loadServicePrices();
    } catch (error) {
      console.error('Error updating service price:', error);
      toast.error(error.response?.data?.error || 'Failed to update service price');
    } finally {
      setLoading(false);
    }
  };

  const editPrice = (serviceType) => {
    const price = servicePrices[serviceType] || {};
    setPriceForm({
      service_type: serviceType,
      amount: price.amount || '',
      currency: price.currency || 'NGN',
      description: price.description || ''
    });
  };

  const [budgetForm, setBudgetForm] = useState({
    id: '',
    title: '',
    year: new Date().getFullYear().toString(),
    description: '',
    file: null,
    existingFile: null
  });
  const [uploading, setUploading] = useState(false);
  const [showBudgetUploadForm, setShowBudgetUploadForm] = useState(false);

  // File input refs
  const governorFileInputRef = useRef(null);
  const leaderFileInputRef = useRef(null);
  const newsFileInputRef = useRef(null);
  const traditionalRulerFileInputRef = useRef(null);
  const ngoFileInputRef = useRef(null);
  const academiaFileInputRef = useRef(null);
  const galleryFileInputRef = useRef(null);

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      loadDashboardData();
      loadServicePrices();
      if (user) {
        setProfileForm({
          username: user.username || '',
          email: user.email || '',
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }
    }
  }, [isAuthenticated, isAdmin, user]);

  // ---------- LOGIN ----------
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');
    try {
      const result = await login(loginForm.username, loginForm.password);
      if (result.success) {
        setLoginForm({ username: '', password: '' });
        toast.success('Login successful!');
        loadDashboardData();
      } else {
        setLoginError(result.error || 'Invalid credentials');
      }
    } catch (error) {
      setLoginError('Login failed. Please try again.');
    } finally {
      setLoginLoading(false);
    }
  };

  // ---------- LOAD DATA ----------
  const loadDashboardData = async () => {
    if (!isAuthenticated || !isAdmin) return;
    setLoading(true);
    try {
      const [
        governorRes, leadersRes, newsRes, villagesRes, contactsRes,
        applicationsRes, traditionalRulersRes, ngosRes, academiaRes,
        galleryRes, leadershipHistoryRes, notificationsRes, budgetsRes
      ] = await Promise.all([
        api.getGovernor().catch(() => ({ data: null })),
        api.getLeaders().catch(() => ({ data: [] })),
        api.getNews().catch(() => ({ data: [] })),
        api.getVillages().catch(() => ({ data: [] })),
        api.getContacts().catch(() => ({ data: [] })),
        api.getApplications().catch(() => ({ data: [] })),
        api.getTraditionalRulers().catch(() => ({ data: [] })),
        api.getNGOs().catch(() => ({ data: [] })),
        api.getAcademia().catch(() => ({ data: [] })),
        api.getGallery().catch(() => ({ data: [] })),
        api.getLeadershipHistory().catch(() => ({ data: [] })),
        api.getNotifications().catch(() => ({ data: { notifications: [], unreadCount: 0 } })),
        api.getBudgets().catch(() => ({ data: [] }))
      ]);

      setData({
        governor: governorRes.data || null,
        leaders: leadersRes.data || [],
        news: newsRes.data || [],
        villages: villagesRes.data || [],
        contacts: contactsRes.data || [],
        applications: applicationsRes.data || [],
        traditionalRulers: traditionalRulersRes.data || [],
        ngos: ngosRes.data || [],
        academia: academiaRes.data || [],
        gallery: galleryRes.data || [],
        leadershipHistory: leadershipHistoryRes.data || [],
        notifications: notificationsRes.data?.notifications || [],
        budgets: budgetsRes.data || []
      });

      setStats({
        totalLeaders: leadersRes.data?.length || 0,
        totalNews: newsRes.data?.length || 0,
        totalContacts: contactsRes.data?.length || 0,
        totalApplications: applicationsRes.data?.length || 0,
        totalVillages: villagesRes.data?.length || 0,
        unreadNotifications: notificationsRes.data?.unreadCount || 0
      });

      if (governorRes.data) {
        setGovernorForm({
          name: governorRes.data.name || '',
          bio: governorRes.data.bio || '',
          title: governorRes.data.title || 'Executive Governor',
          vision: governorRes.data.vision || '',
          mission: governorRes.data.mission || '',
          achievements: governorRes.data.achievements || '',
          image: null,
          existingImage: governorRes.data.image || null
        });
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // ---------- PROFILE ----------
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (profileForm.newPassword && profileForm.newPassword !== profileForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (profileForm.newPassword && profileForm.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const updateData = {};
      if (profileForm.username && profileForm.username !== user?.username) updateData.username = profileForm.username;
      if (profileForm.email && profileForm.email !== user?.email) updateData.email = profileForm.email;
      if (profileForm.currentPassword && profileForm.newPassword) {
        updateData.currentPassword = profileForm.currentPassword;
        updateData.newPassword = profileForm.newPassword;
      }
      if (Object.keys(updateData).length === 0) {
        toast.info('No changes to update');
        setLoading(false);
        return;
      }
      const response = await api.updateAdminProfile(updateData);
      toast.success('Profile updated successfully!');
      if (response.data.user) {
        updateUser(response.data.user);
      }
      setProfileForm({
        username: response.data.user?.username || profileForm.username,
        email: response.data.user?.email || profileForm.email,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.error || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  // ---------- GOVERNOR ----------
  const handleGovernorSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', governorForm.name);
      formData.append('bio', governorForm.bio || '');
      formData.append('title', governorForm.title || 'Executive Governor');
      formData.append('vision', governorForm.vision || '');
      formData.append('mission', governorForm.mission || '');
      formData.append('achievements', governorForm.achievements || '');
      if (governorForm.image && governorForm.image instanceof File) {
        formData.append('image', governorForm.image);
      }
      const response = await api.updateGovernor(formData);
      toast.success('Governor updated successfully!');
      if (response.data) {
        setGovernorForm({
          ...governorForm,
          name: response.data.name || governorForm.name,
          bio: response.data.bio || governorForm.bio,
          title: response.data.title || governorForm.title,
          vision: response.data.vision || governorForm.vision,
          mission: response.data.mission || governorForm.mission,
          achievements: response.data.achievements || governorForm.achievements,
          image: null,
          existingImage: response.data.image || governorForm.existingImage
        });
        if (governorFileInputRef.current) governorFileInputRef.current.value = '';
        const preview = document.getElementById('governorImagePreview');
        if (preview) {
          if (response.data.image) {
            preview.innerHTML = `<img src="${response.data.image}" alt="Governor" class="max-h-40 rounded-lg shadow-sm">`;
          } else {
            preview.innerHTML = 'No image uploaded';
          }
        }
      }
      loadDashboardData();
    } catch (error) {
      console.error('Error updating governor:', error);
      toast.error(error.response?.data?.error || 'Failed to update governor');
    } finally {
      setLoading(false);
    }
  };

  // ---------- LEADERS ----------
  const handleLeaderSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', leaderForm.name);
      formData.append('position', leaderForm.position);
      formData.append('bio', leaderForm.bio || '');
      formData.append('email', leaderForm.email || '');
      formData.append('phone', leaderForm.phone || '');
      formData.append('twitter', leaderForm.twitter || '');
      formData.append('facebook', leaderForm.facebook || '');
      formData.append('linkedin', leaderForm.linkedin || '');
      if (leaderForm.image && leaderForm.image instanceof File) {
        formData.append('image', leaderForm.image);
      }
      let response;
      if (leaderForm.id) {
        response = await api.updateLeader(leaderForm.id, formData);
        toast.success('Leader updated successfully!');
      } else {
        response = await api.addLeader(formData);
        toast.success('Leader added successfully!');
      }
      resetLeaderForm();
      loadDashboardData();
    } catch (error) {
      console.error('Error saving leader:', error);
      toast.error(error.response?.data?.error || 'Failed to save leader');
    } finally {
      setLoading(false);
    }
  };

  const editLeader = (leader) => {
    setLeaderForm({
      id: leader.id || leader._id,
      name: leader.name || '',
      position: leader.position || '',
      bio: leader.bio || '',
      image: null,
      existingImage: leader.image || null,
      email: leader.email || '',
      phone: leader.phone || '',
      twitter: leader.twitter || '',
      facebook: leader.facebook || '',
      linkedin: leader.linkedin || ''
    });
    setActiveTab('leaders');
  };

  const resetLeaderForm = () => {
    setLeaderForm({
      id: '',
      name: '',
      position: '',
      bio: '',
      image: null,
      existingImage: null,
      email: '',
      phone: '',
      twitter: '',
      facebook: '',
      linkedin: ''
    });
    if (leaderFileInputRef.current) leaderFileInputRef.current.value = '';
    const preview = document.getElementById('leaderImagePreview');
    if (preview) preview.innerHTML = 'No image selected';
  };

  const deleteLeader = async (id) => {
    openConfirmModal(async () => {
      setLoading(true);
      try {
        await api.deleteLeader(id);
        toast.success('Leader deleted successfully!');
        loadDashboardData();
      } catch (error) {
        toast.error('Failed to delete leader');
      } finally {
        setLoading(false);
      }
    }, 'Delete Leader', 'Are you sure you want to delete this leader? This action cannot be undone.', 'Delete Leader');
  };

  // ---------- NEWS ----------
  const handleNewsSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', newsForm.title);
      formData.append('content', newsForm.content);
      formData.append('date', newsForm.date || new Date().toISOString().split('T')[0]);
      formData.append('category', newsForm.category || 'General');
      formData.append('author', newsForm.author || 'Admin');
      formData.append('status', newsForm.status || 'published');
      if (newsForm.image && newsForm.image instanceof File) {
        formData.append('image', newsForm.image);
      }
      let response;
      if (newsForm.id) {
        response = await api.updateNews(newsForm.id, formData);
        toast.success('News updated successfully!');
      } else {
        response = await api.addNews(formData);
        toast.success('News added successfully!');
      }
      resetNewsForm();
      loadDashboardData();
    } catch (error) {
      console.error('Error saving news:', error);
      toast.error(error.response?.data?.error || 'Failed to save news');
    } finally {
      setLoading(false);
    }
  };

  const editNews = (news) => {
    setNewsForm({
      id: news.id || news._id,
      title: news.title || '',
      content: news.content || '',
      image: null,
      existingImage: news.image || null,
      date: news.date?.split('T')[0] || '',
      category: news.category || 'General',
      author: news.author || 'Admin',
      status: news.status || 'published'
    });
    setActiveTab('news');
  };

  const resetNewsForm = () => {
    setNewsForm({
      id: '',
      title: '',
      content: '',
      image: null,
      existingImage: null,
      date: '',
      category: 'General',
      author: 'Admin',
      status: 'published'
    });
    if (newsFileInputRef.current) newsFileInputRef.current.value = '';
    const preview = document.getElementById('newsImagePreview');
    if (preview) preview.innerHTML = 'No image selected';
  };

  const deleteNews = async (id) => {
    openConfirmModal(async () => {
      setLoading(true);
      try {
        await api.deleteNews(id);
        toast.success('News deleted successfully!');
        loadDashboardData();
      } catch (error) {
        toast.error('Failed to delete news');
      } finally {
        setLoading(false);
      }
    }, 'Delete News', 'Are you sure you want to delete this news article? This action cannot be undone.', 'Delete News');
  };

  // ---------- VILLAGES ----------
  const handleVillageSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.addVillage(villageForm);
      toast.success('Village added successfully!');
      setVillageForm({ name: '', description: '', population: '', ward: '' });
      loadDashboardData();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to add village');
    } finally {
      setLoading(false);
    }
  };

  const deleteVillage = async (id) => {
    openConfirmModal(async () => {
      setLoading(true);
      try {
        await api.deleteVillage(id);
        toast.success('Village deleted successfully!');
        loadDashboardData();
      } catch (error) {
        toast.error('Failed to delete village');
      } finally {
        setLoading(false);
      }
    }, 'Delete Village', 'Are you sure you want to delete this village? This action cannot be undone.', 'Delete Village');
  };

  // ---------- TRADITIONAL RULERS ----------
  const handleTraditionalRulerSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', traditionalRulerForm.name);
      formData.append('title', traditionalRulerForm.title || 'Traditional Ruler');
      formData.append('role', traditionalRulerForm.role || 'Traditional Leader');
      formData.append('village', traditionalRulerForm.village || '');
      formData.append('year', traditionalRulerForm.year || '');
      formData.append('bio', traditionalRulerForm.bio || '');
      formData.append('phone', traditionalRulerForm.phone || '');
      formData.append('email', traditionalRulerForm.email || '');
      if (traditionalRulerForm.image && traditionalRulerForm.image instanceof File) {
        formData.append('image', traditionalRulerForm.image);
      }
      let response;
      if (traditionalRulerForm.id) {
        response = await api.updateTraditionalRuler(traditionalRulerForm.id, formData);
        toast.success('Traditional ruler updated successfully!');
      } else {
        response = await api.addTraditionalRuler(formData);
        toast.success('Traditional ruler added successfully!');
      }
      resetTraditionalRulerForm();
      loadDashboardData();
    } catch (error) {
      console.error('Error saving traditional ruler:', error);
      toast.error(error.response?.data?.error || 'Failed to save traditional ruler');
    } finally {
      setLoading(false);
    }
  };

  const editTraditionalRuler = (ruler) => {
    setTraditionalRulerForm({
      id: ruler.id || ruler._id,
      name: ruler.name || '',
      title: ruler.title || 'Traditional Ruler',
      role: ruler.role || 'Traditional Leader',
      village: ruler.village || '',
      year: ruler.year || '',
      bio: ruler.bio || '',
      phone: ruler.phone || '',
      email: ruler.email || '',
      image: null,
      existingImage: ruler.image || null
    });
    setActiveTab('traditional-rulers');
  };

  const resetTraditionalRulerForm = () => {
    setTraditionalRulerForm({
      id: '',
      name: '',
      title: '',
      role: '',
      village: '',
      year: '',
      bio: '',
      phone: '',
      email: '',
      image: null,
      existingImage: null
    });
    if (traditionalRulerFileInputRef.current) traditionalRulerFileInputRef.current.value = '';
  };

  const deleteTraditionalRuler = async (id) => {
    openConfirmModal(async () => {
      setLoading(true);
      try {
        await api.deleteTraditionalRuler(id);
        toast.success('Traditional ruler deleted successfully!');
        loadDashboardData();
      } catch (error) {
        toast.error('Failed to delete traditional ruler');
      } finally {
        setLoading(false);
      }
    }, 'Delete Traditional Ruler', 'Are you sure you want to delete this traditional ruler? This action cannot be undone.', 'Delete Ruler');
  };

  // ---------- NGOS ----------
  const handleNgoSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', ngoForm.name);
      formData.append('type', ngoForm.type || '');
      formData.append('description', ngoForm.description || '');
      formData.append('location', ngoForm.location || '');
      formData.append('yearFounded', ngoForm.yearFounded || '');
      formData.append('focusArea', ngoForm.focusArea || '');
      formData.append('projects', ngoForm.projects || '');
      formData.append('website', ngoForm.website || '');
      formData.append('email', ngoForm.email || '');
      formData.append('phone', ngoForm.phone || '');
      if (ngoForm.image && ngoForm.image instanceof File) {
        formData.append('logo', ngoForm.image);
      }
      let response;
      if (ngoForm.id) {
        response = await api.updateNGO(ngoForm.id, formData);
        toast.success('NGO updated successfully!');
      } else {
        response = await api.addNGO(formData);
        toast.success('NGO added successfully!');
      }
      resetNgoForm();
      loadDashboardData();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to save NGO');
    } finally {
      setLoading(false);
    }
  };

  const editNgo = (ngo) => {
    setNgoForm({
      id: ngo.id || ngo._id,
      name: ngo.name || '',
      type: ngo.type || '',
      description: ngo.description || '',
      location: ngo.location || '',
      yearFounded: ngo.yearFounded || '',
      focusArea: ngo.focusArea || '',
      projects: ngo.projects || '',
      website: ngo.website || '',
      email: ngo.email || '',
      phone: ngo.phone || '',
      image: null,
      existingImage: ngo.logo || null
    });
    setActiveTab('ngos');
  };

  const resetNgoForm = () => {
    setNgoForm({
      id: '',
      name: '',
      type: '',
      description: '',
      location: '',
      yearFounded: '',
      focusArea: '',
      projects: '',
      website: '',
      email: '',
      phone: '',
      image: null,
      existingImage: null
    });
    if (ngoFileInputRef.current) ngoFileInputRef.current.value = '';
  };

  const deleteNgo = async (id) => {
    openConfirmModal(async () => {
      setLoading(true);
      try {
        await api.deleteNGO(id);
        toast.success('NGO deleted successfully!');
        loadDashboardData();
      } catch (error) {
        toast.error('Failed to delete NGO');
      } finally {
        setLoading(false);
      }
    }, 'Delete NGO', 'Are you sure you want to delete this NGO? This action cannot be undone.', 'Delete NGO');
  };

  // ---------- ACADEMIA ----------
  const handleAcademiaSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('full_name', academiaForm.full_name);
      formData.append('title', academiaForm.title || '');
      formData.append('village', academiaForm.village || '');
      formData.append('qualification', academiaForm.qualification || '');
      if (academiaForm.image && academiaForm.image instanceof File) {
        formData.append('photo', academiaForm.image);
      }
      let response;
      if (academiaForm.id) {
        response = await api.updateAcademician(academiaForm.id, formData);
        toast.success('Academician updated successfully!');
      } else {
        response = await api.addAcademician(formData);
        toast.success('Academician added successfully!');
      }
      resetAcademiaForm();
      loadDashboardData();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to save academician');
    } finally {
      setLoading(false);
    }
  };

  const editAcademia = (person) => {
    setAcademiaForm({
      id: person.id || person._id,
      full_name: person.full_name || '',
      title: person.title || '',
      village: person.village || '',
      qualification: person.qualification || '',
      image: null,
      existingImage: person.photo || null
    });
    setActiveTab('academia');
  };

  const resetAcademiaForm = () => {
    setAcademiaForm({
      id: '',
      full_name: '',
      title: '',
      village: '',
      qualification: '',
      image: null,
      existingImage: null
    });
    if (academiaFileInputRef.current) academiaFileInputRef.current.value = '';
  };

  const deleteAcademia = async (id) => {
    openConfirmModal(async () => {
      setLoading(true);
      try {
        await api.deleteAcademician(id);
        toast.success('Academician deleted successfully!');
        loadDashboardData();
      } catch (error) {
        toast.error('Failed to delete academician');
      } finally {
        setLoading(false);
      }
    }, 'Delete Academician', 'Are you sure you want to delete this academician? This action cannot be undone.', 'Delete Academician');
  };

  // ---------- GALLERY ----------
  const handleGallerySubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', galleryForm.title || '');
      formData.append('description', galleryForm.description || '');
      formData.append('type', galleryForm.type || 'image');
      formData.append('category', galleryForm.category || 'General');
      if (galleryForm.file && galleryForm.file instanceof File) {
        formData.append('file', galleryForm.file);
      }
      let response;
      if (galleryForm.id) {
        response = await api.updateGalleryItem(galleryForm.id, formData);
        toast.success('Gallery item updated successfully!');
      } else {
        response = await api.addGalleryItem(formData);
        toast.success('Gallery item added successfully!');
      }
      resetGalleryForm();
      loadDashboardData();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to save gallery item');
    } finally {
      setLoading(false);
    }
  };

  const editGallery = (item) => {
    setGalleryForm({
      id: item.id || item._id,
      title: item.title || '',
      description: item.description || '',
      type: item.type || 'image',
      category: item.category || 'General',
      file: null,
      existingImage: item.file_url || null
    });
    setActiveTab('gallery');
  };

  const resetGalleryForm = () => {
    setGalleryForm({
      id: '',
      title: '',
      description: '',
      type: 'image',
      category: 'General',
      file: null,
      existingImage: null
    });
    if (galleryFileInputRef.current) galleryFileInputRef.current.value = '';
  };

  const deleteGallery = async (id) => {
    openConfirmModal(async () => {
      setLoading(true);
      try {
        await api.deleteGalleryItem(id);
        toast.success('Gallery item deleted successfully!');
        loadDashboardData();
      } catch (error) {
        toast.error('Failed to delete gallery item');
      } finally {
        setLoading(false);
      }
    }, 'Delete Gallery Item', 'Are you sure you want to delete this gallery item? This action cannot be undone.', 'Delete Item');
  };

  // ---------- BUDGETS ----------
  const handleBudgetSubmit = async (e) => {
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
      setData({
        ...data,
        budgets: [response.data, ...(data.budgets || [])]
      });
      resetBudgetForm();
      setShowBudgetUploadForm(false);
      const fileInput = document.getElementById('budgetFileInput');
      if (fileInput) fileInput.value = '';
    } catch (error) {
      console.error('Error uploading budget:', error);
      toast.error(error.response?.data?.error || 'Failed to upload budget');
    } finally {
      setUploading(false);
    }
  };

  const resetBudgetForm = () => {
    setBudgetForm({
      id: '',
      title: '',
      year: new Date().getFullYear().toString(),
      description: '',
      file: null,
      existingFile: null
    });
  };

  const deleteBudget = async (id) => {
    openConfirmModal(async () => {
      try {
        await api.deleteBudget(id);
        toast.success('Budget deleted successfully');
        setData({
          ...data,
          budgets: data.budgets?.filter(b => b.id !== id) || []
        });
      } catch (error) {
        toast.error('Failed to delete budget');
      }
    }, 'Delete Budget', 'Are you sure you want to delete this budget document? This action cannot be undone.', 'Delete Budget');
  };

  // ---------- CONFIRM MODAL ----------
  const openConfirmModal = (onConfirm, title, message, confirmText = 'Delete', type = 'danger') => {
    setConfirmModal({
      isOpen: true,
      title: title || 'Confirm Delete',
      message: message || 'Are you sure you want to delete this item? This action cannot be undone.',
      confirmText: confirmText || 'Delete',
      type: type || 'danger',
      onConfirm: async () => {
        await onConfirm();
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  // ---------- HELPERS ----------
  const formatFileSize = (bytes) => {
    if (!bytes) return 'N/A';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
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

  // ---------- LOGOUT ----------
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // ---------- TABS ----------
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: FaChartLine },
    { id: 'governor', label: 'Governor', icon: FaUserCog },
    { id: 'leaders', label: 'Leaders', icon: FaUsers },
    { id: 'news', label: 'News', icon: FaNewspaper },
    { id: 'villages', label: 'Villages', icon: FaHome },
    { id: 'traditional-rulers', label: 'Traditional Rulers', icon: FaCrown },
    { id: 'budgets', label: 'Budgets', icon: FaFilePdf },
    { id: 'contacts', label: 'Contacts', icon: FaEnvelope },
    { id: 'applications', label: 'Applications', icon: FaFileAlt },
    { id: 'ngos', label: 'NGOs & Foundations', icon: FaHandsHelping },
    { id: 'academia', label: 'Academia', icon: FaGraduationCap },
    { id: 'gallery', label: 'Gallery', icon: FaPhotoVideo },
    { id: 'service-prices', label: 'Service Prices', icon: FaMoneyBillWave },
    { id: 'profile', label: 'Profile Settings', icon: FaUserShield },
  ];

  // ======================== RENDER ========================
  if (isAuthenticated && !isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-xl">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <FaLock className="text-2xl text-red-600" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900">
            Access Denied
          </h2>

          <p className="mt-3 text-gray-600">
            This dashboard is restricted to administrators only.
          </p>

          <button
            type="button"
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="mt-6 w-full rounded-xl bg-[#006400] px-5 py-3 font-semibold text-white transition hover:bg-[#005000]"
          >
            Return to Website
          </button>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-fadeIn">
          <div className="bg-gradient-to-r from-[#006400] to-[#008000] p-6 text-center">
            <div className="bg-[#ffcc00] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
              <FaUserShield className="text-[#006400] text-3xl" />
            </div>
            <h2 className="text-2xl font-bold text-white">Admin Login</h2>
            <p className="text-[#ffcc00]/80 text-sm">Enter your credentials to access the dashboard</p>
          </div>
          <div className="p-8">
            {loginError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm flex items-center">
                <FaTimesCircle className="mr-2" />
                {loginError}
              </div>
            )}
            <form onSubmit={handleLoginSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaUser className="inline mr-2 text-[#006400]" />
                  Username
                </label>
                <input
                  type="text"
                  value={loginForm.username}
                  onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006400] focus:border-transparent outline-none transition-all"
                  placeholder="Enter username"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaLock className="inline mr-2 text-[#006400]" />
                  Password
                </label>
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006400] focus:border-transparent outline-none transition-all"
                  placeholder="Enter password"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loginLoading}
                className="w-full bg-[#006400] hover:bg-[#005a00] text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-[#006400]/30 disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {loginLoading ? <FaSpinner className="animate-spin" /> : <FaUserShield />}
                <span>{loginLoading ? 'Logging in...' : 'Login to Dashboard'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur border-b border-slate-200 sticky top-0 z-20 shadow-sm">
        <div className="container-custom flex items-center justify-between gap-4 py-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="bg-gradient-to-br from-[#006400] to-[#008000] p-3 rounded-2xl shadow-lg shadow-green-900/10">
              <FaUserShield className="text-[#ffcc00] text-2xl" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#006400]">Ugwunagbo LGA</p>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 truncate">Administration Centre</h2>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/')}
              className="hidden sm:flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 hover:border-[#006400] hover:text-[#006400] transition-all"
            >
              <FaHome /> View site
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-100 px-3 sm:px-4 py-2 rounded-xl transition-all text-sm font-semibold"
            >
              <FaSignOutAlt />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="container-custom py-6">
        {/* Navigation */}
        <div className="flex overflow-x-auto bg-white/90 border border-slate-200 rounded-2xl shadow-sm mb-6 p-1.5 gap-1 sticky top-[82px] z-10">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-300 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-[#006400] to-[#008000] text-white shadow-md shadow-green-900/10'
                  : 'text-slate-600 hover:text-[#006400] hover:bg-slate-50'
              }`}
            >
              <tab.icon className="text-lg" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <FaSpinner className="text-4xl text-[#006400] animate-spin" />
          </div>
        ) : (
          <>
            {/* Dashboard */}
            {activeTab === 'dashboard' && (
              <div className="animate-fadeIn">
                <div className="mb-6 rounded-3xl bg-gradient-to-r from-[#003d00] via-[#006400] to-[#008000] p-6 sm:p-8 text-white shadow-xl overflow-hidden relative">
                  <div className="relative z-10 max-w-3xl">
                    <h1 className="text-2xl sm:text-3xl font-bold">Welcome back! {user?.fullName || 'Admin'}.</h1>
                    <p className="text-white/75 mt-2 text-sm sm:text-base">Monitor services, applications, public information and community resources from one central workspace.</p>
                  </div>
                  <div className="absolute -right-10 -top-20 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
                  <div className="absolute right-20 -bottom-32 h-64 w-64 rounded-full bg-[#ffcc00]/10 blur-3xl" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
                  {[
                    { label: 'Total Leaders', value: stats.totalLeaders, icon: FaUsers, color: 'text-[#006400]' },
                    { label: 'Total News', value: stats.totalNews, icon: FaNewspaper, color: 'text-blue-600' },
                    { label: 'Total Contacts', value: stats.totalContacts, icon: FaEnvelope, color: 'text-purple-600' },
                    { label: 'Applications', value: stats.totalApplications, icon: FaFileAlt, color: 'text-orange-600' },
                    { label: 'Total Villages', value: stats.totalVillages, icon: FaHome, color: 'text-green-600' },
                    { label: 'Notifications', value: stats.unreadNotifications, icon: FaBell, color: 'text-red-600' },
                  ].map((stat, index) => (
                    <div key={index} className="group bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                          <p className="text-3xl font-bold text-gray-800 mt-1">{stat.value}</p>
                        </div>
                        <div className={`${stat.color} bg-opacity-10 p-3 rounded-2xl`}>
                          <stat.icon className={`text-2xl ${stat.color}`} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Activity</h3>
                  <p className="text-gray-500">Dashboard is working! Use the tabs above to manage content.</p>
                </div>
              </div>
            )}

            {/* Governor */}
            {activeTab === 'governor' && (
              <div className="bg-white rounded-2xl p-6 shadow-md max-w-2xl mx-auto">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <FaUserCog className="text-[#006400] mr-3" />
                  Manage Governor
                </h3>
                <form onSubmit={handleGovernorSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      value={governorForm.name}
                      onChange={(e) => setGovernorForm({ ...governorForm, name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006400] focus:border-transparent outline-none transition-all"
                      placeholder="Enter governor's name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={governorForm.title}
                      onChange={(e) => setGovernorForm({ ...governorForm, title: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006400] focus:border-transparent outline-none transition-all"
                      placeholder="Enter title (e.g., Executive Governor)"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Biography</label>
                    <textarea
                      value={governorForm.bio}
                      onChange={(e) => setGovernorForm({ ...governorForm, bio: e.target.value })}
                      rows="4"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006400] focus:border-transparent outline-none transition-all resize-y"
                      placeholder="Enter biography"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Vision</label>
                    <textarea
                      value={governorForm.vision}
                      onChange={(e) => setGovernorForm({ ...governorForm, vision: e.target.value })}
                      rows="2"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006400] focus:border-transparent outline-none transition-all resize-y"
                      placeholder="Enter vision statement"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mission</label>
                    <textarea
                      value={governorForm.mission}
                      onChange={(e) => setGovernorForm({ ...governorForm, mission: e.target.value })}
                      rows="2"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006400] focus:border-transparent outline-none transition-all resize-y"
                      placeholder="Enter mission statement"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Achievements</label>
                    <textarea
                      value={governorForm.achievements}
                      onChange={(e) => setGovernorForm({ ...governorForm, achievements: e.target.value })}
                      rows="3"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006400] focus:border-transparent outline-none transition-all resize-y"
                      placeholder="Enter key achievements"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Photo</label>
                    {governorForm.existingImage && (
                      <div className="mb-2">
                        <p className="text-xs text-gray-500 mb-1">Current Image:</p>
                        <img src={governorForm.existingImage} alt="Current" className="max-h-32 rounded-lg shadow-sm" />
                      </div>
                    )}
                    <input
                      ref={governorFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setGovernorForm({ ...governorForm, image: file });
                          const reader = new FileReader();
                          reader.onload = (e) => {
                            const preview = document.getElementById('governorImagePreview');
                            if (preview) {
                              preview.innerHTML = `<img src="${e.target.result}" alt="Preview" class="max-h-40 rounded-lg shadow-sm">`;
                              preview.className = 'mt-2';
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006400] focus:border-transparent outline-none transition-all"
                    />
                    <div id="governorImagePreview" className="mt-2 text-gray-500 text-sm">
                      {governorForm.existingImage ? 'Click to upload new image' : 'No image selected'}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Recommended: Portrait image, max 5MB</p>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#006400] hover:bg-[#005a00] text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-[#006400]/30 disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    {loading ? <FaSpinner className="animate-spin" /> : <FaSave />}
                    <span>{loading ? 'Saving...' : 'Update Governor'}</span>
                  </button>
                </form>
              </div>
            )}

            {/* Leaders */}
            {activeTab === 'leaders' && (
              <div>
                <div className="bg-white rounded-2xl p-6 shadow-md mb-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                    <FaUsers className="text-[#006400] mr-3" />
                    {leaderForm.id ? 'Edit Leader' : 'Add New Leader'}
                  </h3>
                  <form onSubmit={handleLeaderSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                        <input
                          type="text"
                          value={leaderForm.name}
                          onChange={(e) => setLeaderForm({ ...leaderForm, name: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006400] focus:border-transparent outline-none transition-all"
                          placeholder="Enter full name"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Position *</label>
                        <select
                          value={leaderForm.position}
                          onChange={(e) => setLeaderForm({ ...leaderForm, position: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006400] focus:border-transparent outline-none transition-all"
                          required
                        >
                          <option value="">Select Position</option>
                          <option value="Executive Mayor">Executive Mayor</option>
                          <option value="Deputy Mayor">Deputy Mayor</option>
                          <option value="Secretary">Secretary</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Biography</label>
                      <textarea
                        value={leaderForm.bio}
                        onChange={(e) => setLeaderForm({ ...leaderForm, bio: e.target.value })}
                        rows="3"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006400] focus:border-transparent outline-none transition-all resize-y"
                        placeholder="Enter biography"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image</label>
                      {leaderForm.existingImage && (
                        <div className="mb-2">
                          <p className="text-xs text-gray-500 mb-1">Current Image:</p>
                          <img src={leaderForm.existingImage} alt="Current" className="max-h-20 rounded-lg shadow-sm" />
                        </div>
                      )}
                      <input
                        ref={leaderFileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            setLeaderForm({ ...leaderForm, image: file });
                            const reader = new FileReader();
                            reader.onload = (e) => {
                              const preview = document.getElementById('leaderImagePreview');
                              if (preview) {
                                preview.innerHTML = `<img src="${e.target.result}" alt="Preview" class="max-h-40 rounded-lg shadow-sm">`;
                                preview.className = 'mt-2';
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006400] focus:border-transparent outline-none transition-all"
                      />
                      <div id="leaderImagePreview" className="mt-2 text-gray-500 text-sm">
                        {leaderForm.existingImage ? 'Click to upload new image' : 'No image selected'}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Recommended: Square image, max 5MB</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                          type="email"
                          value={leaderForm.email}
                          onChange={(e) => setLeaderForm({ ...leaderForm, email: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006400] focus:border-transparent outline-none transition-all"
                          placeholder="Enter email"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <input
                          type="text"
                          value={leaderForm.phone}
                          onChange={(e) => setLeaderForm({ ...leaderForm, phone: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006400] focus:border-transparent outline-none transition-all"
                          placeholder="Enter phone number"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Twitter</label>
                        <input
                          type="text"
                          value={leaderForm.twitter}
                          onChange={(e) => setLeaderForm({ ...leaderForm, twitter: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006400] focus:border-transparent outline-none transition-all"
                          placeholder="Twitter URL"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Facebook</label>
                        <input
                          type="text"
                          value={leaderForm.facebook}
                          onChange={(e) => setLeaderForm({ ...leaderForm, facebook: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006400] focus:border-transparent outline-none transition-all"
                          placeholder="Facebook URL"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
                        <input
                          type="text"
                          value={leaderForm.linkedin}
                          onChange={(e) => setLeaderForm({ ...leaderForm, linkedin: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006400] focus:border-transparent outline-none transition-all"
                          placeholder="LinkedIn URL"
                        />
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <button
                        type="submit"
                        disabled={loading}
                        className="bg-[#006400] hover:bg-[#005a00] text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-[#006400]/30 disabled:opacity-50 flex items-center space-x-2"
                      >
                        {loading ? <FaSpinner className="animate-spin" /> : <FaSave />}
                        <span>{loading ? 'Saving...' : leaderForm.id ? 'Update Leader' : 'Add Leader'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={resetLeaderForm}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-xl transition-all duration-300"
                      >
                        Reset Form
                      </button>
                    </div>
                  </form>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-md">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Current Leaders</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data.leaders.map((leader) => (
                      <div key={leader.id || leader._id} className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-all duration-300 border border-gray-100">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {leader.image && (
                              <img src={leader.image} alt={leader.name} className="w-12 h-12 rounded-full object-cover" />
                            )}
                            <div>
                              <p className="font-semibold text-gray-800">{leader.name}</p>
                              <p className="text-sm text-[#006400]">{leader.position}</p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => editLeader(leader)}
                              className="text-blue-600 hover:text-blue-800 p-1.5 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => deleteLeader(leader.id || leader._id)}
                              className="text-red-600 hover:text-red-800 p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {data.leaders.length === 0 && (
                      <p className="text-gray-500 text-center col-span-full py-8">No leaders added yet</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* News */}
            {activeTab === 'news' && (
              <div>
                <div className="bg-white rounded-2xl p-6 shadow-md mb-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                    <FaNewspaper className="text-[#006400] mr-3" />
                    {newsForm.id ? 'Edit News' : 'Add News Article'}
                  </h3>
                  <form onSubmit={handleNewsSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                      <input
                        type="text"
                        value={newsForm.title}
                        onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006400] focus:border-transparent outline-none transition-all"
                        placeholder="Enter news title"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Content *</label>
                      <textarea
                        value={newsForm.content}
                        onChange={(e) => setNewsForm({ ...newsForm, content: e.target.value })}
                        rows="5"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006400] focus:border-transparent outline-none transition-all resize-y"
                        placeholder="Enter news content"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <input
                          type="text"
                          value={newsForm.category}
                          onChange={(e) => setNewsForm({ ...newsForm, category: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006400] focus:border-transparent outline-none transition-all"
                          placeholder="e.g., Politics, Community, Development"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                        <input
                          type="date"
                          value={newsForm.date}
                          onChange={(e) => setNewsForm({ ...newsForm, date: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006400] focus:border-transparent outline-none transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                      {newsForm.existingImage && (
                        <div className="mb-2">
                          <p className="text-xs text-gray-500 mb-1">Current Image:</p>
                          <img src={newsForm.existingImage} alt="Current" className="max-h-32 rounded-lg shadow-sm" />
                        </div>
                      )}
                      <input
                        ref={newsFileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            setNewsForm({ ...newsForm, image: file });
                            const reader = new FileReader();
                            reader.onload = (e) => {
                              const preview = document.getElementById('newsImagePreview');
                              if (preview) {
                                preview.innerHTML = `<img src="${e.target.result}" alt="Preview" class="max-h-40 rounded-lg shadow-sm">`;
                                preview.className = 'mt-2';
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006400] focus:border-transparent outline-none transition-all"
                      />
                      <div id="newsImagePreview" className="mt-2 text-gray-500 text-sm">
                        {newsForm.existingImage ? 'Click to upload new image' : 'No image selected'}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Recommended: Landscape image, max 5MB</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <button
                        type="submit"
                        disabled={loading}
                        className="bg-[#006400] hover:bg-[#005a00] text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-[#006400]/30 disabled:opacity-50 flex items-center space-x-2"
                      >
                        {loading ? <FaSpinner className="animate-spin" /> : <FaSave />}
                        <span>{loading ? 'Saving...' : newsForm.id ? 'Update News' : 'Add News'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={resetNewsForm}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-xl transition-all duration-300"
                      >
                        Reset Form
                      </button>
                    </div>
                  </form>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-md">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Current News</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data.news.map((item) => (
                      <div key={item.id || item._id} className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-all duration-300 border border-gray-100">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="font-semibold text-gray-800 line-clamp-1">{item.title}</p>
                            <p className="text-sm text-gray-500">{new Date(item.date || item.created_at).toLocaleDateString()}</p>
                            {item.image && (
                              <img src={item.image} alt={item.title} className="mt-2 max-h-16 rounded object-cover" />
                            )}
                          </div>
                          <div className="flex space-x-2 ml-2">
                            <button
                              onClick={() => editNews(item)}
                              className="text-blue-600 hover:text-blue-800 p-1.5 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => deleteNews(item.id || item._id)}
                              className="text-red-600 hover:text-red-800 p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {data.news.length === 0 && (
                      <p className="text-gray-500 text-center col-span-full py-8">No news added yet</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Villages */}
            {activeTab === 'villages' && (
              <div>
                <div className="bg-white rounded-2xl p-6 shadow-md mb-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                    <FaHome className="text-[#006400] mr-3" />
                    Add Village
                  </h3>
                  <form onSubmit={handleVillageSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Village Name *</label>
                      <input
                        type="text"
                        value={villageForm.name}
                        onChange={(e) => setVillageForm({ ...villageForm, name: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006400] focus:border-transparent outline-none transition-all"
                        placeholder="Enter village name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        value={villageForm.description}
                        onChange={(e) => setVillageForm({ ...villageForm, description: e.target.value })}
                        rows="3"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006400] focus:border-transparent outline-none transition-all resize-y"
                        placeholder="Enter village description"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Population</label>
                        <input
                          type="text"
                          value={villageForm.population}
                          onChange={(e) => setVillageForm({ ...villageForm, population: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006400] focus:border-transparent outline-none transition-all"
                          placeholder="Enter population"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ward</label>
                        <input
                          type="text"
                          value={villageForm.ward}
                          onChange={(e) => setVillageForm({ ...villageForm, ward: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006400] focus:border-transparent outline-none transition-all"
                          placeholder="Enter ward"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-[#006400] hover:bg-[#005a00] text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-[#006400]/30 disabled:opacity-50 flex items-center justify-center space-x-2"
                    >
                      {loading ? <FaSpinner className="animate-spin" /> : <FaPlus />}
                      <span>{loading ? 'Adding...' : 'Add Village'}</span>
                    </button>
                  </form>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-md">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Current Villages</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data.villages.map((village) => (
                      <div key={village.id || village._id} className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-all duration-300 border border-gray-100">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-gray-800">{village.name}</p>
                            <p className="text-sm text-gray-500">{village.ward || 'No ward'}</p>
                            {village.population && (
                              <p className="text-sm text-gray-500">Population: {village.population}</p>
                            )}
                          </div>
                          <button
                            onClick={() => deleteVillage(village.id || village._id)}
                            className="text-red-600 hover:text-red-800 p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    ))}
                    {data.villages.length === 0 && (
                      <p className="text-gray-500 text-center col-span-full py-8">No villages added yet</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Traditional Rulers */}
            {activeTab === 'traditional-rulers' && (
              <div>
                <div className="bg-white rounded-2xl p-6 shadow-md mb-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                    <FaCrown className="text-[#006400] mr-3" />
                    {traditionalRulerForm.id ? 'Edit Traditional Ruler' : 'Add Traditional Ruler'}
                  </h3>
                  <form onSubmit={handleTraditionalRulerSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                        <input
                          type="text"
                          value={traditionalRulerForm.name}
                          onChange={(e) => setTraditionalRulerForm({ ...traditionalRulerForm, name: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006400] focus:border-transparent outline-none transition-all"
                          placeholder="Enter full name"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input
                          type="text"
                          value={traditionalRulerForm.title}
                          onChange={(e) => setTraditionalRulerForm({ ...traditionalRulerForm, title: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006400] focus:border-transparent outline-none transition-all"
                          placeholder="e.g., HRH, Chief, Eze"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Role / Position</label>
                        <input
                          type="text"
                          value={traditionalRulerForm.role}
                          onChange={(e) => setTraditionalRulerForm({ ...traditionalRulerForm, role: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006400] focus:border-transparent outline-none transition-all"
                          placeholder="e.g., Traditional Leader, Chief"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Village / Community</label>
                        <input
                          type="text"
                          value={traditionalRulerForm.village}
                          onChange={(e) => setTraditionalRulerForm({ ...traditionalRulerForm, village: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006400] focus:border-transparent outline-none transition-all"
                          placeholder="Enter village or community"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Year (Reign Start)</label>
                        <input
                          type="text"
                          value={traditionalRulerForm.year}
                          onChange={(e) => setTraditionalRulerForm({ ...traditionalRulerForm, year: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006400] focus:border-transparent outline-none transition-all"
                          placeholder="e.g., 2010"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <input
                          type="text"
                          value={traditionalRulerForm.phone}
                          onChange={(e) => setTraditionalRulerForm({ ...traditionalRulerForm, phone: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006400] focus:border-transparent outline-none transition-all"
                          placeholder="Enter phone number"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={traditionalRulerForm.email}
                        onChange={(e) => setTraditionalRulerForm({ ...traditionalRulerForm, email: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006400] focus:border-transparent outline-none transition-all"
                        placeholder="Enter email address"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Biography</label>
                      <textarea
                        value={traditionalRulerForm.bio}
                        onChange={(e) => setTraditionalRulerForm({ ...traditionalRulerForm, bio: e.target.value })}
                        rows="3"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006400] focus:border-transparent outline-none transition-all resize-y"
                        placeholder="Enter biography or background information"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Photo</label>
                      {traditionalRulerForm.existingImage && (
                        <div className="mb-2">
                          <p className="text-xs text-gray-500 mb-1">Current Photo:</p>
                          <img src={traditionalRulerForm.existingImage} alt="Current" className="max-h-20 rounded-lg shadow-sm" />
                        </div>
                      )}
                      <input
                        ref={traditionalRulerFileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            setTraditionalRulerForm({ ...traditionalRulerForm, image: file });
                          }
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006400] focus:border-transparent outline-none transition-all"
                      />
                      <p className="text-xs text-gray-500 mt-1">Recommended: Portrait image, max 5MB</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <button
                        type="submit"
                        disabled={loading}
                        className="bg-[#006400] hover:bg-[#005a00] text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-[#006400]/30 disabled:opacity-50 flex items-center space-x-2"
                      >
                        {loading ? <FaSpinner className="animate-spin" /> : <FaSave />}
                        <span>{loading ? 'Saving...' : traditionalRulerForm.id ? 'Update Ruler' : 'Add Ruler'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={resetTraditionalRulerForm}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-xl transition-all duration-300"
                      >
                        Reset Form
                      </button>
                    </div>
                  </form>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-md">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Current Traditional Rulers</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data.traditionalRulers.map((ruler) => (
                      <div key={ruler.id || ruler._id} className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-all duration-300 border border-gray-100">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {ruler.image && (
                              <img src={ruler.image} alt={ruler.name} className="w-12 h-12 rounded-full object-cover" />
                            )}
                            <div>
                              <p className="font-semibold text-gray-800">{ruler.name}</p>
                              <p className="text-sm text-[#006400]">{ruler.title || 'Traditional Ruler'}</p>
                              <p className="text-xs text-gray-500">{ruler.village || 'Ugwunagbo'}</p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => editTraditionalRuler(ruler)}
                              className="text-blue-600 hover:text-blue-800 p-1.5 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => deleteTraditionalRuler(ruler.id || ruler._id)}
                              className="text-red-600 hover:text-red-800 p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {data.traditionalRulers.length === 0 && (
                      <p className="text-gray-500 text-center col-span-full py-8">No traditional rulers added yet</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Budgets */}
            {activeTab === 'budgets' && (
              <div>
                <div className="bg-white rounded-2xl p-6 shadow-md mb-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                    <FaFilePdf className="text-[#006400] mr-3" />
                    Budget Management
                  </h3>
                  <button
                    onClick={() => setShowBudgetUploadForm(!showBudgetUploadForm)}
                    className="mb-4 bg-[#006400] hover:bg-[#005a00] text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <FaUpload /> {showBudgetUploadForm ? 'Cancel' : 'Upload New Budget'}
                  </button>
                  {showBudgetUploadForm && (
                    <form onSubmit={handleBudgetSubmit} className="space-y-4 border-t border-gray-200 pt-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Budget Title *</label>
                        <input
                          type="text"
                          value={budgetForm.title}
                          onChange={(e) => setBudgetForm({ ...budgetForm, title: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006400] focus:border-transparent outline-none"
                          placeholder="e.g., 2024 Annual Budget"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Year *</label>
                          <input
                            type="text"
                            value={budgetForm.year}
                            onChange={(e) => setBudgetForm({ ...budgetForm, year: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006400] focus:border-transparent outline-none"
                            placeholder="e.g., 2024"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Budget File (PDF/Word) *</label>
                          <input
                            id="budgetFileInput"
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) {
                                setBudgetForm({ ...budgetForm, file });
                              }
                            }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006400] focus:border-transparent outline-none"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                          value={budgetForm.description}
                          onChange={(e) => setBudgetForm({ ...budgetForm, description: e.target.value })}
                          rows="2"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006400] focus:border-transparent outline-none"
                          placeholder="Brief description of the budget"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={uploading}
                        className="bg-[#006400] hover:bg-[#005a00] text-white font-semibold py-2 px-6 rounded-lg transition-colors flex items-center gap-2"
                      >
                        {uploading ? <FaSpinner className="animate-spin" /> : <FaUpload />}
                        {uploading ? 'Uploading...' : 'Upload Budget'}
                      </button>
                    </form>
                  )}
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-md">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <FaFilePdf className="text-[#006400]" /> Budget Documents ({data.budgets?.length || 0})
                  </h3>
                  {loading ? (
                    <div className="text-center py-8">
                      <FaSpinner className="text-3xl text-[#006400] animate-spin mx-auto" />
                      <p className="text-gray-500 mt-2">Loading budgets...</p>
                    </div>
                  ) : data.budgets?.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <FaFilePdf className="text-4xl mx-auto mb-2 text-gray-300" />
                      <p>No budgets uploaded yet</p>
                      <button
                        onClick={() => setShowBudgetUploadForm(true)}
                        className="mt-4 bg-[#006400] hover:bg-[#005a00] text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        Upload First Budget
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {data.budgets.map((budget) => (
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
                              <button
                                onClick={() => deleteBudget(budget.id)}
                                className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg transition-colors text-sm"
                              >
                                <FaTrash /> Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Contacts */}
            {activeTab === 'contacts' && (
              <div className="bg-white rounded-2xl p-6 shadow-md">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <FaEnvelope className="text-[#006400] mr-3" />
                  Contact Requests
                </h3>
                {data.contacts.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No contact requests yet</p>
                ) : (
                  <div className="space-y-4">
                    {data.contacts.map((contact) => (
                      <div key={contact.id || contact._id} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold text-gray-800">{contact.name}</p>
                            <p className="text-sm text-gray-600">{contact.email}</p>
                            {contact.phone && <p className="text-sm text-gray-600">{contact.phone}</p>}
                            <p className="text-sm font-medium text-gray-700 mt-1">{contact.subject}</p>
                            <p className="text-sm text-gray-500 mt-1">{contact.message}</p>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full ${contact.status === 'new' ? 'bg-green-100 text-green-700' : contact.status === 'read' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                            {contact.status || 'new'}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">{new Date(contact.created_at || contact.createdAt).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Applications Tab - UPDATED with Authorization File View */}
            {activeTab === 'applications' && (
              <div className="bg-white rounded-2xl p-6 shadow-md">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <FaFileAlt className="text-[#006400] mr-3" />
                  Service Applications
                </h3>
                {data.applications.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No applications yet</p>
                ) : (
                  <div className="space-y-4">
                    {data.applications.map((app) => (
                      <div key={app.id || app._id} className="bg-gray-50 rounded-xl p-4 border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                          <div className="flex-1">
                            <div className="flex items-start justify-between flex-wrap gap-2">
                              <div>
                                <p className="font-semibold text-gray-800">{app.name}</p>
                                <p className="text-sm text-gray-600">{app.email}</p>
                                {app.phone && <p className="text-sm text-gray-600">{app.phone}</p>}
                                <p className="text-sm font-medium text-[#006400] mt-1">Service: {app.service_type || 'Other'}</p>
                                
                                {/* Traditional Ruler Authorization Info */}
                                {app.service_type === 'Local Government of Origin' && (
                                  <div className="mt-2 p-3 bg-[#006400]/10 rounded-lg border border-[#006400]/20">
                                    <p className="text-sm font-semibold text-[#006400] flex items-center gap-2">
                                      <FaCrown className="text-[#006400]" />
                                      Traditional Ruler Authorization
                                    </p>
                                    {app.traditional_ruler_name && (
                                      <p className="text-sm text-gray-700 mt-1">
                                        <span className="font-medium">Ruler:</span> {app.traditional_ruler_name}
                                      </p>
                                    )}
                                    {app.traditional_ruler_title && (
                                      <p className="text-sm text-gray-700">
                                        <span className="font-medium">Title:</span> {app.traditional_ruler_title}
                                      </p>
                                    )}
                                    {app.authorization_file_url && (
                                      <div className="mt-2 flex items-center gap-2">
                                        <FaFile className="text-[#006400]" />
                                        <a
                                          href={app.authorization_file_url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-[#006400] hover:text-[#004d00] underline text-sm font-medium flex items-center gap-1"
                                        >
                                          <FaEye className="text-xs" /> View Authorization Letter
                                        </a>
                                        <a
                                          href={app.authorization_file_url}
                                          download
                                          className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                                        >
                                          <FaDownload className="text-xs" /> Download
                                        </a>
                                      </div>
                                    )}
                                    {!app.authorization_file_url && app.service_type === 'Local Government of Origin' && (
                                      <p className="text-sm text-red-500 mt-1">⚠️ No authorization file uploaded</p>
                                    )}
                                  </div>
                                )}
                                
                                {app.description && (
                                  <p className="text-sm text-gray-500 mt-1">{app.description}</p>
                                )}
                                <p className="text-xs text-gray-400 mt-2">ID: {app.id || app._id}</p>
                                <p className="text-xs text-gray-400">{new Date(app.created_at || app.createdAt).toLocaleString()}</p>
                              </div>
                              <span className={`text-xs px-3 py-1 rounded-full whitespace-nowrap ${
                                app.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 
                                app.status === 'approved' ? 'bg-green-100 text-green-700' : 
                                app.status === 'rejected' ? 'bg-red-100 text-red-700' : 
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {app.status || 'pending'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* NGOs & Foundations */}
            {activeTab === 'ngos' && (
              <div>
                <div className="bg-white rounded-2xl p-6 shadow-md mb-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                    <FaHandsHelping className="text-[#006400] mr-3" />
                    {ngoForm.id ? 'Edit NGO' : 'Add NGO / Foundation'}
                  </h3>
                  <form onSubmit={handleNgoSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                        <input
                          type="text"
                          value={ngoForm.name}
                          onChange={(e) => setNgoForm({ ...ngoForm, name: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006400] focus:border-transparent outline-none transition-all"
                          placeholder="Enter NGO name"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                        <input
                          type="text"
                          value={ngoForm.type}
                          onChange={(e) => setNgoForm({ ...ngoForm, type: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006400] focus:border-transparent outline-none transition-all"
                          placeholder="e.g., NGO, Foundation, CBO"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        value={ngoForm.description}
                        onChange={(e) => setNgoForm({ ...ngoForm, description: e.target.value })}
                        rows="3"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006400] focus:border-transparent outline-none transition-all resize-y"
                        placeholder="Brief description of the organization"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                        <input
                          type="text"
                          value={ngoForm.location}
                          onChange={(e) => setNgoForm({ ...ngoForm, location: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006400] focus:border-transparent outline-none transition-all"
                          placeholder="City, State"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Year Founded</label>
                        <input
                          type="text"
                          value={ngoForm.yearFounded}
                          onChange={(e) => setNgoForm({ ...ngoForm, yearFounded: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006400] focus:border-transparent outline-none transition-all"
                          placeholder="e.g., 2010"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Focus Area</label>
                        <input
                          type="text"
                          value={ngoForm.focusArea}
                          onChange={(e) => setNgoForm({ ...ngoForm, focusArea: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006400] focus:border-transparent outline-none transition-all"
                          placeholder="e.g., Education, Health"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Projects / Programs</label>
                        <input
                          type="text"
                          value={ngoForm.projects}
                          onChange={(e) => setNgoForm({ ...ngoForm, projects: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006400] focus:border-transparent outline-none transition-all"
                          placeholder="Key projects"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                        <input
                          type="text"
                          value={ngoForm.website}
                          onChange={(e) => setNgoForm({ ...ngoForm, website: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006400] focus:border-transparent outline-none transition-all"
                          placeholder="https://..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                          type="email"
                          value={ngoForm.email}
                          onChange={(e) => setNgoForm({ ...ngoForm, email: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006400] focus:border-transparent outline-none transition-all"
                          placeholder="Email"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <input
                          type="text"
                          value={ngoForm.phone}
                          onChange={(e) => setNgoForm({ ...ngoForm, phone: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006400] focus:border-transparent outline-none transition-all"
                          placeholder="Phone number"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Logo</label>
                      {ngoForm.existingImage && (
                        <div className="mb-2">
                          <p className="text-xs text-gray-500 mb-1">Current Logo:</p>
                          <img src={ngoForm.existingImage} alt="Current" className="max-h-20 rounded-lg shadow-sm" />
                        </div>
                      )}
                      <input
                        ref={ngoFileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            setNgoForm({ ...ngoForm, image: file });
                          }
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006400] focus:border-transparent outline-none transition-all"
                      />
                      <p className="text-xs text-gray-500 mt-1">Recommended: Square logo, max 5MB</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <button
                        type="submit"
                        disabled={loading}
                        className="bg-[#006400] hover:bg-[#005a00] text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-[#006400]/30 disabled:opacity-50 flex items-center space-x-2"
                      >
                        {loading ? <FaSpinner className="animate-spin" /> : <FaSave />}
                        <span>{loading ? 'Saving...' : ngoForm.id ? 'Update NGO' : 'Add NGO'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={resetNgoForm}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-xl transition-all duration-300"
                      >
                        Reset Form
                      </button>
                    </div>
                  </form>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-md">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Current NGOs</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data.ngos.map((ngo) => (
                      <div key={ngo.id || ngo._id} className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-all duration-300 border border-gray-100">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {ngo.logo && (
                              <img src={ngo.logo} alt={ngo.name} className="w-12 h-12 rounded-full object-cover" />
                            )}
                            <div>
                              <p className="font-semibold text-gray-800">{ngo.name}</p>
                              <p className="text-sm text-[#006400]">{ngo.type || 'NGO'}</p>
                              <p className="text-xs text-gray-500">{ngo.location}</p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => editNgo(ngo)}
                              className="text-blue-600 hover:text-blue-800 p-1.5 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => deleteNgo(ngo.id || ngo._id)}
                              className="text-red-600 hover:text-red-800 p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {data.ngos.length === 0 && (
                      <p className="text-gray-500 text-center col-span-full py-8">No NGOs added yet</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Academia */}
            {activeTab === 'academia' && (
              <div>
                <div className="bg-white rounded-2xl p-6 shadow-md mb-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                    <FaGraduationCap className="text-[#006400] mr-3" />
                    {academiaForm.id ? 'Edit Academician' : 'Add Academician'}
                  </h3>
                  <form onSubmit={handleAcademiaSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                        <input
                          type="text"
                          value={academiaForm.full_name}
                          onChange={(e) => setAcademiaForm({ ...academiaForm, full_name: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006400] focus:border-transparent outline-none transition-all"
                          placeholder="Enter full name"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title / Position</label>
                        <input
                          type="text"
                          value={academiaForm.title}
                          onChange={(e) => setAcademiaForm({ ...academiaForm, title: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006400] focus:border-transparent outline-none transition-all"
                          placeholder="e.g., Professor, Dr."
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Village</label>
                        <input
                          type="text"
                          value={academiaForm.village}
                          onChange={(e) => setAcademiaForm({ ...academiaForm, village: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006400] focus:border-transparent outline-none transition-all"
                          placeholder="Village of origin"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Qualification</label>
                        <input
                          type="text"
                          value={academiaForm.qualification}
                          onChange={(e) => setAcademiaForm({ ...academiaForm, qualification: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006400] focus:border-transparent outline-none transition-all"
                          placeholder="e.g., PhD, MSc"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Photo</label>
                      {academiaForm.existingImage && (
                        <div className="mb-2">
                          <p className="text-xs text-gray-500 mb-1">Current Photo:</p>
                          <img src={academiaForm.existingImage} alt="Current" className="max-h-20 rounded-lg shadow-sm" />
                        </div>
                      )}
                      <input
                        ref={academiaFileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            setAcademiaForm({ ...academiaForm, image: file });
                          }
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006400] focus:border-transparent outline-none transition-all"
                      />
                      <p className="text-xs text-gray-500 mt-1">Recommended: Portrait image, max 5MB</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <button
                        type="submit"
                        disabled={loading}
                        className="bg-[#006400] hover:bg-[#005a00] text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-[#006400]/30 disabled:opacity-50 flex items-center space-x-2"
                      >
                        {loading ? <FaSpinner className="animate-spin" /> : <FaSave />}
                        <span>{loading ? 'Saving...' : academiaForm.id ? 'Update Academician' : 'Add Academician'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={resetAcademiaForm}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-xl transition-all duration-300"
                      >
                        Reset Form
                      </button>
                    </div>
                  </form>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-md">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Current Academicians</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data.academia.map((person) => (
                      <div key={person.id || person._id} className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-all duration-300 border border-gray-100">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {person.photo && (
                              <img src={person.photo} alt={person.full_name} className="w-12 h-12 rounded-full object-cover" />
                            )}
                            <div>
                              <p className="font-semibold text-gray-800">{person.full_name}</p>
                              <p className="text-sm text-[#006400]">{person.title || 'Academician'}</p>
                              <p className="text-xs text-gray-500">{person.village}</p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => editAcademia(person)}
                              className="text-blue-600 hover:text-blue-800 p-1.5 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => deleteAcademia(person.id || person._id)}
                              className="text-red-600 hover:text-red-800 p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {data.academia.length === 0 && (
                      <p className="text-gray-500 text-center col-span-full py-8">No academicians added yet</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Gallery */}
            {activeTab === 'gallery' && (
              <div>
                <div className="bg-white rounded-2xl p-6 shadow-md mb-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                    <FaPhotoVideo className="text-[#006400] mr-3" />
                    {galleryForm.id ? 'Edit Gallery Item' : 'Add Gallery Item'}
                  </h3>
                  <form onSubmit={handleGallerySubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                      <input
                        type="text"
                        value={galleryForm.title}
                        onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006400] focus:border-transparent outline-none transition-all"
                        placeholder="Enter title"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        value={galleryForm.description}
                        onChange={(e) => setGalleryForm({ ...galleryForm, description: e.target.value })}
                        rows="3"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006400] focus:border-transparent outline-none transition-all resize-y"
                        placeholder="Brief description"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                        <select
                          value={galleryForm.type}
                          onChange={(e) => setGalleryForm({ ...galleryForm, type: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006400] focus:border-transparent outline-none transition-all"
                          required
                        >
                          <option value="image">Image</option>
                          <option value="video">Video</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <input
                          type="text"
                          value={galleryForm.category}
                          onChange={(e) => setGalleryForm({ ...galleryForm, category: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006400] focus:border-transparent outline-none transition-all"
                          placeholder="e.g., Event, Infrastructure"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">File *</label>
                      {galleryForm.existingImage && (
                        <div className="mb-2">
                          <p className="text-xs text-gray-500 mb-1">Current File:</p>
                          {galleryForm.type === 'image' ? (
                            <img src={galleryForm.existingImage} alt="Current" className="max-h-32 rounded-lg shadow-sm" />
                          ) : (
                            <video src={galleryForm.existingImage} className="max-h-32 rounded-lg shadow-sm" controls />
                          )}
                        </div>
                      )}
                      <input
                        ref={galleryFileInputRef}
                        type="file"
                        accept={galleryForm.type === 'image' ? 'image/*' : 'video/*'}
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            setGalleryForm({ ...galleryForm, file });
                          }
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006400] focus:border-transparent outline-none transition-all"
                        required={!galleryForm.id}
                      />
                      <p className="text-xs text-gray-500 mt-1">Max file size: 10MB</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <button
                        type="submit"
                        disabled={loading}
                        className="bg-[#006400] hover:bg-[#005a00] text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-[#006400]/30 disabled:opacity-50 flex items-center space-x-2"
                      >
                        {loading ? <FaSpinner className="animate-spin" /> : <FaSave />}
                        <span>{loading ? 'Saving...' : galleryForm.id ? 'Update Item' : 'Add Item'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={resetGalleryForm}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-xl transition-all duration-300"
                      >
                        Reset Form
                      </button>
                    </div>
                  </form>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-md">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Gallery Items</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {data.gallery.map((item) => (
                      <div key={item.id || item._id} className="bg-gray-50 rounded-xl p-3 hover:shadow-md transition-all duration-300 border border-gray-100">
                        <div className="aspect-w-16 aspect-h-9 mb-2">
                          {item.type === 'image' ? (
                            <img src={item.file_url} alt={item.title} className="object-cover rounded-lg w-full h-32" />
                          ) : (
                            <video src={item.file_url} className="object-cover rounded-lg w-full h-32" controls />
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-gray-800 text-sm line-clamp-1">{item.title || 'Untitled'}</p>
                            <p className="text-xs text-gray-500">{item.category || 'General'}</p>
                          </div>
                          <div className="flex space-x-1">
                            <button
                              onClick={() => editGallery(item)}
                              className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <FaEdit className="text-sm" />
                            </button>
                            <button
                              onClick={() => deleteGallery(item.id || item._id)}
                              className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <FaTrash className="text-sm" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {data.gallery.length === 0 && (
                      <p className="text-gray-500 text-center col-span-full py-8">No gallery items added yet</p>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {/* Service Prices Tab */}
            {activeTab === 'service-prices' && (
              <div>
                <div className="bg-white rounded-2xl p-6 shadow-md mb-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                    <FaMoneyBillWave className="text-[#006400] mr-3" />
                    Manage Service Prices
                  </h3>
                  <form onSubmit={handlePriceUpdate} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Service Type *</label>
                        <select
                          value={priceForm.service_type}
                          onChange={(e) => setPriceForm({ ...priceForm, service_type: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006400] focus:border-transparent outline-none transition-all"
                          required
                        >
                          <option value="">Select a service</option>
                          {serviceTypes.map((service) => (
                            <option key={service} value={service}>{service}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₦) *</label>
                        <input
                          type="number"
                          value={priceForm.amount}
                          onChange={(e) => setPriceForm({ ...priceForm, amount: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006400] focus:border-transparent outline-none transition-all"
                          placeholder="e.g., 5000"
                          required
                          min="0"
                          step="100"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <input
                        type="text"
                        value={priceForm.description}
                        onChange={(e) => setPriceForm({ ...priceForm, description: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006400] focus:border-transparent outline-none transition-all"
                        placeholder="Brief description of what's included"
                      />
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <button
                        type="submit"
                        disabled={loading}
                        className="bg-[#006400] hover:bg-[#005a00] text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-[#006400]/30 disabled:opacity-50 flex items-center space-x-2"
                      >
                        {loading ? <FaSpinner className="animate-spin" /> : <FaSave />}
                        <span>{loading ? 'Saving...' : 'Update Price'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPriceForm({ service_type: '', amount: '', currency: 'NGN', description: '' })}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-xl transition-all duration-300"
                      >
                        Reset Form
                      </button>
                    </div>
                  </form>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-md">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Current Service Prices</h3>
                  {Object.keys(servicePrices).length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No service prices set yet</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(servicePrices).map(([service, price]) => (
                        <div key={service} className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-all duration-300 border border-gray-100">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold text-gray-800">{service}</p>
                              <p className="text-2xl font-bold text-[#006400]">₦{price.amount?.toLocaleString()}</p>
                              {price.description && (
                                <p className="text-xs text-gray-500 mt-1">{price.description}</p>
                              )}
                            </div>
                            <button
                              onClick={() => editPrice(service)}
                              className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <FaEdit />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Profile Settings */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-2xl p-6 shadow-md max-w-2xl mx-auto">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <FaUserShield className="text-[#006400] mr-3" />
                  Profile Settings
                </h3>
                
                <form onSubmit={handleProfileSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">New Username</label>
                      <input
                        type="text"
                        value={profileForm.username}
                        onChange={(e) => setProfileForm({ ...profileForm, username: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006400] focus:border-transparent outline-none transition-all"
                        placeholder="Enter new username"
                      />
                      <p className="text-xs text-gray-400 mt-1">Leave blank to keep current</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">New Email</label>
                      <input
                        type="email"
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006400] focus:border-transparent outline-none transition-all"
                        placeholder="Enter new email"
                      />
                      <p className="text-xs text-gray-400 mt-1">Leave blank to keep current</p>
                    </div>
                  </div>
                  <div className="border-t border-gray-200 pt-6 mt-6">
                    <h4 className="text-md font-semibold text-gray-700 mb-4 flex items-center">
                      <FaKey className="text-[#006400] mr-2" />
                      Change Password
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                        <input
                          type="password"
                          value={profileForm.currentPassword}
                          onChange={(e) => setProfileForm({ ...profileForm, currentPassword: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006400] focus:border-transparent outline-none transition-all"
                          placeholder="Enter current password"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                          <input
                            type="password"
                            value={profileForm.newPassword}
                            onChange={(e) => setProfileForm({ ...profileForm, newPassword: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006400] focus:border-transparent outline-none transition-all"
                            placeholder="Enter new password"
                          />
                          <p className="text-xs text-gray-400 mt-1">Min 6 characters</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                          <input
                            type="password"
                            value={profileForm.confirmPassword}
                            onChange={(e) => setProfileForm({ ...profileForm, confirmPassword: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006400] focus:border-transparent outline-none transition-all"
                            placeholder="Confirm new password"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3 mt-6">
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-[#006400] hover:bg-[#005a00] text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-[#006400]/30 disabled:opacity-50 flex items-center space-x-2"
                    >
                      {loading ? <FaSpinner className="animate-spin" /> : <FaSave />}
                      <span>{loading ? 'Saving...' : 'Update Profile'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setProfileForm({
                          username: user?.username || '',
                          email: user?.email || '',
                          currentPassword: '',
                          newPassword: '',
                          confirmPassword: ''
                        });
                      }}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-xl transition-all duration-300"
                    >
                      Reset Form
                    </button>
                  </div>
                </form>
              </div>
            )}
          </>
        )}
      </div>

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
        type={confirmModal.type}
      />
    </div>
  );
};

export default AdminPage;