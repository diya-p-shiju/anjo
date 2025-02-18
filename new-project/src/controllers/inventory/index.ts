import { RequestHandler } from 'express';
import { z } from 'zod';
import Inventory from '../../models/InventoryModel';

// Define Zod schema for updating inventory
const updateInventorySchema = z.object({
    vendorId: z.string().nonempty("Vendor ID is required"),
    stock: z.array(
        z.object({
            name: z.string().nonempty("Stock item name is required"),
            quantity: z.number().min(0, "Quantity cannot be negative")
        })
    )
});

// Define Zod schema for removing items from inventory
const removeInventorySchema = z.object({
    vendorId: z.string().nonempty("Vendor ID is required"),
    itemName: z.string().nonempty("Item name is required")
});

// Add or reduce stock
const updateInventory: RequestHandler = async (req, res) => {
    try {
        // Parse and validate the request body using Zod
        const validatedData = updateInventorySchema.parse(req.body);
        const { vendorId, stock } = validatedData;

        // Find the inventory by vendorId
        let inventory = await Inventory.findOne({ vendorId });

        if (!inventory) {
            // If no inventory exists for the vendor, create a new one
            inventory = new Inventory({ vendorId, stock });
        } else {
            // Update existing inventory
            stock.forEach(({ name, quantity }) => {
                const item = inventory?.stock.find(item => item.name === name);
                if (item) {
                    // Update quantity if item exists
                    item.quantity = quantity;
                } else {
                    // Add new item if it doesn't exist
                    inventory?.stock.push({ name, quantity });
                }
            });
        }

        await inventory.save();

        res.status(200).json({
            message: 'Inventory updated successfully',
            status: 'success',
            data: inventory
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

        console.error(error);
        res.status(500).json({
            message: 'Error updating inventory',
            status: 'error',
            data: null
        });
    }
};

const removeInventory: RequestHandler = async (req, res) => {
    try {
        // Parse and validate the request body using Zod
        const validatedData = removeInventorySchema.parse(req.body);
        const { vendorId, itemName } = validatedData;

        // Find the inventory by vendorId
        const inventory = await Inventory.findOne({ vendorId });

        if (!inventory) {
            return res.status(404).json({
                message: 'Inventory not found',
                status: 'error',
                data: null
            });
        }

        // Remove the item from stock using Mongoose's DocumentArray API
        const itemIndex = inventory.stock.findIndex(item => item.name === itemName);
        if (itemIndex !== -1) {
            inventory.stock.splice(itemIndex, 1);
            await inventory.save();

            res.status(200).json({
                message: 'Item removed from inventory successfully',
                status: 'success',
                data: inventory
            });
        } else {
            res.status(404).json({
                message: 'Item not found in inventory',
                status: 'error',
                data: null
            });
        }
    } catch (error) {
        // Handle Zod validation errors
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                message: 'Validation error',
                status: 'error',
                data: error.errors
            });
        }

        console.error(error);
        res.status(500).json({
            message: 'Error removing item from inventory',
            status: 'error',
            data: null
        });
    }
};

export { updateInventory, removeInventory };
