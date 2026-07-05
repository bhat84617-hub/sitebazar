const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const { checkGenerationAccess, checkDownloadAccess } = require('../middleware/checkAccess');
const { generateWebsite, downloadWebsite, getWebsite } = require('../controllers/generateController');

router.post('/generate-website', requireAuth, checkGenerationAccess, generateWebsite);
router.post('/download-website', requireAuth, checkDownloadAccess, downloadWebsite);
router.get('/website/:id', requireAuth, getWebsite);

module.exports = router;
