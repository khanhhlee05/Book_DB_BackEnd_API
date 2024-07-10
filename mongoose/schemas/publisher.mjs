import mongoose from "mongoose";
import validator from "validator";

const PublisherSchema = new mongoose.Schema({
    name: {
        type: mongoose.Schema.Types.String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters long'],
        maxlength: [100, 'Name must be at most 100 characters long']
    },

    address: {
        street: {
            type: mongoose.Schema.Types.String,
            required: [true, 'Street address is required'],
            trim: true,
            minlength: [2, 'Street must be at least 2 characters long'],
            maxlength: [100, 'Street must be at most 100 characters long']
        },

        city: {
            type: mongoose.Schema.Types.String,
            required: [true, 'City is required'],
            trim: true,
            minlength: [2, 'City must be at least 2 characters long'],
            maxlength: [50, 'City must be at most 50 characters long']
        },

        zip: {
            type: mongoose.Schema.Types.String,
            required: [true, 'Zip code is required'],
            validate: {
                validator: (value) => validator.isPostalCode(value, 'any'),
                message: 'Zip code must be valid'
            }
        }
    },

    phoneNumber: {
        type: mongoose.Schema.Types.String,
        required: [true, 'Phone number is required'],
        unique: true,
        validate: {
            validator: (value) => validator.isMobilePhone(value, 'any'),
            message: 'Phone number must be valid'
        }
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

PublisherSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

export const Publisher = mongoose.model("Publisher", PublisherSchema);
