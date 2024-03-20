import mongoose from 'mongoose';

const { Schema } = mongoose;

const orderSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    shipping: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Address',
    },
    status: {
      type: Boolean,
      default: false,
    },
    amount: {
      type: Number,
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
