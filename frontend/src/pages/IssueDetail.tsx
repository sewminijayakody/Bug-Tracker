import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useIssueStore } from '../store/store';
import { Button } from "../components/common/Button";
import { Select } from "../components/common/Select";
import { Badge, StatusBadge } from "../components/common/Badge";
import { Card, CardBody, CardHeader } from "../components/common/Card";
import { Alert } from "../components/common/Alert";
import { Modal } from "../components/common/Modal";
import { formatDate, formatTime } from '../utils/helpers';
import '../styles/issue-detail.css';

export const IssueDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const {
    selectedIssue,
    isLoading,
    error,
    fetchIssueById,
    deleteIssue,
    updateIssueStatus,
    clearError,
  } = useIssueStore();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [statusChanging, setStatusChanging] = useState(false);
  const [statusConfirmOpen, setStatusConfirmOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchIssueById(id);
    }
  }, [id, fetchIssueById]);

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    if (!id || !newStatus) return;

    // Show confirmation for Resolved or Closed status
    if (newStatus === 'Resolved' || newStatus === 'Closed') {
      setPendingStatus(newStatus);
      setStatusConfirmOpen(true);
    } else {
      // Update immediately for other statuses
      await confirmStatusChange(newStatus);
    }
  };

  const confirmStatusChange = async (newStatus: string) => {
    if (!id) return;
    setStatusChanging(true);
    try {
      await updateIssueStatus(id, newStatus);
      setStatusConfirmOpen(false);
      setPendingStatus(null);
    } catch (err) {
      // Error handled by store
    } finally {
      setStatusChanging(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    setDeleting(true);
    try {
      await deleteIssue(id);
      navigate('/dashboard');
    } catch (err) {
      // Error handled by store
    } finally {
      setDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="issue-detail">
        <div className="loading-container">
          <div className="loading-spinner" />
          <p>Loading issue...</p>
        </div>
      </div>
    );
  }

  if (!selectedIssue) {
    return (
      <div className="issue-detail">
        <Card>
          <CardBody>
            <h3>Issue not found</h3>
            <p>The issue you're looking for doesn't exist or has been deleted.</p>
            <Button onClick={() => navigate('/dashboard')}>Back to Issues</Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="issue-detail">
      <div className="detail-header">
        <Button variant="secondary" onClick={() => navigate('/dashboard')}>
          ← Back to Issues
        </Button>
      </div>

      {error && <Alert type="error" message={error} onClose={clearError} />}

      <Card>
        <CardHeader>
          <div className="detail-title-section">
            <h1>{selectedIssue.title}</h1>
            <StatusBadge status={selectedIssue.status} />
          </div>
        </CardHeader>

        <CardBody>
          <div className="detail-content">
            {/* Status and Metadata */}
            <div className="detail-section">
              <h3>Status & Details</h3>
              <div className="detail-grid">
                <div className="detail-field">
                  <label>Current Status</label>
                  <Select
                    options={[
                      { value: 'Open', label: 'Open' },
                      { value: 'In Progress', label: 'In Progress' },
                      { value: 'Resolved', label: 'Resolved' },
                      { value: 'Closed', label: 'Closed' },
                    ]}
                    value={selectedIssue.status}
                    onChange={handleStatusChange}
                    disabled={statusChanging}
                  />
                </div>

                {selectedIssue.priority && (
                  <div className="detail-field">
                    <label>Priority</label>
                    <Badge label={selectedIssue.priority} variant="primary" />
                  </div>
                )}

                {selectedIssue.severity && (
                  <div className="detail-field">
                    <label>Severity</label>
                    <Badge label={selectedIssue.severity} variant="warning" />
                  </div>
                )}

                <div className="detail-field">
                  <label>Created Date</label>
                  <p className="detail-text">{formatDate(selectedIssue.createdAt)}</p>
                </div>

                <div className="detail-field">
                  <label>Created Time</label>
                  <p className="detail-text">{formatTime(selectedIssue.createdAt)}</p>
                </div>

                <div className="detail-field">
                  <label>Last Updated</label>
                  <p className="detail-text">{formatDate(selectedIssue.updatedAt)}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="detail-section">
              <h3>Description</h3>
              <div className="detail-description">
                <p>{selectedIssue.description}</p>
              </div>
            </div>

            {/* Issue ID */}
            <div className="detail-section">
              <h3>Issue Information</h3>
              <div className="detail-grid">
                <div className="detail-field">
                  <label>Issue ID</label>
                  <p className="detail-text mono">{selectedIssue._id}</p>
                </div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Actions */}
      <div className="detail-actions">
        <Button onClick={() => navigate(`/issues/${id}/edit`)} variant="primary">
          Edit Issue
        </Button>
        <Button
          onClick={() => setDeleteModalOpen(true)}
          variant="danger"
        >
          Delete Issue
        </Button>
      </div>

      {/* Delete Modal */}
      <Modal
        isOpen={deleteModalOpen}
        title="Delete Issue"
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        confirmText="Delete"
        cancelText="Cancel"
        isDangerous={true}
        isLoading={deleting}
      >
        <p>Are you sure you want to delete this issue? This action cannot be undone.</p>
      </Modal>

      {/* Status Confirmation Modal */}
      <Modal
        isOpen={statusConfirmOpen}
        title="Confirm Status Change"
        onClose={() => setStatusConfirmOpen(false)}
        onConfirm={() => pendingStatus && confirmStatusChange(pendingStatus)}
        confirmText="Confirm"
        cancelText="Cancel"
        isDangerous={false}
        isLoading={statusChanging}
      >
        <p>
          Are you sure you want to mark this issue as <strong>{pendingStatus}</strong>?
        </p>
      </Modal>
    </div>
  );
};
