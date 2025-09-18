import { Routes, Route } from 'react-router-dom';
import LoginPage from './Pages/Auth/LoginPage';
import RegisterPage from './Pages/Auth/RegisterPage';
import AdminDashboard from './Pages/Dashboard/AdminDashboard';
import OperatorDashboard from './Pages/Dashboard/OperatorDashboard';
import SectionControllerDashboard from './Pages/Dashboard/SectionControllerDashboard';

function App() {
  return (
    <Routes>
      <Route path="/" element={<h1 className="text-center">Hello</h1>} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/operator/dashboard" element={<OperatorDashboard />} />
      <Route path="/section-controller/dashboard" element={<SectionControllerDashboard />} />
    </Routes>
  );
}

export default App;
