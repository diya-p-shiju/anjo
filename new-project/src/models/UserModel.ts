// Import mongoose
import mongoose from 'mongoose';

// Define the schema for the User model
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    admissionNumber: {
        type: String,
        required: false,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'vendor', 'user'],
        required: true
    },
    userCategory: {
        type: String,
        enum: ['management', 'teaching_staff', 'non_teaching_staff', 'student', 'union'],
        required: true
    },
    credits: {
        type: Number,
        default: 0
    },
    mobileNumber: {
        type: String,
        required: true
    }
}, { timestamps: true }); // Enable timestamps

// Create and export the model
const User = mongoose.model('User', UserSchema);
export default User;
