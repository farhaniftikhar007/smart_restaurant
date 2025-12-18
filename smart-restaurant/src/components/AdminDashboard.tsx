import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircleIcon, XCircleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

interface TableStatus {
  tableNumber: number;
  isPaid: boolean;
  lastUpdated: string;
}

const AdminDashboard: React.FC = () => {
  const [tables, setTables] = useState<TableStatus[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Generate table data
  useEffect(() => {
    const generateTableData = () => {
      const tableData: TableStatus[] = [];
      for (let i = 1; i <= 10; i++) {
        const isPaid = localStorage.getItem(`table${i}Paid`) === 'true';
        const lastUpdated = localStorage.getItem(`table${i}LastUpdated`) || new Date().toISOString();
        tableData.push({
          tableNumber: i,
          isPaid,
          lastUpdated,
        });
      }
      setTables(tableData);
    };

    generateTableData();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate refresh delay
    setTimeout(() => {
      const tableData: TableStatus[] = [];
      for (let i = 1; i <= 10; i++) {
        const isPaid = localStorage.getItem(`table${i}Paid`) === 'true';
        const lastUpdated = localStorage.getItem(`table${i}LastUpdated`) || new Date().toISOString();
        tableData.push({
          tableNumber: i,
          isPaid,
          lastUpdated,
        });
      }
      setTables(tableData);
      setIsRefreshing(false);
    }, 1000);
  };

  const handleResetTable = (tableNumber: number) => {
    localStorage.removeItem(`table${tableNumber}Paid`);
    localStorage.removeItem(`table${tableNumber}LastUpdated`);
    setTables(tables.map(table => 
      table.tableNumber === tableNumber 
        ? { ...table, isPaid: false, lastUpdated: new Date().toISOString() }
        : table
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900">
              Payment Status Dashboard
            </h1>
            <p className="mt-2 text-lg text-gray-500">
              Monitor table payment statuses in real-time
            </p>
          </div>
          <button
            onClick={handleRefresh}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            <ArrowPathIcon className={`h-5 w-5 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        <div className="mt-8">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50 border-b">
              <div className="font-semibold text-gray-900">Table Number</div>
              <div className="font-semibold text-gray-900">Status</div>
              <div className="font-semibold text-gray-900">Last Updated</div>
              <div className="font-semibold text-gray-900">Actions</div>
            </div>
            <div className="divide-y divide-gray-200">
              {tables.map((table) => (
                <motion.div
                  key={table.tableNumber}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-4 gap-4 p-4 items-center"
                >
                  <div className="font-medium text-gray-900">
                    Table #{table.tableNumber}
                  </div>
                  <div>
                    {table.isPaid ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircleIcon className="h-4 w-4 mr-1" />
                        Paid
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <XCircleIcon className="h-4 w-4 mr-1" />
                        Not Paid
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(table.lastUpdated).toLocaleString()}
                  </div>
                  <div>
                    <button
                      onClick={() => handleResetTable(table.tableNumber)}
                      className="text-sm text-orange-600 hover:text-orange-900"
                    >
                      Reset Status
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckCircleIcon className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Paid Tables
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {tables.filter(t => t.isPaid).length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <XCircleIcon className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Pending Payments
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {tables.filter(t => !t.isPaid).length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ArrowPathIcon className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Last Updated
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {new Date().toLocaleTimeString()}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 