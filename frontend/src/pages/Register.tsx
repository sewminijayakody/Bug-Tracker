import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/store';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Alert } from '../components/common/Alert';
import { LogoIcon } from '../components/common/LogoIcon';
import '../styles/auth.css';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError } = useAuthStore();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
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
      await register(formData.email, formData.password, formData.name);
      navigate('/dashboard');
    } catch (err) {
      // Error is handled by store
    }
  };

  return (
    <div className="auth-container">
      {/* Left Side: Visual Branding */}
      <div className="auth-image-sidebar">
        <img src="/images/login-background.png" alt="BUG Tracker" />
        <div className="auth-image-overlay">
          <h2>Focus. Track.<br />Resolve.</h2>
          <p>Welcome to BUG Tracker. Your centralized hub for managing bugs and issues with efficiency.</p>
        </div>
      </div>

      {/* Right Side: Form Content */}
      <div className="auth-form-section">
        <div className="auth-card">
          <div className="auth-header">
            <div className="brand-logo">
              <LogoIcon size={72} />
            </div>
            <h1>BUG Tracker</h1>
            <p>Create a new account</p>
          </div>

          {error && <Alert type="error" message={error} onClose={clearError} />}

          <form onSubmit={handleSubmit} className="auth-form">
            <Input
              type="text"
              name="name"
              label="Full Name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              required
            />

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

            <Input
              type="password"
              name="confirmPassword"
              label="Confirm Password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              required
            />

            <Button 
              type="submit" 
              fullWidth
              loading={isLoading} 
              variant="primary"
            >
              Sign Up
            </Button>
          </form>

          <div className="auth-footer">
            <p>
              Already have an account?{' '}
              <Link to="/login" className="signup-link">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
