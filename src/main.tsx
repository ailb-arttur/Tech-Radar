import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { INITIAL_NEWS } from './data';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// expose initial news (fallback) to client-side scripts
// @ts-ignore
window.__INITIAL_NEWS = INITIAL_NEWS;
