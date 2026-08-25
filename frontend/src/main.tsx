import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Set RTL direction for the document
document.dir = 'rtl';
document.documentElement.setAttribute('dir', 'rtl');
document.documentElement.setAttribute('lang', 'ar');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div dir="rtl" className="font-arabic">
      <App />
    </div>
  </React.StrictMode>,
)