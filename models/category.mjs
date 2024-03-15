import mongoose from 'mongoose';

const { Schema } = mongoose;

const brandSchema = new Schema({
  brandName: {
    type: String,
    required: true,
  },
});

const categorySchema = new Schema({
  categoryName: {
    type: String,
    required: true,
  },
  brands: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Brand',
      required: true,
    },
  ],
});

export const Brand = mongoose.model('Brand', brandSchema);
export const Category = mongoose.model('Category', categorySchema);
