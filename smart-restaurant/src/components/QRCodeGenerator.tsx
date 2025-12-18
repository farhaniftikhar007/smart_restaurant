import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface QRCodeGeneratorProps {
  tableId: string;
  size?: number;
  type?: 'menu' | 'payment';
  amount?: number;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ 
  tableId, 
  size = 200,
  type = 'menu',
  amount
}) => {
  const getQRValue = () => {
    const baseUrl = window.location.origin;
    if (type === 'payment' && amount) {
      return `${baseUrl}/pay?table=${tableId}&amount=${amount}`;
    }
    return `${baseUrl}/menu?table=${tableId}`;
  };

  const getLabel = () => {
    if (type === 'payment') {
      return `Scan to pay for Table ${tableId}`;
    }
    return `Scan to view menu for Table ${tableId}`;
  };

  return (
    <div className="flex flex-col items-center p-4">
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <QRCodeSVG
          value={getQRValue()}
          size={size}
          level="H"
          includeMargin={true}
        />
      </div>
      <p className="mt-4 text-sm text-gray-600">{getLabel()}</p>
    </div>
  );
};

export default QRCodeGenerator; 