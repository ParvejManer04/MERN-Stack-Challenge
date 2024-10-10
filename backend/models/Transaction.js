const mongoose = require('mongoose');

const categoryEnum = ['Electronics', 'Clothing', 'Food', 'Books', 'Furniture'];

const transactionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true, 
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true, 
        min: 0, 
    },
    dateOfSale: {
        type: Date,
        required: true, 
        default: Date.now, 
    },
    category: {
        type: String,
        enum: categoryEnum, 
        required: true, 
    },
}, {
    timestamps: true,
});

const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;
