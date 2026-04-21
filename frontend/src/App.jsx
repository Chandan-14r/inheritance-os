import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Assets from './pages/Assets';
import Beneficiaries from './pages/Beneficiaries';
import FamilyTree from './pages/FamilyTree';
import Letters from './pages/Letters';
import Simulator from './pages/Simulator';
import DeadManSwitch from './pages/DeadManSwitch';
import Landing from './pages/Landing';
import Login from './pages/Login';
import { useData } from './DataContext';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useData();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

function App() {
  const { isAuthenticated } = useData();

  return (
    <Router>
      <Toaster position="top-right" toastOptions={{ className: 'glass-card border border-indigo-500/20 text-white', style: { background: '#0b1120', color: '#fff' } }} />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} />
        
        <Route path="/dashboard" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="assets" element={<Assets />} />
          <Route path="beneficiaries" element={<Beneficiaries />} />
          <Route path="family-tree" element={<FamilyTree />} />
          <Route path="letters" element={<Letters />} />
          <Route path="simulator" element={<Simulator />} />
          <Route path="dead-man-switch" element={<DeadManSwitch />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
