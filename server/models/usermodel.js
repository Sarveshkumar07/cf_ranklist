// {"email":"2005364@kiit.ac.in",
// "name":"ANIKET KUNDU",
// "cf_handle":"tourist",
// "rating":3635,
// "image":"https://userpic.codeforces.org/422/title/50a270ed4a722867.jpg",
// "maxRating":3979,
// "rank":"legendary grandmaster"}

const mongoose = require('mongoose')

const user_schema = new mongoose.Schema({
    email :{
        type : String,
        required : true,
    },
    name : String,
    cf_handle : String,
    rating : {
        type : Number,
        default : 0,
    },
    image : String,
    maxRating : {
        type : Number,
        default : 0,
    },
    rank : {
        type : String,
        default : '-'
    }
})

const user_model = mongoose.model('UserModel',user_schema);

module.exports=user_model