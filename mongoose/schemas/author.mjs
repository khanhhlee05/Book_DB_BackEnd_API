import mongoose from "mongoose";

const AuthorSchema = new mongoose.Schema({
    firstName: {
        type: mongoose.Schema.Types.String,
        required: [true, 'First name is required'],
        trim: true,
        minlength: [2, 'First name must be at least 2 characters long'],
        maxlength: [50, 'First name must be at most 50 characters long']
    },

    lastName: {
        type: mongoose.Schema.Types.String,
        required: [true, 'Last name is required'],
        trim: true,
        minlength: [2, 'Last name must be at least 2 characters long'],
        maxlength: [50, 'Last name must be at most 50 characters long']
    },

    dateOfBirth: {
        type: mongoose.Schema.Types.Date,
        required: [true, 'Date of birth is required'],
        validate: {
            validator: function(value) {
                return value < Date.now();
            },
            message: 'Date of birth must be in the past'
        }
    },

    nationality: {
        type: mongoose.Schema.Types.String,
        required: [true, 'Nationality is required'],
        trim: true,
        minlength: [2, 'Nationality must be at least 2 characters long'],
        maxlength: [50, 'Nationality must be at most 50 characters long']
    },

    biography: {
        type: mongoose.Schema.Types.String,
        required: [true, 'Biography is required'],
        trim: true,
        minlength: [10, 'Biography must be at least 10 characters long'],
        maxlength: [2000, 'Biography must be at most 2000 characters long']
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

AuthorSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

export const Author = mongoose.model("Author", AuthorSchema);
