import React, { useState, useEffect } from 'react';
import {
  ClipboardDocumentListIcon,
  ShoppingBagIcon,
  CalendarIcon,
  TableCellsIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config/api';
import axios from 'axios';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  todayRevenue: number;
  totalRevenue: number;
  activeReservations: number;
}

interface SalesTrend {
  date: string;
  amount: number;
}

interface TopSellingItem {
  name: string;
  value: number;
}

const CompleteAdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    pendingOrders: 0,
    todayRevenue: 0,
    totalRevenue: 0,
    activeReservations: 0
  });
  const [salesTrends, setSalesTrends] = useState<SalesTrend[]>([]);
  const [topSelling, setTopSelling] = useState<TopSellingItem[]>([]);
  const [leastSelling, setLeastSelling] = useState<TopSellingItem[]>([]);
  const [peakHours, setPeakHours] = useState<{ hour: number, count: number }[]>([]);
  const [aiInsights, setAiInsights] = useState<{ type: string, message: string }[]>([]);

  useEffect(() => {
    fetchDashboardStats();
    const intervalId = setInterval(fetchDashboardStats, 5000); // Poll every 5 seconds
    return () => clearInterval(intervalId);
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('token');

      // Fetch orders
      // Fetch orders (Request large limit to get accurate total count)
      const ordersRes = await axios.get(`${API_BASE_URL}/api/orders?limit=1000`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Fetch reservations
      const reservationsRes = await axios.get(`${API_BASE_URL}/api/reservations/`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Fetch Analytics
      try {
        const salesRes = await axios.get(`${API_BASE_URL}/api/analytics/sales-trends`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const topRes = await axios.get(`${API_BASE_URL}/api/analytics/top-selling`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const leastRes = await axios.get(`${API_BASE_URL}/api/analytics/least-selling`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const peakRes = await axios.get(`${API_BASE_URL}/api/analytics/peak-hours`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const insightsRes = await axios.get(`${API_BASE_URL}/api/analytics/insights`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setSalesTrends(salesRes.data || []);
        setTopSelling(topRes.data || []);
        setLeastSelling(leastRes.data || []);
        setPeakHours(peakRes.data || []);
        setAiInsights(insightsRes.data || []);
      } catch (err) {
        console.error("Error fetching analytics", err);
      }

      const orders = ordersRes.data || [];
      const reservations = reservationsRes.data || [];

      // Calculate stats
      const totalOrders = orders.length;
      const pendingOrders = orders.filter((o: any) => o.status === 'pending').length;
      const todayRevenue = orders
        .filter((o: any) => {
          const orderDate = new Date(o.created_at).toDateString();
          const today = new Date().toDateString();
          return orderDate === today;
        })
        .reduce((sum: number, o: any) => sum + parseFloat(o.total_amount || 0), 0);

      const totalRevenue = orders.reduce((sum: number, o: any) => sum + parseFloat(o.total_amount || 0), 0);

      const activeReservations = reservations.filter((r: any) =>
        r.status === 'pending' || r.status === 'confirmed'
      ).length;

      setStats({
        totalOrders,
        pendingOrders,
        todayRevenue,
        totalRevenue,
        activeReservations
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      // Keep default values on error
      setStats({
        totalOrders: 0,
        pendingOrders: 0,
        todayRevenue: 0,
        totalRevenue: 0,
        activeReservations: 0
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/auth');
  };

  const menuItems = [
    {
      title: 'Orders Management',
      description: 'View and manage all orders',
      icon: ClipboardDocumentListIcon,
      color: 'bg-blue-500',
      path: '/admin/orders',  // Changed path
      stat: stats.pendingOrders,
      statLabel: 'Pending'
    },
    {
      title: 'Menu Management',
      description: 'Add, edit, and remove menu items',
      icon: ShoppingBagIcon,
      color: 'bg-green-500',
      path: '/admin/menu',
      stat: null,
      statLabel: null
    },
    {
      title: 'Tables Management',
      description: 'Manage restaurant tables',
      icon: TableCellsIcon,
      color: 'bg-purple-500',
      path: '/admin/tables',
      stat: null,
      statLabel: null
    },
    {
      title: 'Reservations',
      description: 'View and manage reservations',
      icon: CalendarIcon,
      color: 'bg-yellow-500',
      path: '/admin/reservations',  // Changed path
      stat: stats.activeReservations,
      statLabel: 'Active'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="mt-1 text-sm text-gray-500">Welcome back! Manage your restaurant</p>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                <ClipboardDocumentListIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5">
                <dt className="text-sm font-medium text-gray-500">Total Orders</dt>
                <dd className="text-2xl font-semibold text-gray-900">{stats.totalOrders}</dd>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-orange-500 rounded-md p-3">
                <ClipboardDocumentListIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5">
                <dt className="text-sm font-medium text-gray-500">Pending Orders</dt>
                <dd className="text-2xl font-semibold text-gray-900">{stats.pendingOrders}</dd>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                <ShoppingBagIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5">
                <dt className="text-sm font-medium text-gray-500">Total Revenue</dt>
                <dd className="text-2xl font-semibold text-gray-900">Rs. {stats.totalRevenue.toFixed(2)}</dd>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                <CalendarIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5">
                <dt className="text-sm font-medium text-gray-500">Reservations</dt>
                <dd className="text-2xl font-semibold text-gray-900">{stats.activeReservations}</dd>
              </div>
            </div>
          </div>
        </div>

        {/* AI Analytics Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span>🤖</span> AI Insights & Analytics
          </h2>

          {/* Textual Insights */}
          <div className="grid grid-cols-1 gap-4 mb-6">
            {aiInsights.map((insight, idx) => (
              <div key={idx} className={`p-4 rounded-lg border-l-4 shadow-sm ${insight.type === 'warning' ? 'bg-red-50 border-red-500 text-red-700' :
                insight.type === 'success' ? 'bg-green-50 border-green-500 text-green-700' :
                  'bg-blue-50 border-blue-500 text-blue-700'
                }`}>
                <div className="flex items-start">
                  <div className="ml-3">
                    <p className="text-sm font-medium">{insight.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white p-5 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4 text-gray-700">Sales Trends (Last 30 Days)</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={salesTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="amount" stroke="#4F46E5" strokeWidth={2} name="Revenue (PKR)" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-5 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4 text-gray-700">Top Selling Items</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topSelling}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#F97316" name="Quantity Sold" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-5 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4 text-gray-700">⚠️ Least Selling Items (Action Needed)</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={leastSelling} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#EF4444" name="Quantity Sold" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-5 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4 text-gray-700">⏰ Peak Business Hours</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={peakHours}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#8B5CF6" name="Orders Count" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Management</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {menuItems.map((item, index) => (
              <div
                key={index}
                onClick={() => navigate(item.path)}
                className="bg-white overflow-hidden shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`${item.color} rounded-lg p-3`}>
                    <item.icon className="h-8 w-8 text-white" />
                  </div>
                  {item.stat && (
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">{item.stat}</p>
                      <p className="text-xs text-gray-500">{item.statLabel}</p>
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                <p className="mt-2 text-sm text-gray-500">{item.description}</p>
                <div className="mt-4">
                  <span className="text-orange-600 text-sm font-medium hover:text-orange-700">
                    Go to {item.title} →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompleteAdminDashboard;
