// Import mongoose
import mongoose from 'mongoose';

// Define the schema for the Inventory model
const InventorySchema = new mongoose.Schema({
    vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true
    },
    stock: [
        {
            name: {
                type: String,
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                default: 0
            }
        }
    ]
}, { timestamps: true }); // Enable timestamps (createdAt, updatedAt)

// Create and export the model
const Inventory = mongoose.model('Inventory', InventorySchema);
export default Inventory;