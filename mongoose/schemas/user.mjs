import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    FirstName: {
        type: mongoose.Schema.Types.String,
        required: true
    },

    LastName: {
        type: mongoose.Schema.Types.String,
        required: true
    },

    Password: {
        type: mongoose.Schema.Types.String,
        required: true
    },

    Email: {
        type: mongoose.Schema.Types.String,
        required: true,
        unique: true
    },

    Membership: [
        {
            StartDate: {
                type: mongoose.Schema.Types.Date,
                required: true
            },
            EndDate: {
                type: mongoose.Schema.Types.Date,
                required: true
            }
        }
    ],

    PhoneNumber: {
        type: mongoose.Schema.Types.String,
        required: true,
        unique: true
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
        ZipCode: {
            type: mongoose.Schema.Types.String,
            required: true
        }
    },

    Role: {
        type: mongoose.Schema.Types.String,
        enum: ['user', 'admin'],
        required: true
    },

    LastLogin: {
        type: mongoose.Schema.Types.Date
    },

    CreatedAt: {
        type: mongoose.Schema.Types.Date,
        default: Date.now
    },

    UpdatedAt: {
        type: mongoose.Schema.Types.Date,
        default: Date.now
    }
});

UserSchema.pre('save', function (next) {
    this.UpdatedAt = Date.now();
    next();
});

export const User = mongoose.model("User", UserSchema);
