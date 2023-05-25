const mongoose = require('mongoose');
const { Schema } = mongoose;

const userBuyAllotmentSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    buyAllotmentId: { type: Schema.Types.ObjectId, ref: 'BuyAllotment' },
    buyAllotmentUsage: Number,
    isCompleted: Boolean,
    createdAt: Date,
    modifiedAt: Date,
})

const UserBuyAllotment = module.exports = mongoose.model('UserBuyAllotment', userBuyAllotmentSchema)