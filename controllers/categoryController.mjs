import { Category } from '../models/category.mjs';

export const getBrands = async (req, res, next) => {
  const cateName = req.params.categoryName;

  try {
    const brands = await Category.find({ categoryName: cateName }).populate(
      'brands'
    );
    if (brands.length === 0) {
      const error = new Error('Could not find category.');
      error.statusCode = 404;
      throw error;
    }
    const extractedBrands = brands.map((category) => {
      return category.brands.map((brand) => {
        return {
          _id: brand._id,
          brandName: brand.brandName,
          logoImage: brand.logoImage,
        };
      });
    });
    res.status(200).json({
      message: 'Brands fetched successfully',
      brands: extractedBrands,
    });
  } catch (err) {
    next(err);
  }
};
