const mongoose = require('mongoose');

const ListingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  regularPrice: {
    type: Number,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  furnished: {
    type: Boolean,
    required: true
  },
  parking: {
    type: Boolean,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['rent', 'sell']
  },
  bathroom: {
    type: Number,
    required: true
  },
  bedrooms: {
    type: Number,
    required: true
  },
  offer: {
    type: Boolean,
    required: true
  },
  discountedPrice: {
    type: Number,
    required: true
  },
  imageUrls: {
    type: [String],
    required: true
  },
  userRefs: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
},{ timestamps: true });

const Listing = mongoose.model('Listing', ListingSchema);
module.exports = Listing;
