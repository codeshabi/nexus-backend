const express = require('express');
const { uploadDocument, getDocuments, getDocument, signDocument } = require('../controllers/documentController');
const { authenticate } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.post('/upload', authenticate, upload.single('document'), uploadDocument);
router.get('/', authenticate, getDocuments);
router.get('/:id', authenticate, getDocument);
router.post('/:id/sign', authenticate, signDocument);

module.exports = router;