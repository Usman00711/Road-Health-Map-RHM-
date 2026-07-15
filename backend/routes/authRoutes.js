const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const router = express.Router();
const Admin = mongoose.model('Admin');
const { verifyPassword } = require('../utils/password');
require('dotenv').config();


router.post('/signup', async (req, res) => {
    const { email, password} = req.body;
    if( !email || !password){
        return res.status(422).send({error: "All fields are required"});
    }

    Admin.findOne({email: email})
    .then( async (savedAdmin) => {
            if(savedAdmin){
                return res.status(422).send({error: "User already exist"});
            }
            const admin = new Admin({
                email,
                password
            })
            try{
                await admin.save();
                const token = jwt.sign({ _id: admin._id}, process.env.JWT_SECRET || 'local-development-secret', { expiresIn: '8h' });
                res.status(201).send({token, admin: { email: admin.email }});
            }
            catch(err) {
            return res.status(422).send({error: err.message});
            }
        }
    )
})

router.post('/login', async (req, res) => {
    const{email, password} = req.body;
    if(!email || !password){
        return res.status(422).json({error: "Email or Password is not entered!"});
    }
    const savedAdmin = await Admin.findOne({email: email});

    if(!savedAdmin){
        return res.status(422).json({error: "Invalid Credentials"});
    }

    try{
        if (verifyPassword(password, savedAdmin.password)) {
            const token = jwt.sign({ _id: savedAdmin._id}, process.env.JWT_SECRET || 'local-development-secret', { expiresIn: '8h' });
            return res.send({token, admin: { email: savedAdmin.email }});
        }
        return res.status(422).json({error: "Invalid Password"});
    }
    catch(err) {
        return res.status(500).json({error: 'Unable to sign in right now.'});
    }
})


module.exports = router;
