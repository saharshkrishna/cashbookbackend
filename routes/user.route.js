const express = require("express");
const controller = require('../controllers/user.controller')

const router = express.Router();

router.post('/transactions', controller.createTransaction);

// Get all transactions
router.get('/transactions', controller.getAllTransactions);

// Get transactions by type
router.get('/transactions/:type', controller.getTransactionsByType);

// Update a transaction
router.put('/transactions/:id', controller.updateTransaction);

// Delete a transaction
router.delete('/transactions/:id', controller.deleteTransaction);



module.exports = router;