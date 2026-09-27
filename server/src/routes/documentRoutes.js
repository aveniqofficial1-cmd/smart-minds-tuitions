const express = require('express');
const router = express.Router();
const { getDocument } = require('../controllers/documentController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/:filename', getDocument);

module.exports = router;
