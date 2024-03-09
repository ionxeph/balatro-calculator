import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
    <p className="text-red-300 mt-10">
      Disclaimer: I made this mostly for myself and I can't guarantee user friendliness or score calculation accuracy.
    </p>
  </React.StrictMode>
);
