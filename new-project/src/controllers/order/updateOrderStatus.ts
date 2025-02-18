import { RequestHandler } from 'express';
import Order from '../../models/OrderModel';

const updateOrderStatus: RequestHandler = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
        return res.status(400).json({
            message: 'No status provided to update',
            status: 'error',
            data: null
        });
    }

    try {
        // Find the order by ID
        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({
                message: 'Order not found',
                status: 'error',
                data: null
            });
        }

        // Check if the status to be updated is 'canceled'
        if (status === 'canceled') {
            const oneHourAgo = new Date();
            oneHourAgo.setHours(oneHourAgo.getHours() - 1);

            // Check if the orderDate is within the last hour
            if (new Date(order.orderDate) < oneHourAgo) {
                return res.status(400).json({
                    message: 'Order cannot be canceled after one hour of order placement',
                    status: 'error',
                    data: null
                });
            }
        }

        // Update the order status
        order.status = status;
        const updatedOrder = await order.save();

        res.status(200).json({
            message: 'Order status updated successfully',
            status: 'success',
            data: updatedOrder
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error updating order status',
            status: 'error',
            data: null
        });
    }
};

export default updateOrderStatus;
