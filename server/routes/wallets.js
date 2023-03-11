var express = require('express');
var controller = require('../controllers/wallets')
var router = express.Router();


router.get('/', controller.getWallet);
router.post('/', controller.createRecord);
router.get('/available', controller.getAvailable);
router.delete('/:id', controller.deleteRecordByID)

module.exports = router;
