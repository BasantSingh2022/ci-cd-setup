const express = require('express');
const router = express.Router();

// Sample user routes
router.get('/', (req, res) => {
  res.json({ message: 'Get all users' });
});

router.post('/', (req, res) => {
  res.json({ message: 'Create user' });
});

module.exports = router;