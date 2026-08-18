const express = require('express');
const router = express.Router();
const { getJoinToken } = require('../controllers/roomController');

router.post('/get-join-token', getJoinToken);

module.exports = router;