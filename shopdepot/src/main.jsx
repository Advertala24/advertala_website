import React from 'react';
import { flushSync } from 'react-dom';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles.css';

const data = window.__DATA__ || { page: 'home' };

// Render synchronously so the ad <li> elements exist before the
// partner script below scans the page.
flushSync(() => createRoot(document.getElementById('root')).render(<App data={data} />));

// Partner page-load script, appended at the bottom of the page.
const js = document.createElement('script');
js.src = 'https://mediawavegroup.org/mwgpageload.js?v=15';
document.body.appendChild(js);
