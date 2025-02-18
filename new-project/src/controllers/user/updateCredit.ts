import { RequestHandler } from 'express';
import User from '../../models/UserModel';

const updateCredit: RequestHandler = async (req, res) => {
    const { credits } = req.body;

    try {
        // Find the user by ID
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update credits and ensure it doesn't go below 0
        user.credits = Math.max(0, credits);

        // Save the updated user
        await user.save();

        // Respond with the updated credits
        res.json({ credits: user.credits });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export default updateCredit;
