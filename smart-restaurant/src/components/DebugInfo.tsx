import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config/api';
import axios from 'axios';

export const DebugInfo: React.FC = () => {
  const [apiStatus, setApiStatus] = useState<string>('Checking...');
  const [show, setShow] = useState(true);

  useEffect(() => {
    checkAPI();
  }, []);

  const checkAPI = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/`);
      setApiStatus(`✅ Connected: ${response.data.message}`);
    } catch (error: any) {
      setApiStatus(`❌ Failed: ${error.message}`);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-80 text-white p-4 rounded-lg text-xs max-w-xs z-50">
      <button 
        onClick={() => setShow(false)}
        className="absolute top-1 right-1 text-white"
      >
        ×
      </button>
      <div className="font-bold mb-2">🔍 Debug Info</div>
      <div>Hostname: {window.location.hostname}</div>
      <div>Port: {window.location.port}</div>
      <div>API URL: {API_BASE_URL}</div>
      <div className="mt-2">{apiStatus}</div>
      <button 
        onClick={checkAPI}
        className="mt-2 bg-blue-500 px-2 py-1 rounded text-xs"
      >
        Test API
      </button>
    </div>
  );
};
