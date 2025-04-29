const express = require("express");
const controller = require('../controllers/user.controller')
const upload = require('../middleware/file');
const {uploadFiles} = require('../controllers/filecontroller')
const router = express.Router();

//Transaction Routes
router.post('/transactions', controller.createTransaction);
router.get('/transactions', controller.getAllTransactions);
router.get('/transactions/:type', controller.getTransactionsByType);
router.put('/transactions/:id', controller.updateTransaction);
router.post('/transactions/delete', controller.deleteTransaction);

//Loan Routes
router.post("/loans", controller.createLoan);
router.get("/loans", controller.getAllLoans);
router.get("/loans/:id", controller.getLoanById);
router.put("/loans/:id", controller.updateLoan);
router.delete("/loans", controller.deleteLoan);

// Add party
router.post("/parties",controller.AddParty);
router.get('/parties', controller.getParty);

// Add Payment Mode
router.post("/paymentMode", controller.AddPaymentMode);
// Add Category
router.post("/category", controller.AddCategory);
// Route to get all categories
router.get("/category", controller.getCategory);

// Route to get all payment modes
router.get("/paymentMode", controller.getPaymentModes);

router.post('/uploads', upload.array('file', 5), uploadFiles);

module.exports = router;