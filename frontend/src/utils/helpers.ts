import { Issue } from '../store/store';

export const exportToCSV = (issues: Issue[], filename = 'issues.csv') => {
  const headers = ['ID', 'Title', 'Description', 'Status', 'Priority', 'Severity', 'Created At'];
  
  const rows = issues.map(issue => [
    issue._id,
    `"${issue.title.replace(/"/g, '""')}"`,
    `"${issue.description?.replace(/"/g, '""') || ''}"`,
    issue.status,
    issue.priority || 'N/A',
    issue.severity || 'N/A',
    new Date(issue.createdAt).toLocaleString(),
  ]);

  const csv = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToJSON = (issues: Issue[], filename = 'issues.json') => {
  const json = JSON.stringify(issues, null, 2);
  const blob = new Blob([json], { type: 'application/json;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    'Open': '#ef4444',
    'In Progress': '#f59e0b',
    'Resolved': '#10b981',
    'Closed': '#6b7280',
  };
  return colors[status] || '#6b7280';
};

export const getPriorityColor = (priority?: string): string => {
  const colors: Record<string, string> = {
    'Low': '#3b82f6',
    'Medium': '#f59e0b',
    'High': '#ef4444',
  };
  return colors[priority || ''] || '#9ca3af';
};

export const getSeverityColor = (severity?: string): string => {
  const colors: Record<string, string> = {
    'Low': '#3b82f6',
    'Medium': '#f59e0b',
    'High': '#ef4444',
    'Critical': '#7c3aed',
  };
  return colors[severity || ''] || '#9ca3af';
};

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatTime = (date: string): string => {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};
