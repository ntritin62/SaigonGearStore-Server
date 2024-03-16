import mongoose from 'mongoose';

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
    password: {
      type: String,
      required: true,
    },
    address: [
      {
        type: String,
        required: false,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('User', userSchema);
