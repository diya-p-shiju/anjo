import { RequestHandler } from 'express';
import Order from '../../models/OrderModel';

const updateOrder: RequestHandler = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    if (!updateData || Object.keys(updateData).length === 0) {
        return res.status(400).json({
            message: 'No data provided to update',
            status: 'error',
            data: null
        });
    }

    try {
        // Find the order by ID and update it
        const updatedOrder = await Order.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedOrder) {
            return res.status(404).json({
                message: 'Order not found',
                status: 'error',
                data: null
            });
        }

        res.status(200).json({
            message: 'Order updated successfully',
            status: 'success',
            data: updatedOrder
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error updating order',
            status: 'error',
            data: null
        });
    }
};

export default updateOrder;
