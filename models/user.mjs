import mongoose, { SchemaType } from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    address: [
      {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Address',
      },
    ],
    favorites: [
      {
        products: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: 'Product',
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const addressSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model('User', userSchema);
export const Address = mongoose.model('Address', addressSchema);
