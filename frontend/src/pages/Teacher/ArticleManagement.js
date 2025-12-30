import React, { useState } from 'react';

const ArticleManagement = () => {
  // Data contoh artikel
  const initialArticles = [
    {
      id: 1,
      title: "Praktikum Algoritma dan Struktur Data",
      content: "Pada praktikum kali ini, mahasiswa mempelajari implementasi algoritma sorting dan searching menggunakan bahasa Python di Lab Komputer A. Hasil menunjukkan peningkatan pemahaman sebesar 40% terhadap konsep algoritma...",
      lab: "Lab Komputer A",
      date: "15 Okt 2023",
      status: "published",
      category: "Praktikum",
      tags: ["Algoritma", "Python", "Sorting", "Struktur Data"],
      author: "Dr. Ahmad",
      views: 125,
      likes: 32,
      comments: 8,
      excerpt: "Implementasi algoritma sorting dan searching dengan Python menunjukkan peningkatan pemahaman mahasiswa sebesar 40%."
    },
    {
      id: 2,
      title: "Penelitian Kimia Organik: Sintesis Senyawa Baru",
      content: "Penelitian ini bertujuan untuk mensintesis senyawa organik baru dengan potensi aktivitas biologis. Percobaan dilakukan di Lab Kimia dengan menggunakan metode kromatografi kolom dan spektroskopi NMR...",
      lab: "Lab Kimia",
      date: "16 Okt 2023",
      status: "draft",
      category: "Penelitian",
      tags: ["Kimia Organik", "Sintesis", "Spektroskopi"],
      author: "Prof. Sari",
      views: 89,
      likes: 18,
      comments: 5,
      excerpt: "Sintesis senyawa organik baru menggunakan kromatografi kolom dan analisis spektroskopi NMR."
    },
    {
      id: 3,
      title: "Eksperimen Mekanika: Hukum Newton",
      content: "Eksperimen ini membuktikan Hukum Newton I, II, dan III menggunakan alat peraga mekanika. Mahasiswa melakukan pengukuran gaya, massa, dan percepatan dengan hasil yang sesuai dengan teori...",
      lab: "Lab Fisika",
      date: "17 Okt 2023",
      status: "published",
      category: "Eksperimen",
      tags: ["Fisika", "Mekanika", "Hukum Newton"],
      author: "Dr. Budi",
      views: 156,
      likes: 45,
      comments: 12,
      excerpt: "Pembuktian Hukum Newton melalui eksperimen mekanika dengan hasil yang konsisten terhadap teori."
    },
    {
      id: 4,
      title: "Studi Mikroorganisme Tanah",
      content: "Penelitian mikroorganisme tanah dari berbagai ekosistem menunjukkan keragaman yang signifikan. Pengamatan menggunakan mikroskop elektron di Lab Biologi mengungkap struktur sel yang unik...",
      lab: "Lab Biologi",
      date: "18 Okt 2023",
      status: "published",
      category: "Penelitian",
      tags: ["Biologi", "Mikroorganisme", "Mikroskop"],
      author: "Dr. Rina",
      views: 112,
      likes: 28,
      comments: 7,
      excerpt: "Studi keragaman mikroorganisme tanah menggunakan mikroskop elektron mengungkap struktur sel unik."
    },
    {
      id: 5,
      title: "Workshop Machine Learning untuk Pemula",
      content: "Workshop ini memperkenalkan konsep dasar machine learning menggunakan TensorFlow dan Python. Peserta berhasil membuat model prediksi sederhana dengan akurasi 85%...",
      lab: "Lab Komputer A",
      date: "19 Okt 2023",
      status: "draft",
      category: "Workshop",
      tags: ["Machine Learning", "Python", "TensorFlow", "AI"],
      author: "Dr. Joko",
      views: 0,
      likes: 0,
      comments: 0,
      excerpt: "Workshop pengenalan machine learning menghasilkan model prediksi dengan akurasi 85%."
    }
  ];

  // Data kegiatan lab
  const labActivities = [
    { id: 1, lab: "Lab Komputer A", activity: "Praktikum Algoritma", date: "15 Okt 2023", status: "completed" },
    { id: 2, lab: "Lab Kimia", activity: "Penelitian Kimia Organik", date: "16 Okt 2023", status: "completed" },
    { id: 3, lab: "Lab Fisika", activity: "Eksperimen Mekanika", date: "17 Okt 2023", status: "completed" },
    { id: 4, lab: "Lab Biologi", activity: "Studi Mikroorganisme", date: "18 Okt 2023", status: "completed" },
    { id: 5, lab: "Lab Multimedia", activity: "Editing Video Project", date: "20 Okt 2023", status: "in progress" },
    { id: 6, lab: "Lab Jaringan", activity: "Network Security Training", date: "22 Okt 2023", status: "scheduled" }
  ];

  // State management
  const [articles, setArticles] = useState(initialArticles);
  const [showForm, setShowForm] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedActivity, setSelectedActivity] = useState(null);

  // Form state
  const [articleForm, setArticleForm] = useState({
    title: '',
    content: '',
    lab: '',
    category: '',
    tags: '',
    status: 'draft',
    activityId: ''
  });

  // Categories
  const categories = [
    'Praktikum', 'Penelitian', 'Eksperimen', 'Workshop', 
    'Seminar', 'Pelatihan', 'Observasi', 'Laporan'
  ];

  // Labs
  const labs = [
    'Lab Komputer A', 'Lab Kimia', 'Lab Fisika', 
    'Lab Biologi', 'Lab Multimedia', 'Lab Jaringan'
  ];

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setArticleForm({
      ...articleForm,
      [name]: value
    });
  };

  // Handle activity selection
  const handleActivitySelect = (activity) => {
    setSelectedActivity(activity);
    setArticleForm({
      ...articleForm,
      title: `${activity.activity} - ${activity.lab}`,
      lab: activity.lab,
      activityId: activity.id
    });
  };

  // Submit article
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!articleForm.title || !articleForm.content || !articleForm.lab) {
      alert('Judul, konten, dan lab harus diisi!');
      return;
    }

    const newArticle = {
      id: editingArticle ? editingArticle.id : articles.length > 0 ? Math.max(...articles.map(a => a.id)) + 1 : 1,
      title: articleForm.title,
      content: articleForm.content,
      lab: articleForm.lab,
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
      status: articleForm.status,
      category: articleForm.category || 'Praktikum',
      tags: articleForm.tags ? articleForm.tags.split(',').map(tag => tag.trim()) : [],
      author: "Anda",
      views: 0,
      likes: 0,
      comments: 0,
      excerpt: articleForm.content.substring(0, 100) + '...'
    };

    if (editingArticle) {
      // Update existing article
      setArticles(articles.map(article => 
        article.id === editingArticle.id ? newArticle : article
      ));
    } else {
      // Add new article
      setArticles([newArticle, ...articles]);
    }

    // Reset form
    setArticleForm({
      title: '',
      content: '',
      lab: '',
      category: '',
      tags: '',
      status: 'draft',
      activityId: ''
    });
    setShowForm(false);
    setEditingArticle(null);
    setSelectedActivity(null);
  };

  // Edit article
  const handleEdit = (article) => {
    setEditingArticle(article);
    setArticleForm({
      title: article.title,
      content: article.content,
      lab: article.lab,
      category: article.category,
      tags: article.tags.join(', '),
      status: article.status,
      activityId: ''
    });
    setShowForm(true);
  };

  // Delete article
  const handleDelete = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus artikel ini?')) {
      setArticles(articles.filter(article => article.id !== id));
    }
  };

  // Publish article
  const handlePublish = (id) => {
    setArticles(articles.map(article => 
      article.id === id ? { ...article, status: 'published' } : article
    ));
  };

  // Filter articles
  const filteredArticles = articles.filter(article => {
    const matchesFilter = filter === 'all' || article.status === filter;
    const matchesSearch = 
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesFilter && matchesSearch;
  });

  // Stats
  const stats = {
    total: articles.length,
    published: articles.filter(a => a.status === 'published').length,
    draft: articles.filter(a => a.status === 'draft').length,
    views: articles.reduce((sum, article) => sum + article.views, 0),
    likes: articles.reduce((sum, article) => sum + article.likes, 0)
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manajemen Artikel</h1>
            <p className="text-gray-600 mt-1">
              Kelola dan publikasi artikel dari kegiatan laboratorium
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="mt-4 md:mt-0 px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center shadow-sm"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Tulis Artikel Baru
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-sm transition-shadow">
            <div className="flex items-center">
              <div className="p-2 bg-blue-50 rounded-lg mr-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Artikel</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-sm transition-shadow">
            <div className="flex items-center">
              <div className="p-2 bg-green-50 rounded-lg mr-3">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600">Dipublikasi</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.published}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-sm transition-shadow">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-50 rounded-lg mr-3">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600">Draft</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.draft}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-sm transition-shadow">
            <div className="flex items-center">
              <div className="p-2 bg-purple-50 rounded-lg mr-3">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total View</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.views}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-sm transition-shadow">
            <div className="flex items-center">
              <div className="p-2 bg-pink-50 rounded-lg mr-3">
                <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905a3.61 3.61 0 01-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Likes</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.likes}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column - Activities Panel */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-5 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">Kegiatan Terbaru</h3>
                <p className="text-sm text-gray-600 mt-1">Pilih kegiatan untuk dijadikan artikel</p>
              </div>
              
              <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
                {labActivities.map(activity => (
                  <div 
                    key={activity.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedActivity?.id === activity.id 
                        ? 'border-blue-300 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => handleActivitySelect(activity)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-900 text-sm">{activity.activity}</h4>
                        <p className="text-xs text-gray-600 mt-0.5">{activity.lab}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded ${
                        activity.status === 'completed' ? 'bg-green-100 text-green-800' :
                        activity.status === 'in progress' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {activity.status === 'completed' ? 'Selesai' :
                         activity.status === 'in progress' ? 'Berjalan' : 'Terjadwal'}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-2">{activity.date}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tips Card */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
              <h3 className="font-semibold text-gray-900 mb-3">Tips Menulis</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <svg className="w-4 h-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Sertakan tujuan dan metodologi</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-4 h-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Tambahkan hasil dan analisis</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-4 h-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Gunakan gambar/foto jika ada</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-4 h-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Berikan kesimpulan dan saran</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column - Articles */}
          <div className="lg:col-span-3">
            {/* Search and Filter */}
            <div className="bg-white rounded-lg border border-gray-200 p-5 mb-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-wrap gap-2">
                  <button 
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      filter === 'all' 
                        ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                    }`}
                    onClick={() => setFilter('all')}
                  >
                    Semua
                  </button>
                  <button 
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      filter === 'published' 
                        ? 'bg-green-100 text-green-700 border border-green-200' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                    }`}
                    onClick={() => setFilter('published')}
                  >
                    Dipublikasi
                  </button>
                  <button 
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      filter === 'draft' 
                        ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                    }`}
                    onClick={() => setFilter('draft')}
                  >
                    Draft
                  </button>
                </div>
                
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input 
                    type="text" 
                    placeholder="Cari artikel..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full md:w-64"
                  />
                </div>
              </div>
            </div>

            {/* Articles List */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-gray-900">Daftar Artikel</h2>
                  <span className="text-sm text-gray-600">
                    {filteredArticles.length} dari {articles.length} artikel
                  </span>
                </div>
              </div>

              {filteredArticles.length === 0 ? (
                <div className="text-center py-12">
                  <div className="inline-block p-3 bg-gray-100 rounded-lg mb-4">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada artikel</h3>
                  <p className="text-gray-600 mb-4">
                    {searchTerm ? 'Tidak ada artikel yang sesuai dengan pencarian' : 'Mulai tulis artikel pertama Anda'}
                  </p>
                  <button
                    onClick={() => setShowForm(true)}
                    className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Tulis Artikel Baru
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {filteredArticles.map(article => (
                    <div key={article.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                        {/* Article Content */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`px-2 py-1 text-xs font-medium rounded ${
                              article.status === 'published' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {article.status === 'published' ? 'Dipublikasi' : 'Draft'}
                            </span>
                            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded font-medium">
                              {article.category}
                            </span>
                          </div>
                          
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {article.title}
                          </h3>
                          
                          <p className="text-gray-600 mb-3 text-sm">
                            {article.excerpt}
                          </p>
                          
                          <div className="flex items-center text-sm text-gray-500 mb-3">
                            <span className="mr-4">🏛️ {article.lab}</span>
                            <span className="mr-4">✍️ {article.author}</span>
                            <span>📅 {article.date}</span>
                          </div>
                          
                          <div className="flex flex-wrap gap-2 mb-3">
                            {article.tags.map((tag, index) => (
                              <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                #{tag}
                              </span>
                            ))}
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              {article.views}
                            </span>
                            <span className="flex items-center">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905a3.61 3.61 0 01-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                              </svg>
                              {article.likes}
                            </span>
                            <span className="flex items-center">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                              </svg>
                              {article.comments}
                            </span>
                          </div>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(article)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg border border-blue-200"
                            title="Edit"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          
                          {article.status === 'draft' && (
                            <button
                              onClick={() => handlePublish(article.id)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg border border-green-200"
                              title="Publikasikan"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </button>
                          )}
                          
                          <button
                            onClick={() => handleDelete(article.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg border border-red-200"
                            title="Hapus"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Article Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-900">
                  {editingArticle ? 'Edit Artikel' : 'Tulis Artikel Baru'}
                </h3>
                <button 
                  onClick={() => {
                    setShowForm(false);
                    setEditingArticle(null);
                    setSelectedActivity(null);
                    setArticleForm({
                      title: '',
                      content: '',
                      lab: '',
                      category: '',
                      tags: '',
                      status: 'draft',
                      activityId: ''
                    });
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="p-6">
                {selectedActivity && (
                  <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-blue-900 text-sm">Berdasarkan Kegiatan:</h4>
                        <p className="text-blue-800 font-medium">{selectedActivity.activity} - {selectedActivity.lab}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedActivity(null);
                          setArticleForm({...articleForm, activityId: ''});
                        }}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column - Form */}
                  <div className="lg:col-span-2 space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Judul Artikel *
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={articleForm.title}
                        onChange={handleInputChange}
                        placeholder="Contoh: Praktikum Algoritma dan Struktur Data"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Konten Artikel *
                      </label>
                      <textarea
                        name="content"
                        value={articleForm.content}
                        onChange={handleInputChange}
                        placeholder="Deskripsikan kegiatan, metodologi, hasil, dan kesimpulan..."
                        rows="12"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        required
                      />
                      <div className="text-xs text-gray-500 mt-2">
                        Minimal 200 karakter. Gunakan format yang jelas dengan paragraf.
                      </div>
                    </div>
                  </div>
                  
                  {/* Right Column - Settings */}
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Laboratorium *
                      </label>
                      <select
                        name="lab"
                        value={articleForm.lab}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      >
                        <option value="">Pilih Lab</option>
                        {labs.map(lab => (
                          <option key={lab} value={lab}>{lab}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Kategori
                      </label>
                      <select
                        name="category"
                        value={articleForm.category}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Pilih Kategori</option>
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tags (pisahkan dengan koma)
                      </label>
                      <input
                        type="text"
                        name="tags"
                        value={articleForm.tags}
                        onChange={handleInputChange}
                        placeholder="Algoritma, Python, Praktikum"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                      </label>
                      <div className="space-y-3">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="status"
                            value="draft"
                            checked={articleForm.status === 'draft'}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-blue-600"
                          />
                          <span className="ml-2 text-gray-700">Draft (Simpan sebagai draft)</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="status"
                            value="published"
                            checked={articleForm.status === 'published'}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-blue-600"
                          />
                          <span className="ml-2 text-gray-700">Publikasikan (Tampilkan ke publik)</span>
                        </label>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-200">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Panduan Penulisan:</h4>
                      <ul className="text-xs text-gray-600 space-y-1">
                        <li>• Gunakan bahasa yang formal dan akademis</li>
                        <li>• Sertakan data dan hasil yang valid</li>
                        <li>• Tambahkan referensi jika diperlukan</li>
                        <li>• Periksa ejaan dan tata bahasa</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingArticle(null);
                      setSelectedActivity(null);
                      setArticleForm({
                        title: '',
                        content: '',
                        lab: '',
                        category: '',
                        tags: '',
                        status: 'draft',
                        activityId: ''
                      });
                    }}
                    className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {editingArticle ? 'Update Artikel' : 'Simpan Artikel'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticleManagement;