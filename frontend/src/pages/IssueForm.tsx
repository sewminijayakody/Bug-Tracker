import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useIssueStore } from '../store/store';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Textarea } from '../components/common/Textarea';
import { Select } from '../components/common/Select';
import { Card, CardBody, CardFooter } from '../components/common/Card';
import { Alert } from '../components/common/Alert';
import '../styles/form-page.css';

export const IssueForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const isEdit = !!id;

  const { createIssue, updateIssue, fetchIssueById, selectedIssue, isLoading, error, clearError } =
    useIssueStore();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    severity: 'Medium',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (isEdit && id) {
      fetchIssueById(id);
    }
  }, [id, isEdit, fetchIssueById]);

  useEffect(() => {
    if (isEdit && selectedIssue) {
      setFormData({
        title: selectedIssue.title,
        description: selectedIssue.description,
        priority: selectedIssue.priority || 'Medium',
        severity: selectedIssue.severity || 'Medium',
      });
    }
  }, [selectedIssue, isEdit]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      if (isEdit && id) {
        await updateIssue(id, formData as any);
        navigate(`/issues/${id}`);
      } else {
        await createIssue(formData as any);
        navigate('/dashboard');
      }
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to save issue');
    }
  };

  if (isEdit && isLoading && !selectedIssue) {
    return (
      <div className="form-page">
        <div className="loading-container">
          <div className="loading-spinner" />
          <p>Loading issue...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="form-page">
      <div className="form-header">
        <div>
          <h1>{isEdit ? 'Edit Issue' : 'Create New Issue'}</h1>
          <p>{isEdit ? 'Update issue details' : 'Add a new issue to track'}</p>
        </div>
        <Button variant="secondary" onClick={() => navigate('/dashboard')}>
          ← Back to Dashboard
        </Button>
      </div>

      {error && <Alert type="error" message={error} onClose={clearError} />}
      {submitError && <Alert type="error" message={submitError} onClose={() => setSubmitError('')} />}

      <Card>
        <form onSubmit={handleSubmit}>
          <CardBody>
            <div className="form-row">
              <Input
                label="Title"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                error={errors.title}
                placeholder="Issue title"
                required
              />

              <div className="form-row-half">
                <Select
                  label="Priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  options={[
                    { value: 'Low', label: 'Low' },
                    { value: 'Medium', label: 'Medium' },
                    { value: 'High', label: 'High' },
                  ]}
                />
              </div>

              <div className="form-row-half">
                <Select
                  label="Severity"
                  name="severity"
                  value={formData.severity}
                  onChange={handleChange}
                  options={[
                    { value: 'Low', label: 'Low' },
                    { value: 'Medium', label: 'Medium' },
                    { value: 'High', label: 'High' },
                  ]}
                />
              </div>
            </div>

            <Textarea
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              error={errors.description}
              placeholder="Describe the issue in detail"
              required
            />
          </CardBody>

          <CardFooter>
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate(isEdit ? `/issues/${id}` : '/dashboard')}
            >
              Cancel
            </Button>
            <Button type="submit" loading={isLoading}>
              {isEdit ? 'Update Issue' : 'Create Issue'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};
