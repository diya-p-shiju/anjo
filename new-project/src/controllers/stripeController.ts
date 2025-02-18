import Stripe from 'stripe';
import { Request, Response } from 'express';
import dotenv from 'dotenv';
import User from '../models/UserModel'; // Add this import

dotenv.config();

const stripe = new Stripe('sk_test_51P52w8SBNPGsIMEIL2KTOGyFcmAegwcTHa3F0lQT9aW9FG3MJU6kD2yCmcjh6SZFEsymo8Dp6XyvBh8OrJiDUI2I00cLLO7n0G' as string, {
    apiVersion: '2022-11-15'
});

const YOUR_DOMAIN = 'http://localhost:5173';

const createCheckoutSession = async (req: Request, res: Response) => {
    try {
        const { amount, userId } = req.body;
        
        if (!amount || !userId) {
            return res.status(400).json({ error: 'Amount and userId are required' });
        }

        // First, check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'inr',
                    product_data: {
                        name: 'Credits',
                    },
                    unit_amount: amount,
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: `${YOUR_DOMAIN}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${YOUR_DOMAIN}/payment/cancel`,
            metadata: {
                userId: userId,
                amount: amount.toString()
            }
        });

        // After successful session creation, update credits
        stripe.checkout.sessions.retrieve(session.id).then(async (session) => {
            if (session.payment_status === 'paid') {
                const amountPaid = Number(session.metadata?.amount) || 0;
                // Convert to rupees (since amount is in paisa)
                const creditsToAdd = amountPaid / 100;
                
                // Update user's credits
                const updatedUser = await User.findByIdAndUpdate(
                    userId,
                    { $inc: { credits: creditsToAdd } },
                    { new: true }
                );

                console.log('Credits updated:', updatedUser?.credits);
            }
        });

        res.json({ id: session.id });
    } catch (error) {
        console.error('Stripe session creation error:', error);
        res.status(500).json({ error: 'Failed to create checkout session' });
    }
};

export default createCheckoutSession;