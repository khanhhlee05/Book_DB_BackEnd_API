import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs"


const UserSchema = new mongoose.Schema({
    firstName: {
        type: mongoose.Schema.Types.String,
        required: [true, 'First name is required'],
        trim: true,
        minlength: [2, 'First name must be at least 2 characters long'],
        maxlength: [50, 'First name must be at most 50 characters long']
    },

    lastName: {
        type: mongoose.Schema.Types.String,
        required: [true, 'Last name is required'],
        trim: true,
        minlength: [2, 'Last name must be at least 2 characters long'],
        maxlength: [50, 'Last name must be at most 50 characters long']
    },

    password: {
        type: mongoose.Schema.Types.String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long']
    },

    email: {
        type: mongoose.Schema.Types.String,
        required: [true, 'Email is required'],
        unique: true,
        validate: {
            validator: (value) => validator.isEmail(value),
            message: 'Email must be valid'
        }
    },

    membership: [
        {
            startDate: {
                type: mongoose.Schema.Types.Date,
                required: [true, 'Membership start date is required']
            },
            endDate: {
                type: mongoose.Schema.Types.Date,
                required: [true, 'Membership end date is required'],
                validate: {
                    validator: function(value) {
                        return value > this.startDate;
                    },
                    message: 'End date must be after start date'
                }
            }
        }
    ],

    phoneNumber: {
        type: mongoose.Schema.Types.String,
        required: [true, 'Phone number is required'],
        unique: true,
        validate: {
            validator: (value) => validator.isMobilePhone(value),
            message: 'Phone number must be valid'
        }
    },

    address: {
        street: {
            type: mongoose.Schema.Types.String,
            required: [true, 'Street address is required'],
            trim: true
        },
        city: {
            type: mongoose.Schema.Types.String,
            required: [true, 'City is required'],
            trim: true
        },
        zipCode: {
            type: mongoose.Schema.Types.String,
            required: [true, 'Zip code is required'],
            trim: true,
            validate: {
                validator: (value) => validator.isPostalCode(value, 'any'),
                message: 'Zip code must be valid'
            }
        }
    },

    role: {
        type: mongoose.Schema.Types.String,
        enum: ['user', 'admin'],
        required: [true, 'Role is required']
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
    const salt = bcrypt.genSaltSync()
    this.password = bcrypt.hashSync(this.password, salt)
    next();
}); 

UserSchema.statics.login = async function (email, password){
    const user = await this.findOne({email})
    if (user){
        const auth = await bcrypt.compare(password, user.password)
        if (auth) {
            return user;
        }
        throw Error("Incorrect Password")
    }
    throw Error("Incorrect Email")
}


export const User = mongoose.model("User", UserSchema);
