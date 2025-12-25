import React, { useState, useEffect } from 'react';
import { labAPI } from '../../services/api';

const LabManagement = () => {
  // State dengan default array
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // State untuk form
  const [newLab, setNewLab] = useState({
    name: '',
    location: '',
    capacity: '',
    facilities: '',
    status: 'available',
    openingTime: '08:00',
    closingTime: '17:00'
  });

  const [editMode, setEditMode] = useState(false);
  const [currentLab, setCurrentLab] = useState(null);

  // Debug state
  const [debugInfo, setDebugInfo] = useState(null);

  // Safe getter untuk labs
  const getSafeLabs = () => {
    if (!labs || !Array.isArray(labs)) {
      console.warn('⚠️ labs is not array, returning empty array:', labs);
      return [];
    }
    return labs;
  };

  // Helper functions
  const mapStatusToIndonesian = (status) => {
    const statusMap = {
      'available': 'tersedia',
      'occupied': 'digunakan',
      'maintenance': 'maintenance'
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status) => {
    const statusInIndonesian = mapStatusToIndonesian(status);
    switch (statusInIndonesian) {
      case 'tersedia': return 'bg-green-100 text-green-800 border-green-200';
      case 'digunakan': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'maintenance': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status) => {
    const statusInIndonesian = mapStatusToIndonesian(status);
    switch (statusInIndonesian) {
      case 'tersedia': return 'Tersedia';
      case 'digunakan': return 'Sedang Digunakan';
      case 'maintenance': return 'Dalam Perawatan';
      default: return status;
    }
  };

  // Check if user is admin
  const isAdmin = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.role === 'admin';
  };

  // Mengambil data dari API
  useEffect(() => {
    console.log('🔍 Component mounted, fetching labs...');
    fetchLabs();
  }, []);

  const fetchLabs = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('🔄 ===== FETCH LABS START =====');

      const response = await labAPI.getAll();
      console.log('📦 FULL API RESPONSE:', response);

      // Debug response structure
      console.log('🔍 RESPONSE STRUCTURE ANALYSIS:');
      console.log('- response:', response);
      console.log('- response.data:', response?.data);
      console.log('- typeof response.data:', typeof response?.data);
      console.log('- Array.isArray(response.data):', Array.isArray(response?.data));
      console.log('- response.data?.data:', response?.data?.data);
      console.log('- response.data?.labs:', response?.data?.labs);

      // Extract data
    let labsData = [];
    let dataSource = '';
    
    if (Array.isArray(response?.data)) {
      labsData = response.data;
      dataSource = 'response.data (direct array)';
      console.log('✅ Format 1: response.data is array directly');
    } else if (response?.data?.data && Array.isArray(response.data.data)) {
      labsData = response.data.data;
      dataSource = 'response.data.data';
      console.log('✅ Format 2: response.data.data is array');
    } else if (response?.data?.labs && Array.isArray(response.data.labs)) {
      labsData = response.data.labs;
      dataSource = 'response.data.labs';
      console.log('✅ Format 3: response.data.labs is array');
    } else if (Array.isArray(response)) {
      labsData = response;
      dataSource = 'response (direct)';
      console.log('✅ Format 4: response is array');
    } else {
      console.warn('⚠️ Unknown response format');
      console.warn('Full response:', JSON.stringify(response, null, 2));
      labsData = [];
    }

    console.log(`🎯 Extracted ${labsData.length} labs from ${dataSource}`);
    
    // ⭐⭐ DEBUG DETAIL SETIAP LAB - SEMUA LAB! ⭐⭐
    console.log('📋 ===== ALL LABS DETAILS =====');
    if (labsData.length > 0) {
      labsData.forEach((lab, index) => {
        console.log(`\n🔬 Lab ${index + 1}: "${lab.name || 'No Name'}"`);
        console.log('   All properties:', Object.keys(lab));
        console.log('   _id:', lab._id);
        console.log('   id:', lab.id);
        console.log('   Has _id?', !!lab._id);
        console.log('   Has id?', !!lab.id);
        console.log('   _id type:', typeof lab._id);
        console.log('   _id length:', lab._id?.length);
        
        // Check if _id exists but is undefined string
        if (lab._id === 'undefined') {
          console.error('   ⚠️ WARNING: _id is string "undefined"!');
        }
        if (lab._id === undefined) {
          console.error('   ⚠️ WARNING: _id is undefined!');
        }
      });
      
      // Log first lab in detail
      console.log('\n🔍 FIRST LAB FULL STRUCTURE:');
      console.log(JSON.stringify(labsData[0], null, 2));
      
      // Count labs with IDs
      const labsWithId = labsData.filter(lab => lab._id || lab.id).length;
      const labsWithoutId = labsData.length - labsWithId;
      console.log(`\n📊 ID STATS: ${labsWithId} with ID, ${labsWithoutId} without ID`);
    } else {
      console.warn('⚠️ No labs data extracted');
    }

    const validLabs = labsData.filter(lab => {
      const isValid = lab && typeof lab === 'object';
      if (!isValid) {
        console.warn('Filtered out invalid lab:', lab);
      }
      return isValid;
    });
    
    console.log(`✅ Valid labs after filter: ${validLabs.length}`);
    
    // ⭐⭐ STANDARDIZE ID FIELD ⭐⭐
    const standardizedLabs = validLabs.map((lab, index) => {
      // Pastikan kita memiliki ID yang valid
      let labId = lab._id || lab.id;
      
      if (!labId) {
        console.error(`❌ Lab "${lab.name}" has no ID! Creating temporary ID`);
        labId = `temp-id-${Date.now()}-${index}`;
      } else if (labId === 'undefined' || labId === undefined) {
        console.error(`❌ Lab "${lab.name}" has invalid ID: "${labId}"`);
        labId = `invalid-fixed-${Date.now()}-${index}`;
      }
      
      return {
        ...lab,
        _id: labId, // Pastikan _id selalu ada
        originalId: lab._id || lab.id // Simpan original untuk debug
      };
    });

    console.log('📦 FINAL LABS DATA TO SET STATE:');
    console.log(standardizedLabs.map(l => ({
      name: l.name,
      _id: l._id,
      originalId: l.originalId,
      location: l.location
    })));

    setLabs(standardizedLabs);
    console.log('✅ State updated with labs');

  } catch (err) {
    console.error('❌ Error fetching labs:', err);
    console.error('Error details:', {
      message: err.message,
      response: err.response?.data,
      status: err.response?.status
    });
    setError('Gagal memuat data lab: ' + (err.message || 'Unknown error'));
    setLabs([]);
  } finally {
    setLoading(false);
    console.log('🔚 ===== FETCH LABS COMPLETE =====\n');
  }
};

  // ⭐⭐⭐ PERBAIKAN 1: Handle Input Change ⭐⭐⭐
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(`📝 Input change: ${name} = "${value}"`);

    setNewLab({
      ...newLab,
      [name]: value
    });
  };

  // ⭐⭐⭐ PERBAIKAN 2: Add Lab dengan Format Database ⭐⭐⭐
  const addLab = async () => {
    if (!isAdmin()) {
      alert('Hanya admin yang dapat menambahkan lab');
      return;
    }

    // Validasi
    if (!newLab.name?.trim()) {
      alert('Nama lab harus diisi!');
      return;
    }
    if (!newLab.location?.trim()) {
      alert('Lokasi lab harus diisi!');
      return;
    }
    if (!newLab.capacity) {
      alert('Kapasitas lab harus diisi!');
      return;
    }

    const capacityNum = Number(newLab.capacity);
    if (isNaN(capacityNum) || capacityNum <= 0) {
      alert('Kapasitas harus berupa angka positif!');
      return;
    }

    try {
      console.log('➕ ADD LAB - Form data:', newLab);

      // Parse facilities
      let facilitiesArray = [];
      if (newLab.facilities && newLab.facilities.trim()) {
        facilitiesArray = newLab.facilities
          .split(',')
          .map(item => item.trim())
          .filter(item => item.length > 0);
      }

      // ⭐⭐ FORMAT SESUAI DATABASE ⭐⭐
      const labToAdd = {
        name: newLab.name.trim(),
        location: newLab.location.trim(),
        capacity: Math.floor(capacityNum), // Pastikan integer
        facilities: facilitiesArray, // Array kosong jika tidak ada
        status: newLab.status || 'available',
        openingTime: newLab.openingTime || '08:00',
        closingTime: newLab.closingTime || '17:00'
        // JANGAN kirim images, createdBy, createdAt - biar backend handle
      };

      console.log('📤 Data untuk API:', labToAdd);
      console.log('📝 JSON string:', JSON.stringify(labToAdd, null, 2));

      const response = await labAPI.create(labToAdd);
      console.log('✅ Response dari API:', response.data);

      // Refresh data
      await fetchLabs();

      // Reset form
      setNewLab({
        name: '',
        location: '',
        capacity: '',
        facilities: '',
        status: 'available',
        openingTime: '08:00',
        closingTime: '17:00'
      });

      alert('✅ Lab berhasil ditambahkan!');

    } catch (err) {
      console.error('❌ Error adding lab:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });

      alert(`❌ Gagal: ${err.response?.data?.message || err.message}`);
    }
  };

  const deleteLab = async (id) => {
    if (!isAdmin()) {
      alert('Hanya admin yang dapat menghapus lab');
      return;
    }

    // Validasi ID
    try {
      // Coerce to string and trim to avoid values like objects or ' undefined' strings
      id = id != null ? String(id).trim() : '';
    } catch (e) {
      id = '';
    }

    if (!id || id === 'undefined') {
      console.error('❌ Invalid lab ID for deletion:', id);
      alert('ID lab tidak valid untuk dihapus');
      return;
    }

    if (window.confirm('Apakah Anda yakin ingin menghapus lab ini?')) {
      try {
        console.log('🗑️ Deleting lab with ID:', id);
        // Encode id to be safe for URLs (in case id contains unexpected characters)
        const encodedId = encodeURIComponent(id);
        const response = await labAPI.delete(encodedId);
        console.log('✅ Delete response:', response);
        await fetchLabs();
        alert('✅ Lab berhasil dihapus!');
      } catch (err) {
        console.error('❌ Error deleting lab:', err);

        // Try to extract useful message
        const serverMsg = err.response?.data?.message || err.response?.data || null;
        const humanMsg = serverMsg ? (typeof serverMsg === 'string' ? serverMsg : JSON.stringify(serverMsg)) : err.message;

        alert('Gagal menghapus lab: ' + humanMsg);
      }
    }
  };

  // ⭐⭐⭐ PERBAIKAN 3: Start Edit dengan Debugging Lengkap ⭐⭐⭐
  const startEdit = (lab) => {
    console.log('🔍 ===== START EDIT =====');
    console.log('📦 Lab dari database:', lab);
    console.log('📋 Struktur lengkap:', JSON.stringify(lab, null, 2));

    if (!isAdmin()) {
      alert('Hanya admin yang dapat mengedit lab');
      return;
    }

    // Validasi lab object
    if (!lab) {
      console.error('❌ ERROR: Lab object is null');
      alert('Data lab tidak valid');
      return;
    }

    const labId = lab._id || lab.id;
    if (!labId) {
      console.error('❌ ERROR: Lab tidak memiliki ID');
      alert('Data lab tidak valid: ID tidak ditemukan');
      return;
    }

    console.log('✅ ID valid:', labId);

    // Debug facilities dari database
    console.log('🔍 Facilities analysis:');
    console.log('  - Value:', lab.facilities);
    console.log('  - Type:', typeof lab.facilities);
    console.log('  - Is array?', Array.isArray(lab.facilities));
    if (Array.isArray(lab.facilities)) {
      console.log('  - Length:', lab.facilities.length);
      console.log('  - Items:', lab.facilities);
    }

    // Siapkan data untuk form edit
    const editData = {
      _id: labId,
      name: lab.name || '',
      location: lab.location || '',
      capacity: lab.capacity ? String(lab.capacity) : '',
      status: lab.status || 'available',
      openingTime: lab.openingTime || '08:00',
      closingTime: lab.closingTime || '17:00'
    };

    // Handle facilities: array -> string untuk form
    if (Array.isArray(lab.facilities) && lab.facilities.length > 0) {
      editData.facilities = lab.facilities.join(', ');
      console.log('✅ Facilities (array to string):', editData.facilities);
    } else if (lab.facilities && typeof lab.facilities === 'string') {
      editData.facilities = lab.facilities;
      console.log('✅ Facilities (string):', editData.facilities);
    } else {
      editData.facilities = '';
      console.log('✅ Facilities (empty)');
    }

    console.log('📝 Data untuk form edit:', editData);

    // Simpan debug info
    setDebugInfo(null);

    setEditMode(true);
    setCurrentLab(editData);

    console.log('✅ Edit mode aktif, currentLab set');
    console.log('🔚 ===== END START EDIT =====\n');
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    console.log(`✏️ Edit change: ${name} = "${value}"`);

    if (!currentLab) {
      console.error('❌ currentLab is null!');
      setCurrentLab({ [name]: value });
      return;
    }

    setCurrentLab({
      ...currentLab,
      [name]: value
    });
  };

  // ⭐⭐⭐ PERBAIKAN 4: Save Edit dengan Format Database ⭐⭐⭐
  const saveEdit = async () => {
    console.log('💾 ===== SAVE EDIT =====');
    console.log('📋 currentLab saat save:', currentLab);

    setDebugInfo(null);

    // Validasi dengan detail
    if (!currentLab) {
      console.error('❌ ERROR 1: currentLab is null');
      alert('Data lab tidak valid untuk disimpan!');
      return;
    }

    if (!currentLab._id) {
      console.error('❌ ERROR 2: currentLab._id tidak ada');
      console.error('currentLab:', currentLab);
      alert('Data lab tidak valid: ID tidak ditemukan');
      return;
    }

    console.log('🔍 Validasi field:');
    console.log('  - Name:', currentLab.name, 'Valid?', !!currentLab.name?.trim());
    console.log('  - Location:', currentLab.location, 'Valid?', !!currentLab.location?.trim());
    console.log('  - Capacity:', currentLab.capacity, 'Valid?', !!currentLab.capacity);
    console.log('  - ID:', currentLab._id, 'Valid?', !!currentLab._id);

    // Validasi field wajib
    if (!currentLab.name?.trim()) {
      alert('Nama lab harus diisi!');
      return;
    }
    if (!currentLab.location?.trim()) {
      alert('Lokasi lab harus diisi!');
      return;
    }
    if (!currentLab.capacity) {
      alert('Kapasitas lab harus diisi!');
      return;
    }

    const capacityNum = Number(currentLab.capacity);
    if (isNaN(capacityNum) || capacityNum <= 0) {
      alert('Kapasitas harus berupa angka positif!');
      return;
    }

    try {
      console.log('✅ Validasi berhasil, mempersiapkan data...');

      // Parse facilities
      let facilitiesArray = [];
      if (currentLab.facilities) {
        console.log('🔍 Parsing facilities:', currentLab.facilities);

        if (typeof currentLab.facilities === 'string' && currentLab.facilities.trim()) {
          facilitiesArray = currentLab.facilities
            .split(',')
            .map(item => item.trim())
            .filter(item => item.length > 0);
        } else if (Array.isArray(currentLab.facilities)) {
          facilitiesArray = currentLab.facilities;
        }
      }

      console.log('✅ Facilities array:', facilitiesArray);

      // ⭐⭐ FORMAT SAMA DENGAN DATABASE ⭐⭐
      const labData = {
        name: currentLab.name.trim(),
        location: currentLab.location.trim(),
        capacity: Math.floor(capacityNum), // Pastikan integer
        facilities: facilitiesArray, // ⭐ Array, bukan string
        status: currentLab.status || 'available',
        openingTime: currentLab.openingTime || '08:00',
        closingTime: currentLab.closingTime || '17:00'
      };

      console.log('📤 Data untuk API update:', labData);
      console.log('📝 JSON string:', JSON.stringify(labData, null, 2));
      console.log(`🌐 PUT /api/labs/${currentLab._id}`);

      // Test dengan fetch langsung dulu untuk debug
      console.log('🔄 Testing API call...');

      // Method 1: Gunakan labAPI (preferred)
      const response = await labAPI.update(currentLab._id, labData);

      console.log('✅ API Response:', {
        status: response.status,
        data: response.data
      });

      // Update debug info
      setDebugInfo(null);

      // Refresh data
      await fetchLabs();

      // Reset state
      setEditMode(false);
      setCurrentLab(null);

      console.log('✅ Edit berhasil disimpan!');
      alert('✅ Perubahan berhasil disimpan!');

    } catch (err) {
      console.error('❌ ===== ERROR SAVE EDIT =====');
      console.error('Error details:', {
        name: err.name,
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        config: err.config
      });

      // Update debug info dengan error
      setDebugInfo(null);

      let errorMsg = 'Gagal menyimpan perubahan';
      if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
      } else if (err.response?.data) {
        errorMsg = JSON.stringify(err.response.data);
      }

      console.error('Error untuk user:', errorMsg);
      alert(`❌ ${errorMsg}`);
    }

    console.log('🔚 ===== END SAVE EDIT =====\n');
  };

  const cancelEdit = () => {
    console.log('✖️ Cancel edit');
    setEditMode(false);
    setCurrentLab(null);
    setDebugInfo(null);
  };

  // Calculate stats SAFELY
  const safeLabs = getSafeLabs();
  const tersediaCount = safeLabs.filter(lab => mapStatusToIndonesian(lab.status) === 'tersedia').length;
  const digunakanCount = safeLabs.filter(lab => mapStatusToIndonesian(lab.status) === 'digunakan').length;
  const maintenanceCount = safeLabs.filter(lab => mapStatusToIndonesian(lab.status) === 'maintenance').length;

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Memuat data lab...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white">Manajemen Lab</h2>
            <p className="text-blue-100">
              {isAdmin() ? '👑 Mode Admin' : '👤 Mode User'}
            </p>
          </div>
          <div className="text-sm text-blue-200">
            Total Lab: <span className="font-bold">{safeLabs.length}</span>
          </div>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="m-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
          <button
            onClick={fetchLabs}
            className="mt-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
          >
            Coba Muat Ulang
          </button>
        </div>
      )}

      {/* Debug Panel - Hanya di development */}
      {process.env.NODE_ENV === 'development' && debugInfo && (
        <div className="m-4 p-4 bg-gray-900 text-green-400 border border-gray-700 rounded-lg text-sm font-mono">
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold">🔧 DEBUG INFO</span>
            <button
              onClick={() => setDebugInfo(null)}
              className="text-xs bg-gray-700 px-2 py-1 rounded"
            >
              Close
            </button>
          </div>
          <pre className="overflow-auto max-h-40">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </div>
      )}

      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-blue-500 rounded-lg mr-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-blue-600">Total Lab</p>
                <p className="text-2xl font-bold text-blue-800">{safeLabs.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-green-500 rounded-lg mr-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-green-600">Tersedia</p>
                <p className="text-2xl font-bold text-green-800">{tersediaCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-500 rounded-lg mr-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-yellow-600">Sedang Digunakan</p>
                <p className="text-2xl font-bold text-yellow-800">{digunakanCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-red-500 rounded-lg mr-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-red-600">Dalam Perawatan</p>
                <p className="text-2xl font-bold text-red-800">{maintenanceCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* FORM SECTION - HANYA UNTUK ADMIN */}
        {isAdmin() && (
          <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-6 mb-8 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-800">
                {editMode ? '✏️ Edit Lab' : '➕ Tambah Lab Baru'}
              </h3>
              <div className="flex items-center space-x-2">
                {editMode && (
                  <button
                    onClick={cancelEdit}
                    className="text-sm px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                  >
                    Batal Edit
                  </button>
                )}
                {/* Debug button */}
                {editMode && currentLab && (
                  <button
                    onClick={() => {
                      console.log('🔍 Debug currentLab:', currentLab);
                      console.log('📝 JSON:', JSON.stringify(currentLab, null, 2));
                    }}
                    className="text-sm px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
                  >
                    Debug
                  </button>
                )}
              </div>
            </div>

            {editMode ? (
              // EDIT FORM
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <span className="text-red-500">*</span> Nama Lab
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={currentLab?.name || ''}
                      onChange={handleEditChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      placeholder="Contoh: Lab Komputer B"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <span className="text-red-500">*</span> Lokasi
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={currentLab?.location || ''}
                      onChange={handleEditChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      placeholder="Contoh: Gedung D Lantai 2"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <span className="text-red-500">*</span> Kapasitas
                    </label>
                    <input
                      type="number"
                      name="capacity"
                      value={currentLab?.capacity || ''}
                      onChange={handleEditChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      placeholder="Jumlah maksimal orang"
                      min="1"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Jam Buka
                      </label>
                      <input
                        type="time"
                        name="openingTime"
                        value={currentLab?.openingTime || '08:00'}
                        onChange={handleEditChange}
                        className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition'
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Jam Tutup
                      </label>
                      <input
                        type="time"
                        name="closingTime"
                        value={currentLab?.closingTime || '17:00'}
                        onChange={handleEditChange}
                        className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition'
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fasilitas (pisahkan dengan koma)
                  </label>
                  <input
                    type="text"
                    name="facilities"
                    value={currentLab?.facilities || ''}
                    onChange={handleEditChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="Contoh: Oscilloscope, Multimeter, Power Supply"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {currentLab?.facilities ?
                      `Akan menjadi array dengan ${currentLab.facilities.split(',').filter(item => item.trim()).length} item` :
                      'Pisahkan setiap fasilitas dengan koma'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status Lab
                  </label>
                  <select
                    name="status"
                    value={currentLab?.status || 'available'}
                    onChange={handleEditChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  >
                    <option value="available">🟢 Tersedia</option>
                    <option value="occupied">🟡 Sedang Digunakan</option>
                    <option value="maintenance">🔴 Dalam Perawatan</option>
                  </select>
                </div>

                <div className="flex space-x-3 pt-2">
                  <button
                    onClick={saveEdit}
                    className="px-5 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white font-medium rounded-lg hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition shadow-sm"
                  >
                    💾 Simpan Perubahan
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="px-5 py-2.5 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition"
                  >
                    Batal
                  </button>
                </div>

                {/* Debug info untuk edit mode */}
                {editMode && currentLab && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm">
                    <p className="font-medium text-blue-800 mb-1">📋 Data yang akan dikirim:</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>Nama: <span className="font-semibold">{currentLab.name}</span></div>
                      <div>ID: <span className="font-mono">{currentLab._id?.substring(0, 8)}...</span></div>
                      <div>Lokasi: <span className="font-semibold">{currentLab.location}</span></div>
                      <div>Kapasitas: <span className="font-semibold">{currentLab.capacity}</span></div>
                      <div>Status: <span className="font-semibold">{currentLab.status}</span></div>
                      <div>Fasilitas: <span className="font-semibold">{currentLab.facilities || '(kosong)'}</span></div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // ADD FORM
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <span className="text-red-500">*</span> Nama Lab
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={newLab.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      placeholder="Contoh: Lab Komputer B"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <span className="text-red-500">*</span> Lokasi
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={newLab.location}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      placeholder="Contoh: Gedung D Lantai 2"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <span className="text-red-500">*</span> Kapasitas
                    </label>
                    <input
                      type="number"
                      name="capacity"
                      value={newLab.capacity}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      placeholder="Jumlah maksimal orang"
                      min="1"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Jam Buka
                      </label>
                      <input
                        type="time"
                        name="openingTime"
                        value={newLab.openingTime}
                        onChange={handleInputChange}
                        className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition'
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Jam Tutup
                      </label>
                      <input
                        type="time"
                        name="closingTime"
                        value={newLab.closingTime}
                        onChange={handleInputChange}
                        className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition'
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fasilitas (pisahkan dengan koma)
                  </label>
                  <input
                    type="text"
                    name="facilities"
                    value={newLab.facilities}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="Contoh: Oscilloscope, Multimeter, Power Supply"
                  />
                  <p className="text-xs text-gray-500 mt-1">Pisahkan setiap fasilitas dengan koma</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status Lab
                  </label>
                  <select
                    name="status"
                    value={newLab.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  >
                    <option value="available">🟢 Tersedia</option>
                    <option value="occupied">🟡 Sedang Digunakan</option>
                    <option value="maintenance">🔴 Dalam Perawatan</option>
                  </select>
                </div>

                <button
                  onClick={addLab}
                  className="w-full md:w-auto px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition shadow-sm"
                >
                  ➕ Tambah Lab Baru
                </button>
              </div>
            )}
          </div>
        )}

        {/* Labs Table */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-800">📋 Daftar Laboratorium</h3>
              <div className="mt-2 md:mt-0 flex items-center space-x-2">
                <span className="text-sm text-gray-500">
                  Total: <span className="font-semibold">{safeLabs.length} lab</span>
                </span>
                <div className="h-4 w-px bg-gray-300"></div>
                <span className="text-sm text-gray-500">
                  Tersedia: <span className="font-semibold text-green-600">{tersediaCount}</span>
                </span>
              </div>
            </div>
          </div>

          {safeLabs.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-block p-4 bg-gray-100 rounded-full mb-4">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                </svg>
              </div>
              <h4 className="text-lg font-medium text-gray-700 mb-2">Belum ada data lab</h4>
              <p className="text-gray-500">
                {isAdmin()
                  ? 'Mulai dengan menambahkan lab baru menggunakan form di atas.'
                  : 'Tidak ada lab yang tersedia saat ini.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Lab</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lokasi</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kapasitas</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fasilitas</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    {isAdmin() && (
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {safeLabs.map((lab, index) => (
                    <tr key={lab._id || lab.id || index} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{index + 1}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                            <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                            </svg>
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-gray-900">{lab.name || 'No name'}</div>
                            <div className="text-xs text-gray-500">
                              {lab.openingTime && lab.closingTime
                                ? `${lab.openingTime} - ${lab.closingTime}`
                                : '08:00 - 17:00'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{lab.location || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-sm text-gray-900 font-medium">{lab.capacity || 0}</div>
                          <span className="ml-2 text-xs text-gray-500">orang</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs">
                          {Array.isArray(lab.facilities) && lab.facilities.length > 0 ? (
                            <div>
                              {lab.facilities.join(', ')}
                              <div className="text-xs text-gray-500 mt-1">
                                {lab.facilities.length} item
                              </div>
                            </div>
                          ) : (
                            <span className="text-gray-400 italic">Tidak ada fasilitas</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(lab.status)}`}>
                          {mapStatusToIndonesian(lab.status) === 'tersedia' && '🟢'}
                          {mapStatusToIndonesian(lab.status) === 'digunakan' && '🟡'}
                          {mapStatusToIndonesian(lab.status) === 'maintenance' && '🔴'}
                          <span className="ml-1">{getStatusText(lab.status)}</span>
                        </span>
                      </td>
                      {isAdmin() && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => startEdit(lab)}
                              className="inline-flex items-center px-3 py-1.5 border border-blue-300 text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition text-sm"
                            >
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                              </svg>
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                const labId = lab._id || lab.id;
                                console.log('Delete ID:', labId);
                                deleteLab(labId);
                              }}
                              className="inline-flex items-center px-3 py-1.5 border border-red-300 text-red-700 bg-red-50 rounded-md hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 transition text-sm"
                            >
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                              </svg>
                              Hapus
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 mt-1">
              <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
              </svg>
            </div>
            <div className="ml-3">
              <h4 className="text-sm font-medium text-blue-800">
                {isAdmin() ? 'Tips Manajemen Lab untuk Admin' : 'Informasi Lab'}
              </h4>
              <div className="mt-1 text-sm text-blue-700">
                {isAdmin() ? (
                  <>
                    <p>• Pastikan status lab selalu diperbarui sesuai kondisi sebenarnya</p>
                    <p>• Tambahkan detail fasilitas untuk memudahkan pengecekan inventaris</p>
                    <p>• Update kapasitas lab jika ada perubahan fasilitas</p>
                  </>
                ) : (
                  <>
                    <p>• Lab dengan status <span className="font-semibold text-green-700">🟢 Tersedia</span> dapat dipesan</p>
                    <p>• Hubungi admin untuk informasi lebih lanjut tentang lab</p>
                    <p>• Lakukan booking melalui sistem booking yang tersedia</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabManagement;