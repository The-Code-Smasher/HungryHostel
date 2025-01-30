const mongoose = require('mongoose')

const connection = mongoose.connect('mongodb://0.0.0.0/hungryhostel').then(() => {
    try {
        console.log("connected to database")
    } catch (error) {
        console.log(error);
        
    }
})

module.exports = connection