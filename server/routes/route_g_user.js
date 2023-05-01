const express = require('express');
const routerGUser = express.Router();
const UserModel = require('../models/usermodel')
const AdminModel = require('../models/adminmodel')

const CF_API = "https://codeforces.com/api/user.info?handles="

async function add_user(user,guser)
{
   await UserModel.updateOne(
      { email : guser.email },
      { 
          email: guser.email,
          name : guser.name,
          cf_handle: user.handle,
          rating: user.rating?user.rating:0,
          image: user.titlePhoto,
          maxRating : user.maxRating,
          rank : user.rank
      },
      { upsert: true }
    ).then(result => {
        console.log(result);
      })
      .catch(err => {
        console.error(err);
      });  
}
function delete_user(my_email)
{
    UserModel.deleteOne({ email : my_email })
      .then(result => {
        console.log(result.deletedCount) 
      })
      .catch(err => {
        console.error(err)
      });
}
function find_cfuser_email(my_email,cb)
{
  UserModel.find({email : my_email})
     .then(user =>{
       cb(user[0])
     })
     .catch(err =>{
      console.log(err)
      cb(null)
     })   
}

function check_and_add(handle,guser,cb)
{
    //handle should not contain ; semicolon
    if(!handle.includes(';'))
    {
      console.log("Do not contain semicolon")
      let url=CF_API+handle
      fetch(url).then((response)=>{
              if(response.ok) {
                  return response.json();
                }
                throw new Error('Something went wrong');
          })
          .then(async (response)=>{
            await add_user(response.result[0],guser)
            console.log(response.result[0])
            cb({
              cf_handle : response.result[0].handle,
              email : guser.email,
              image  : response.result[0].titlePhoto,
              maxRating : response.result[0].maxRating,
              name : guser.name,
              rank : response.result[0].rank,
              rating : response.result[0].rating?response.result[0].rating:0,
            })
          })
          .catch((error) => {
              console.error(error)
              cb(null)
            });
    }
    else
     cb(null)
}
function verify_admin(guser)
{
    AdminModel.updateOne(
      {email : guser.email },
      { $set : {verified : true, name : guser.name}})
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });

}
routerGUser.get('/user_g_info',(req,res)=>{
    if (req.user) {
      verify_admin(req.user._json)
      res.status(200).
          json({
              error: false,
              message: "Successfully Loged In",
              user: {
                name : req.user._json.name,
                picture : req.user._json.picture,
                email : req.user._json.email,
              },
            });
        } else {
          res.status(403).json({ error: true, message: "Not Authorized" });
        }
})
routerGUser.get('/is_linked',(req,res)=>{
    if (req.user) {
        find_cfuser_email(req.user._json.email,function(cf_data){
        res.status(200).json({
              error: false,
              message: "Successfully Loged In",
              user: cf_data,
            });
          })
        } else {
           res.status(403).json({ error: true, message: "Not Authorized" });
         }
})
routerGUser.get('/new_cf_user',(req,res)=>{
   if (req.user) {
      console.log(req.query.cf_id)
      check_and_add(req.query.cf_id,req.user._json,function(cf_user){
       
       res.status(200).json({
              error: false,
              message: cf_user?"Found cf user":"User not found!",
              user: cf_user,
            })
          
        })
      } else {
        res.status(403).json({ error: true, message: "Not Authorized" });
      }
})

routerGUser.get('/remove_user',(req,res)=>{
    //Removing CF USER - own
    console.log("user mail")
    console.log(req.user.email)
    delete_user(req.user._json.email)
})

module.exports = {routerGUser,delete_user};

