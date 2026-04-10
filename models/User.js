const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        minlength: [3, 'Name must be at least 3 characters long']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        validate: [validator.isEmail, 'Please enter a valid email format']
    },
    age: {
        type: Number,
        min: [0, 'Age cannot be negative'],
        max: [120, 'Age cannot exceed 120']
    },
    hobbies: {
        type: [String], // Array of strings
        default: []
    },
    bio: {
        type: String
    },
    userId: {
        type: String,
        unique: true,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// ================= INDEXES =================
// 1. Single field index
userSchema.index({ name: 1 }); 

// 2. Compound index
userSchema.index({ email: 1, age: 1 }); 

// 3. Multikey index (Automatically applied because 'hobbies' is an array)
userSchema.index({ hobbies: 1 }); 

// 4. Text index
userSchema.index({ bio: 'text' }); 

// 5. Hashed index
userSchema.index({ userId: 'hashed' }); 

// 6. TTL index (Deletes document 30 days after creation)
userSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 }); 

module.exports = mongoose.model('User', userSchema);