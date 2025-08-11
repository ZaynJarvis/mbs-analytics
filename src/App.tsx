import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import SharedView from './components/SharedView';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/shared" element={<SharedView />} />
    </Routes>
  );
}

export default App;