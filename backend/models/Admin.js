const mongoose = require('mongoose'); 
const { hashPassword } = require('../utils/password');

const adminSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    }
})

adminSchema.pre('save', async function (next){
    const admin = this;
    if(!admin.isModified('password')){
        return next();
    }
    admin.password = hashPassword(admin.password);
    next();
})


mongoose.model("Admin", adminSchema);
