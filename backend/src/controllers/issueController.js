const Issue = require('../models/Issue');

// Get all issues with filters + pagination
const getIssues = async (req, res) => {
  const { page = 1, limit = 10, search = '', status = '', priority = '' } = req.query;
  const query = { createdBy: req.user.id };

  if (search) query.title = { $regex: search, $options: 'i' };
  if (status) query.status = status;
  if (priority) query.priority = priority;

  try {
    const issues = await Issue.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const totalCount = await Issue.countDocuments(query);

    res.json({ issues, totalCount, pages: Math.ceil(totalCount / limit) });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get status counts
const getStatusCounts = async (req, res) => {
  try {
    const counts = await Issue.aggregate([
      { $match: { createdBy: req.user.id } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    res.json(counts);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const createIssue = async (req, res) => {
  try {
    const issue = new Issue({ ...req.body, createdBy: req.user.id });
    await issue.save();
    res.status(201).json(issue);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getIssueById = async (req, res) => {
  try {
    const issue = await Issue.findOne({ _id: req.params.id, createdBy: req.user.id });
    if (!issue) return res.status(404).json({ message: 'Issue not found' });
    res.json(issue);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateIssue = async (req, res) => {
  try {
    const issue = await Issue.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user.id },
      req.body,
      { new: true }
    );
    if (!issue) return res.status(404).json({ message: 'Issue not found' });
    res.json(issue);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteIssue = async (req, res) => {
  try {
    const issue = await Issue.findOneAndDelete({ _id: req.params.id, createdBy: req.user.id });
    if (!issue) return res.status(404).json({ message: 'Issue not found' });
    res.json({ message: 'Issue deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Bonus: CSV Export
const exportCSV = async (req, res) => {
  try {
    const issues = await Issue.find({ createdBy: req.user.id });
    let csv = 'Title,Description,Status,Priority,Severity,Created At\n';
    issues.forEach(i => {
      csv += `"${i.title}","${i.description}",${i.status},${i.priority},${i.severity},${i.createdAt}\n`;
    });
    res.header('Content-Type', 'text/csv');
    res.attachment('issues.csv');
    res.send(csv);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Bonus: JSON Export
const exportJSON = async (req, res) => {
  try {
    const issues = await Issue.find({ createdBy: req.user.id });
    const jsonData = {
      exportDate: new Date().toISOString(),
      totalIssues: issues.length,
      issues: issues.map(i => ({
        id: i._id,
        title: i.title,
        description: i.description,
        status: i.status,
        priority: i.priority,
        severity: i.severity,
        createdAt: i.createdAt,
        updatedAt: i.updatedAt
      }))
    };
    res.header('Content-Type', 'application/json');
    res.attachment('issues.json');
    res.send(JSON.stringify(jsonData, null, 2));
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getIssues, getStatusCounts, createIssue, getIssueById, updateIssue, deleteIssue, exportCSV, exportJSON };