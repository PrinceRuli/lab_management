import React, { useState, useEffect } from 'react';

const MySchedule = () => {
  // Data guru (dari konteks autentikasi)
  const teacherData = {
    id: 1,
    name: "Dr. Ahmad",
    email: "ahmad@university.edu",
    department: "Informatika",
    subjects: ["Algoritma", "Struktur Data", "Pemrograman Web"],
    labs: ["Lab Komputer A", "Lab Komputer B"]
  };

  // Jadwal mengajar contoh
  const initialSchedule = [
    {
      id: 1,
      subject: "Algoritma dan Pemrograman",
      class: "TI-2021-A",
      day: "Senin",
      date: "2023-10-23",
      startTime: "08:00",
      endTime: "10:00",
      room: "R.301",
      lab: "Lab Komputer A",
      type: "Praktikum",
      status: "upcoming",
      students: 30,
      color: "blue"
    },
    {
      id: 2,
      subject: "Struktur Data",
      class: "TI-2021-B",
      day: "Senin",
      date: "2023-10-23",
      startTime: "13:00",
      endTime: "15:00",
      room: "R.302",
      lab: "Lab Komputer B",
      type: "Teori",
      status: "upcoming",
      students: 28,
      color: "green"
    },
    {
      id: 3,
      subject: "Pemrograman Web",
      class: "TI-2021-C",
      day: "Selasa",
      date: "2023-10-24",
      startTime: "09:00",
      endTime: "12:00",
      room: "Lab Komputer A",
      lab: "Lab Komputer A",
      type: "Praktikum",
      status: "upcoming",
      students: 25,
      color: "purple"
    },
    {
      id: 4,
      subject: "Algoritma Lanjut",
      class: "TI-2020-A",
      day: "Rabu",
      date: "2023-10-25",
      startTime: "10:00",
      endTime: "12:00",
      room: "R.303",
      lab: "Lab Komputer B",
      type: "Seminar",
      status: "upcoming",
      students: 20,
      color: "orange"
    },
    {
      id: 5,
      subject: "Basis Data",
      class: "TI-2021-D",
      day: "Kamis",
      date: "2023-10-26",
      startTime: "08:00",
      endTime: "10:00",
      room: "Lab Komputer A",
      lab: "Lab Komputer A",
      type: "Praktikum",
      status: "upcoming",
      students: 32,
      color: "red"
    },
    {
      id: 6,
      subject: "Machine Learning",
      class: "TI-2019-A",
      day: "Jumat",
      date: "2023-10-27",
      startTime: "14:00",
      endTime: "17:00",
      room: "Lab Komputer B",
      lab: "Lab Komputer B",
      type: "Workshop",
      status: "upcoming",
      students: 18,
      color: "indigo"
    },
    {
      id: 7,
      subject: "Struktur Data",
      class: "TI-2021-A",
      day: "Senin",
      date: "2023-10-16",
      startTime: "08:00",
      endTime: "10:00",
      room: "Lab Komputer A",
      lab: "Lab Komputer A",
      type: "Praktikum",
      status: "completed",
      students: 30,
      color: "green"
    },
    {
      id: 8,
      subject: "Algoritma",
      class: "TI-2021-C",
      day: "Selasa",
      date: "2023-10-17",
      startTime: "13:00",
      endTime: "15:00",
      room: "R.301",
      lab: "Lab Komputer A",
      type: "Teori",
      status: "completed",
      students: 28,
      color: "blue"
    }
  ];

  // State management
  const [schedule, setSchedule] = useState(initialSchedule);
  const [viewMode, setViewMode] = useState('week'); // 'week', 'day', 'list'
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [filterType, setFilterType] = useState('all'); // 'all', 'upcoming', 'completed'
  const [filterSubject, setFilterSubject] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  
  // Form state untuk menambah jadwal
  const [scheduleForm, setScheduleForm] = useState({
    subject: '',
    class: '',
    day: '',
    date: '',
    startTime: '',
    endTime: '',
    room: '',
    lab: '',
    type: 'Praktikum',
    description: ''
  });

  // Data untuk filter
  const subjects = [...new Set(initialSchedule.map(item => item.subject))];
  const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const types = ['Praktikum', 'Teori', 'Seminar', 'Workshop', 'Konsultasi'];
  const labs = ['Lab Komputer A', 'Lab Komputer B', 'Lab Kimia', 'Lab Fisika', 'Lab Biologi'];

  // Initialize dengan tanggal hari ini
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setScheduleForm({
      ...scheduleForm,
      [name]: value
    });
  };

  // Tambah jadwal baru
  const handleAddSchedule = (e) => {
    e.preventDefault();
    
    if (!scheduleForm.subject || !scheduleForm.date || !scheduleForm.startTime || !scheduleForm.endTime) {
      alert('Mata kuliah, tanggal, dan waktu harus diisi!');
      return;
    }

    const newSchedule = {
      id: schedule.length > 0 ? Math.max(...schedule.map(s => s.id)) + 1 : 1,
      subject: scheduleForm.subject,
      class: scheduleForm.class || "TI-XXXX",
      day: scheduleForm.day || getDayName(scheduleForm.date),
      date: scheduleForm.date,
      startTime: scheduleForm.startTime,
      endTime: scheduleForm.endTime,
      room: scheduleForm.room || "R.XXX",
      lab: scheduleForm.lab || "Lab Komputer A",
      type: scheduleForm.type,
      status: new Date(scheduleForm.date) > new Date() ? 'upcoming' : 'completed',
      students: Math.floor(Math.random() * 20) + 15,
      color: getRandomColor(),
      description: scheduleForm.description
    };

    setSchedule([newSchedule, ...schedule]);
    setScheduleForm({
      subject: '',
      class: '',
      day: '',
      date: '',
      startTime: '',
      endTime: '',
      room: '',
      lab: '',
      type: 'Praktikum',
      description: ''
    });
    setShowAddModal(false);
    
    alert('Jadwal berhasil ditambahkan!');
  };

  // Hapus jadwal
  const handleDeleteSchedule = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus jadwal ini?')) {
      setSchedule(schedule.filter(item => item.id !== id));
      alert('Jadwal berhasil dihapus!');
    }
  };

  // Tandai selesai
  const handleMarkComplete = (id) => {
    setSchedule(schedule.map(item => 
      item.id === id ? { ...item, status: 'completed' } : item
    ));
    alert('Jadwal ditandai sebagai selesai!');
  };

  // Filter schedule
  const filteredSchedule = schedule.filter(item => {
    const matchesStatus = filterType === 'all' || item.status === filterType;
    const matchesSubject = filterSubject === 'all' || item.subject === filterSubject;
    
    // Untuk view hari tertentu
    if (viewMode === 'day') {
      const matchesDate = item.date === selectedDate;
      return matchesStatus && matchesSubject && matchesDate;
    }
    
    return matchesStatus && matchesSubject;
  });

  // Get schedule for specific day
  const getScheduleForDay = (day) => {
    return schedule.filter(item => 
      item.day === day && 
      (filterType === 'all' || item.status === filterType) &&
      (filterSubject === 'all' || item.subject === filterSubject)
    );
  };

  // Get day name from date
  const getDayName = (dateString) => {
    const date = new Date(dateString);
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    return days[date.getDay()];
  };

  // Get random color for schedule
  const getRandomColor = () => {
    const colors = ['blue', 'green', 'purple', 'orange', 'red', 'indigo', 'pink', 'teal'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Get color class
  const getColorClass = (color) => {
    const colorMap = {
      blue: 'bg-blue-100 text-blue-800 border-blue-200',
      green: 'bg-green-100 text-green-800 border-green-200',
      purple: 'bg-purple-100 text-purple-800 border-purple-200',
      orange: 'bg-orange-100 text-orange-800 border-orange-200',
      red: 'bg-red-100 text-red-800 border-red-200',
      indigo: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      pink: 'bg-pink-100 text-pink-800 border-pink-200',
      teal: 'bg-teal-100 text-teal-800 border-teal-200'
    };
    return colorMap[color] || colorMap.blue;
  };

  // Get status color
  const getStatusColor = (status) => {
    return status === 'upcoming' 
      ? 'bg-yellow-100 text-yellow-800 border-yellow-200' 
      : 'bg-green-100 text-green-800 border-green-200';
  };

  // Get current week dates
  const getCurrentWeek = () => {
    const today = new Date();
    const firstDay = new Date(today.setDate(today.getDate() - today.getDay() + 1));
    const week = [];
    
    for (let i = 0; i < 5; i++) {
      const date = new Date(firstDay);
      date.setDate(firstDay.getDate() + i);
      week.push({
        date: date.toISOString().split('T')[0],
        day: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'][i],
        dayShort: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum'][i]
      });
    }
    
    return week;
  };

  // Navigate date
  const navigateDate = (direction) => {
    const date = new Date(selectedDate);
    if (direction === 'prev') {
      date.setDate(date.getDate() - 1);
    } else {
      date.setDate(date.getDate() + 1);
    }
    setSelectedDate(date.toISOString().split('T')[0]);
  };

  // Stats
  const stats = {
    total: schedule.length,
    upcoming: schedule.filter(s => s.status === 'upcoming').length,
    completed: schedule.filter(s => s.status === 'completed').length,
    thisWeek: schedule.filter(s => {
      const scheduleDate = new Date(s.date);
      const today = new Date();
      const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      return scheduleDate >= weekStart && scheduleDate <= weekEnd;
    }).length,
    students: schedule.reduce((sum, s) => sum + s.students, 0)
  };

  // Icons
  const IconCalendar = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
    </svg>
  );

  const IconClock = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>
  );

  const IconUsers = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0c-.828 0-1.5.672-1.5 1.5v3.5m0 0h-12m12 0h-12"></path>
    </svg>
  );

  const IconBuilding = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
    </svg>
  );

  const IconCheck = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
    </svg>
  );

  const IconPlus = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
    </svg>
  );

  
  const IconTrash = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
    </svg>
  );

  const IconEye = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
    </svg>
  );

  const IconChevronLeft = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
    </svg>
  );

  const IconChevronRight = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
    </svg>
  );

  // Format date untuk display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const currentWeek = getCurrentWeek();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Jadwal Mengajar Saya</h1>
            <p className=" mt-2">
              {teacherData.name} • {teacherData.department}
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              {teacherData.subjects.map((subject, index) => (
                <span key={index} className="px-3 py-1 bg-green-500 bg-opacity-30 rounded-full text-sm">
                  {subject}
                </span>
              ))}
            </div>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="mt-4 md:mt-0 px-6 py-3 bg-white text-green-600 font-semibold rounded-lg hover:bg-blue-50 transition flex items-center"
          >
            <IconPlus />
            <span className="ml-2">Tambah Jadwal</span>
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <IconCalendar />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Sesi</p>
                <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg mr-3">
                <IconClock />
              </div>
              <div>
                <p className="text-sm text-gray-500">Akan Datang</p>
                <p className="text-2xl font-bold text-gray-800">{stats.upcoming}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg mr-3">
                <IconCheck />
              </div>
              <div>
                <p className="text-sm text-gray-500">Selesai</p>
                <p className="text-2xl font-bold text-gray-800">{stats.completed}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg mr-3">
                <IconCalendar />
              </div>
              <div>
                <p className="text-sm text-gray-500">Minggu Ini</p>
                <p className="text-2xl font-bold text-gray-800">{stats.thisWeek}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-pink-100 rounded-lg mr-3">
                <IconUsers />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Mahasiswa</p>
                <p className="text-2xl font-bold text-gray-800">{stats.students}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between">
            <div className="flex space-x-3 mb-4 lg:mb-0">
              <button 
                className={`px-4 py-2 rounded-lg flex items-center ${viewMode === 'week' ? 'bg-blue-100 text-blue-700 border border-blue-300' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                onClick={() => setViewMode('week')}
              >
                <IconCalendar />
                <span className="ml-2">Mingguan</span>
              </button>
              <button 
                className={`px-4 py-2 rounded-lg flex items-center ${viewMode === 'day' ? 'bg-blue-100 text-blue-700 border border-blue-300' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                onClick={() => setViewMode('day')}
              >
                <IconCalendar />
                <span className="ml-2">Harian</span>
              </button>
              <button 
                className={`px-4 py-2 rounded-lg flex items-center ${viewMode === 'list' ? 'bg-blue-100 text-blue-700 border border-blue-300' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                onClick={() => setViewMode('list')}
              >
                <span className="mr-2">📋</span>
                Daftar
              </button>
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              <div className="flex space-x-3">
                <select 
                  value={filterType} 
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Semua Status</option>
                  <option value="upcoming">Akan Datang</option>
                  <option value="completed">Selesai</option>
                </select>
                
                <select 
                  value={filterSubject} 
                  onChange={(e) => setFilterSubject(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Semua Mata Kuliah</option>
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          {/* Date Navigation untuk Day View */}
          {viewMode === 'day' && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <button 
                  onClick={() => navigateDate('prev')}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <IconChevronLeft />
                </button>
                
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-800">{formatDate(selectedDate)}</h3>
                  <button 
                    onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
                    className="text-sm text-blue-600 hover:text-blue-800 mt-1"
                  >
                    Hari Ini
                  </button>
                </div>
                
                <button 
                  onClick={() => navigateDate('next')}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <IconChevronRight />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Schedule Content */}
        {viewMode === 'week' ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Jadwal Minggu Ini</h2>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {currentWeek.map((dayData, index) => {
                  const daySchedule = getScheduleForDay(dayData.day);
                  const isToday = dayData.date === new Date().toISOString().split('T')[0];
                  
                  return (
                    <div 
                      key={index} 
                      className={`border rounded-lg p-4 ${isToday ? 'border-blue-300 bg-blue-50' : 'border-gray-200'}`}
                    >
                      <div className="flex justify-between items-center mb-3">
                        <div>
                          <div className="font-semibold text-gray-800">{dayData.day}</div>
                          <div className="text-sm text-gray-500">{dayData.date}</div>
                        </div>
                        {daySchedule.length > 0 && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {daySchedule.length}
                          </span>
                        )}
                      </div>
                      
                      <div className="space-y-3">
                        {daySchedule.slice(0, 3).map(session => (
                          <div 
                            key={session.id}
                            className={`p-3 rounded-lg border cursor-pointer ${getColorClass(session.color)}`}
                            onClick={() => {
                              setSelectedSession(session);
                              setShowDetailModal(true);
                            }}
                          >
                            <div className="font-medium text-sm mb-1">{session.subject}</div>
                            <div className="text-xs opacity-75">{session.startTime} - {session.endTime}</div>
                            <div className="text-xs mt-1">{session.room}</div>
                          </div>
                        ))}
                        
                        {daySchedule.length > 3 && (
                          <div className="text-xs text-gray-500 text-center">
                            +{daySchedule.length - 3} sesi lainnya
                          </div>
                        )}
                        
                        {daySchedule.length === 0 && (
                          <div className="text-center py-4 text-gray-400 text-sm">
                            Tidak ada jadwal
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-6 flex flex-wrap gap-3">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">Hari Ini</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-100 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">Ada Jadwal</span>
                </div>
              </div>
            </div>
          </div>
        ) : viewMode === 'day' ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Jadwal Harian</h2>
              <p className="text-gray-600 text-sm mt-1">{formatDate(selectedDate)}</p>
            </div>
            
            {filteredSchedule.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-block p-4 bg-gray-100 rounded-full mb-4">
                  <IconCalendar />
                </div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">Tidak ada jadwal</h3>
                <p className="text-gray-500">Tidak ada jadwal mengajar untuk hari ini.</p>
              </div>
            ) : (
              <div className="p-6">
                <div className="space-y-4">
                  {filteredSchedule
                    .sort((a, b) => a.startTime.localeCompare(b.startTime))
                    .map(session => (
                      <div 
                        key={session.id} 
                        className={`p-4 rounded-lg border ${getColorClass(session.color)} hover:shadow-md transition cursor-pointer`}
                        onClick={() => {
                          setSelectedSession(session);
                          setShowDetailModal(true);
                        }}
                      >
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <span className={`px-2 py-1 text-xs rounded mr-2 ${getStatusColor(session.status)}`}>
                                {session.status === 'upcoming' ? 'Akan Datang' : 'Selesai'}
                              </span>
                              <span className="px-2 py-1 text-xs bg-white bg-opacity-50 rounded">
                                {session.type}
                              </span>
                            </div>
                            
                            <h3 className="text-lg font-semibold mb-2">{session.subject}</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                              <div className="flex items-center">
                                <IconClock className="mr-2" />
                                <span>{session.startTime} - {session.endTime}</span>
                              </div>
                              <div className="flex items-center">
                                <IconBuilding className="mr-2" />
                                <span>{session.room} • {session.lab}</span>
                              </div>
                              <div className="flex items-center">
                                <IconUsers className="mr-2" />
                                <span>Kelas {session.class} • {session.students} mahasiswa</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-4 lg:mt-0 lg:ml-4 flex space-x-2">
                            {session.status === 'upcoming' && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMarkComplete(session.id);
                                }}
                                className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                              >
                                Tandai Selesai
                              </button>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteSchedule(session.id);
                              }}
                              className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                            >
                              Hapus
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* List View */
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800">Daftar Semua Jadwal</h2>
                <span className="text-sm text-gray-500">
                  {filteredSchedule.length} dari {schedule.length} jadwal
                </span>
              </div>
            </div>
            
            {filteredSchedule.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-block p-4 bg-gray-100 rounded-full mb-4">
                  <IconCalendar />
                </div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">Tidak ada jadwal</h3>
                <p className="text-gray-500">
                  {filterType !== 'all' || filterSubject !== 'all' 
                    ? 'Tidak ada jadwal yang sesuai dengan filter' 
                    : 'Belum ada jadwal yang ditambahkan'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hari/Tanggal</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mata Kuliah & Waktu</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lokasi & Kelas</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredSchedule
                      .sort((a, b) => new Date(b.date) - new Date(a.date))
                      .map(session => (
                        <tr key={session.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{session.day}</div>
                            <div className="text-sm text-gray-500">{session.date}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <div className="text-sm font-semibold text-gray-900">{session.subject}</div>
                              <div className="text-sm text-gray-700">
                                {session.startTime} - {session.endTime}
                              </div>
                              <div className="text-xs text-gray-500 mt-1">{session.type}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{session.room}</div>
                              <div className="text-sm text-gray-700">{session.lab}</div>
                              <div className="text-sm text-gray-500">Kelas {session.class}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                              {session.status === 'upcoming' ? 'Akan Datang' : 'Selesai'}
                            </span>
                            <div className="text-xs text-gray-500 mt-1">{session.students} mahasiswa</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => {
                                  setSelectedSession(session);
                                  setShowDetailModal(true);
                                }}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                title="Lihat Detail"
                              >
                                <IconEye />
                              </button>
                              {session.status === 'upcoming' && (
                                <button
                                  onClick={() => handleMarkComplete(session.id)}
                                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                                  title="Tandai Selesai"
                                >
                                  <IconCheck />
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteSchedule(session.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                title="Hapus"
                              >
                                <IconTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Upcoming Events */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">📅 Jadwal Akan Datang</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {schedule
              .filter(s => s.status === 'upcoming')
              .slice(0, 3)
              .map(session => (
                <div 
                  key={session.id}
                  className={`p-4 rounded-lg border cursor-pointer ${getColorClass(session.color)} hover:shadow-md transition`}
                  onClick={() => {
                    setSelectedSession(session);
                    setShowDetailModal(true);
                  }}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="font-semibold text-lg">{session.subject}</div>
                      <div className="text-sm text-gray-700">{session.class}</div>
                    </div>
                    <span className="px-2 py-1 text-xs bg-white bg-opacity-50 rounded">
                      {session.type}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <IconCalendar className="mr-2" />
                      <span>{session.day}, {session.date}</span>
                    </div>
                    <div className="flex items-center">
                      <IconClock className="mr-2" />
                      <span>{session.startTime} - {session.endTime}</span>
                    </div>
                    <div className="flex items-center">
                      <IconBuilding className="mr-2" />
                      <span>{session.room}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-xs text-gray-600">{session.students} mahasiswa</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMarkComplete(session.id);
                      }}
                      className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                    >
                      Tandai Selesai
                    </button>
                  </div>
                </div>
              ))}
          </div>
          
          {schedule.filter(s => s.status === 'upcoming').length === 0 && (
            <div className="text-center py-6 text-gray-500">
              Tidak ada jadwal yang akan datang
            </div>
          )}
        </div>
      </div>

      {/* Add Schedule Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-800">Tambah Jadwal Baru</h3>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
            </div>
            
            <form onSubmit={handleAddSchedule}>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mata Kuliah *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={scheduleForm.subject}
                      onChange={handleInputChange}
                      placeholder="Nama mata kuliah"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Kelas
                    </label>
                    <input
                      type="text"
                      name="class"
                      value={scheduleForm.class}
                      onChange={handleInputChange}
                      placeholder="Contoh: TI-2021-A"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tanggal *
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={scheduleForm.date}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hari
                    </label>
                    <select
                      name="day"
                      value={scheduleForm.day}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Pilih hari</option>
                      {days.map(day => (
                        <option key={day} value={day}>{day}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Waktu Mulai *
                    </label>
                    <input
                      type="time"
                      name="startTime"
                      value={scheduleForm.startTime}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Waktu Selesai *
                    </label>
                    <input
                      type="time"
                      name="endTime"
                      value={scheduleForm.endTime}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ruangan
                    </label>
                    <input
                      type="text"
                      name="room"
                      value={scheduleForm.room}
                      onChange={handleInputChange}
                      placeholder="Contoh: R.301"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Laboratorium
                    </label>
                    <select
                      name="lab"
                      value={scheduleForm.lab}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Pilih lab</option>
                      {labs.map(lab => (
                        <option key={lab} value={lab}>{lab}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipe Sesi
                    </label>
                    <select
                      name="type"
                      value={scheduleForm.type}
                      onChange={handleInputChange}
                      className="w-full px-4 py 3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {types.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Deskripsi (Opsional)
                    </label>
                    <textarea
                      name="description"
                      value={scheduleForm.description}
                      onChange={handleInputChange}
                      placeholder="Catatan tambahan tentang sesi ini..."
                      rows="3"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    ></textarea>
                  </div>
                </div>
                
                <div className="mt-8 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition"
                  >
                    Simpan Jadwal
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Schedule Detail Modal */}
      {showDetailModal && selectedSession && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-indigo-600">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold text-white">Detail Jadwal</h3>
                  <p className="text-blue-100 text-sm">{selectedSession.subject}</p>
                </div>
                <button 
                  onClick={() => setShowDetailModal(false)}
                  className="text-white hover:text-blue-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-gray-800">{selectedSession.subject}</h4>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedSession.status)}`}>
                    {selectedSession.status === 'upcoming' ? 'Akan Datang' : 'Selesai'}
                  </span>
                </div>
                
                <div className={`p-4 rounded-lg ${getColorClass(selectedSession.color)}`}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-600">Kelas</div>
                      <div className="font-medium">{selectedSession.class}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Tipe</div>
                      <div className="font-medium">{selectedSession.type}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Tanggal</div>
                      <div className="font-medium">{selectedSession.day}, {selectedSession.date}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Waktu</div>
                      <div className="font-medium">{selectedSession.startTime} - {selectedSession.endTime}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Ruangan</div>
                      <div className="font-medium">{selectedSession.room}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Laboratorium</div>
                      <div className="font-medium">{selectedSession.lab}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Jumlah Mahasiswa</div>
                      <div className="font-medium">{selectedSession.students} orang</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Durasi</div>
                      <div className="font-medium">
                        {(() => {
                          const [sh, sm] = selectedSession.startTime.split(':').map(Number);
                          const [eh, em] = selectedSession.endTime.split(':').map(Number);
                          const duration = (eh * 60 + em) - (sh * 60 + sm);
                          return `${Math.floor(duration / 60)} jam ${duration % 60} menit`;
                        })()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">AKSI</h4>
                <div className="flex flex-wrap gap-3">
                  {selectedSession.status === 'upcoming' && (
                    <button
                      onClick={() => {
                        handleMarkComplete(selectedSession.id);
                        setShowDetailModal(false);
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center"
                    >
                      <IconCheck />
                      <span className="ml-2">Tandai Selesai</span>
                    </button>
                  )}
                  
                  <button
                    onClick={() => {
                      if (window.confirm('Apakah Anda yakin ingin menghapus jadwal ini?')) {
                        handleDeleteSchedule(selectedSession.id);
                        setShowDetailModal(false);
                      }
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center"
                  >
                    <IconTrash />
                    <span className="ml-2">Hapus Jadwal</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(JSON.stringify(selectedSession, null, 2));
                      alert('Detail jadwal disalin ke clipboard!');
                    }}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path>
                    </svg>
                    Salin Detail
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MySchedule;