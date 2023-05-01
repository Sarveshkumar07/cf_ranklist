const express = require('express');
const routerAdmin = express.Router();
const AdminModel = require('../models/adminmodel')
const {delete_user} = require('./route_g_user')

function add_admin(my_email)
{
    AdminModel.find({email : my_email})
     .then(users =>{
       if(users.length == 0)
       {
        AdminModel.updateOne(
            { email : my_email },
            { 
              email : my_email,
              verified : false,
              name: '',
            },
            { upsert: true }
          ).then(result => {
              console.log(result);
            })
            .catch(err => {
              console.error(err);
            });
       }
     })
     .catch(err => {
      console.error(err);
    });
   
}

function remove_admins(emails)
{
  AdminModel.bulkWrite(
    emails.map(my_email => ({
      deleteOne: {
        filter: { email: my_email }
      }
    }))
  ).then((result) => {
    console.log('Bulk write operation successful:', result);
  }).catch((err) => {
    console.error('Error during bulk write operation:', err);
  });
}

function check_admin(guser,cb)
{
  AdminModel.find({email : guser.email})
  .then((users) => {
    cb(users.length>0)
  })
  .catch((err) => {
    console.log(err);
    cb(false)
  });
}

function admin_list(cb)
{
  AdminModel.find()
  .then((users) => {
    cb(users)
  })
  .catch((err) => {
    console.log('ERROR FIND',err);
    cb([])
  });
}

routerAdmin.get('/all_admins',(req,res)=>{
   admin_list(function(users){
    res.send(users)
   })
})

routerAdmin.post('/remove_user_list',(req,res)=>{
  //Removing CF USER by admin
  console.log("Params pass : ")
  console.log(req.body)
  check_admin(req.body,function(data){
    if(data)
     {
       delete_user(req.body.remove_email)
       res.status(200).json({
         error: false,
         message: "removed Successfully",
         isAdmin: true,
       })
     }
    else
       res.status(200).json({
         error: false,
         message: "Not removed",
         isAdmin: false,
       })
   })
})

routerAdmin.post('/add_admin',(req,res)=>{
  console.log(req.body.add_email)
  check_admin(req.body,function(data){
   if(data)
    {
      add_admin(req.body.add_email)
      res.status(200).json({
        error: false,
        message: "Added Successfully",
        isAdmin: true,
      })
    }
   else
      res.status(200).json({
        error: false,
        message: "Not Add",
        isAdmin: false,
      })
  })
  
})
routerAdmin.post('/remove_admins',(req,res)=>{
  console.log(req.body.email)
  console.log(req.body.email_list)
  check_admin(req.body,function(data){
    console.log(data)
   if(data)
    {
      remove_admins(req.body.email_list)
      res.status(200).json({
        error: false,
        message: "Successfully Removed Admins",
        isAdmin: true,
      })
    }
   else
    res.status(200).json({
      error: false,
      message: "Not Removed Admins",
      isAdmin: false,
    })
  })
})

routerAdmin.get('/is_admin',(req,res)=>{
 if(req.user)
  check_admin(req.user._json,function(data){
    res.send(data)
  })
  else
   res.send(false)
})

module.exports = {routerAdmin};



