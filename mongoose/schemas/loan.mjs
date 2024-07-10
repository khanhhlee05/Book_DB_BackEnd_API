import mongoose from "mongoose";

const LoanSchema = new mongoose.Schema({
    rentDate: {
        type: mongoose.Schema.Types.Date,
        required: true
    },

    rentDue: {
        type: mongoose.Schema.Types.Date,
        required: true
    },

    actualReturnDate: {
        type: mongoose.Schema.Types.Date
    },

    itemId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Item'
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },

    note: {
        type: mongoose.Schema.Types.String
    },

    createdAt: {
        type: mongoose.Schema.Types.Date,
        default: Date.now
    },

    updatedAt: {
        type: mongoose.Schema.Types.Date,
        default: Date.now
    }
});

LoanSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

export const Loan = mongoose.model("Loan", LoanSchema);
