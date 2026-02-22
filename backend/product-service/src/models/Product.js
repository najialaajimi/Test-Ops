const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  price: { type: Number, required: true, min: 0 },
  stock: { type: Number, default: 0, min: 0 },
  categoryId: { type: String, required: true },
  imageUrl: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
