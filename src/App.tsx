import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import SearchPage from './components/SearchPage';
import AnalysisPage from './components/AnalysisPage';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';
import HelpPage from './components/HelpPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import AuthCallback from './components/AuthCallback';
import SequenceAlignment from './components/SequenceAlignment';
import AccountSettings from './components/AccountSettings';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/analysis" element={<AnalysisPage />} />
              <Route path="/sequence-alignment" element={<SequenceAlignment />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/help" element={<HelpPage />} />
              <Route path="/settings" element={<AccountSettings />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;