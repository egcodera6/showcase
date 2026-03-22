import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DynamicShowcaseCarousel from './components/DynamicShowcaseCarousel';
import ProjectEditor from './components/ProjectEditor';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<DynamicShowcaseCarousel />} />
          <Route path="/editor" element={<ProjectEditor />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
