import mongoose, { Document, Schema } from 'mongoose';

export interface InventoryItem extends Document {
  name: string;
  category: string;
  quantity: number;
  unit: string;
  minThreshold: number;
  status: 'available' | 'low-stock' | 'out-of-stock';
  costPrice: number;
  vendor: string;
  lastRestocked: Date;
  expiryDate?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const inventorySchema = new Schema<InventoryItem>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['ingredients', 'beverages', 'snacks', 'packaging', 'cleaning', 'other'],
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
    },
    unit: {
      type: String,
      required: true,
      enum: ['kg', 'g', 'l', 'ml', 'pcs', 'packs', 'boxes'],
    },
    minThreshold: {
      type: Number,
      required: true,
      default: 5,
    },
    status: {
      type: String,
      enum: ['available', 'low-stock', 'out-of-stock'],
      default: 'available',
    },
    costPrice: {
      type: Number,
      required: true,
    },
    vendor: {
      type: String,
      required: true,
    },
    lastRestocked: {
      type: Date,
      default: Date.now,
    },
    expiryDate: {
      type: Date,
    },
    notes: {
      type: String,
    },
  },
  { timestamps: true }
);

// Pre-save middleware to automatically update status based on quantity and minThreshold
inventorySchema.pre('save', function (next) {
  if (this.quantity <= 0) {
    this.status = 'out-of-stock';
  } else if (this.quantity <= this.minThreshold) {
    this.status = 'low-stock';
  } else {
    this.status = 'available';
  }
  next();
});

const Inventory = mongoose.model<InventoryItem>('Inventory', inventorySchema);

export default Inventory;