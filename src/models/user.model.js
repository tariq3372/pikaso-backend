const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    name: String,
    email: String,
    password: String,
    avatar: String,
    dob: String,
    phoneNumber: String,
    country: String,
    otp: String,
    token: String,
    freeAllotmentId: { type: Schema.Types.ObjectId, ref: 'FreeAllotment' },
    freeAllotmentUsage: Number,
    isVerified: Boolean,
    createdAt: Date,
    modifiedAt: Date,
})

const User = module.exports = mongoose.model('User', userSchema)