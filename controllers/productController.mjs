import Product from '../models/product.mjs';
import { Category } from '../models/category.mjs';
import { Brand } from '../models/category.mjs';

export const getProductsByCategory = async (req, res, next) => {
  const cateName = req.params.categoryName;
  const brandName = req.query.brand;
  try {
    const cateId = await Category.findOne({ categoryName: cateName }).select(
      '_id'
    );
    if (!cateId) {
      const error = new Error('Could not find category.');
      error.statusCode = 404;
      throw error;
    }
    let products;
    if (brandName) {
      const brandId = await Brand.findOne({ brandName: brandName }).select(
        '_id'
      );
      if (!brandId) {
        const error = new Error('Could not find brand.');
        error.statusCode = 404;
        throw error;
      }
      products = await Product.find({ category: cateId, brand: brandId })
        .populate('brand')
        .select('-category');
    } else {
      products = await Product.find({ category: cateId })
        .populate('brand')
        .select('-category');
    }
    res.status(200).json({
      message: 'Products fetched successfully',
      products,
    });
  } catch (err) {
    next(err);
  }
};

export const getProductById = async (req, res, next) => {
  const productId = req.params.productId;
  try {
    const product = await Product.findById(productId).populate('brand');
    if (!product) {
      const error = new Error('Could not find product.');
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({
      message: 'Product fetched successfully',
      product,
    });
  } catch (err) {
    next(err);
  }
};

export const getProductsByCategoryOrBrands = async (req, res, next) => {
  const category = req.query.category;
  const brand = req.query.brand;

  let query = {};

  if (category) {
    const cateId = await Category.findOne({ categoryName: category }).select(
      '_id'
    );
    query.category = cateId;
  }

  if (brand) {
    const brandId = await Brand.findOne({ brandName: brand }).select('_id');
    query.brand = brandId;
  }

  try {
    const products = await Product.find(query).limit(4);

    res.status(200).json({
      message: 'Product fetched successfully',
      products,
    });
  } catch (err) {
    next(err);
  }
};
