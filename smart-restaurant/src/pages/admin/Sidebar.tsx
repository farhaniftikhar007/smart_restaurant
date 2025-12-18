import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  ClipboardDocumentListIcon,
  ShoppingCartIcon,
  TableCellsIcon,
  CalendarIcon,
  UserGroupIcon,
  CreditCardIcon,
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';

const menuItems = [
  { path: '/admin/menu', icon: ClipboardDocumentListIcon, label: 'Menu' },
  { path: '/admin/orders', icon: ShoppingCartIcon, label: 'Orders' },
  { path: '/admin/tables', icon: TableCellsIcon, label: 'Tables' },
  { path: '/admin/reservations', icon: CalendarIcon, label: 'Reservations' },
  { path: '/admin/staff', icon: UserGroupIcon, label: 'Staff' },
  { path: '/admin/payments', icon: CreditCardIcon, label: 'Payments' },
  { path: '/admin/feedback', icon: ChatBubbleLeftRightIcon, label: 'Feedback' },
  { path: '/admin/reports', icon: ChartBarIcon, label: 'Reports' },
  { path: '/admin/settings', icon: Cog6ToothIcon, label: 'Settings' },
];

const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-gray-800 text-white h-screen">
      <div className="p-4">
        <h1 className="text-2xl font-bold text-orange-500">Admin Panel</h1>
      </div>
      <nav className="mt-8">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors ${
                isActive ? 'bg-gray-700 text-white' : ''
              }`
            }
          >
            <item.icon className="w-6 h-6 mr-3" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar; 