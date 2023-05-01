import React, { useState, useEffect} from 'react';
import axios from 'axios';
//THIS PAGE IS ONLY ACCESSIBLE IF YOU HAVE E-MAIL USER
function Adminpage(props){
    const [vList , setvList] = useState([])
    const [uvList, setuvList] = useState([])
    const [rAdmins,setRAdmins]= useState([])
    const url=process.env.REACT_APP_API_URL
    const getuList=()=>{
      setvList(
      props.list.map((value,index)=>{
        return {value : index , isVerified : value.verified}
      }). 
      filter((data)=>{
      return data.isVerified
      })
      )
    }
    const getuvList=()=>{
      setuvList(
        props.list.map((value,index)=>{
          return {value : index , isVerified : value.verified}
        }). 
        filter((data)=>{
        return !data.isVerified
        })
        )
    }
    const onRemove=(e)=>{

      //update in DB along with set props
      const rA=rAdmins
      setRAdmins([])
      axios.post(`${url}/admin/remove_admins`,{ email_list : props.list.filter((data,index)=>{
          return rA.findIndex(value => value==index) !=-1
        }).map(value=> value=value.email) ,
        email : props.g_user?props.g_user.email:"",
      }).then(res =>{
        //work with response
        if(res.data.isAdmin)
        {
          props.setAdArr(
            props.list.filter((data,index)=>{
              return rA.findIndex(value => value==index) ==-1
          }))
          if(props.isAdmin==false)
           props.setAdmin(true)
        }
        else if(props.isAdmin)
         props.setAdmin(false)
      }).catch(err => {
        // Handle error
        console.log(err);
        });
      
    }
    const onClick=(e)=>{
      if(rAdmins.findIndex(value => value==e.target.value) !=-1)
        setRAdmins(rAdmins.filter((value)=> value!=e.target.value))
      else
        setRAdmins(prev => [...prev,e.target.value])
    }
    const addAdmin=(e)=>{
      e.preventDefault();  // prevent from reloading
      
      console.log(e.target.add_admin.value)
      const email=e.target.add_admin.value
      e.target.add_admin.value=""
      if(email.length>0 && props.list.findIndex((value)=> value.email == email) == -1){
        console.log("there")
      
        //update in DB
        axios.post(`${url}/admin/add_admin`,{ add_email : email , email : props.g_user?props.g_user.email:""})
        .then(res =>{
          //work with response
          console.log(res.data.isAdmin)
          if(res.data.isAdmin)
          {
              props.setAdArr( prev => [...prev,{
                email : email,
                verified : false,
                name: '',
              }])
            if(props.isAdmin==false)
             props.setAdmin(true)
          }
          else if(props.isAdmin)
           props.setAdmin(false)

        }).catch(err => {
          // Handle error
          console.log(err);
          });
      }
      
    }
    useEffect(() => {
        getuList();
        getuvList();
        console.log("props")
        console.log(props.list)
    }, [props.list]);
    
    return (
     <>
     <div className="container-fluid" style={{width : '70%' ,'marginTop' : '10px', ' paddingBottom' : '100px'}}>
        <div align="right">
            <p style={{'marginRight' : '200px', 'marginBottom' : '0px'}}>Enter Admin's Email :</p>
            <form onSubmit={addAdmin}>
            <div className="input-group mb-3 mt-2"style={{width : '350px'}}>
              
                <input type="text" id="add_admin" className="form-control" placeholder="kodewreck.cse@kiit.ac.in" aria-label="Recipient's username" aria-describedby="button-addon2"/>
                <button className="btn btn-success" type="sumbit" id="button-addon2">Add</button>
              
            </div>
            </form>
        </div>
        <h4><u>Admins : </u></h4>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">S.no</th>
              <th scope="col">Name</th>
              <th scope="col">Email</th>
              <th scope="col" style={{width : '350px','textAlign': 'right' ,'paddingRight': '1em'}}>Select</th>
            </tr>
          </thead>
          <tbody className="table-group-divider">
            {
          
               vList.map((data,index)=>{
                return (
                  props.list&&props.list[data.value]?
                  <tr key={props.list[data.value].email}>
                    <th scope="row">{index+1}</th>
                    <td>{props.list[data.value].name}</td>
                    <td><a href={`mailto: ${props.list[data.value].email}`} style={{textDecoration : 'none',color : "#212529"}}>{props.list[data.value].email}</a></td> 
                    <td colSpan="2" style={{'textAlign': 'right' , 'paddingRight' : '1em'}}>
                       {
                        (props.g_user.email!=props.list[data.value].email)?
                          <input className="form-check-input" type="checkbox" value={data.value} key={props.list[data.value].email} onClick={onClick}/>
                         :<></>
                       }
                    </td>
                  </tr>
                  :<></>
                )
              })
            }
          </tbody>
        </table>

        <h5><u>Unverified Admins : </u></h5>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">S.no</th>
              <th scope="col">Email</th>
              <th scope="col" style={{width : '350px','textAlign': 'right' ,'paddingRight': '1em'}}>Select</th>
            </tr>
          </thead>
          <tbody className="table-group-divider">
            {
               uvList.map((data,index)=>{
                return (
                  props.list&&props.list[data.value]?
                  <tr  key={props.list[data.value].email}>
                    <th scope="row">{index+1}</th>
                    <td>{props.list[data.value].email}</td>
                    <td colSpan="2" style={{'textAlign': 'right' , 'paddingRight' : '1em'}}>
                      <input className="form-check-input" type="checkbox" value={data.value} key={props.list[data.value].email} id={"uvID"+index+1} onClick={onClick}/>
                    </td>
                  </tr>
                  :<></>
                )
              })
            }
          </tbody> 
         </table>
         <button type="button" className="btn btn-danger" style={{"marginTop" : '10px'}} onClick={onRemove}>remove</button>
     </div>
       
     </>
    );
}
export default Adminpage;