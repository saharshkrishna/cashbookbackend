const Transaction = require("../MongoDb/models/userModels/User");
const Party = require("../MongoDb/models/userModels/Party");
const Category = require("../MongoDb/models/userModels/Category");
const PaymentMode = require("../MongoDb/models/userModels/Payment");
const Loan = require("../MongoDb/models/userModels/Loan");



//Transaction Apis
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
        const transactions = await Transaction.find().sort({ createdAt: -1 });
        res.status(200).json({ transactions });
    } catch (err) {
        console.error("Error fetching transactions:", err);
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

        console.log("Updating transaction with ID:", id); // Debugging
    console.log("Update data:", updateData); // Debugging

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
    const { ids } = req.body; // IDs of transactions to delete
  
    try {
      // Ensure IDs are provided
      if (!ids || ids.length === 0) {
        return res.status(400).json({ message: "No IDs provided for deletion." });
      }
  
      // Delete transactions from the database
      await Transaction.deleteMany({ _id: { $in: ids } });
  
      res.status(200).json({ message: "Transactions deleted successfully." });
    } catch (error) {
      console.error("Error deleting transactions:", error);
      res.status(500).json({ message: "Failed to delete transactions." });
    }
  };


  //Loan Apis

  exports.createLoan = async (req, res) => {
    try {
        const { date, loanTitle, loanAmount, interestRate, loanTerm, loanIssuedBy } = req.body;

        // Validate required fields
        if (!date || !loanTitle || !loanAmount || !interestRate || !loanIssuedBy) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Calculate additional fields
        const dailyInterestAmount = (loanAmount * (interestRate / 100)).toFixed(2);
        const dailyEMI = ((loanAmount / loanTerm) + parseFloat(dailyInterestAmount)).toFixed(2);

        // Calculate due date
        const dueDate = new Date(date);
        dueDate.setDate(dueDate.getDate() + loanTerm);
        const formattedDueDate = dueDate.toISOString().split("T")[0];

        // Create new loan entry
        const newLoan = new Loan({
            date,
            loanTitle,
            loanAmount,
            interestRate,
            dailyInterestAmount,
            loanTerm,
            dailyEMI,
            dueDate: formattedDueDate,
            loanIssuedBy
        });

        // Save to database
        const savedLoan = await newLoan.save();
        res.status(201).json({ message: "Loan created successfully", loan: savedLoan });
    } catch (err) {
        res.status(500).json({ error: "Something went wrong!!", details: err.message });
    }
};

exports.getAllLoans = async (req, res) => {
    try {
        const loans = await Loan.find().sort({ createdAt: -1 });
        res.status(200).json({ loans });
    } catch (err) {
        console.error("Error fetching loans:", err);
        res.status(500).json({ error: "Something went wrong!!", details: err.message });
    }
};

exports.getLoanById = async (req, res) => {
    try {
        const { id } = req.params;
        const loan = await Loan.findById(id);

        if (!loan) {
            return res.status(404).json({ error: "Loan not found" });
        }

        res.status(200).json({ loan });
    } catch (err) {
        res.status(500).json({ error: "Something went wrong!!", details: err.message });
    }
};

exports.updateLoan = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        console.log("Updating loan with ID:", id); // Debugging
        console.log("Update data:", updateData); // Debugging

        // Recalculate values if interest rate or amount is updated
        if (updateData.loanAmount || updateData.interestRate || updateData.loanTerm) {
            const loan = await Loan.findById(id);
            if (!loan) return res.status(404).json({ error: "Loan not found" });

            const loanAmount = updateData.loanAmount || loan.loanAmount;
            const interestRate = updateData.interestRate || loan.interestRate;
            const loanTerm = updateData.loanTerm || loan.loanTerm;

            updateData.dailyInterestAmount = (loanAmount * (interestRate / 100)).toFixed(2);
            updateData.dailyEMI = ((loanAmount / loanTerm) + parseFloat(updateData.dailyInterestAmount)).toFixed(2);

            // Recalculate due date
            const dueDate = new Date(loan.date);
            dueDate.setDate(dueDate.getDate() + loanTerm);
            updateData.dueDate = dueDate.toISOString().split("T")[0];
        }

        const updatedLoan = await Loan.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedLoan) {
            return res.status(404).json({ error: "Loan not found" });
        }

        res.status(200).json({ message: "Loan updated successfully", loan: updatedLoan });
    } catch (err) {
        res.status(500).json({ error: "Something went wrong!!", details: err.message });
    }
};

exports.deleteLoan = async (req, res) => {
    const { ids } = req.body; // IDs of loans to delete
  
    try {
        if (!ids || ids.length === 0) {
            return res.status(400).json({ message: "No IDs provided for deletion." });
        }
  
        await Loan.deleteMany({ _id: { $in: ids } });
  
        res.status(200).json({ message: "Loans deleted successfully." });
    } catch (error) {
        console.error("Error deleting loans:", error);
        res.status(500).json({ message: "Failed to delete loans." });
    }
};


  // Party Apis

  exports.AddParty = async (req, res) => {
    const { partyName, phone, partyType } = req.body;
    
    console.log("Received Data:", req.body);
  
    if (!partyName || partyName.trim() === "") {
      return res.status(400).json({ message: "Enter the required fields" });
    }
  
    try {
      const existingParty = await Party.findOne({ partyName: partyName.trim() });
      if (existingParty) {
        return res.status(400).json({ message: "Party already exists" });
      }
  
      const newParty = new Party({  
        partyName: partyName.trim(),  // Ensure no accidental empty spaces
        phone: phone || "",           // Set default if phone is missing
        partyType, 
      });
  
      await newParty.save();
      console.log("Party saved successfully:", newParty);
  
      res.status(200).json({ message: "Party added successfully", partyName });
    } catch (error) {
      console.error("Error adding party:", error);
      res.status(500).json({ message: "Error adding party", error: error.message });
    }
  };
  

  exports.getParty = async (req, res) => {
    try {
      const parties = await Party.find({}, "partyName"); // Fetch only `partyName`
      res.status(200).json({ parties });
    } catch (error) {
      console.error("Error fetching parties:", error);
      res.status(500).json({ message: "Error fetching parties" });
    }
};

  // PaymentMode Apis
  exports.AddPaymentMode = async (req, res) => {
    console.log("Received Add Payment Mode Request:", req.body); // ✅ Log incoming request
  
    const { paymentMode } = req.body;
    if (!paymentMode) {
        console.error("Error: Payment mode is missing");
        return res.status(400).json({ message: "Payment mode is required" });
    }

    try {
        console.log("Checking if payment mode already exists...");
        const existingMode = await PaymentMode.findOne({ paymentMode }); // ✅ Fixed incorrect field name
        if (existingMode) {
            console.warn("Payment mode already exists:", existingMode);
            return res.status(400).json({ message: "Payment mode already exists" });
        }

        console.log("Saving new payment mode...");
        const newMode = new PaymentMode({ paymentMode });
        await newMode.save();
        console.log("Payment mode added successfully:", newMode);

        res.status(201).json({ message: "Payment mode added successfully", newPaymentMode: newMode });
    } catch (error) {
        console.error("Error adding payment mode:", error);
        res.status(500).json({ message: "Error adding payment mode", error: error.message });
    }
};
exports.getPaymentModes = async (req, res) => {
    try {
        console.log("Fetching all payment modes...");
        const paymentModes = await PaymentMode.find({});
        console.log("Fetched Payment Modes:", paymentModes);
        res.status(200).json({ paymentMode: paymentModes });
    } catch (error) {
        console.error("Error fetching payment modes:", error);
        res.status(500).json({ message: "Error fetching payment modes", error: error.message });
    }
};

// Category Apis
exports.AddCategory = async (req, res) => {
    console.log("Received Add Category Request:", req.body); // ✅ Log incoming request

    const { category } = req.body;
    if (!category) {
        console.error("Error: Category is missing");
        return res.status(400).json({ message: "Category is required" });
    }

    try {
        console.log("Checking if category already exists...");
        const existingCategory = await Category.findOne({ category });
        if (existingCategory) {
            console.warn("Category already exists:", existingCategory);
            return res.status(400).json({ message: "Category already exists" });
        }

        console.log("Saving new category...");
        const newCategory = new Category({ category });
        await newCategory.save();
        console.log("Category added successfully:", newCategory);

        res.status(201).json({ message: "Category added successfully", newCategory: newCategory });
    } catch (error) {
        console.error("Error adding category:", error);
        res.status(500).json({ message: "Error adding category", error: error.message });
    }
};

exports.getCategory = async (req, res) => {
    try {
        console.log("Fetching all categories...");
        const categories = await Category.find({});
        console.log("Fetched Categories:", categories);
        res.status(200).json({ category: categories }); // ✅ Ensure correct response key
    } catch (error) {
        console.error("Error fetching categories:", error);
        res.status(500).json({ message: "Error fetching categories", error: error.message });
    }
};
  