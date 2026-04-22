import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIssueStore } from '../store/store';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Alert } from '../components/common/Alert';
import { Modal } from '../components/common/Modal';
import { formatDate } from '../utils/helpers';
import '../styles/dashboard.css';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const {
    issues,
    isLoading,
    error,
    totalCount,
    currentPage,
    pageSize,
    searchQuery,
    filterStatus,
    filterPriority,
    fetchIssues,
    setSearchQuery,
    setFilterStatus,
    setFilterPriority,
    clearFilters,
    deleteIssue,
    
    exportToCSV,
    exportToJSON,
    clearError,
  } = useIssueStore();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState('');
  const [deleting, setDeleting] = useState(false);

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'Open', label: 'Open' },
    { value: 'In Progress', label: 'In Progress' },
    { value: 'Resolved', label: 'Resolved' },
    { value: 'Closed', label: 'Closed' },
  ];

  const priorityOptions = [
    { value: '', label: 'All Priority' },
    { value: 'Low', label: 'Low' },
    { value: 'Medium', label: 'Medium' },
    { value: 'High', label: 'High' },
  ];

  useEffect(() => {
    fetchIssues(currentPage);
  }, [searchQuery, filterStatus, filterPriority, currentPage]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const handleSearchSubmit = () => {
    setSearchQuery(searchInput);
  };

  const handleDelete = async () => {
    if (!selectedIssueId) return;
    setDeleting(true);
    try {
      await deleteIssue(selectedIssueId);
      setDeleteModalOpen(false);
      setSelectedIssueId(null);
    } catch (err) {
      // Error handled by store
    } finally {
      setDeleting(false);
    }
  };

  const getStatusCounts = () => {
    const counts = {
      Open: 0,
      'In Progress': 0,
      Resolved: 0,
    };
    issues.forEach((issue) => {
      if (issue.status === 'Open') counts.Open++;
      if (issue.status === 'In Progress') counts['In Progress']++;
      if (issue.status === 'Resolved') counts.Resolved++;
    });
    return counts;
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Open':
        return 'badge-open';
      case 'In Progress':
        return 'badge-in-progress';
      case 'Resolved':
        return 'badge-resolved';
      case 'Closed':
        return 'badge-closed';
      default:
        return '';
    }
  };

  const getPriorityBadgeClass = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'priority-high';
      case 'medium':
        return 'priority-medium';
      case 'low':
        return 'priority-low';
      default:
        return '';
    }
  };

  const getBugIconPath = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return '/images/bug-red.svg';
      case 'medium':
        return '/images/bug-orange.svg';
      case 'low':
        return '/images/bug-green.svg';
      default:
        return '';
    }
  };

  const statusCounts = getStatusCounts();
  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="dashboard">
      {error && <Alert type="error" message={error} onClose={clearError} />}

      {/* Metric Cards */}
      <div className="status-overview">
        <div className="status-card">
          <div className="status-count">{totalCount}</div>
          <div className="status-label">Total Issues</div>
        </div>
        <div className="status-card">
          <div className="status-count">{statusCounts.Open}</div>
          <div className="status-label">Open</div>
        </div>
        <div className="status-card">
          <div className="status-count">{statusCounts['In Progress']}</div>
          <div className="status-label">In Progress</div>
        </div>
        <div className="status-card">
          <div className="status-count">{statusCounts.Resolved}</div>
          <div className="status-label">Resolved</div>
        </div>
      </div>

      {/* Filters */}
      <div className="filter-section">
        <div className="search-box">
          <Input
            type="text"
            placeholder="Search issues by title..."
            value={searchInput}
            onChange={handleSearch}
          />
          <Button onClick={handleSearchSubmit}>Search</Button>
        </div>

        <div className="filter-controls">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
          >
            {priorityOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {(searchQuery || filterStatus || filterPriority) && (
            <Button variant="secondary" onClick={clearFilters}>
              Clear Filters
            </Button>
          )}
          <Button 
            variant="secondary" 
            onClick={() => exportToCSV()} 
            title="Export issues to CSV"
            icon={<img src="/images/export-icon.svg" alt="Export" style={{ width: '20px', height: '20px' }} />}
          >
            Export CSV
          </Button>
          <Button 
            variant="secondary" 
            onClick={() => exportToJSON()} 
            title="Export issues to JSON"
            icon={<img src="/images/export-icon.svg" alt="Export" style={{ width: '20px', height: '20px' }} />}
          >
            Export JSON
          </Button>
          <Button variant="primary" onClick={() => navigate('/issues/create')}>
            + New Issue
          </Button>
        </div>
      </div>

      {/* Issues Table */}
      {isLoading ? (
        <div className="loading-container">
          <div className="loading-spinner" />
          <p>Loading issues...</p>
        </div>
      ) : issues.length === 0 ? (
        <div className="empty-state">
          <h3>No issues found</h3>
          <p>Create a new issue to get started.</p>
          <Button onClick={() => navigate('/issues/create')}>Create Issue</Button>
        </div>
      ) : (
        <>
          <div className="issues-table-container">
            <table className="issues-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Date</th>
                  <th>Actions</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {issues.map((issue) => (
                  <tr key={issue._id}>
                    <td>
                      <span
                        className="issue-title"
                        onClick={() => navigate(`/issues/${issue._id}`)}
                      >
                        {issue.title}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${getStatusBadgeClass(issue.status)}`}>
                        {issue.status}
                      </span>
                    </td>
                    <td>
                      {issue.priority && (
                        <span className={`priority-badge ${getPriorityBadgeClass(issue.priority)}`}>
                          {issue.priority}
                        </span>
                      )}
                    </td>
                    <td>
                      <span className="issue-date">{formatDate(issue.createdAt)}</span>
                    </td>
                    <td>
                      <div className="issue-actions">
                        <button onClick={() => navigate(`/issues/${issue._id}`)}>
                          View
                        </button>
                        <button onClick={() => navigate(`/issues/${issue._id}/edit`)}>
                          Edit
                        </button>
                        <button
                          className="danger"
                          onClick={() => {
                            setSelectedIssueId(issue._id);
                            setDeleteModalOpen(true);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                    <td>
                      {issue.priority && getBugIconPath(issue.priority) && (
                        <img 
                          src={getBugIconPath(issue.priority)} 
                          alt={`${issue.priority} priority`}
                          className="bug-icon-image"
                        />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <Button
                variant="secondary"
                disabled={currentPage === 1}
                onClick={() => fetchIssues(currentPage - 1)}
              >
                ← Previous
              </Button>

              <div className="pagination-info">
                Page {currentPage} of {totalPages}
              </div>

              <Button
                variant="secondary"
                disabled={currentPage === totalPages}
                onClick={() => fetchIssues(currentPage + 1)}
              >
                Next →
              </Button>
            </div>
          )}
        </>
      )}

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
    </div>
  );
};
