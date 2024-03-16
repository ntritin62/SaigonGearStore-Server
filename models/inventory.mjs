import mongoose from 'mongoose';

const { Schema } = mongoose;

const inventorySchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Product',
    },
    quantity: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Inventory', inventorySchema);
