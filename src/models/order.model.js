const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    cost: Number,
    cartId: [{ type: Schema.Types.ObjectId, ref: 'Cart' }],
    status: String,
    shipping: String,
    createdAt: Date,
    updatedAt: Date
})

const Order = module.exports = mongoose.model('Order', orderSchema)