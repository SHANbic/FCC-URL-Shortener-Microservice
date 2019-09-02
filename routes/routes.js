const express = require('express');
const router = express.Router();
const urlController = require('../controller/url_controller')

router.get('/', urlController.exercice)
router.post('/api/shorturl/new', urlController.newUrl);
router.get('/api/shorturl/:shortenedUrl', urlController.redirection)

module.exports = router;
