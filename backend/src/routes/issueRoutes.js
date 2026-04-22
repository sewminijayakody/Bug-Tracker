const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const {
  getIssues, getStatusCounts, createIssue, getIssueById,
  updateIssue, deleteIssue, exportCSV, exportJSON
} = require('../controllers/issueController');

const router = express.Router();

router.use(authMiddleware);           // Protect all issue routes

router.get('/', getIssues);
router.get('/counts', getStatusCounts);
router.post('/', createIssue);
router.get('/:id', getIssueById);
router.put('/:id', updateIssue);
router.delete('/:id', deleteIssue);
router.get('/export/csv', exportCSV);
router.get('/export/json', exportJSON);

module.exports = router;