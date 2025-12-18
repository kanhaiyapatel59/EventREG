import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import CreateEvent from './pages/CreateEvent'; 
import Home from './pages/Home';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create-event" element={<CreateEvent />} />
        <Route path="/" element={<h1 className="text-center mt-10">Home: Event List Coming Soon!</h1>} />
      </Routes>
    </Router>
  );
}

export default App;