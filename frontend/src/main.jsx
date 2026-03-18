import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { BillProvider } from './context/BillContext';
import { AuthProvider } from './context/AuthContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <BillProvider>
          <App />
        </BillProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
