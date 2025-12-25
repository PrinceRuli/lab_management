import React, { useState } from 'react';

const Resources = () => {
  // Data guru (dari konteks autentikasi)
  const teacherData = {
    id: 1,
    name: "Dr. Ahmad",
    email: "ahmad@university.edu",
    department: "Informatika",
    subjects: ["Algoritma", "Struktur Data", "Pemrograman Web"],
    labs: ["Lab Komputer A", "Lab Komputer B"]
  };

  // Data resources
  const initialResources = [
    {
      id: 1,
      title: "Modul Praktikum Algoritma Dasar",
      description: "Modul lengkap untuk praktikum algoritma dengan contoh-contoh implementasi Python",
      type: "pdf",
      category: "Modul",
      subject: "Algoritma",
      lab: "Lab Komputer A",
      size: "4.2 MB",
      downloads: 128,
      uploadDate: "2023-09-15",
      tags: ["Python", "Algoritma", "Praktikum", "Dasar"],
      author: "Dr. Ahmad",
      rating: 4.8,
      fileUrl: "#"
    },
    {
      id: 2,
      title: "Template Laporan Praktikum",
      description: "Template standar untuk laporan praktikum struktur data",
      type: "doc",
      category: "Template",
      subject: "Struktur Data",
      lab: "Lab Komputer A",
      size: "1.5 MB",
      downloads: 89,
      uploadDate: "2023-09-20",
      tags: ["Template", "Laporan", "Struktur Data"],
      author: "Prof. Budi",
      rating: 4.5,
      fileUrl: "#"
    },
    {
      id: 3,
      title: "Video Tutorial Python OOP",
      description: "Video pembelajaran Object-Oriented Programming dengan Python",
      type: "video",
      category: "Video",
      subject: "Pemrograman Web",
      lab: "Lab Komputer B",
      size: "250 MB",
      downloads: 56,
      uploadDate: "2023-10-05",
      tags: ["Python", "OOP", "Video", "Tutorial"],
      author: "Dr. Sari",
      rating: 4.9,
      fileUrl: "#"
    },
    {
      id: 4,
      title: "Dataset Machine Learning",
      description: "Kumpulan dataset untuk pembelajaran machine learning",
      type: "csv",
      category: "Dataset",
      subject: "Machine Learning",
      lab: "Lab Komputer B",
      size: "15.3 MB",
      downloads: 42,
      uploadDate: "2023-10-10",
      tags: ["Dataset", "ML", "Data", "Analisis"],
      author: "Dr. Joko",
      rating: 4.7,
      fileUrl: "#"
    },
    {
      id: 5,
      title: "Slide Presentasi Web Development",
      description: "Slide materi untuk pengembangan website modern",
      type: "ppt",
      category: "Slide",
      subject: "Pemrograman Web",
      lab: "Lab Komputer A",
      size: "8.7 MB",
      downloads: 73,
      uploadDate: "2023-10-12",
      tags: ["Web", "Development", "Slide", "Presentasi"],
      author: "Dr. Ahmad",
      rating: 4.6,
      fileUrl: "#"
    },
    {
      id: 6,
      title: "Cheatsheet Python Pandas",
      description: "Referensi cepat untuk library Pandas dalam Python",
      type: "pdf",
      category: "Cheatsheet",
      subject: "Data Science",
      lab: "Lab Komputer B",
      size: "2.1 MB",
      downloads: 95,
      uploadDate: "2023-10-15",
      tags: ["Python", "Pandas", "Cheatsheet", "Data Science"],
      author: "Prof. Rina",
      rating: 4.8,
      fileUrl: "#"
    },
    {
      id: 7,
      title: "Kode Contoh REST API",
      description: "Contoh implementasi REST API menggunakan Flask",
      type: "zip",
      category: "Source Code",
      subject: "Pemrograman Web",
      lab: "Lab Komputer A",
      size: "3.8 MB",
      downloads: 61,
      uploadDate: "2023-10-18",
      tags: ["API", "Flask", "Python", "Source Code"],
      author: "Dr. Ahmad",
      rating: 4.7,
      fileUrl: "#"
    },
    {
      id: 8,
      title: "Protokol Keselamatan Lab Kimia",
      description: "Panduan keselamatan untuk praktikum di lab kimia",
      type: "pdf",
      category: "Safety",
      subject: "Kimia",
      lab: "Lab Kimia",
      size: "1.2 MB",
      downloads: 112,
      uploadDate: "2023-09-25",
      tags: ["Safety", "Kimia", "Protokol", "Lab"],
      author: "Dr. Linda",
      rating: 4.9,
      fileUrl: "#"
    }
  ];

  // Data lab tools
  const labTools = [
    {
      id: 1,
      name: "Python Development Kit",
      description: "Lingkungan pengembangan Python lengkap untuk lab komputer",
      lab: "Lab Komputer A",
      version: "3.11.4",
      status: "installed",
      lastUpdate: "2023-10-15",
      docsUrl: "#"
    },
    {
      id: 2,
      name: "Jupyter Notebook",
      description: "Interactive computing environment untuk data science",
      lab: "Lab Komputer B",
      version: "6.5.4",
      status: "installed",
      lastUpdate: "2023-10-10",
      docsUrl: "#"
    },
    {
      id: 3,
      name: "Visual Studio Code",
      description: "Code editor modern dengan berbagai ekstensi",
      lab: "Lab Komputer A",
      version: "1.82.2",
      status: "installed",
      lastUpdate: "2023-10-05",
      docsUrl: "#"
    },
    {
      id: 4,
      name: "TensorFlow",
      description: "Machine learning framework untuk deep learning",
      lab: "Lab Komputer B",
      version: "2.13.0",
      status: "available",
      lastUpdate: "2023-09-30",
      docsUrl: "#"
    },
    {
      id: 5,
      name: "Chemical Analysis Software",
      description: "Software untuk analisis data kimia",
      lab: "Lab Kimia",
      version: "5.2.1",
      status: "installed",
      lastUpdate: "2023-10-01",
      docsUrl: "#"
    }
  ];

  // State management
  const [resources, setResources] = useState(initialResources);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [labFilter, setLabFilter] = useState('all');
  const [sortBy, setSortBy] = useState('downloads');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [myResources, setMyResources] = useState(true);

  // Form state
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    type: 'pdf',
    category: 'Modul',
    subject: '',
    lab: '',
    tags: ''
  });

  // Data untuk filter
  const categories = [...new Set(initialResources.map(r => r.category))];
  const subjects = [...new Set(initialResources.map(r => r.subject))];
  const labs = [...new Set(initialResources.map(r => r.lab))];
  const fileTypes = ['pdf', 'doc', 'ppt', 'video', 'csv', 'zip', 'image', 'other'];

  // Filter resources
  const filteredResources = resources.filter(resource => {
    const matchesFilter = filter === 'all' || resource.type === filter;
    const matchesSearch = 
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === 'all' || resource.category === categoryFilter;
    const matchesSubject = subjectFilter === 'all' || resource.subject === subjectFilter;
    const matchesLab = labFilter === 'all' || resource.lab === labFilter;
    const matchesMyResources = !myResources || resource.author === teacherData.name;
    
    return matchesFilter && matchesSearch && matchesCategory && 
           matchesSubject && matchesLab && matchesMyResources;
  });

  // Sort resources
  const sortedResources = [...filteredResources].sort((a, b) => {
    if (sortBy === 'downloads') {
      return b.downloads - a.downloads;
    } else if (sortBy === 'rating') {
      return b.rating - a.rating;
    } else if (sortBy === 'date') {
      return new Date(b.uploadDate) - new Date(a.uploadDate);
    } else if (sortBy === 'title') {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

  // Handle upload form changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUploadForm({
      ...uploadForm,
      [name]: value
    });
  };

  // Handle resource upload
  const handleUpload = (e) => {
    e.preventDefault();
    
    if (!uploadForm.title || !uploadForm.description || !uploadForm.subject) {
      alert('Judul, deskripsi, dan mata kuliah harus diisi!');
      return;
    }

    const newResource = {
      id: resources.length > 0 ? Math.max(...resources.map(r => r.id)) + 1 : 1,
      title: uploadForm.title,
      description: uploadForm.description,
      type: uploadForm.type,
      category: uploadForm.category,
      subject: uploadForm.subject,
      lab: uploadForm.lab || teacherData.labs[0],
      size: '0 MB',
      downloads: 0,
      uploadDate: new Date().toISOString().split('T')[0],
      tags: uploadForm.tags ? uploadForm.tags.split(',').map(tag => tag.trim()) : [],
      author: teacherData.name,
      rating: 0,
      fileUrl: '#'
    };

    setResources([newResource, ...resources]);
    setUploadForm({
      title: '',
      description: '',
      type: 'pdf',
      category: 'Modul',
      subject: '',
      lab: '',
      tags: ''
    });
    setShowUploadModal(false);
    
    alert('Resource berhasil diupload!');
  };

  // Handle resource download
  const handleDownload = (resource) => {
    const updatedResources = resources.map(r => 
      r.id === resource.id ? { ...r, downloads: r.downloads + 1 } : r
    );
    setResources(updatedResources);
    alert(`Mengunduh: ${resource.title}`);
    // Simulasi download
    window.open(resource.fileUrl, '_blank');
  };

  // Handle resource delete
  const handleDelete = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus resource ini?')) {
      setResources(resources.filter(resource => resource.id !== id));
      alert('Resource berhasil dihapus!');
    }
  };

  // View resource details
  const viewResourceDetails = (resource) => {
    setSelectedResource(resource);
    setShowDetailModal(true);
  };

  // Get file icon
  const getFileIcon = (type) => {
    const iconMap = {
      pdf: '📕',
      doc: '📄',
      ppt: '📊',
      video: '🎬',
      csv: '📊',
      zip: '📦',
      image: '🖼️',
      other: '📎'
    };
    return iconMap[type] || '📎';
  };

  // Get file color
  const getFileColor = (type) => {
    const colorMap = {
      pdf: 'bg-red-100 text-red-800',
      doc: 'bg-blue-100 text-blue-800',
      ppt: 'bg-orange-100 text-orange-800',
      video: 'bg-purple-100 text-purple-800',
      csv: 'bg-green-100 text-green-800',
      zip: 'bg-yellow-100 text-yellow-800',
      image: 'bg-pink-100 text-pink-800',
      other: 'bg-gray-100 text-gray-800'
    };
    return colorMap[type] || colorMap.other;
  };

  // Get type label
  const getTypeLabel = (type) => {
    const labelMap = {
      pdf: 'PDF',
      doc: 'Document',
      ppt: 'PowerPoint',
      video: 'Video',
      csv: 'Dataset',
      zip: 'Archive',
      image: 'Image',
      other: 'Other'
    };
    return labelMap[type] || type;
  };

  // Get rating stars
  const getRatingStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push('★');
    }
    if (hasHalfStar) {
      stars.push('½');
    }
    while (stars.length < 5) {
      stars.push('☆');
    }
    
    return stars.join('');
  };

  // Calculate stats
  const stats = {
    total: resources.length,
    myUploads: resources.filter(r => r.author === teacherData.name).length,
    totalDownloads: resources.reduce((sum, r) => sum + r.downloads, 0),
    pdfCount: resources.filter(r => r.type === 'pdf').length,
    videoCount: resources.filter(r => r.type === 'video').length,
    codeCount: resources.filter(r => r.category === 'Source Code').length
  };

  // Get most popular resource
  const getMostPopular = () => {
    if (resources.length === 0) return null;
    return resources.reduce((a, b) => a.downloads > b.downloads ? a : b);
  };

  // Icons
  const IconSearch = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
    </svg>
  );

  const IconDownload = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
    </svg>
  );

  const IconUpload = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"></path>
    </svg>
  );

  const IconEye = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
    </svg>
  );

  const IconStar = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
    </svg>
  );

  const IconTrash = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
    </svg>
  );

  
  const IconBuilding = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
    </svg>
  );

  const IconBook = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
    </svg>
  );

  

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-700 text-white px-6 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Teaching Resources</h1>
            <p className="text-green-100 mt-2">
              {teacherData.name} • {teacherData.department}
            </p>
            <p className="text-green-100 text-sm mt-1">
              Kumpulan sumber daya pengajaran dan materi laboratorium
            </p>
          </div>
          <button
            onClick={() => setShowUploadModal(true)}
            className="mt-4 md:mt-0 px-6 py-3 bg-white text-green-600 font-semibold rounded-lg hover:bg-green-50 transition flex items-center"
          >
            <IconUpload />
            <span className="ml-2">Upload Resource</span>
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <IconBook />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Resources</p>
                <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg mr-3">
                <IconUpload />
              </div>
              <div>
                <p className="text-sm text-gray-500">Upload Saya</p>
                <p className="text-2xl font-bold text-gray-800">{stats.myUploads}</p>
                <p className="text-xs text-green-600 mt-1">
                  {stats.total > 0 ? Math.round((stats.myUploads / stats.total) * 100) : 0}%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg mr-3">
                <IconDownload />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Downloads</p>
                <p className="text-2xl font-bold text-gray-800">{stats.totalDownloads}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg mr-3">
                <span className="text-xl">📕</span>
              </div>
              <div>
                <p className="text-sm text-gray-500">PDF Documents</p>
                <p className="text-2xl font-bold text-gray-800">{stats.pdfCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-indigo-100 rounded-lg mr-3">
                <span className="text-xl">🎬</span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Video Tutorials</p>
                <p className="text-2xl font-bold text-gray-800">{stats.videoCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg mr-3">
                <span className="text-xl">💻</span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Source Code</p>
                <p className="text-2xl font-bold text-gray-800">{stats.codeCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column - Filters & Tools */}
          <div className="lg:col-span-1 space-y-6">
            {/* Filter Panel */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">🔍 Filter Resources</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipe File</label>
                  <div className="flex flex-wrap gap-2">
                    <button 
                      className={`px-3 py-2 rounded-lg text-sm ${filter === 'all' ? 'bg-blue-100 text-blue-700 border border-blue-300' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                      onClick={() => setFilter('all')}
                    >
                      Semua
                    </button>
                    {fileTypes.map(type => (
                      <button
                        key={type}
                        className={`px-3 py-2 rounded-lg text-sm flex items-center ${filter === type ? 'bg-blue-100 text-blue-700 border border-blue-300' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        onClick={() => setFilter(type)}
                      >
                        <span className="mr-1">{getFileIcon(type)}</span>
                        {getTypeLabel(type)}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                  <select 
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="all">Semua Kategori</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mata Kuliah</label>
                  <select 
                    value={subjectFilter}
                    onChange={(e) => setSubjectFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="all">Semua Mata Kuliah</option>
                    {subjects.map(subject => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Laboratorium</label>
                  <select 
                    value={labFilter}
                    onChange={(e) => setLabFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="all">Semua Lab</option>
                    {labs.map(lab => (
                      <option key={lab} value={lab}>{lab}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Urutkan Berdasarkan</label>
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="downloads">Popularitas (Downloads)</option>
                    <option value="rating">Rating Tertinggi</option>
                    <option value="date">Terbaru</option>
                    <option value="title">Judul (A-Z)</option>
                  </select>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={myResources}
                      onChange={(e) => setMyResources(e.target.checked)}
                      className="mr-2 rounded text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-700">Tampilkan hanya upload saya</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Lab Tools Panel */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">🛠️ Lab Tools & Software</h3>
              
              <div className="space-y-3">
                {labTools.map(tool => (
                  <div key={tool.id} className="bg-white rounded-lg p-3 border border-blue-100">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-medium text-gray-800">{tool.name}</div>
                        <div className="text-xs text-gray-500">{tool.description}</div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded ${
                        tool.status === 'installed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {tool.status === 'installed' ? 'Terinstal' : 'Tersedia'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>{tool.lab}</span>
                      <span>v{tool.version}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t border-blue-200">
                <h4 className="text-sm font-medium text-gray-700 mb-2">💡 Saran Resource:</h4>
                <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
                  <li>Modul praktikum dengan contoh kode</li>
                  <li>Video tutorial step-by-step</li>
                  <li>Dataset untuk analisis</li>
                  <li>Template laporan & presentasi</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right Column - Resources List */}
          <div className="lg:col-span-3">
            {/* Search Bar */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div className="mb-4 md:mb-0">
                  <div className="text-sm text-gray-500">
                    Menampilkan {sortedResources.length} dari {resources.length} resources
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="relative flex-1 md:flex-none">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <IconSearch />
                    </div>
                    <input 
                      type="text" 
                      placeholder="Cari resources..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent w-full md:w-64"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Resources Grid */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">Teaching Resources</h2>
              </div>
              
              {sortedResources.length === 0 ? (
                <div className="text-center py-12">
                  <div className="inline-block p-4 bg-gray-100 rounded-full mb-4">
                    <IconBook />
                  </div>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">Tidak ada resources</h3>
                  <p className="text-gray-500 mb-4">
                    {searchTerm || filter !== 'all' 
                      ? 'Tidak ada resources yang sesuai dengan filter pencarian.' 
                      : 'Belum ada resources yang diupload.'}
                  </p>
                  <button
                    onClick={() => setShowUploadModal(true)}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                  >
                    Upload Resource Pertama
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                  {sortedResources.map(resource => (
                    <div 
                      key={resource.id} 
                      className="border border-gray-200 rounded-xl hover:shadow-lg transition-shadow duration-300"
                    >
                      <div className="p-5">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center">
                            <span className="text-2xl mr-3">{getFileIcon(resource.type)}</span>
                            <div>
                              <span className={`px-2 py-1 text-xs rounded ${getFileColor(resource.type)}`}>
                                {getTypeLabel(resource.type)}
                              </span>
                              <span className="ml-2 px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded">
                                {resource.category}
                              </span>
                            </div>
                          </div>
                          
                          {resource.author === teacherData.name && (
                            <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                              Upload Anda
                            </span>
                          )}
                        </div>
                        
                        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                          {resource.title}
                        </h3>
                        
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {resource.description}
                        </p>
                        
                        <div className="flex items-center text-sm text-gray-500 mb-4">
                          <IconBuilding className="mr-1" size={14} />
                          <span className="mr-3">{resource.lab}</span>
                          <IconBook className="mr-1" size={14} />
                          <span>{resource.subject}</span>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          {resource.tags.slice(0, 3).map((tag, index) => (
                            <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">
                              {tag}
                            </span>
                          ))}
                          {resource.tags.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                              +{resource.tags.length - 3}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm">
                            <div className="flex items-center">
                              <IconDownload className="mr-1" size={14} />
                              <span className="text-gray-700">{resource.downloads}</span>
                            </div>
                            <div className="flex items-center">
                              <IconStar className="mr-1" size={14} />
                              <span className="text-gray-700">{resource.rating.toFixed(1)}</span>
                              <span className="ml-1 text-yellow-500 text-xs">
                                {getRatingStars(resource.rating)}
                              </span>
                            </div>
                            <div className="text-gray-500 text-xs">
                              {formatDate(resource.uploadDate)}
                            </div>
                          </div>
                          
                          <div className="flex space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                viewResourceDetails(resource);
                              }}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                              title="Lihat Detail"
                            >
                              <IconEye />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDownload(resource);
                              }}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                              title="Download"
                            >
                              <IconDownload />
                            </button>
                            {resource.author === teacherData.name && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(resource.id);
                                }}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                title="Hapus"
                              >
                                <IconTrash />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Most Popular Resource */}
            {stats.total > 0 && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">🏆 Resource Terpopuler</h3>
                {(() => {
                  const popularResource = getMostPopular();
                  if (!popularResource) return null;
                  
                  return (
                    <div className="bg-white rounded-lg p-4 border border-green-100">
                      <div className="flex flex-col md:flex-row md:items-center">
                        <div className="flex items-center mb-4 md:mb-0 md:mr-6">
                          <span className="text-3xl mr-4">{getFileIcon(popularResource.type)}</span>
                          <div>
                            <div className="font-semibold text-lg text-gray-800">{popularResource.title}</div>
                            <div className="text-sm text-gray-600">{popularResource.author} • {popularResource.lab}</div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <div className="text-2xl font-bold text-green-600">{popularResource.downloads}</div>
                            <div className="text-xs text-gray-500">Downloads</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-yellow-600">{popularResource.rating.toFixed(1)}</div>
                            <div className="text-xs text-gray-500">Rating</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-blue-600">{popularResource.size}</div>
                            <div className="text-xs text-gray-500">Size</div>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => handleDownload(popularResource)}
                          className="mt-4 md:mt-0 md:ml-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
                        >
                          <IconDownload />
                          <span className="ml-2">Download</span>
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-800">Upload Resource Baru</h3>
                <button 
                  onClick={() => setShowUploadModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
            </div>
            
            <form onSubmit={handleUpload}>
              <div className="p-6">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Judul Resource *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={uploadForm.title}
                      onChange={handleInputChange}
                      placeholder="Contoh: Modul Praktikum Algoritma Dasar"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Deskripsi *
                    </label>
                    <textarea
                      name="description"
                      value={uploadForm.description}
                      onChange={handleInputChange}
                      placeholder="Deskripsikan resource ini..."
                      rows="3"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                      required
                    ></textarea>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tipe File *
                      </label>
                      <select
                        name="type"
                        value={uploadForm.type}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        {fileTypes.map(type => (
                          <option key={type} value={type}>
                            {getFileIcon(type)} {getTypeLabel(type)}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Kategori *
                      </label>
                      <select
                        name="category"
                        value={uploadForm.category}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mata Kuliah *
                      </label>
                      <select
                        name="subject"
                        value={uploadForm.subject}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      >
                        <option value="">Pilih Mata Kuliah</option>
                        {teacherData.subjects.map(subject => (
                          <option key={subject} value={subject}>{subject}</option>
                        ))}
                        {subjects.filter(s => !teacherData.subjects.includes(s)).map(subject => (
                          <option key={subject} value={subject}>{subject}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Laboratorium
                      </label>
                      <select
                        name="lab"
                        value={uploadForm.lab}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="">Pilih Lab</option>
                        {teacherData.labs.map(lab => (
                          <option key={lab} value={lab}>{lab}</option>
                        ))}
                        {labs.filter(l => !teacherData.labs.includes(l)).map(lab => (
                          <option key={lab} value={lab}>{lab}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tags (pisahkan dengan koma)
                    </label>
                    <input
                      type="text"
                      name="tags"
                      value={uploadForm.tags}
                      onChange={handleInputChange}
                      placeholder="Python, Algoritma, Praktikum, Dasar"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="border border-gray-300 rounded-lg p-4">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Upload File *
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <IconUpload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">Drag & drop file atau klik untuk upload</p>
                      <p className="text-sm text-gray-500">Maksimal 50MB • PDF, DOC, PPT, ZIP, dll.</p>
                      <input
                        type="file"
                        className="hidden"
                        id="file-upload"
                      />
                      <label
                        htmlFor="file-upload"
                        className="mt-4 inline-block px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer"
                      >
                        Pilih File
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition"
                  >
                    Upload Resource
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Resource Detail Modal */}
      {showDetailModal && selectedResource && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-green-600 to-emerald-600">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold text-white">Detail Resource</h3>
                  <p className="text-green-100 text-sm">{selectedResource.title}</p>
                </div>
                <button 
                  onClick={() => setShowDetailModal(false)}
                  className="text-white hover:text-green-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex items-center mb-6">
                <span className="text-4xl mr-4">{getFileIcon(selectedResource.type)}</span>
                <div>
                  <h4 className="text-xl font-semibold text-gray-800">{selectedResource.title}</h4>
                  <div className="flex items-center mt-1">
                    <span className={`px-2 py-1 text-sm rounded mr-2 ${getFileColor(selectedResource.type)}`}>
                      {getTypeLabel(selectedResource.type)}
                    </span>
                    <span className="px-2 py-1 text-sm bg-gray-100 text-gray-800 rounded">
                      {selectedResource.category}
                    </span>
                    {selectedResource.author === teacherData.name && (
                      <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                        Upload Anda
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Deskripsi</div>
                    <div className="text-gray-700">{selectedResource.description}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Informasi File</div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs text-gray-500">Size</div>
                        <div className="font-medium">{selectedResource.size}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Downloads</div>
                        <div className="font-medium">{selectedResource.downloads}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Rating</div>
                        <div className="font-medium flex items-center">
                          {selectedResource.rating.toFixed(1)}
                          <span className="ml-2 text-yellow-500 text-sm">
                            {getRatingStars(selectedResource.rating)}
                          </span>
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Upload Date</div>
                        <div className="font-medium">{formatDate(selectedResource.uploadDate)}</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Detail</div>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <IconBook className="mr-2 text-gray-400" />
                        <span>{selectedResource.subject}</span>
                      </div>
                      <div className="flex items-center">
                        <IconBuilding className="mr-2 text-gray-400" />
                        <span>{selectedResource.lab}</span>
                      </div>
                      <div className="flex items-center">
                        <IconUpload className="mr-2 text-gray-400" />
                        <span>Oleh: {selectedResource.author}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Tags</div>
                    <div className="flex flex-wrap gap-2">
                      {selectedResource.tags.map((tag, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-lg">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-6">
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => {
                      handleDownload(selectedResource);
                      setShowDetailModal(false);
                    }}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
                  >
                    <IconDownload />
                    <span className="ml-2">Download Resource</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(JSON.stringify(selectedResource, null, 2));
                      alert('Detail resource disalin ke clipboard!');
                    }}
                    className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path>
                    </svg>
                    Salin Detail
                  </button>
                  
                  {selectedResource.author === teacherData.name && (
                    <button
                      onClick={() => {
                        if (window.confirm('Apakah Anda yakin ingin menghapus resource ini?')) {
                          handleDelete(selectedResource.id);
                          setShowDetailModal(false);
                        }
                      }}
                      className="px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center ml-auto"
                    >
                      <IconTrash />
                      <span className="ml-2">Hapus Resource</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Resources;