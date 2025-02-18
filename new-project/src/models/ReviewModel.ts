// models/ReviewModel.ts
import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
    // User who made the review
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Order details
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    orderDate: {
        type: Date,
        required: true
    },
    // Menu item being reviewed
    menuItem: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'MenuItem',
            required: true
        },
        name: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        }
    },
    // Vendor info
    vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    vendorName: {
        type: String,
        required: true
    },
    // Review content
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true
    },
    // Reviewer info
    reviewerName: {
        type: String,
        required: true
    },
    reviewerEmail: {
        type: String,
        required: true
    },
    reviewerMobile: {
        type: String,
        required: true
    }
}, { 
    timestamps: true 
});

const Review = mongoose.model('Review', ReviewSchema);
export default Review;