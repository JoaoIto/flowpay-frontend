import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { Teams } from './pages/Teams';
import { Agents } from './pages/Agents';
import { AgentView } from './pages/AgentView';
import { Simulator } from './pages/Simulator';
import { Logs } from './pages/Logs';
import { Layout } from './components/Layout';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/agents" element={<Agents />} />
          <Route path="/agent-view" element={<AgentView />} />
          <Route path="/simulator" element={<Simulator />} />
          <Route path="/logs" element={<Logs />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
