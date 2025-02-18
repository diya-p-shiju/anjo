import { RequestHandler } from 'express';
import Order from '../../models/OrderModel';
import User from '../../models/UserModel';
import mongoose from 'mongoose';

const createOrder: RequestHandler = async (req, res) => {
    const { userId, menuItems, totalAmount, deliveryTime, vendorId,
        name,
        email,
        mobileNumber
    } = req.body;

    console.log("Starting order creation process...");

    try {
        // First, get a fresh read of the user data
        const freshUser = await User.findById(userId).select('+credits').lean();
        console.log("Direct DB Query Result:", freshUser);

        // Double-check with a raw MongoDB query
        const rawUser = await mongoose.connection.db.collection('users')
            .findOne({ _id: new mongoose.Types.ObjectId(userId) });
        console.log("Raw MongoDB Query Result:", rawUser);

        if (!freshUser) {
            return res.status(404).json({
                message: 'User not found',
                status: 'error',
                data: null
            });
        }

        console.log("Credit Verification:", {
            userCreditsFromModel: freshUser.credits,
            userCreditsFromRaw: rawUser?.credits,
            requestedAmount: totalAmount,
            difference: freshUser.credits - totalAmount
        });

        // Now use the freshly queried data for comparison
        if (freshUser.credits < totalAmount) {
            return res.status(400).json({
                message: `Insufficient credits. Required: ${totalAmount}, Available: ${freshUser.credits}`,
                status: 'error',
                data: null
            });
        }

        // Create order with validated data
        const newOrder = new Order({
            vendorId,
            userId,
            menuItems,
            totalAmount,
            deliveryTime,
            name,
            email,
            mobileNumber,
            status: 'pending',
            paymentStatus: 'paid'
        });

        // Calculate new credits
        const newCredits = freshUser.credits - totalAmount;
        
        console.log("Credit Update Operation:", {
            userId,
            oldCredits: freshUser.credits,
            deduction: totalAmount,
            newCredits,
            updateQuery: { $set: { credits: newCredits } }
        });

        // Use a transaction to ensure atomic update
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            // Save order and update credits atomically
            await newOrder.save({ session });
            const updatedUser = await User.findByIdAndUpdate(
                userId,
                { $set: { credits: newCredits } },
                { new: true, session }
            );

            if (!updatedUser) {
                throw new Error('Failed to update user credits');
            }

            await session.commitTransaction();
            
            console.log("Transaction completed successfully");
            console.log("Final user state:", await User.findById(userId).lean());

            res.status(201).json({
                message: 'Order placed successfully',
                status: 'success',
                data: {
                    order: newOrder,
                    updatedCredits: newCredits
                }
            });
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }

    } catch (error: any) {
        console.error("Order creation error:", error);
        res.status(500).json({
            message: error.message || 'Error placing order',
            status: 'error',
            data: null
        });
    }
};

export default createOrder;