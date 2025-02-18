import { RequestHandler } from 'express';
import Order from '../../models/OrderModel';

const getOrder: RequestHandler = async (req, res) => {
    try {
        const query: any = req.query; // Initialize query object

        // If there is no ID parameter, fetch all orders
           if (!req.params.id) {
            const orders = await Order.find(query)
                .sort({ orderDate: -1 })
                .lean(); // Add lean() for better performance

            return res.status(200).json({
                message: "Orders Fetched Successfully",
                status: "success",
                data: orders
            });
        }

        // If the ID is provided, fetch a single order by ID
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({
                message: "Order not found",
                status: "error",
                data: null
            });
        }

        return res.status(200).json({
            message: "Order Fetched Successfully",
            status: "success",
            data: order
        });
    } catch (error) {
        return res.status(400).json({
            message: "Error Fetching Orders",
            status: "error",
            data: null
        });
    }
};

export default getOrder;
