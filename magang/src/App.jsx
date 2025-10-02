import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import NetworkTopology from './pages/NetworkTopology';
import FiberRoutes from './pages/FiberRoutes';
import Backbone from './pages/Backbone';
import Monitoring from './pages/Monitoring';
import Devices from './pages/Devices';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="topology" element={<NetworkTopology />} />
          <Route path="fiber-routes" element={<FiberRoutes />} />
          <Route path="backbone" element={<Backbone />} />
          <Route path="monitoring" element={<Monitoring />} />
          <Route path="devices" element={<Devices />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
