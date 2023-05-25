const mongoose = require('mongoose');
const { Schema } = mongoose;

const settingSchema = new Schema({
    ratio: String,
    cost: Number,
    isDeleted: Boolean,
    createdAt: Date,
    modifiedAt: Date,
})

const Setting = module.exports = mongoose.model('Setting', settingSchema)