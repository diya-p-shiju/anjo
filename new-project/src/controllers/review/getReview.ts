// controllers/review/getReview.ts
import { RequestHandler } from 'express';
import Review from '../../models/ReviewModel';

const getReview: RequestHandler = async (req, res) => {
    try {
        const { orderId, menuItemId, userId, vendorId, page = 1, pageSize = 10 } = req.query;
        
        // Build query based on provided filters
        const query: any = {};
        if (orderId) query.orderId = orderId;
        if (menuItemId) query['menuItem.id'] = menuItemId;
        if (userId) query.userId = userId;
        if (vendorId) query.vendorId = vendorId;

        // Execute query with pagination
        const reviews = await Review.find(query)
            .sort({ createdAt: -1 })
            .skip((Number(page) - 1) * Number(pageSize))
            .limit(Number(pageSize));

        const total = await Review.countDocuments(query);

        return res.status(200).json({
            message: "Reviews fetched successfully",
            status: "success",
            data: reviews,
            pagination: {
                current: Number(page),
                pageSize: Number(pageSize),
                total
            }
        });
    } catch (error) {
        console.error('Error fetching reviews:', error);
        return res.status(500).json({
            message: "Error fetching reviews",
            status: "error",
            data: null
        });
    }
};

export default getReview;