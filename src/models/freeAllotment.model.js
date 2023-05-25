const mongoose = require('mongoose');
const { Schema } = mongoose;

const freeAllotmentSchema = new Schema({
    limit: Number,
    createdAt: Date,
    modifiedAt: Date,
})

const FreeAllotment = module.exports = mongoose.model('FreeAllotment', freeAllotmentSchema)