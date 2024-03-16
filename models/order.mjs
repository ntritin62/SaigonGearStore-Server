import mongoose from 'mongoose';

const { Schema } = mongoose;

const orderSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    cartId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Cart',
    },
    shipping: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Address',
    },
    status: {
      type: Boolean,
      require: true,
    },
    products: [
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
    ],
  },
  { timestamps: true }
);

export default mongoose.model('Order', orderSchema);
