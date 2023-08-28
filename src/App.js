import { BrowserRouter as Router, Route, Routes, Navigate, BrowserRouter } from 'react-router-dom';

import './App.css'

// pages and components
import Dashboard from './pages/dashboard/Dashboard'
import Create from './pages/create/Create'
import Project from './pages/project/Project'
import Signup from './pages/signup/Signup'
import Login from './pages/login/Login'
import Navbar from './components/Navbar'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <div className="container">
          <Navbar />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/create" element={<Create />} />
              <Route path="/project/:id" element={<Project />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
            </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App