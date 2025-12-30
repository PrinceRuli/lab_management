import React, { useState, useEffect } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { labAPI } from '../../services/api';
import { toast } from 'react-hot-toast'; // Import toast

const LabManagement = () => {
  // ================= STATE =================
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLab, setSelectedLab] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  
  // Form state
  const [labForm, setLabForm] = useState({
    name: '',
    location: '',
    capacity: '',
    facilities: '',
    status: 'available',
    openingTime: '08:00',
    closingTime: '17:00'
  });

  // ================= FETCH DATA =================
  useEffect(() => {
    const fetchLabs = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🔄 Fetching labs data...');
        const response = await labAPI.getAll();
        
        // Handle different response formats
        let labsData = [];
        if (Array.isArray(response.data)) {
          labsData = response.data;
        } else if (response.data && Array.isArray(response.data.data)) {
          labsData = response.data.data;
        } else if (response.data && Array.isArray(response.data.labs)) {
          labsData = response.data.labs;
        }
        
        // Standardize IDs
        const standardizedLabs = labsData.map((lab, index) => ({
          ...lab,
          _id: lab._id || lab.id || `temp-${Date.now()}-${index}`,
          facilities: Array.isArray(lab.facilities) ? lab.facilities : []
        }));
        
        setLabs(standardizedLabs);
        console.log(`✅ Loaded ${standardizedLabs.length} labs`);
        
      } catch (err) {
        console.error('❌ Error fetching labs:', err);
        setError('Gagal memuat data lab. Silakan coba lagi.');
        toast.error('Gagal memuat data lab'); // Toast error
      } finally {
        setLoading(false);
      }
    };

    fetchLabs();
  }, []);

  // ================= HANDLERS =================
  const openDetail = (lab) => {
    setSelectedLab(lab);
    setShowDetailModal(true);
  };

  const closeDetail = () => {
    setSelectedLab(null);
    setShowDetailModal(false);
  };

  const openAddForm = () => {
    setIsEditMode(false);
    setLabForm({
      name: '',
      location: '',
      capacity: '',
      facilities: '',
      status: 'available',
      openingTime: '08:00',
      closingTime: '17:00'
    });
    setShowFormModal(true);
  };

  const openEditForm = (lab) => {
    setIsEditMode(true);
    setLabForm({
      _id: lab._id,
      name: lab.name || '',
      location: lab.location || '',
      capacity: lab.capacity ? String(lab.capacity) : '',
      facilities: Array.isArray(lab.facilities) ? lab.facilities.join(', ') : '',
      status: lab.status || 'available',
      openingTime: lab.openingTime || '08:00',
      closingTime: lab.closingTime || '17:00'
    });
    setShowFormModal(true);
  };

  const closeForm = () => {
    setShowFormModal(false);
    setLabForm({
      name: '',
      location: '',
      capacity: '',
      facilities: '',
      status: 'available',
      openingTime: '08:00',
      closingTime: '17:00'
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setLabForm({
      ...labForm,
      [name]: value
    });
  };

  const saveLab = async () => {
    try {
      // Validate form dengan toast
      if (!labForm.name?.trim()) {
        toast.error('Nama lab harus diisi');
        return;
      }
      if (!labForm.location?.trim()) {
        toast.error('Lokasi lab harus diisi');
        return;
      }
      if (!labForm.capacity) {
        toast.error('Kapasitas lab harus diisi');
        return;
      }

      const capacityNum = Number(labForm.capacity);
      if (isNaN(capacityNum) || capacityNum <= 0) {
        toast.error('Kapasitas harus berupa angka positif');
        return;
      }

      // Prepare data
      const facilitiesArray = labForm.facilities 
        ? labForm.facilities.split(',').map(item => item.trim()).filter(item => item)
        : [];

      const labData = {
        name: labForm.name.trim(),
        location: labForm.location.trim(),
        capacity: Math.floor(capacityNum),
        facilities: facilitiesArray,
        status: labForm.status,
        openingTime: labForm.openingTime,
        closingTime: labForm.closingTime
      };

      let response;
      const loadingToast = toast.loading(isEditMode ? 'Memperbarui lab...' : 'Menambahkan lab...');
      
      if (isEditMode && labForm._id) {
        response = await labAPI.update(labForm._id, labData);
      } else {
        response = await labAPI.create(labData);
      }

      console.log('✅ Lab saved:', response.data);
      
      // Refresh labs
      const refreshResponse = await labAPI.getAll();
      let refreshedData = [];
      if (Array.isArray(refreshResponse.data)) {
        refreshedData = refreshResponse.data;
      } else if (refreshResponse.data && Array.isArray(refreshResponse.data.data)) {
        refreshedData = refreshResponse.data.data;
      }
      
      setLabs(refreshedData.map((lab, index) => ({
        ...lab,
        _id: lab._id || lab.id || `temp-${Date.now()}-${index}`,
        facilities: Array.isArray(lab.facilities) ? lab.facilities : []
      })));

      closeForm();
      
      // Update toast untuk success
      toast.dismiss(loadingToast);
      toast.success(isEditMode ? 'Lab berhasil diperbarui' : 'Lab berhasil ditambahkan');

    } catch (err) {
      console.error('❌ Error saving lab:', err);
      const errorMessage = err.response?.data?.message || 'Gagal menyimpan lab';
      toast.error(errorMessage);
    }
  };

  const deleteLab = async (labId) => {
    // Konfirmasi dengan modal custom atau toast
    if (!window.confirm('Apakah Anda yakin ingin menghapus lab ini?')) {
      return;
    }

    try {
      const loadingToast = toast.loading('Menghapus lab...');
      await labAPI.delete(labId);
      
      // Update local state
      setLabs(labs.filter(lab => lab._id !== labId));
      
      // Update toast untuk success
      toast.dismiss(loadingToast);
      toast.success('Lab berhasil dihapus');
      
      // Tutup modal detail jika terbuka
      if (showDetailModal && selectedLab?._id === labId) {
        closeDetail();
      }
      
    } catch (err) {
      console.error('❌ Error deleting lab:', err);
      const errorMessage = err.response?.data?.message || 'Gagal menghapus lab';
      toast.error(errorMessage);
    }
  };

  // Custom confirmation untuk delete di modal detail
  const confirmDeleteLab = (lab) => {
    toast.custom((t) => (
      <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}>
        <div className="flex-1 w-0 p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.856-.833-2.732 0L4.346 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-900">Konfirmasi Hapus</p>
              <p className="mt-1 text-sm text-gray-500">
                Apakah Anda yakin ingin menghapus lab "{lab.name}"? Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>
          </div>
        </div>
        <div className="flex border-l border-gray-200">
          <button
            onClick={() => {
              toast.dismiss(t.id);
            }}
            className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-gray-600 hover:text-gray-500 focus:outline-none"
          >
            Batal
          </button>
          <button
            onClick={() => {
              toast.dismiss(t.id);
              deleteLab(lab._id);
            }}
            className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-red-600 hover:text-red-500 focus:outline-none"
          >
            Hapus
          </button>
        </div>
      </div>
    ), {
      duration: 10000, // 10 detik
    });
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'available': { bg: 'bg-green-100', text: 'text-green-800', label: 'Tersedia' },
      'occupied': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Digunakan' },
      'maintenance': { bg: 'bg-red-100', text: 'text-red-800', label: 'Perawatan' },
    };

    const config = statusMap[status] || { bg: 'bg-gray-100', text: 'text-gray-800', label: status };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  // ================= RENDER LOADING =================
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Manajemen Lab</h1>
          <p className="text-gray-600 mt-1">Memuat data lab...</p>
        </div>
        <div className="flex flex-col justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600">Memuat data lab...</p>
        </div>
      </div>
    );
  }

  // ================= RENDER ERROR =================
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Manajemen Lab</h1>
          <p className="text-gray-600 mt-1">Terjadi kesalahan</p>
        </div>
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-red-800 mb-2">Gagal Memuat Data</h3>
              <p className="text-red-700 mb-6">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Muat Ulang
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ================= RENDER =================
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Manajemen Lab</h1>
            <p className="text-gray-600 mt-1">
              Kelola data laboratorium yang tersedia
            </p>
          </div>
          <Button
            onClick={openAddForm}
            className="mt-4 md:mt-0 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Tambah Lab
          </Button>
        </div>
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-600 font-medium">Total Lab</p>
            <p className="text-2xl font-bold text-blue-700 mt-1">{labs.length}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-green-600 font-medium">Tersedia</p>
            <p className="text-2xl font-bold text-green-700 mt-1">
              {labs.filter(l => l.status === 'available').length}
            </p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-sm text-yellow-600 font-medium">Digunakan</p>
            <p className="text-2xl font-bold text-yellow-700 mt-1">
              {labs.filter(l => l.status === 'occupied').length}
            </p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <p className="text-sm text-red-600 font-medium">Perawatan</p>
            <p className="text-2xl font-bold text-red-700 mt-1">
              {labs.filter(l => l.status === 'maintenance').length}
            </p>
          </div>
        </div>
      </div>

      {/* Labs List */}
      {labs.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Belum ada lab</h3>
            <p className="text-gray-600 mb-6">
              Mulai dengan menambahkan lab pertama Anda.
            </p>
            <Button onClick={openAddForm}>
              Tambah Lab Pertama
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {labs.map((lab) => (
            <Card 
              key={lab._id} 
              className="p-5 hover:shadow-md transition-all duration-200 hover:-translate-y-1"
            >
              <div className="flex flex-col md:flex-row md:items-start gap-4">
                {/* Lab Icon */}
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                
                {/* Lab Details */}
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-800 mb-1">
                        {lab.name}
                      </h3>
                      <div className="flex flex-wrap gap-2 mb-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {lab.location}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {lab.capacity} orang
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{lab.openingTime} - {lab.closingTime}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          <span>{lab.facilities?.length || 0} fasilitas</span>
                        </div>
                      </div>
                      
                      {/* Facilities preview */}
                      {lab.facilities && lab.facilities.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1">
                          {lab.facilities.slice(0, 3).map((facility, index) => (
                            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                              {facility}
                            </span>
                          ))}
                          {lab.facilities.length > 3 && (
                            <span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded">
                              +{lab.facilities.length - 3} lainnya
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col items-end gap-3">
                      {getStatusBadge(lab.status)}
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                    <div className="text-xs text-gray-500">
                      ID: {lab._id?.substring(0, 8)}...
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => openDetail(lab)}
                        className="flex items-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Detail
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => openEditForm(lab)}
                        className="flex items-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </Button>
                      <Button 
                        size="sm" 
                        variant="danger"
                        onClick={() => deleteLab(lab._id)}
                        className="flex items-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Hapus
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* ================= MODAL DETAIL ================= */}
      <Modal
        isOpen={showDetailModal}
        onClose={closeDetail}
        title={
          <div className="flex items-center gap-2">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Detail Lab</span>
          </div>
        }
        size="lg"
      >
        {selectedLab && (
          <div className="space-y-6">
            {/* Header */}
            <div>
              <h3 className="text-xl font-bold text-gray-800">{selectedLab.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                {getStatusBadge(selectedLab.status)}
                <span className="text-gray-600">• {selectedLab.location}</span>
              </div>
            </div>

            {/* Lab Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DetailItem label="Lokasi" value={selectedLab.location} />
              <DetailItem label="Kapasitas" value={`${selectedLab.capacity} orang`} />
              <DetailItem label="Jam Operasional" value={`${selectedLab.openingTime} - ${selectedLab.closingTime}`} />
              <DetailItem label="Status" value={getStatusBadge(selectedLab.status)} isComponent />
            </div>

            {/* Facilities */}
            {selectedLab.facilities && selectedLab.facilities.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Fasilitas</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex flex-wrap gap-2">
                    {selectedLab.facilities.map((facility, index) => (
                      <span key={index} className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm">
                        {facility}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="pt-4 border-t border-gray-200 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  closeDetail();
                  openEditForm(selectedLab);
                }}
              >
                Edit Lab
              </Button>
              <Button
                variant="danger"
                onClick={() => confirmDeleteLab(selectedLab)}
              >
                Hapus Lab
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* ================= MODAL FORM ================= */}
      <Modal
        isOpen={showFormModal}
        onClose={closeForm}
        title={
          <div className="flex items-center gap-2">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isEditMode ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              )}
            </svg>
            <span>{isEditMode ? 'Edit Lab' : 'Tambah Lab Baru'}</span>
          </div>
        }
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nama Lab *
            </label>
            <input
              type="text"
              name="name"
              value={labForm.name}
              onChange={handleFormChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Contoh: Lab Komputer B"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lokasi *
            </label>
            <input
              type="text"
              name="location"
              value={labForm.location}
              onChange={handleFormChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Contoh: Gedung D Lantai 2"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kapasitas *
              </label>
              <input
                type="number"
                name="capacity"
                value={labForm.capacity}
                onChange={handleFormChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="30"
                min="1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                name="status"
                value={labForm.status}
                onChange={handleFormChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="available">Tersedia</option>
                <option value="occupied">Digunakan</option>
                <option value="maintenance">Perawatan</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Jam Buka
              </label>
              <input
                type="time"
                name="openingTime"
                value={labForm.openingTime}
                onChange={handleFormChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Jam Tutup
              </label>
              <input
                type="time"
                name="closingTime"
                value={labForm.closingTime}
                onChange={handleFormChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fasilitas (pisahkan dengan koma)
            </label>
            <textarea
              name="facilities"
              value={labForm.facilities}
              onChange={handleFormChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Contoh: Komputer, Proyektor, Whiteboard"
              rows="3"
            />
          </div>

          <div className="pt-4 border-t border-gray-200 flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={closeForm}
            >
              Batal
            </Button>
            <Button
              onClick={saveLab}
            >
              {isEditMode ? 'Simpan Perubahan' : 'Tambah Lab'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

// Helper Component for Detail Items
const DetailItem = ({ label, value, isComponent = false }) => (
  <div>
    <h4 className="font-medium text-gray-700 mb-1">{label}</h4>
    {isComponent ? (
      value
    ) : (
      <p className="text-gray-900">{value || <span className="text-gray-400">Tidak tersedia</span>}</p>
    )}
  </div>
);

export default LabManagement;