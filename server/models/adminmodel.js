// {"email":"kunduaniket7@gmail.com",
// "verified":true,
// "name":"aniket kundu"}

const mongoose = require('mongoose')

const admin_schema= new mongoose.Schema({
    email : {
        type : String,
        required : true,
    },
    verified : {
        type : Boolean,
        default : false,
    },
    name : {
        type : String,
        default : "",
    }
})

const admin_model = mongoose.model('AdminModel',admin_schema)

module.exports = admin_model