const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
    date: {
        type: String, // YYYY-MM-DD format
        required: true,
    },
    loanTitle: {
        type: String,
        required: true,
    },
    loanAmount: {
        type: Number,
        required: true,
    },
    interestRate: {
        type: Number, // Interest rate per day
        required: true,
    },
    dailyInterestAmount: {
        type: Number,
        required: true,
    },
    loanTerm: {
        type: Number,
        default: 30, // Default loan term is 30 days
    },
    dailyEMI: {
        type: Number,
        required: true,
    },
    dueDate: {
        type: String, // YYYY-MM-DD format
        required: true,
    },
    loanIssuedBy: {
        type: String,
        required: true,
    }
}, {
    timestamps: true
});

const Loan = mongoose.model('Loan', loanSchema);

module.exports = Loan;
