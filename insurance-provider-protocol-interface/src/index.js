import React from 'react';
import ReactDOM from 'react-dom/client';
import 'tailwindcss/tailwind.css';

import App from './App';
import reportWebVitals from './reportWebVitals';

const rootElement = document.getElementById('root');

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />        
  </React.StrictMode>
);

reportWebVitals();


