import Menu from '../../models/MenuModel';
import { RequestHandler } from 'express';

const updateMenu: RequestHandler = async (req, res) => {
    const { vendorId, items } = req.body;

    console.log("the controller reached");
    // Validate that vendorId and items are provided
    if (!vendorId || !items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({
            message: 'Missing required fields or items array is empty',
            status: 'error',
            data: null
        });
    }

    try {
        // Update the menu if it exists
        const menu = await Menu.findOneAndUpdate(
            { vendorId }, // Filter by vendorId
            { $set: { items } }, // Update the items array
            {
                new: true, // Return the updated document
                upsert: true, // Create a new document if none is found
                setDefaultsOnInsert: true // Set default values on insert
            }
        );

        res.status(200).json({
            message: 'Menu item upserted successfully',
            status: 'success',
            data: menu
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error upserting menu item',
            status: 'error',
            data: null
        });
    }
};

export default updateMenu;