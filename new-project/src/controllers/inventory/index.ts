import { Request, Response } from 'express';
import Inventory from '../../models/InventoryModel';

// Get all inventory items
export const getAllInventory = async (req: Request, res: Response) => {
  try {
    const { category, status, sortBy = 'name', sortOrder = 'asc' } = req.query;
    
    // Build filter
    const filter: any = {};
    if (category) filter.category = category;
    if (status) filter.status = status;
    
    // Build sort options
    const sort: any = {};
    sort[sortBy as string] = sortOrder === 'desc' ? -1 : 1;
    
    const inventory = await Inventory.find(filter).sort(sort);
    
    return res.status(200).json({
      status: 'success',
      data: inventory,
    });
  } catch (error) {
    console.error('Error fetching inventory:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Server Error',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Get single inventory item
export const getInventoryItem = async (req: Request, res: Response) => {
  try {
    const item = await Inventory.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({
        status: 'error',
        message: 'Inventory item not found',
      });
    }
    
    return res.status(200).json({
      status: 'success',
      data: item,
    });
  } catch (error) {
    console.error('Error fetching inventory item:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Server Error',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Create new inventory item
export const createInventoryItem = async (req: Request, res: Response) => {
  try {
    const newItem = await Inventory.create(req.body);
    
    return res.status(201).json({
      status: 'success',
      data: newItem,
    });
  } catch (error) {
    console.error('Error creating inventory item:', error);
    
    if (error instanceof Error && error.name === 'ValidationError') {
      return res.status(400).json({
        status: 'error',
        message: 'Validation Error',
        error: error.message,
      });
    }
    
    return res.status(500).json({
      status: 'error',
      message: 'Server Error',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Update inventory item
export const updateInventoryItem = async (req: Request, res: Response) => {
  try {
    const item = await Inventory.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    
    if (!item) {
      return res.status(404).json({
        status: 'error',
        message: 'Inventory item not found',
      });
    }
    
    return res.status(200).json({
      status: 'success',
      data: item,
    });
  } catch (error) {
    console.error('Error updating inventory item:', error);
    
    if (error instanceof Error && error.name === 'ValidationError') {
      return res.status(400).json({
        status: 'error',
        message: 'Validation Error',
        error: error.message,
      });
    }
    
    return res.status(500).json({
      status: 'error',
      message: 'Server Error',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Delete inventory item
export const deleteInventoryItem = async (req: Request, res: Response) => {
  try {
    const item = await Inventory.findByIdAndDelete(req.params.id);
    
    if (!item) {
      return res.status(404).json({
        status: 'error',
        message: 'Inventory item not found',
      });
    }
    
    return res.status(200).json({
      status: 'success',
      message: 'Inventory item deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting inventory item:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Server Error',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Update inventory item quantity
export const updateInventoryQuantity = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { quantity, operation = 'set' } = req.body;
    
    const item = await Inventory.findById(id);
    
    if (!item) {
      return res.status(404).json({
        status: 'error',
        message: 'Inventory item not found',
      });
    }
    
    // Update quantity based on operation type
    let newQuantity = item.quantity;
    
    switch (operation) {
      case 'add':
        newQuantity += Number(quantity);
        break;
      case 'subtract':
        newQuantity = Math.max(0, newQuantity - Number(quantity));
        break;
      case 'set':
      default:
        newQuantity = Number(quantity);
    }
    
    // Update the item with new quantity
    item.quantity = newQuantity;
    
    // Let the pre-save middleware handle status update
    await item.save();
    
    return res.status(200).json({
      status: 'success',
      data: item,
    });
  } catch (error) {
    console.error('Error updating inventory quantity:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Server Error',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Get low stock items
export const getLowStockItems = async (req: Request, res: Response) => {
  try {
    const items = await Inventory.find({
      $or: [
        { status: 'low-stock' },
        { status: 'out-of-stock' },
      ],
    }).sort({ status: -1, name: 1 });
    
    return res.status(200).json({
      status: 'success',
      data: items,
    });
  } catch (error) {
    console.error('Error fetching low stock items:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Server Error',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};