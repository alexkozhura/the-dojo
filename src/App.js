import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import { useAuthContext } from './hooks/useAuthContext'

import './App.css'

// pages and components
import Dashboard from './pages/dashboard/Dashboard'
import Create from './pages/create/Create'
import Project from './pages/project/Project'
import Signup from './pages/signup/Signup'
import Login from './pages/login/Login'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'

function App() {
  const { user, authIsReady } = useAuthContext()

  return (
    <div className="App">
      {/* only display the app after we've figured out if the user is logged in or not */}
      {authIsReady && (
        <Router>
          {user && <Sidebar />}
          <div className="container">
            <Navbar />
              <Routes>
                <Route path="/" element={user ? <Dashboard /> : <Navigate to="/login" />} />
                <Route path="/create" element={user ? <Create /> : <Navigate to="/login" />} />
                <Route path="/project/:id" element={user ? <Project /> : <Navigate to="/login" />} />
                <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/" />} />
                <Route path="/login" element={!user ? <Login /> : < Navigate to="/"/>} />
              </Routes>
          </div>
        </Router>
      )}
    </div>
  );
}

export default App