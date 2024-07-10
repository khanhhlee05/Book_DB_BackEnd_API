import mongoose from "mongoose";
import validator from "validator";

const ItemSchema = new mongoose.Schema({
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Author ID is required'],
        ref: 'Author',
        validate: {
            validator: mongoose.Types.ObjectId.isValid,
            message: 'Invalid author ID'
        }
    },
    title: {
        type: mongoose.Schema.Types.String,
        required: [true, 'Title is required'],
        trim: true,
        minlength: [1, 'Title must be at least 1 character long'],
        maxlength: [255, 'Title must be at most 255 characters long']
    },
    genres: [{
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'At least one genre is required'],
        ref: 'Genre',
        validate: {
            validator: mongoose.Types.ObjectId.isValid,
            message: 'Invalid genre ID'
        }
    }],
    dateImported: {
        type: mongoose.Schema.Types.Date,
        required: [true, 'Date imported is required'],
        default: Date.now,
        validate: {
            validator: (value) => validator.isDate(value),
            message: 'Date imported must be a valid date'
        }
    },
    publishedDate: {
        type: mongoose.Schema.Types.Date,
        required: [true, 'Published date is required'],
        validate: {
            validator: (value) => validator.isDate(value),
            message: 'Published date must be a valid date'
        }
    },
    copiesAvailable: {
        type: mongoose.Schema.Types.Number,
        required: [true, 'Number of available copies is required'],
        min: [0, 'Number of available copies must be at least 0']
    },
    publisherId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Publisher ID is required'],
        ref: 'Publisher',
        validate: {
            validator: mongoose.Types.ObjectId.isValid,
            message: 'Invalid publisher ID'
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

ItemSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

export default mongoose.model('Item', ItemSchema);
