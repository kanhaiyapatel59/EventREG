import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Register from './pages/Register';
import Login from './pages/Login';
import CreateEvent from './pages/CreateEvent';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import AdminRoute from './components/AdminRoute';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Only Admins can reach these */}
        <Route
          path="/create-event"
          element={
            <AdminRoute>
              <CreateEvent />
            </AdminRoute>
          }
        />
        
        {/* FIX: This was outside <Routes>, now it is inside */}
        <Route 
          path="/admin-stats" 
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } 
        />
      </Routes> 
    </Router>
  );
}

export default App;