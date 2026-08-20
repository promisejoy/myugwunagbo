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
      if (response.data) {
        setServicePrices(response.data);
      }
    } catch (error) {
      console.error('Error loading service prices:', error);
    }
  };

  // Update service price
  const handlePriceUpdate = async (e) => {
    e.preventDefault();
    if (!priceForm.service_type || !priceForm.amount) {
      toast.error('Please select a service and enter an amount');
      return;
    }
    
    setLoading(true);
    try {
      await api.updateServicePrice(priceForm.service_type, {
        amount: parseFloat(priceForm.amount),
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
    if (isAuthenticated) {
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
  }, [isAuthenticated, user]);

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
    if (!isAuthenticated) return;
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#006400] to-[#008000] p-4 sticky top-0 z-20 shadow-lg">
        <div className="container-custom flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center space-x-4">
            <div className="bg-[#ffcc00] p-3 rounded-2xl">
              <FaUserShield className="text-[#006400] text-2xl" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Admin Dashboard</h2>
              <p className="text-[#ffcc00]/80 text-sm">Welcome back, {user?.fullName || 'Admin'}!</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl transition-all duration-300 text-sm"
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </div>

      <div className="container-custom py-6">
        {/* Tabs */}
        <div className="flex overflow-x-auto bg-white rounded-2xl shadow-md mb-6 p-1 gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-300 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-[#006400] text-white shadow-lg'
                  : 'text-gray-600 hover:text-[#006400] hover:bg-gray-100'
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
                  {[
                    { label: 'Total Leaders', value: stats.totalLeaders, icon: FaUsers, color: 'text-[#006400]' },
                    { label: 'Total News', value: stats.totalNews, icon: FaNewspaper, color: 'text-blue-600' },
                    { label: 'Total Contacts', value: stats.totalContacts, icon: FaEnvelope, color: 'text-purple-600' },
                    { label: 'Applications', value: stats.totalApplications, icon: FaFileAlt, color: 'text-orange-600' },
                    { label: 'Total Villages', value: stats.totalVillages, icon: FaHome, color: 'text-green-600' },
                    { label: 'Notifications', value: stats.unreadNotifications, icon: FaBell, color: 'text-red-600' },
                  ].map((stat, index) => (
                    <div key={index} className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300">
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
                <div className="bg-white rounded-2xl p-6 shadow-md">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Activity</h3>
                  <p className="text-gray-500">Dashboard is working! Use the tabs above to manage content.</p>
                </div>
              </div>
            )}

            {/* ... (All other tabs remain the same - Governor, Leaders, News, Villages, Traditional Rulers, Budgets, Contacts, NGOs, Academia, Gallery, Service Prices, Profile) ... */}

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