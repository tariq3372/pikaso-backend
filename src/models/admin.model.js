const mongoose = require('mongoose');
const { Schema } = mongoose;

const adminSchema = new Schema({
    name: String,
    email: String,
    password: String,
    avatar: String,
    token: String,
    createdAt: Date,
})

const Admin = module.exports = mongoose.model('Admin', adminSchema)