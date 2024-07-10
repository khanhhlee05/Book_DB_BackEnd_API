import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema({
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Author'
    },
    title: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    genres: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Genre'
    }],
    dateImported: {
        type: mongoose.Schema.Types.Date,
        required: true
    },
    publishedDate: {
        type: mongoose.Schema.Types.Date,
        required: true
    },
    copiesAvailable: {
        type: mongoose.Schema.Types.Number,
        required: true
    },
    publisherId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Publisher'
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
