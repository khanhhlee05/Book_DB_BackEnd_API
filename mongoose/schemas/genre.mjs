import mongoose from "mongoose";

const GenreSchema = new mongoose.Schema({
    Genre: {
        type: mongoose.Schema.Types.String,
        required: true,
        unique: true
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

GenreSchema.pre('save', function (next) {
    this.UpdatedAt = Date.now();
    next();
});

export const Genre = mongoose.model("Genre", GenreSchema);
