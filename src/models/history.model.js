const mongoose = require('mongoose');
const { Schema } = mongoose;

const historySchema = new Schema({
    prompt: String,
    ratio: String,
    images: [String],
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    freeAllotmentUsage: Number,
    freeAllotmentLimit: Number,
    userBuyAllotmentUsage: Number,
    buyAllotmentLimit: Number,
    createdAt: Date,
})

const History = module.exports = mongoose.model('History', historySchema)