import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import SkipSelection from './pages/SkipSelection';
import WasteType from './pages/WasteType';
import PermitCheck from './pages/PermitCheck';

export default function App() {

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <Router>
      <div className="flex h-screen" >

        {/* Sidebar component with control props */}
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto p-4">
          <Routes>
            <Route path="/" element={<Navigate to="/select-skip" replace />} />
            <Route path="/select-skip" element={<SkipSelection toggleSidebar={toggleSidebar} />} />
            <Route path="/waste-type" element={<WasteType toggleSidebar={toggleSidebar} />} />
            <Route path="/permit-check" element={<PermitCheck toggleSidebar={toggleSidebar} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
