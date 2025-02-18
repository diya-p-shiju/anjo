// Import mongoose
import mongoose from 'mongoose';

// Define the schema for the Menu model
const MenuSchema = new mongoose.Schema({
    vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Link to the vendor's User model
        required: true
    },
    items: [{
        name: {
            type: String,
            required: true
        },
        calories: {
            type: String,
            required: true,
            default: 0
        },
        description: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        availability: {
            type: Boolean,
            default: true // Item is available by default
        },
        orderQuantity: {
            type: Number,
            default: 0 // Initial quantity is zero, will be updated with orders
        },
        maxOrderQuantity: {
            type: Number,
            required: true, // Max order quantity must be specified
            default: 10 // Default maximum order quantity
        }
    }]
}, { timestamps: true }); // Enable timestamps

// Create and export the model
const Menu = mongoose.model('Menu', MenuSchema);
export default Menu;
