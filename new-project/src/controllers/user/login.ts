import { RequestHandler } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../../models/UserModel';

// JWT Secrets (store these securely, not hardcoded in production)
const JWT_SECRET = 'your_jwt_secret'; // Access token secret key
const REFRESH_TOKEN_SECRET = 'your_refresh_token_secret'; // Refresh token secret key

// Function to generate refresh token
const generateRefreshToken = (userId: string) => {
    return jwt.sign({ userId }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' }); // Refresh token expires in 7 days
};

const loginRoute: RequestHandler = async (req, res): Promise<any> => {
    const { email, password } = req.body;

    try {
        // Check if the user exists in the database
        const user = await User.findOne({
            $or: [{ email }, { admissionNumber: email }]
        }).lean();

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Compare the provided password with the stored hash using bcrypt
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        // Generate JWT Access Token
        const accessToken = jwt.sign(
            { userId: user._id, email: user.email, role: user.role },
            JWT_SECRET, // Access token secret key
            { expiresIn: '1h' } // Access token expires in 1 hour
        );

        // Generate JWT Refresh Token
        const refreshToken = generateRefreshToken(user._id.toString());

        // Send the response with the user data, access token, and refresh token
        return res.json({
            message: 'Login successful',
            accessToken,  // Access token
            refreshToken, // Refresh token
            user: {
                ...user,
                password: "*****"
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export default loginRoute;
