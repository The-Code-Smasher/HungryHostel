const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
    //schema defines the way of 
    // stroring the data in database
    //  so ve can detect them easily
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    // otp: { type: Number }, // OTP field
    // otpExpiry: { type: Date }, // OTP expiry time
    // isVerified: { type: Boolean, default: false }, // Email verified status
    // age: Number, 
    // gender : {
    //     type: String, 
    //     enum: ['male', 'female' ]
    // }
})



condt = userModel = mongoose.model('user', userSchema)
//actually implements the schema into the database 

module.exports = userModel
