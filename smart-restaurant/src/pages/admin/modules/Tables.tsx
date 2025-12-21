import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { PlusIcon, TrashIcon, QrCodeIcon, PrinterIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface Table {
  id: number;
  number: string;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved';
  qrCode: string;
}

const Tables = () => {
  const [baseUrl, setBaseUrl] = useState('');
  const [tables, setTables] = useState<Table[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [newTable, setNewTable] = useState({
    number: '',
    capacity: 2
  });

  // Get the network URL on component mount
  useEffect(() => {
    // Try to get the IP from window location
    // If accessed via IP (like 192.168.x.x), use that
    // Otherwise use localhost
    const hostname = window.location.hostname;
    const port = window.location.port || '3000';
    const url = `http://${hostname}:${port}`;
    setBaseUrl(url);

    // Initialize tables with the URL
    setTables([
      { id: 1, number: '1', capacity: 4, status: 'available', qrCode: `${url}/guest-order?table=1` },
      { id: 2, number: '2', capacity: 2, status: 'occupied', qrCode: `${url}/guest-order?table=2` },
      { id: 3, number: '3', capacity: 6, status: 'available', qrCode: `${url}/guest-order?table=3` },
    ]);
  }, []);

  const handleAddTable = () => {
    if (!newTable.number) {
      alert('Please enter table number');
      return;
    }

    const table: Table = {
      id: tables.length + 1,
      number: newTable.number,
      capacity: newTable.capacity,
      status: 'available',
      qrCode: `${baseUrl}/guest-order?table=${newTable.number}`
    };

    setTables([...tables, table]);
    setNewTable({ number: '', capacity: 2 });
    setShowAddModal(false);
    alert('Table added successfully!');
  };

  const handleDeleteTable = (id: number) => {
    if (window.confirm('Are you sure you want to delete this table?')) {
      setTables(tables.filter(t => t.id !== id));
    }
  };

  const handleViewQR = (table: Table) => {
    setSelectedTable(table);
    setShowQRModal(true);
  };

  const handlePrint = (table: Table) => {
    const printWindow = window.open('', '', 'width=600,height=600');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Table ${table.number} QR Code</title>
            <style>
              body {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 100vh;
                margin: 0;
                font-family: Arial, sans-serif;
              }
              h1 { margin-bottom: 20px; }
              .qr-container { text-align: center; }
              .url { margin-top: 20px; font-size: 12px; color: #666; }
            </style>
          </head>
          <body>
            <h1>Table ${table.number}</h1>
            <div class="qr-container">
              <div id="qr"></div>
              <p class="url">Scan to order</p>
              <p class="url">${table.qrCode}</p>
            </div>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
            <script>
              new QRCode(document.getElementById("qr"), {
                text: "${table.qrCode}",
                width: 256,
                height: 256
              });
              setTimeout(() => window.print(), 500);
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'occupied': return 'bg-red-100 text-red-800';
      case 'reserved': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Table Management</h1>
          <p className="text-sm text-gray-600 mt-1">
            Current URL: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{baseUrl}</span>
          </p>
          <p className="text-xs text-gray-500 mt-1">
            💡 Access via this URL from any device on the same network
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
        >
          <PlusIcon className="h-5 w-5" />
          Add Table
        </button>
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tables.map(table => (
          <div key={table.id} className="bg-white rounded-lg shadow p-6 border-2 border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold">Table {table.number}</h3>
                <p className="text-gray-600">Capacity: {table.capacity} people</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(table.status)}`}>
                {table.status}
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleViewQR(table)}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                <QrCodeIcon className="h-5 w-5" />
                View QR
              </button>
              <button
                onClick={() => handlePrint(table)}
                className="flex-1 flex items-center justify-center gap-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                <PrinterIcon className="h-5 w-5" />
                Print
              </button>
              <button
                onClick={() => handleDeleteTable(table.id)}
                className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Table Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Table</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Table Number
                </label>
                <input
                  type="text"
                  value={newTable.number}
                  onChange={(e) => setNewTable({ ...newTable, number: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  placeholder="e.g., 4"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Capacity
                </label>
                <input
                  type="number"
                  value={newTable.capacity}
                  onChange={(e) => setNewTable({ ...newTable, capacity: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  min="1"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleAddTable}
                className="flex-1 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
              >
                Add Table
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {showQRModal && selectedTable && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Table {selectedTable.number} QR Code</h2>
              <button
                onClick={() => setShowQRModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
                <QRCodeSVG value={selectedTable.qrCode} size={256} />
              </div>
              <p className="text-sm text-gray-600 mt-4 text-center">
                Scan this QR code to view menu for Table {selectedTable.number}
              </p>
              <p className="text-xs text-gray-500 mt-2 text-center break-all">
                {selectedTable.qrCode}
              </p>
            </div>

            <button
              onClick={() => handlePrint(selectedTable)}
              className="w-full mt-6 flex items-center justify-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 font-semibold"
            >
              <PrinterIcon className="h-5 w-5" />
              Print QR Code
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tables;
