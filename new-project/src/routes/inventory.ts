import express from 'express';
import {
  getAllInventory,
  getInventoryItem,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  updateInventoryQuantity,
  getLowStockItems,
} from '../controllers/inventory/index';

const router = express.Router();

// Get all inventory items
router.get('/', getAllInventory);

// Get low stock items
router.get('/low-stock', getLowStockItems);

// Get single inventory item
router.get('/:id', getInventoryItem);

// Create new inventory item
router.post('/', createInventoryItem);

// Update inventory item
router.put('/:id', updateInventoryItem);

// Delete inventory item
router.delete('/:id', deleteInventoryItem);

// Update inventory quantity
router.patch('/:id/quantity', updateInventoryQuantity);

export default router;