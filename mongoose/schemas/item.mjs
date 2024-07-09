import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema({
    AuthorID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Author'
    },
    Title: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    Genres: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Genre'
    }],
    DateImported: {
        type: mongoose.Schema.Types.Date,
        required: true
    },
    PublishedDate: {
        type: mongoose.Schema.Types.Date,
        required: true
    },
    CopiesAvailable: {
        type: mongoose.Schema.Types.Number,
        required: true
    },
    PublisherID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Publisher'
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

ItemSchema.pre('save', function (next) {
    this.UpdatedAt = Date.now();
    next();
});

export default mongoose.model('Item', ItemSchema);
