import mongoose from "mongoose";

const PublisherSchema = new mongoose.Schema({
    Name: {
        type: mongoose.Schema.Types.String,
        required: true
    },

    Address: {
        Street: {
            type: mongoose.Schema.Types.String,
            required: true
        },

        City: {
            type: mongoose.Schema.Types.String,
            required: true
        },

        Zip: {
            type: mongoose.Schema.Types.String,
            required: true
        }
    },

    PhoneNumber: {
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

PublisherSchema.pre('save', function (next) {
    this.UpdatedAt = Date.now();
    next();
});

export const Publisher = mongoose.model("Publisher", PublisherSchema);
