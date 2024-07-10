import mongoose from "mongoose";

const AuthorSchema = new mongoose.Schema({
    firstName: {
        type: mongoose.Schema.Types.String,
        required: true
    },

    lastName: {
        type: mongoose.Schema.Types.String,
        required: true
    },

    dateOfBirth: {
        type: mongoose.Schema.Types.Date,
        required: true
    },

    nationality: {
        type: mongoose.Schema.Types.String,
        required: true
    },

    biography: {
        type: mongoose.Schema.Types.String,
        required: true
    },

    createdAt: {
        type: mongoose.Schema.Types.Date,
        required: true,
        default: Date.now
    },

    updatedAt: {
        type: mongoose.Schema.Types.Date,
        required: true,
        default: Date.now
    }
});

AuthorSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

export const Author = mongoose.model("Author", AuthorSchema);
