import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/store';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Alert } from '../components/common/Alert';
import { LogoIcon } from '../components/common/LogoIcon';
import '../styles/auth.css';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuthStore();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      // Error handled by Zustand store
    }
  };

  return (
    <div className="auth-container">
      {/* Left Side: Visual Branding (60% width) */}
      <div className="auth-image-sidebar">
        <img src="/images/login-background.png" alt="Developer Workspace" />
        <div className="auth-image-overlay">
          <h2>Focus. Track.<br />Resolve.</h2>
          <p>
            Welcome to BUG Tracker. Your centralized hub for 
            managing bugs and issues with efficiency.
          </p>
        </div>
      </div>

      {/* Right Side: Form Content (40% width) */}
      <div className="auth-form-section">
        <div className="auth-card">
          <div className="auth-header">
            <div className="brand-logo">
              <LogoIcon size={72} />
            </div>
            <h1>BUG Tracker</h1>
            <p>Sign in to your account to continue</p>
          </div>

          {error && <Alert type="error" message={error} onClose={clearError} />}

          <form onSubmit={handleSubmit} className="auth-form">
            <Input
              type="email"
              name="email"
              label="Email Address"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              required
            />

            <div className="password-wrapper">
              <Input
                type="password"
                name="password"
                label="Password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                required
              />
              <Link to="/forgot-password" className="forgot-link">
                Forgot?
              </Link>
            </div>

            <Button 
              type="submit" 
              fullWidth 
              loading={isLoading}
              variant="primary"
            >
              Sign In
            </Button>
          </form>

          <div className="auth-footer">
            <p>
              Don't have an account?{' '}
              <Link to="/register" className="signup-link">Create one for free</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};