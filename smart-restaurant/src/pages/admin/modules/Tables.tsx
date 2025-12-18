import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { PlusIcon, TrashIcon, QrCodeIcon, PrinterIcon } from '@heroicons/react/24/outline';

interface Table {
  id: number;
  number: string;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved';
  qrCode: string;
}

const Tables = () => {
  const [tables, setTables] = useState<Table[]>([
    { id: 1, number: '1', capacity: 4, status: 'available', qrCode: `${window.location.origin}/menu?table=1` },
    { id: 2, number: '2', capacity: 2, status: 'occupied', qrCode: `${window.location.origin}/menu?table=2` },
    { id: 3, number: '3', capacity: 6, status: 'available', qrCode: `${window.location.origin}/menu?table=3` },
  ]);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [newTable, setNewTable] = useState({
    number: '',
    capacity: 2
  });

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
      qrCode: `${window.location.origin}/menu?table=${newTable.number}`
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

  const handlePrintQR = (table: Table) => {
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
                font-family: Arial, sans-serif;
              }
              h1 { margin-bottom: 20px; }
              .qr-container { margin: 20px; }
            </style>
          </head>
          <body>
            <h1>Table ${table.number}</h1>
            <div class="qr-container" id="qr"></div>
            <p>Scan to view menu and place order</p>
          </body>
        </html>
      `);
      
      const qrContainer = printWindow.document.getElementById('qr');
      if (qrContainer) {
        // Create QR code as data URL
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const size = 256;
          canvas.width = size;
          canvas.height = size;
          
          // Use a library or create SVG
          const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
          qrContainer.innerHTML = `<svg width="256" height="256"><text x="128" y="128" text-anchor="middle">QR Code</text></svg>`;
        }
      }
      
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'occupied':
        return 'bg-red-100 text-red-800';
      case 'reserved':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Table Management</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
        >
          <PlusIcon className="w-5 h-5" />
          Add Table
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tables.map((table) => (
          <div key={table.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold">Table {table.number}</h3>
                <p className="text-gray-600">Capacity: {table.capacity} people</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(table.status)}`}>
                {table.status}
              </span>
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => {
                  setSelectedTable(table);
                  setShowQRModal(true);
                }}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600"
              >
                <QrCodeIcon className="w-4 h-4" />
                View QR
              </button>
              <button
                onClick={() => handlePrintQR(table)}
                className="flex-1 flex items-center justify-center gap-2 bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600"
              >
                <PrinterIcon className="w-4 h-4" />
                Print
              </button>
              <button
                onClick={() => handleDeleteTable(table.id)}
                className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
              >
                <TrashIcon className="w-4 h-4" />
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
                  Table Number *
                </label>
                <input
                  type="text"
                  value={newTable.number}
                  onChange={(e) => setNewTable({ ...newTable, number: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  placeholder="e.g., 1, A1, VIP-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Capacity *
                </label>
                <input
                  type="number"
                  value={newTable.capacity}
                  onChange={(e) => setNewTable({ ...newTable, capacity: parseInt(e.target.value) })}
                  min="1"
                  max="20"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleAddTable}
                className="flex-1 bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600"
              >
                Add Table
              </button>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewTable({ number: '', capacity: 2 });
                }}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {showQRModal && selectedTable && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Table {selectedTable.number} QR Code</h2>
              <button
                onClick={() => {
                  setShowQRModal(false);
                  setSelectedTable(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="bg-white p-4 border-2 border-gray-200 rounded-lg">
                <QRCodeSVG
                  value={selectedTable.qrCode}
                  size={256}
                  level="H"
                  includeMargin={true}
                />
              </div>
              <p className="mt-4 text-sm text-gray-600 text-center">
                Scan this QR code to view menu for Table {selectedTable.number}
              </p>
              <p className="mt-2 text-xs text-gray-500 break-all text-center px-4">
                {selectedTable.qrCode}
              </p>
              
              <button
                onClick={() => handlePrintQR(selectedTable)}
                className="mt-6 w-full bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 flex items-center justify-center gap-2"
              >
                <PrinterIcon className="w-5 h-5" />
                Print QR Code
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tables;
