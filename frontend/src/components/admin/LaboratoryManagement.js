import React, { useState, useEffect } from 'react';
import AddLaboratoryModal from './AddLaboratoryModal';

const LaboratoryManagement = () => {
  const [laboratories, setLaboratories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddLabModal, setShowAddLabModal] = useState(false);
  const [showEditLabModal, setShowEditLabModal] = useState(false);
  const [selectedLab, setSelectedLab] = useState(null);

  // Sample laboratory data
  const sampleLaboratories = [
    {
      _id: "690f729713915ad44085d1ee",
      name: "Computer Lab 1",
      location: "Building A, Room 101",
      capacity: 30,
      equipment: ["25x Desktop Computers", "Projector", "Whiteboard", "Network Printers"],
      facilities: ["Air Conditioning", "WiFi", "Power Outlets"],
      description: "Main computer laboratory for programming and software development classes",
      status: "active",
      manager: "Dr. Sarah Smith",
      contact: "sarah.smith@university.edu",
      operatingHours: "07:00 - 22:00",
      maintenanceSchedule: "Every Saturday, 08:00-12:00",
      bookingsCount: 45,
      utilization: 85,
      createdAt: "2023-08-10T09:00:00.000Z",
      lastMaintenance: "2024-01-13T08:00:00.000Z"
    },
    {
      _id: "690f729713915ad44085d1ef",
      name: "Physics Laboratory",
      location: "Building B, Room 201",
      capacity: 25,
      equipment: ["Oscilloscopes", "Multimeters", "Power Supplies", "Optical Benches"],
      facilities: ["Dark Room", "Equipment Storage", "Safety Gear"],
      description: "Laboratory for physics experiments and research projects",
      status: "active",
      manager: "Prof. John Davis",
      contact: "john.davis@university.edu",
      operatingHours: "08:00 - 20:00",
      maintenanceSchedule: "First Monday of every month",
      bookingsCount: 32,
      utilization: 72,
      createdAt: "2023-09-15T08:30:00.000Z",
      lastMaintenance: "2024-01-08T09:00:00.000Z"
    },
    {
      _id: "690f729713915ad44085d1f0",
      name: "Chemistry Lab",
      location: "Building C, Room 105",
      capacity: 20,
      equipment: ["Fume Hoods", "Bunsen Burners", "Analytical Balances", "Glassware Sets"],
      facilities: ["Ventilation System", "Chemical Storage", "Safety Showers"],
      description: "Chemistry laboratory for organic and inorganic chemistry experiments",
      status: "maintenance",
      manager: "Dr. Maria Garcia",
      contact: "maria.garcia@university.edu",
      operatingHours: "08:00 - 18:00",
      maintenanceSchedule: "Weekly safety inspection",
      bookingsCount: 28,
      utilization: 68,
      createdAt: "2023-10-05T11:20:00.000Z",
      lastMaintenance: "2024-01-20T10:00:00.000Z"
    },
    {
      _id: "690f729713915ad44085d1f1",
      name: "Biology Laboratory",
      location: "Building D, Room 301",
      capacity: 18,
      equipment: ["Microscopes", "Centrifuges", "Incubators", "PCR Machines"],
      facilities: ["Bio Safety Cabinet", "Cold Storage", "Specimen Storage"],
      description: "Biology lab for microbiology and cellular biology studies",
      status: "active",
      manager: "Dr. Robert Wilson",
      contact: "robert.wilson@university.edu",
      operatingHours: "09:00 - 17:00",
      maintenanceSchedule: "Bi-weekly equipment calibration",
      bookingsCount: 25,
      utilization: 61,
      createdAt: "2023-11-20T14:15:00.000Z",
      lastMaintenance: "2024-01-15T14:00:00.000Z"
    },
    {
      _id: "690f729713915ad44085d1f2",
      name: "Robotics Lab",
      location: "Building E, Room 205",
      capacity: 15,
      equipment: ["3D Printers", "Arduino Kits", "Robotic Arms", "Sensors Collection"],
      facilities: ["Workbenches", "Tool Storage", "Prototyping Area"],
      description: "Robotics and automation laboratory for engineering students",
      status: "inactive",
      manager: "Dr. Lisa Chen",
      contact: "lisa.chen@university.edu",
      operatingHours: "10:00 - 19:00",
      maintenanceSchedule: "Monthly equipment check",
      bookingsCount: 18,
      utilization: 45,
      createdAt: "2024-01-10T13:45:00.000Z",
      lastMaintenance: "2023-12-20T11:00:00.000Z"
    }
  ];

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setLaboratories(sampleLaboratories);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Filter laboratories based on status and search term
  const filteredLabs = laboratories.filter(lab => {
    const matchesFilter = filter === 'all' || lab.status === filter;
    const matchesSearch = lab.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lab.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lab.manager.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Calculate statistics
  const stats = {
    total: laboratories.length,
    active: laboratories.filter(lab => lab.status === 'active').length,
    maintenance: laboratories.filter(lab => lab.status === 'maintenance').length,
    inactive: laboratories.filter(lab => lab.status === 'inactive').length,
    totalCapacity: laboratories.reduce((sum, lab) => sum + lab.capacity, 0),
    avgUtilization: laboratories.reduce((sum, lab) => sum + lab.utilization, 0) / laboratories.length
  };

  const handleAddLaboratory = (labData) => {
    const newLab = {
      _id: Date.now().toString(),
      ...labData,
      bookingsCount: 0,
      utilization: 0,
      createdAt: new Date().toISOString(),
      lastMaintenance: new Date().toISOString()
    };
    
    setLaboratories(prev => [newLab, ...prev]);
    setShowAddLabModal(false);
    console.log('Laboratory added:', newLab);
  };

  const handleEditLaboratory = (labData) => {
    setLaboratories(prev => 
      prev.map(lab => 
        lab._id === selectedLab._id 
          ? { ...lab, ...labData }
          : lab
      )
    );
    setShowEditLabModal(false);
    setSelectedLab(null);
    console.log('Laboratory updated:', labData);
  };

  const handleDeleteLaboratory = (labId) => {
    if (window.confirm('Are you sure you want to delete this laboratory? All associated bookings will also be deleted.')) {
      setLaboratories(prev => prev.filter(lab => lab._id !== labId));
      console.log('Laboratory deleted:', labId);
    }
  };

  const handleStatusChange = (labId, newStatus) => {
    setLaboratories(prev => 
      prev.map(lab => 
        lab._id === labId 
          ? { 
              ...lab, 
              status: newStatus,
              lastMaintenance: newStatus === 'maintenance' ? new Date().toISOString() : lab.lastMaintenance
            }
          : lab
      )
    );
    console.log('Laboratory status updated:', labId, newStatus);
  };

  const handleEditClick = (lab) => {
    setSelectedLab(lab);
    setShowEditLabModal(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'green';
      case 'maintenance': return 'orange';
      case 'inactive': return 'red';
      default: return 'gray';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return '✅';
      case 'maintenance': return '🛠️';
      case 'inactive': return '🚫';
      default: return '❓';
    }
  };

  const getUtilizationColor = (utilization) => {
    if (utilization >= 80) return 'text-red-600';
    if (utilization >= 60) return 'text-orange-600';
    return 'text-green-600';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Laboratory Management</h2>
          <p className="text-gray-600 mt-1">Manage laboratory facilities, equipment, and availability</p>
        </div>
        <button 
          onClick={() => setShowAddLabModal(true)}
          className="mt-4 lg:mt-0 flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <span>+</span>
          <span>Add New Laboratory</span>
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Total Labs</p>
              <p className="text-2xl font-bold text-blue-800">{stats.total}</p>
            </div>
            <div className="text-2xl">🏢</div>
          </div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Active</p>
              <p className="text-2xl font-bold text-green-800">{stats.active}</p>
            </div>
            <div className="text-2xl">✅</div>
          </div>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-600 text-sm font-medium">Maintenance</p>
              <p className="text-2xl font-bold text-orange-800">{stats.maintenance}</p>
            </div>
            <div className="text-2xl">🛠️</div>
          </div>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">Total Capacity</p>
              <p className="text-2xl font-bold text-purple-800">{stats.totalCapacity}</p>
            </div>
            <div className="text-2xl">👥</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by lab name, location, or manager..."
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
          <select 
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="maintenance">Maintenance</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Laboratories Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredLabs.map(lab => (
          <div 
            key={lab._id} 
            className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-200 bg-white"
          >
            {/* Lab Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 text-lg mb-1">{lab.name}</h3>
                <p className="text-gray-600 text-sm">{lab.location}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  lab.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : lab.status === 'maintenance'
                    ? 'bg-orange-100 text-orange-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {getStatusIcon(lab.status)} {lab.status.charAt(0).toUpperCase() + lab.status.slice(1)}
                </span>
              </div>
            </div>

            {/* Lab Details */}
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Capacity:</span>
                <span className="font-semibold">{lab.capacity} people</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Utilization:</span>
                <span className={`font-semibold ${getUtilizationColor(lab.utilization)}`}>
                  {lab.utilization}%
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Bookings:</span>
                <span className="font-semibold">{lab.bookingsCount} total</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Manager:</span>
                <span className="font-semibold">{lab.manager}</span>
              </div>
            </div>

            {/* Equipment Preview */}
            <div className="mb-4">
              <p className="text-gray-600 text-sm mb-2">Equipment:</p>
              <div className="flex flex-wrap gap-1">
                {lab.equipment.slice(0, 3).map((item, index) => (
                  <span 
                    key={index}
                    className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
                  >
                    {item}
                  </span>
                ))}
                {lab.equipment.length > 3 && (
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                    +{lab.equipment.length - 3} more
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            {lab.description && (
              <div className="mb-4">
                <p className="text-gray-600 text-sm line-clamp-2">{lab.description}</p>
              </div>
            )}

            {/* Operating Hours & Maintenance */}
            <div className="space-y-2 text-xs text-gray-500 mb-4">
              <div className="flex justify-between">
                <span>Operating Hours:</span>
                <span>{lab.operatingHours}</span>
              </div>
              <div className="flex justify-between">
                <span>Last Maintenance:</span>
                <span>{new Date(lab.lastMaintenance).toLocaleDateString('id-ID')}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <select 
                value={lab.status}
                onChange={(e) => handleStatusChange(lab._id, e.target.value)}
                className={`text-xs border rounded px-2 py-1 focus:outline-none focus:ring-1 ${
                  lab.status === 'active' 
                    ? 'bg-green-100 text-green-800 border-green-200 focus:ring-green-500' 
                    : lab.status === 'maintenance'
                    ? 'bg-orange-100 text-orange-800 border-orange-200 focus:ring-orange-500'
                    : 'bg-red-100 text-red-800 border-red-200 focus:ring-red-500'
                }`}
              >
                <option value="active">Active</option>
                <option value="maintenance">Maintenance</option>
                <option value="inactive">Inactive</option>
              </select>

              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => handleEditClick(lab)}
                  className="text-blue-600 hover:text-blue-800 p-1 transition-colors"
                  title="Edit Laboratory"
                >
                  ✏️
                </button>
                <button 
                  onClick={() => handleDeleteLaboratory(lab._id)}
                  className="text-red-600 hover:text-red-800 p-1 transition-colors"
                  title="Delete Laboratory"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredLabs.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🏢</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Laboratories Found</h3>
          <p className="text-gray-600">
            {searchTerm || filter !== 'all' 
              ? 'Try changing your search or filter criteria' 
              : 'There are no laboratories to display'
            }
          </p>
          <button 
            onClick={() => setShowAddLabModal(true)}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Add First Laboratory
          </button>
        </div>
      )}

      {/* Add Laboratory Modal */}
      {showAddLabModal && (
        <AddLaboratoryModal
          onClose={() => {
            console.log('Closing modal from LaboratoryManagement');
            setShowAddLabModal(false);
          }}
          onAddLaboratory={(labData) => {
            handleAddLaboratory(labData);
            setShowAddLabModal(false);
          }}
        />
      )}

      {/* Edit Laboratory Modal */}
      {showEditLabModal && selectedLab && (
        <EditLaboratoryModal
          laboratory={selectedLab}
          onClose={() => {
            setShowEditLabModal(false);
            setSelectedLab(null);
          }}
          onEditLaboratory={handleEditLaboratory}
        />
      )}
    </div>
  );
};

// Edit Laboratory Modal Component
const EditLaboratoryModal = ({ laboratory, onClose, onEditLaboratory }) => {
  const [formData, setFormData] = useState({
    name: laboratory.name,
    location: laboratory.location,
    capacity: laboratory.capacity,
    equipment: laboratory.equipment.join(', '),
    facilities: laboratory.facilities.join(', '),
    description: laboratory.description,
    manager: laboratory.manager,
    contact: laboratory.contact,
    operatingHours: laboratory.operatingHours,
    maintenanceSchedule: laboratory.maintenanceSchedule,
    status: laboratory.status
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedData = {
      ...formData,
      equipment: formData.equipment.split(',').map(item => item.trim()).filter(item => item),
      facilities: formData.facilities.split(',').map(item => item.trim()).filter(item => item)
    };
    onEditLaboratory(updatedData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Edit Laboratory</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Laboratory Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="active">Active</option>
                <option value="maintenance">Maintenance</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Equipment (comma separated)</label>
            <textarea
              name="equipment"
              value={formData.equipment}
              onChange={handleChange}
              rows="2"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Computers, Projector, Whiteboard..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Facilities (comma separated)</label>
            <textarea
              name="facilities"
              value={formData.facilities}
              onChange={handleChange}
              rows="2"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Air Conditioning, WiFi, Power Outlets..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Manager</label>
              <input
                type="text"
                name="manager"
                value={formData.manager}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
              <input
                type="email"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Operating Hours</label>
              <input
                type="text"
                name="operatingHours"
                value={formData.operatingHours}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="08:00 - 18:00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Maintenance Schedule</label>
              <input
                type="text"
                name="maintenanceSchedule"
                value={formData.maintenanceSchedule}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Every Saturday, 08:00-12:00"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Update Laboratory
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LaboratoryManagement;