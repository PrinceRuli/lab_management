import React, { useState, useEffect } from 'react';

const TeachingSchedule = ({ user }) => {
  const [loading, setLoading] = useState(true);
  const [scheduleData, setScheduleData] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('week'); // 'day', 'week', 'month'

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setScheduleData({
        weeklySchedule: [
          {
            id: 1,
            day: 'Monday',
            date: '2024-01-15',
            classes: [
              {
                id: 101,
                time: '08:00 - 10:00',
                subject: 'Programming Fundamentals',
                lab: 'Computer Lab 1',
                type: 'lecture',
                status: 'confirmed',
                students: 28,
                color: 'bg-blue-100 border-blue-200'
              },
              {
                id: 102,
                time: '13:00 - 15:00',
                subject: 'Web Development',
                lab: 'Multimedia Lab',
                type: 'lab',
                status: 'confirmed',
                students: 24,
                color: 'bg-green-100 border-green-200'
              }
            ]
          },
          {
            id: 2,
            day: 'Tuesday',
            date: '2024-01-16',
            classes: [
              {
                id: 103,
                time: '09:00 - 11:00',
                subject: 'Database Systems',
                lab: 'Computer Lab 2',
                type: 'lecture',
                status: 'confirmed',
                students: 30,
                color: 'bg-purple-100 border-purple-200'
              }
            ]
          },
          {
            id: 3,
            day: 'Wednesday',
            date: '2024-01-17',
            classes: [
              {
                id: 104,
                time: '10:00 - 12:00',
                subject: 'Mobile Programming',
                lab: 'Computer Lab 1',
                type: 'lab',
                status: 'confirmed',
                students: 22,
                color: 'bg-orange-100 border-orange-200'
              },
              {
                id: 105,
                time: '14:00 - 16:00',
                subject: 'Student Consultation',
                lab: 'Office',
                type: 'meeting',
                status: 'confirmed',
                students: 0,
                color: 'bg-gray-100 border-gray-200'
              }
            ]
          },
          {
            id: 4,
            day: 'Thursday',
            date: '2024-01-18',
            classes: [
              {
                id: 106,
                time: '11:00 - 13:00',
                subject: 'Software Engineering',
                lab: 'Computer Lab 2',
                type: 'lecture',
                status: 'confirmed',
                students: 26,
                color: 'bg-indigo-100 border-indigo-200'
              }
            ]
          },
          {
            id: 5,
            day: 'Friday',
            date: '2024-01-19',
            classes: [
              {
                id: 107,
                time: '08:00 - 10:00',
                subject: 'Programming Fundamentals',
                lab: 'Computer Lab 1',
                type: 'lecture',
                status: 'confirmed',
                students: 28,
                color: 'bg-blue-100 border-blue-200'
              },
              {
                id: 108,
                time: '13:00 - 15:00',
                subject: 'Project Supervision',
                lab: 'Conference Room',
                type: 'meeting',
                status: 'confirmed',
                students: 0,
                color: 'bg-pink-100 border-pink-200'
              }
            ]
          }
        ],
        upcomingClasses: [
          {
            id: 109,
            date: '2024-01-22',
            time: '09:00 - 11:00',
            subject: 'Advanced Programming',
            lab: 'Computer Lab 1',
            type: 'lecture',
            status: 'confirmed'
          },
          {
            id: 110,
            date: '2024-01-23',
            time: '14:00 - 16:00',
            subject: 'Database Lab',
            lab: 'Computer Lab 2',
            type: 'lab',
            status: 'confirmed'
          }
        ],
        statistics: {
          totalClasses: 15,
          teachingHours: 30,
          studentsThisWeek: 150,
          labsUsed: 3
        }
      });
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const getDayClassCount = (day) => {
    const daySchedule = scheduleData.weeklySchedule?.find(d => d.day === day);
    return daySchedule?.classes?.length || 0;
  };

  const getTotalTeachingHours = () => {
    if (!scheduleData.weeklySchedule) return 0;
    let totalHours = 0;
    scheduleData.weeklySchedule.forEach(day => {
      day.classes?.forEach(classItem => {
        const [start, end] = classItem.time.split(' - ');
        const startHour = parseInt(start.split(':')[0]);
        const endHour = parseInt(end.split(':')[0]);
        totalHours += (endHour - startHour);
      });
    });
    return totalHours;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-20 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="lg:col-span-2 space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Teaching Schedule</h1>
            <p className="text-gray-600">Manage and view your teaching timetable</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex bg-gray-100 rounded-lg p-1">
              {['day', 'week', 'month'].map(mode => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-4 py-2 rounded-md text-sm font-medium capitalize transition-colors ${
                    viewMode === mode
                      ? 'bg-white text-cyan-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
            <button className="btn-primary">
              Export Schedule
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Total Classes</p>
                <p className="text-2xl font-bold text-blue-900">{scheduleData.statistics?.totalClasses || 0}</p>
              </div>
              <div className="text-blue-500 text-xl">📚</div>
            </div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 border border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Teaching Hours</p>
                <p className="text-2xl font-bold text-green-900">{getTotalTeachingHours()}h</p>
              </div>
              <div className="text-green-500 text-xl">⏱️</div>
            </div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">Students This Week</p>
                <p className="text-2xl font-bold text-purple-900">{scheduleData.statistics?.studentsThisWeek || 0}</p>
              </div>
              <div className="text-purple-500 text-xl">👥</div>
            </div>
          </div>
          <div className="bg-orange-50 rounded-lg p-4 border border-orange-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 font-medium">Labs Used</p>
                <p className="text-2xl font-bold text-orange-900">{scheduleData.statistics?.labsUsed || 0}</p>
              </div>
              <div className="text-orange-500 text-xl">🔬</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Schedule */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Weekly Schedule</h3>
            <span className="text-sm text-gray-500">This Week</span>
          </div>

          <div className="space-y-4">
            {scheduleData.weeklySchedule?.map(daySchedule => (
              <div key={daySchedule.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <h4 className="font-semibold text-gray-900">{daySchedule.day}</h4>
                    <span className="text-sm text-gray-500">{daySchedule.date}</span>
                  </div>
                  <span className="bg-cyan-100 text-cyan-800 px-3 py-1 rounded-full text-sm font-medium">
                    {daySchedule.classes.length} classes
                  </span>
                </div>

                <div className="space-y-3">
                  {daySchedule.classes.map(classItem => (
                    <div
                      key={classItem.id}
                      className={`p-4 rounded-lg border ${classItem.color} transition-all hover:shadow-sm`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border">
                            <span className="text-lg">
                              {classItem.type === 'lecture' ? '📖' : 
                               classItem.type === 'lab' ? '💻' : '💬'}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{classItem.time}</p>
                            <p className="text-sm text-gray-600">{classItem.subject}</p>
                            <p className="text-xs text-cyan-600">{classItem.lab}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium mb-2">
                            {classItem.status}
                          </span>
                          {classItem.students > 0 && (
                            <p className="text-sm text-gray-600">{classItem.students} students</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {daySchedule.classes.length === 0 && (
                  <div className="text-center py-6 text-gray-500">
                    No classes scheduled for {daySchedule.day}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar - Upcoming & Quick Actions */}
        <div className="space-y-6">
          {/* Upcoming Classes */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Classes</h3>
            <div className="space-y-3">
              {scheduleData.upcomingClasses?.map(classItem => (
                <div key={classItem.id} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-cyan-100 rounded flex items-center justify-center">
                      <span className="text-cyan-600 text-sm">📅</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">{classItem.subject}</p>
                      <p className="text-xs text-gray-600">{classItem.date} | {classItem.time}</p>
                      <p className="text-xs text-cyan-600">{classItem.lab}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
                  <span className="text-green-600">➕</span>
                </div>
                <span className="font-medium text-gray-900">Add New Class</span>
              </button>
              <button className="w-full flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                  <span className="text-blue-600">📋</span>
                </div>
                <span className="font-medium text-gray-900">Generate Report</span>
              </button>
              <button className="w-full flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                <div className="w-8 h-8 bg-purple-100 rounded flex items-center justify-center">
                  <span className="text-purple-600">🔄</span>
                </div>
                <span className="font-medium text-gray-900">Reschedule Class</span>
              </button>
            </div>
          </div>

          {/* Teaching Stats */}
          <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-xl p-6 text-white">
            <h3 className="font-semibold mb-4">Teaching Statistics</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>Weekly Hours</span>
                <span className="font-bold">{getTotalTeachingHours()}h</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Active Classes</span>
                <span className="font-bold">{scheduleData.weeklySchedule?.reduce((acc, day) => acc + day.classes.length, 0) || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Different Labs</span>
                <span className="font-bold">{scheduleData.statistics?.labsUsed || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeachingSchedule;