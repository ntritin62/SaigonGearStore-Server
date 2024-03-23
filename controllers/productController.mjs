import Product from '../models/product.mjs';
import { Category } from '../models/category.mjs';
import { Brand } from '../models/category.mjs';
import { uploadToS3 } from '../utils/aws-s3.mjs';

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
    const product = await Product.findById(productId)
      .populate('brand')
      .populate('category');
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
    const products = await Product.find(query).populate('brand').limit(4);

    res.status(200).json({
      message: 'Product fetched successfully',
      products,
    });
  } catch (err) {
    next(err);
  }
};

export const getAllProducts = async (req, res, next) => {
  try {
    let products = await Product.find()
      .populate('brand')
      .populate('category')
      .sort({ updatedAt: -1 });
    if (!products) {
      const error = new Error('Could not find products.');
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      message: 'Products fetched successfully',
      products,
    });
  } catch (err) {
    next(err);
  }
};

export const addProduct = async (req, res, next) => {
  const files = req.files;
  const productData = req.body;
  try {
    const cateId = await Category.findOne({
      categoryName: productData.category,
    }).select('_id');

    const product = new Product({
      name: productData.name,
      brand: productData.brand,
      price: productData.price,
      sale: productData.saleoff,
      description: productData.description,
      category: cateId,
    });

    const productId = product._id;

    const uploadPromises = files.map(async (file, i) => {
      const { key, error } = await uploadToS3(file, productId, i);
      if (error) {
        throw error;
      }
      return { key, index: i };
    });

    const results = await Promise.all(uploadPromises);

    results.sort((a, b) => a.index - b.index);
    results.forEach(({ key }) =>
      product.images.push(`${process.env.CLOUDFRONT_URL}${key}`)
    );

    await product.save();
    res.status(200).json({
      message: 'Added product successfully',
    });
  } catch (err) {
    next(err);
  }
};

export const editProduct = async (req, res, next) => {
  const productData = req.body;
  const productId = req.params.productId;
  try {
    const product = await Product.findById(productId);

    const cateId = await Category.findOne({
      categoryName: productData.category,
    }).select('_id');

    product.name = productData.name;
    product.brand = productData.brand;
    product.price = productData.price;
    product.sale = productData.saleoff;
    product.description = productData.description;
    product.category = cateId;
    await product.save();

    res.status(200).json({
      message: 'Edited product successfully',
    });
  } catch (err) {
    next(err);
  }
};
