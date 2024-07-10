import mongoose from "mongoose";

const GenreSchema = new mongoose.Schema({
    genre: {
        type: mongoose.Schema.Types.String,
        required: [true, 'Genre is required'],
        unique: true,
        trim: true,
        minlength: [2, 'Genre must be at least 2 characters long'],
        maxlength: [50, 'Genre must be at most 50 characters long']
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

GenreSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

export const Genre = mongoose.model("Genre", GenreSchema);
