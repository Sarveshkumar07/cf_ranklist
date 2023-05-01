const express = require('express');
const routerUser = express.Router();
const UserModel = require('../models/usermodel');

const CF_API = "https://codeforces.com/api/user.info?handles="


function update_list()
{
  UserModel.find()
   .then(users =>{
    let url = CF_API 
    for(let i=0;i<users.length;i++)
      url+=users[i].cf_handle+((i==users.length-1)?"":";")
    
    fetch(url).then((response)=>{
           
                  if(response.ok) {
                      return response.json();
                    }
                    throw new Error('Something went wrong');
              })
              .then((res)=>{
                
                UserModel.bulkWrite(
                  res.result.map((value, id) => ({
                    updateOne: {
                      filter: { email: users[id].email },
                      update: {
                        $set: {
                          maxRating: value.maxRating,
                          rating: value.rating ? value.rating : 0,
                          image: value.titlePhoto,
                          rank: value.rank,
                        },
                      },
                    },
                  }))
                )
                  .then((result) => {
                    console.log('Bulk write operation successful:', result);
                  })
                  .catch((err) => {
                    console.error('Error during bulk write operation:', err);
                  });
                  
              })
              .catch((err) => {
                   console.log(err)
                });

   })
   .catch(err =>{
     console.log(err)
   })
  
}
setInterval(update_list, 1000*60*5); // 5mins interval refresh data


//from DB
routerUser.get('/user_list',(req,res)=>{
  UserModel.find()
   .then(users =>{
     res.send(users.sort( function (a,b) {
          return b.rating - a.rating;
        }))
   })
   .catch(err =>{
    console.log(err)
    res.send([])
   })
})

module.exports = {routerUser};
