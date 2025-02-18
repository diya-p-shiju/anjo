// Import mongoose
import mongoose from 'mongoose';

// Define the schema for the Order model
const OrderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model (who placed the order)
        required: true
    },
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },


    mobileNumber: {
        type: String || Number,
        required: true
    },

    vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model (who placed the order)
        required: true
    },
    menuItems: [{
        menuItemId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'MenuItem', // Reference to the menu item being ordered
            required: true
        },
        calories: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        totalPrice: {
            type: Number,
            required: true
        }
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'completed', 'canceled'],
        default: 'pending' // Order starts as pending
    },
    paymentStatus: {
        type: String,
        enum: ['unpaid', 'paid', 'failed'],
        default: 'paid' // Initially unpaid
    },
    orderDate: {
        type: Date,
        default: Date.now
    },
    deliveryTime: {
        type: Date,
        required: true // Estimated delivery time
    }
}, { timestamps: true }); // Enable timestamps (createdAt, updatedAt)

// Create and export the model
const Order = mongoose.model('Order', OrderSchema);
export default Order;
