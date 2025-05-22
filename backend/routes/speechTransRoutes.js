const express = require('express');
const SpeechTransController = require('../controllers/speechTransController');

const router = express.Router();

router.post('/', SpeechTransController.translateSpeech);

module.exports = router; 