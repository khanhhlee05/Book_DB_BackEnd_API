import mongoose from "mongoose";

const AuthorSchema = new mongoose.Schema({
    FirstName: {
        type: mongoose.Schema.Types.String,
        required: true
    },

    LastName: {
        type: mongoose.Schema.Types.String,
        required: true
    },

    DateOfBirth: {
        type: mongoose.Schema.Types.Date,
        required: true
    },

    Nationality: {
        type: mongoose.Schema.Types.String,
        required: true
    },

    Biography: {
        type: mongoose.Schema.Types.String,
        required: true
    },

    CreatedAt: {
        type: mongoose.Schema.Types.Date,
        required: true,
        default: Date.now
    },

    UpdatedAt: {
        type: mongoose.Schema.Types.Date,
        required: true,
        default: Date.now
    }
});

AuthorSchema.pre('save', function (next) {
    this.UpdatedAt = Date.now();
    next();
});

export const Author = mongoose.model("Author", AuthorSchema);
