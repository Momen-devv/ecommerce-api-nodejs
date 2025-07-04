const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required.'],
      unique: [true, 'Category name must be unique.'],
      minlength: [2, 'Category name must be at least 3 characters.'],
      maxlength: [24, 'Category name must not exceed 32 characters.'],
      trim: true
    },
    slug: {
      type: String,
      lowercase: true
    },
    image: String
  },
  { timestamps: true }
);

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
