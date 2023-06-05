const mongoose = require('mongoose');
const { Schema } = mongoose;

const priceSchema = new Schema({
    ratio: String,
    cost: [{ size: String, price: Number }],
    isDeleted: Boolean,
    createdAt: Date,
    modifiedAt: Date,
})

const Price = module.exports = mongoose.model('Price', priceSchema)