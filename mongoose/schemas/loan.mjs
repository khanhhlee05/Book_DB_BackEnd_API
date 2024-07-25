import mongoose from "mongoose";
import validator from "validator";

const LoanSchema = new mongoose.Schema({
    rentDate: {
        type: mongoose.Schema.Types.Date,
        required: [true, 'Rent date is required'],
        validate: {
            validator: (value) => validator.isDate(value),
            message: 'Rent date must be a valid date'
        }
    },

    rentDue: {
        type: mongoose.Schema.Types.Date,
        required: [true, 'Rent due date is required'],
        validate: {
            validator: (value) => validator.isDate(value),
            message: 'Rent due date must be a valid date'
        }
    },

    actualReturnDate: {
        type: mongoose.Schema.Types.Date,
        validate: {
            validator: (value) => value === null || validator.isDate(value),
            message: 'Actual return date must be a valid date'
        }
    },


    itemId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Item ID is required'],
        ref: 'Item',
        validate: {
            validator: mongoose.Types.ObjectId.isValid,
            message: 'Invalid item ID'
        }
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'User ID is required'],
        ref: 'User',
        validate: {
            validator: mongoose.Types.ObjectId.isValid,
            message: 'Invalid user ID'
        }
    },

    note: {
        type: mongoose.Schema.Types.String,
        trim: true,
        maxlength: [1000, 'Note must be at most 1000 characters long']
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
