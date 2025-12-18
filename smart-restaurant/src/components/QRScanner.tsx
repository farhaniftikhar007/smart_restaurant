import React, { useState } from 'react';
import QrScanner from 'react-qr-scanner';

interface QRScannerProps {
  onScan: (result: string) => void;
}

interface ScanResult {
  text: string;
}

const QRScanner: React.FC<QRScannerProps> = ({ onScan }) => {
  const [error, setError] = useState<string>('');

  const handleScan = (data: ScanResult | null) => {
    if (data) {
      onScan(data.text);
    }
  };

  const handleError = (err: Error) => {
    setError('Error accessing camera. Please make sure you have granted camera permissions.');
    console.error(err);
  };

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <div className="relative aspect-square w-full bg-gray-100 rounded-lg overflow-hidden">
        <QrScanner
          delay={300}
          onError={handleError}
          onScan={handleScan}
          style={{ width: '100%', height: '100%' }}
        />
      </div>
      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
};

export default QRScanner; 