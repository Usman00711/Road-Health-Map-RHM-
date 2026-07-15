import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './pages/login';
import Dashboard from './pages/dashboard';
import Analytics from './pages/analytics';
import Feedbacks from './pages/feeds';
import TodoList from './pages/taskmanager';
import ProfilePage from './pages/profile';
import SettingsPage from './pages/setting';

function ProtectedRoute({ children }) {
  return localStorage.getItem('rhm_token') ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/analytic" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
        <Route path="/feedb" element={<ProtectedRoute><Feedbacks /></ProtectedRoute>} />
        <Route path="/todo" element={<ProtectedRoute><TodoList /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
