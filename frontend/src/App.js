import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Assignments from './pages/Assignments';
import Feedbacks from './pages/Feedbacks';
import FeedbackList from './components/FeedbackList';


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/assignments" element={<Assignments />} />
        <Route path="/feedbacks" element={<Feedbacks />} />
        <Route path="/feedback-list" element={<FeedbackList />} />
      </Routes>
    </Router>
  );
}

export default App;
