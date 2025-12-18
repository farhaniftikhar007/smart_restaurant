import React from 'react';
import { NavLink } from 'react-router-dom';

const AdminSidebar: React.FC = () => {
  const menuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/admin/menu', label: 'Menu', icon: '🍽️' },
    { path: '/admin/orders', label: 'Orders', icon: '📝' },
    { path: '/admin/tables', label: 'Tables', icon: '🪑' },
    { path: '/admin/reservations', label: 'Reservations', icon: '📅' },
    { path: '/admin/staff', label: 'Staff', icon: '👥' },
    { path: '/admin/payments', label: 'Payments', icon: '💰' },
    { path: '/admin/feedback', label: 'Feedback', icon: '💬' },
    { path: '/admin/reports', label: 'Reports', icon: '📈' },
    { path: '/admin/settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <div className="w-64 bg-white shadow-lg h-screen">
      <div className="p-4">
        <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
      </div>
      <nav className="mt-4">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 ${
                isActive ? 'bg-blue-50 text-blue-600' : ''
              }`
            }
          >
            <span className="mr-3">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default AdminSidebar; 