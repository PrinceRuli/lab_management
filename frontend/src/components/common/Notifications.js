import React, { useEffect, useState, useRef } from 'react';

const STORAGE_KEY = 'notifications';

const loadNotifications = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

const saveNotifications = (list) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
};

const Notifications = ({ trigger, small }) => {
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState(loadNotifications());
  const ref = useRef();

  useEffect(() => {
    const onNew = (e) => {
      const payload = e.detail;
      const updated = [payload, ...loadNotifications()];
      saveNotifications(updated);
      setNotes(updated);
    };
    window.addEventListener('new-notification', onNew);
    const onStorage = (e) => {
      if (e.key === STORAGE_KEY) setNotes(loadNotifications());
    };
    window.addEventListener('storage', onStorage);

    const handleClickOutside = (ev) => {
      if (ref.current && !ref.current.contains(ev.target)) setOpen(false);
    };
    document.addEventListener('click', handleClickOutside);

    return () => {
      window.removeEventListener('new-notification', onNew);
      window.removeEventListener('storage', onStorage);
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const markRead = (id) => {
    const updated = notes.map(n => n.id === id ? { ...n, read: true } : n);
    saveNotifications(updated);
    setNotes(updated);
  };

  const clearAll = () => {
    saveNotifications([]);
    setNotes([]);
  };

  const unreadCount = notes.filter(n => !n.read).length;

  return (
    <div className="relative" ref={ref}>
      <button onClick={(e) => { e.stopPropagation(); setOpen(!open); }} className="relative p-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100">
        {trigger}
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center h-4 w-4 rounded-full bg-red-500 text-white text-xs">{unreadCount}</span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="px-4 py-2 border-b flex items-center justify-between">
            <strong>Notifications</strong>
            <div className="text-sm text-gray-500">{notes.length} total</div>
          </div>
          <div className="max-h-64 overflow-auto">
            {notes.length === 0 && (
              <div className="p-4 text-sm text-gray-500">No notifications</div>
            )}
            {notes.map(n => (
              <div key={n.id} className={`p-3 border-b hover:bg-gray-50 ${n.read ? 'bg-gray-50' : ''}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-800">{n.title}</div>
                    <div className="text-xs text-gray-500">{n.body}</div>
                  </div>
                  <div className="ml-2 text-right">
                    <div className="text-xs text-gray-400">{n.date}</div>
                    {!n.read && (
                      <button onClick={() => markRead(n.id)} className="text-xs text-blue-600 mt-1">Mark</button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="px-3 py-2 flex items-center justify-between">
            <button onClick={clearAll} className="text-sm text-red-600">Clear</button>
            <button onClick={() => {
              const sample = { id: Date.now(), title: 'Sample notification', body: 'This is a test', date: new Date().toLocaleString(), read: false };
              const updated = [sample, ...notes];
              saveNotifications(updated);
              setNotes(updated);
            }} className="text-sm text-gray-600">Add sample</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;
