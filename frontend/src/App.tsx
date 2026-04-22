import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from './store/store';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { IssueForm } from './pages/IssueForm';
import { IssueDetail } from './pages/IssueDetail';
import { Button } from './components/common/Button';
import { LogoIcon } from './components/common/LogoIcon';
import { Modal } from './components/common/Modal';
import './styles/index.css';
import './styles/layout.css';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { token } = useAuthStore();
  return token ? <>{children}</> : <Navigate to="/login" replace />;
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuthStore();
  const [showUserModal, setShowUserModal] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="layout">
      <header className="header">
        <div className="header-content">
          <a href="/" className="header-brand">
            <LogoIcon size={32} />
            BUG Tracker
          </a>
          <div className="header-user">
            <div 
              className="header-user-avatar" 
              onClick={() => setShowUserModal(true)}
              style={{ cursor: 'pointer' }}
              title="Click to view profile"
            >
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="header-user-info">
              <span className="header-user-name">{user?.name}</span>
              <span className="header-user-email">{user?.email}</span>
            </div>
            <Button variant="secondary" size="sm" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>
      </header>
      <div className="main-wrapper">
        <aside className="sidebar">
          <nav className="sidebar-nav">
            <a href="/dashboard" className={`sidebar-nav-item ${isActive('/dashboard') ? 'active' : ''}`}>
              <img src="/images/dashboard-icon.svg" alt="Dashboard" className="sidebar-icon" />
              Dashboard
            </a>
            <a href="/issues/create" className={`sidebar-nav-item ${isActive('/issues/create') ? 'active' : ''}`}>
              <img src="/images/plus-icon.svg" alt="New Issue" className="sidebar-icon" />
              New Issue
            </a>
          </nav>
        </aside>

        <main className="main-content">
          {children}
        </main>
      </div>

      {/* User Profile Modal */}
      <Modal
        isOpen={showUserModal}
        title="User Profile"
        onClose={() => setShowUserModal(false)}
        onConfirm={() => setShowUserModal(false)}
        confirmText="Close"
        isDangerous={false}
      >
        <div className="user-profile-content">
          <div className="user-profile-avatar">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="user-profile-details">
            <div className="user-profile-field">
              <label>Name</label>
              <p>{user?.name}</p>
            </div>
            <div className="user-profile-field">
              <label>Email</label>
              <p>{user?.email}</p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

function App() {
  const { token, user } = useAuthStore();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Check if user is still logged in
    if (token && !user) {
      // Could fetch user data here if needed
    }
    setIsInitialized(true);
  }, [token, user]);

  if (!isInitialized) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div className="loading-spinner" />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/issues/create"
          element={
            <ProtectedRoute>
              <Layout>
                <IssueForm />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/issues/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <IssueDetail />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/issues/:id/edit"
          element={
            <ProtectedRoute>
              <Layout>
                <IssueForm />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Redirect root to dashboard or login */}
        <Route path="/" element={<Navigate to={token ? '/dashboard' : '/login'} replace />} />

        {/* 404 */}
        <Route
          path="*"
          element={
            token ? (
              <Layout>
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                  <h1>404 - Page Not Found</h1>
                  <Button onClick={() => window.location.href = '/dashboard'}>
                    Back to Dashboard
                  </Button>
                </div>
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
