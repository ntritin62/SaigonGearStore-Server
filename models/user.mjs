import mongoose, { SchemaType } from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: false,
      default: '',
    },
    email: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: false,
      default: '',
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
