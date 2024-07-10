import mongoose from "mongoose";

const PublisherSchema = new mongoose.Schema({
    name: {
        type: mongoose.Schema.Types.String,
        required: true
    },

    address: {
        street: {
            type: mongoose.Schema.Types.String,
            required: true
        },

        city: {
            type: mongoose.Schema.Types.String,
            required: true
        },

        zip: {
            type: mongoose.Schema.Types.String,
            required: true
        }
    },

    phoneNumber: {
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

PublisherSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

export const Publisher = mongoose.model("Publisher", PublisherSchema);
