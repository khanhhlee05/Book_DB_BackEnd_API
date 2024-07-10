import mongoose from "mongoose";

const GenreSchema = new mongoose.Schema({
    genre: {
        type: mongoose.Schema.Types.String,
        required: true,
        unique: true
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

GenreSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

export const Genre = mongoose.model("Genre", GenreSchema);
