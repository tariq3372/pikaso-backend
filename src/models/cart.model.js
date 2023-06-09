const mongoose = require('mongoose');
const { Schema } = mongoose;

const cartSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    cost: Number,
    costPerQuantity: Number,
    quantity: Number,
    status: String,
    prompt: String,
    ratio: String,
    size: String,
    images: String,
    createdAt: Date,
    modifiedAt: Date,
})

const Cart = module.exports = mongoose.model('Cart', cartSchema)