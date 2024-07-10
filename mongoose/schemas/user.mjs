import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    firstName: {
        type: mongoose.Schema.Types.String,
        required: true
    },

    lastName: {
        type: mongoose.Schema.Types.String,
        required: true
    },

    password: {
        type: mongoose.Schema.Types.String,
        required: true
    },

    email: {
        type: mongoose.Schema.Types.String,
        required: true,
        unique: true
    },

    membership: [
        {
            startDate: {
                type: mongoose.Schema.Types.Date,
                required: true
            },
            endDate: {
                type: mongoose.Schema.Types.Date,
                required: true
            }
        }
    ],

    phoneNumber: {
        type: mongoose.Schema.Types.String,
        required: true,
        unique: true
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
        zipCode: {
            type: mongoose.Schema.Types.String,
            required: true
        }
    },

    role: {
        type: mongoose.Schema.Types.String,
        enum: ['user', 'admin'],
        required: true
    },

    lastLogin: {
        type: mongoose.Schema.Types.Date
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

UserSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

export const User = mongoose.model("User", UserSchema);
