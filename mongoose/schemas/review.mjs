import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 1000
    }
});

const reviewSchema = new mongoose.Schema({
    itemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    reviewText: {
        type: String,
        required: true,
        trim: true,
        minlength: 10,
        maxlength: 2000
    },
    comments: [commentSchema],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

reviewSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const Review = mongoose.model('Review', reviewSchema);
export default Review;
