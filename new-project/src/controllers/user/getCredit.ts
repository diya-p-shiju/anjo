import { RequestHandler } from 'express';
import User from '../../models/UserModel';

const getCredit: RequestHandler = async (req, res) => {

    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ credits: user.credits });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }

};

export default getCredit;
