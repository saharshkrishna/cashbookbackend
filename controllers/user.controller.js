const Transaction = require("../MongoDb/models/userModels/User");
const newUser = require("../MongoDb/models/userModels/User");



exports.createTransaction = async (req, res) => {
    try {
        const { type, date, amount, partyName, remarks, category, paymentMode, files } = req.body;

        // Validate required fields
        if (!type || !date || !amount) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Create a new transaction
        const newTransaction = new Transaction({
            type,
            date,
            amount,
            partyName,
            remarks,
            category,
            paymentMode,
            files,
        });

        // Save the transaction to the database
        const savedTransaction = await newTransaction.save();

        res.status(201).json({ message: "Transaction created successfully", transaction: savedTransaction });
    } catch (err) {
        res.status(500).json({ error: "Something went wrong!!", details: err.message });
    }
};

exports.getAllTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find();
        res.status(200).json({ transactions });
    } catch (err) {
        res.status(500).json({ error: "Something went wrong!!", details: err.message });
    }
};

exports.getTransactionsByType = async (req, res) => {
    try {
        const { type } = req.params; // Get the type from the URL parameter

        // Validate the type
        if (!["Cash In", "Cash Out"].includes(type)) {
            return res.status(400).json({ error: "Invalid transaction type" });
        }

        // Find transactions by type
        const transactions = await Transaction.find({ type });

        res.status(200).json({ transactions });
    } catch (err) {
        res.status(500).json({ error: "Something went wrong!!", details: err.message });
    }
};

exports.updateTransaction = async (req, res) => {
    try {
        const { id } = req.params; // Get the transaction ID from the URL parameter
        const updateData = req.body; // Get the updated data from the request body

        // Find and update the transaction
        const updatedTransaction = await Transaction.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedTransaction) {
            return res.status(404).json({ error: "Transaction not found" });
        }

        res.status(200).json({ message: "Transaction updated successfully", transaction: updatedTransaction });
    } catch (err) {
        res.status(500).json({ error: "Something went wrong!!", details: err.message });
    }
};

exports.deleteTransaction = async (req, res) => {
    try {
        const { id } = req.params; // Get the transaction ID from the URL parameter

        // Find and delete the transaction
        const deletedTransaction = await Transaction.findByIdAndDelete(id);

        if (!deletedTransaction) {
            return res.status(404).json({ error: "Transaction not found" });
        }

        res.status(200).json({ message: "Transaction deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Something went wrong!!", details: err.message });
    }
};