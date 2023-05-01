import Rank from "./Rank";
import axios from "axios";
function Leaderboard(props){
    const url=process.env.REACT_APP_API_URL
    const onSmash=(e)=>{
      e.preventDefault();
      //remove by email in db
      console.log("click")
      console.log(e.target.id)
      
      const email=props.list[e.target.id].email
      try{
        axios.post(`${url}/admin/remove_user_list`,{ remove_email :  email, email : props.g_user?props.g_user.email:""})
        .then(res =>{
          if(res.data.isAdmin)
          {
            if(props.cf_user!=null && email==props.cf_user.email)
              props.setCFUser(null)
            props.setArr(props.list.filter(value=>value.email!=email))
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
      catch(err){
        console.log(err)
      }

    }
    return (
       <>
       <div className="container-fluid" style={{ marginBottom : '90px','paddingLeft' :'40px','paddingRight' : '20px'}}>
         <div style={{marginTop : '20px',marginBottom : '20px',textAlign : 'center', 'fontSize' : '30px'}}>
              <i><b><u>Ranklists</u></b></i>
         </div>
         <table className="table table-striped table-hover"  style={{"--bs-table-hover-bg": "rgb(78 169 77 / 24%)"}}>
          <thead>
            <tr>
              <th scope="col">Rank</th>
              <th scope="col">Handle</th>
              <th scope="col">Name</th>
              <th scope="col">Max. Rating.</th>
              <th scope="col">Title</th>
              <th scope="col" style={{width : '350px','textAlign': 'right' ,'paddingRight': '1em'}}>Rating.</th>
            </tr>
          </thead>
          <tbody className="table-group-divider">
            {
                props.list.map((value, index)=>{
                  return (
                  <Rank key={index} value={value} id={index} onSmash={onSmash} isAdmin={props.isAdmin} g_user={props.g_user}/>
                  ) 
                })
            }
          </tbody>
        </table>
        </div>
       </>
    );
}
export default Leaderboard;