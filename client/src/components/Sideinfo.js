import axios from "axios";
import { useState } from "react";
function Sideinfo(props){
    const [errorMessage , setErrorMessage ] = useState(null)
    const url = process.env.REACT_APP_API_URL
    const remove_cf_user=()=>{
      props.setCFUser(null)
      try {
        axios.get(`${url}/g_user/remove_user`, { withCredentials: true });
        console.log(props.g_user.email)
        props.setArr(props.list.filter(value=>value.email!=props.g_user.email))
      } catch (err) {
        console.log(err);
      }
      // NOTE: remove from database
    }
    const handleSubmit= async (e)=>{
      // NOTE: actual fetch and save in database
      e.preventDefault();
      try{
         console.log(e.target.cf_id.value)
         const cf_id=e.target.cf_id.value
         e.target.cf_id.value=""
         const {data} = await axios.get(`${url}/g_user/new_cf_user`, { params : {cf_id : cf_id}, withCredentials: true });
         console.log("Cf user")
         console.log(data.user)
         props.setCFUser(data.user)
         props.getArr()

         if(!data.user)
          {
            setErrorMessage(data.message);
            setTimeout(() => {
              setErrorMessage(null);
            }, 1000); 
          }
      }
      catch(err){
        console.log(err)
      }
     
    }
    return (
      <>
      {
       props.g_user?
       <div className="text-center"  style={{marginTop : '60px' }}>
         {
          props.cf_user?
          <>
          <img src={props.cf_user.image} className="rounded" alt="..." width= '115px' height='170px'/>
          <div style={{marginTop:'10px'}}>
            User : {props.cf_user.cf_handle}
            <br/>
            Rating : {props.cf_user.rating}
          </div>
          <button type="button" className="btn btn-danger btn-sm" style={{marginTop : '10px'}} onClick={remove_cf_user}>remove</button>       
          </>
           :
          <div className="mb-3 mt-5">
            <form onSubmit={handleSubmit}>
              <input type="text" className="form-control" id="cf_id" placeholder="Enter your Codeforces Handle"/>
              {errorMessage && <p className="error" style={{color : 'red'}}>{errorMessage}</p>}
              <button type="submit" className="btn btn-success btn-sm" style={{marginTop : '10px',width : '110px'}}>add user</button>
            </form>
          </div>
           }
        </div>
        :<></>
       }
      </>
    );
}
export default Sideinfo;