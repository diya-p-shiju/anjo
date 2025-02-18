import { RequestHandler } from 'express';
import bcrypt from 'bcryptjs';
import User from '../../models/UserModel';

const createUserRoute: RequestHandler = async (req, res): Promise<any> => {
    const { name, email, password, role, userCategory, mobileNumber, admissionNumber } = req.body;

    try {
        // Check if all required fields are provided
        if (!name || !email || !password || !role || !mobileNumber ) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Check if the user already exists (check email uniqueness)
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        // Hash the user's password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user instance
        const newUser = new User({
            name,
            admissionNumber: admissionNumber? admissionNumber : "",  // Default admissionNumber to empty string
            email,
            password: hashedPassword,
            role,
            credits: 0,  // Default credits to 0
            userCategory,  // Only set userCategory for 'user' role
            mobileNumber
        });

        // Save the new user to the database
        await newUser.save();

        // Respond with the new user's details (without the password)
        return res.status(201).json({
            message: 'User created successfully',
            user: {
                _id: newUser._id,
                name: newUser.name,
                admissionNumber: newUser.admissionNumber,
                email: newUser.email,
                role: newUser.role,
                userCategory: newUser.userCategory,
                mobileNumber: newUser.mobileNumber,
            }
        });
    } catch (error) {
        console.error('Error creating user:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export default createUserRoute;
