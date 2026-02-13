import { Navigate, Route, Routes } from 'react-router-dom';
import DailyEntryPage from './pages/DailyEntryPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import CustomerOrderAnalysisPage from './pages/CustomerOrderAnalysisPage';
import CustomersPage from './pages/CustomersPage';
import ReportsPage from './pages/ReportsPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<DailyEntryPage />} />
      <Route path="/history" element={<OrderHistoryPage />} />
      <Route path="/customer-analysis" element={<CustomerOrderAnalysisPage />} />
      <Route path="/customers" element={<CustomersPage />} />
      <Route path="/reports" element={<ReportsPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;

