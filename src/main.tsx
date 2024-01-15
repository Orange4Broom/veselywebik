import React from 'react';
import ReactDOM from 'react-dom/client';
import { AuthContextProvider } from './components/context/Authcontext';
import { App } from './App';
import './index.scss';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthContextProvider>
      <App />
    </AuthContextProvider>
  </React.StrictMode>
);
