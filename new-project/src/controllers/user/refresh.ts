import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';

// JWT Secret for refresh token (use the same secret you generated the refresh token with)
const REFRESH_TOKEN_SECRET = 'your_refresh_token_secret';

const refreshTokenRoute: RequestHandler = async (req, res): Promise<any> => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(400).json({ message: 'Refresh token is required' });
    }

    try {
        // Verify the refresh token
        const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as { userId: string };

        // Generate a new access token
        const accessToken = jwt.sign(
            { userId: decoded.userId },
            'your_jwt_secret', // The secret used to generate access tokens
            { expiresIn: '1h' } // Access token expires in 1 hour
        );

        // Send the new access token in the response
        return res.json({
            message: 'Access token refreshed successfully',
            accessToken
        });
    } catch (error) {
        console.error('Refresh token error:', error);
        return res.status(401).json({ message: 'Invalid or expired refresh token' });
    }
};

export default refreshTokenRoute;
