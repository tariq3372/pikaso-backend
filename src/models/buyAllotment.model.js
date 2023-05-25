const mongoose = require('mongoose');
const { Schema } = mongoose;

const buyAllotmentSchema = new Schema({
    limit: Number,
    isDeleted: Boolean,
    createdAt: Date,
    modifiedAt: Date,
})

const BuyAllotment = module.exports = mongoose.model('BuyAllotment', buyAllotmentSchema)