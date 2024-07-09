import mongoose from "mongoose";

const LoanSchema = new mongoose.Schema({
    RentDate: {
        type: mongoose.Schema.Types.Date,
        required: true
    },

    RentDue: {
        type: mongoose.Schema.Types.Date,
        required: true
    },

    ActualReturnDate: {
        type: mongoose.Schema.Types.Date
    },

    ItemID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Item'
    },

    UserID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },

    Note: {
        type: mongoose.Schema.Types.String
    },

    CreatedAt: {
        type: mongoose.Schema.Types.Date,
        default: Date.now
    },

    UpdatedAt: {
        type: mongoose.Schema.Types.Date,
        default: Date.now
    }
});

LoanSchema.pre('save', function (next) {
    this.UpdatedAt = Date.now();
    next();
});

export const Loan = mongoose.model("Loan", LoanSchema);
