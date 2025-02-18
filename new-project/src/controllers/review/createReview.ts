// controllers/review/createReview.ts
import { RequestHandler } from 'express';
import { z } from 'zod';
import Review from '../../models/ReviewModel';
import Order from '../../models/OrderModel';
import User from '../../models/UserModel';

// Define Zod schema for request body validation
const createReviewSchema = z.object({
    userId: z.string().nonempty("User ID is required"),
    orderId: z.string().nonempty("Order ID is required"),
    menuItem: z.object({
        id: z.string().nonempty("Menu item ID is required"),
        name: z.string().nonempty("Menu item name is required"),
        quantity: z.number().min(1, "Quantity must be at least 1")
    }),
    rating: z.number().min(1).max(5, "Rating must be between 1 and 5"),
    comment: z.string().nonempty("Comment is required"),
    reviewerName: z.string().nonempty("Reviewer name is required"),
    reviewerEmail: z.string().email("Invalid email format"),
    reviewerMobile: z.string().nonempty("Mobile number is required")
});

const createReview: RequestHandler = async (req, res) => {
    try {
        // Parse and validate the request body
        const validatedData = createReviewSchema.parse(req.body);

        // Find the order to get order date and vendor details
        const order = await Order.findById(validatedData.orderId).populate('vendorId');
        if (!order) {
            return res.status(404).json({
                message: 'Order not found',
                status: 'error',
                data: null
            });
        }

        // Check if order is completed
        if (order.status !== 'completed') {
            return res.status(400).json({
                message: 'Can only review completed orders',
                status: 'error',
                data: null
            });
        }

        // Check if review already exists for this order and menu item
        const existingReview = await Review.findOne({
            orderId: validatedData.orderId,
            'menuItem.id': validatedData.menuItem.id
        });

        if (existingReview) {
            return res.status(400).json({
                message: 'Review already exists for this order item',
                status: 'error',
                data: null
            });
        }

        // Create the review with additional order details
        const newReview = new Review({
            ...validatedData,
            orderDate: order.createdAt,
            vendorId: order.vendorId._id,
            vendorName: order.vendorId.name,
        });

        await newReview.save();

        res.status(201).json({
            message: 'Review submitted successfully',
            status: 'success',
            data: newReview
        });
    } catch (error) {
        // Handle Zod validation errors
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                message: 'Validation error',
                status: 'error',
                data: error.errors
            });
        }

        console.error('Error creating review:', error);
        res.status(500).json({
            message: 'Error submitting review',
            status: 'error',
            data: null
        });
    }
};

export default createReview;