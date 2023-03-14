var express = require('express');
var controller = require('../controllers/loans')
var router = express.Router();


router.get('/', controller.getLoans);
router.post('/', controller.createLoan);
router.get('/:id', controller.getLoanByID);
router.delete('/:id', controller.deleteLoanByID)
router.post('/:id/pay', controller.payLoanByID)
router.post('/:id/sell', controller.sellLoanByID)
router.patch('/:id', controller.updateLoanByID)

module.exports = router;
