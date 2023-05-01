import { useEffect, useState } from "react";
import axios from "axios";
import { left } from "@popperjs/core";
import { Link } from "react-router-dom";
function NavBar(props)
{
    const url= process.env.REACT_APP_API_URL
    const googleAuth = () => {
      window.open(
        `${url}/auth/google/callback`,
        "_self"
      );
    };
    const googleAuthOut = () => {
      window.open(
        `${url}/logout`,
         "_self"
      );
    };
  const getGUser = async () => {
		try {
			const { data } = await axios.get(`${url}/g_user/user_g_info`, { withCredentials: true });
      console.log("new guser")
      console.log(data.user)
      props.setGUser(data.user);
		} catch (err) {
			console.log(err);
		}
	};
    useEffect(() => {
      getGUser();
    }, []);

     return(
       <>
        <nav className="navbar navbar-dark bg-dark fixed-top" style ={{padding: "0"}}>
        <div className="container-fluid">
          <h1 className="navbar-brand" style={{'fontFamily' : 'Oswald, sans-serif',fontSize : '35px'}}>Kodewreck</h1>
          <p></p>
          <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasDarkNavbar" aria-controls="offcanvasDarkNavbar">
            <span className="navbar-toggler-icon" />
          </button>



          <div className="offcanvas offcanvas-end text-bg-dark" tabIndex={-1} id="offcanvasDarkNavbar" aria-labelledby="offcanvasDarkNavbarLabel" style={{'maxWidth': '22%'}}>
            <div className="offcanvas-header">
              <h5 className="offcanvas-title" id="offcanvasDarkNavbarLabel">Menu</h5>
              <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close" />
            </div>
            <div className="offcanvas-body">

              {
               props.g_user?
               <div className="row" style={{height:'80px'}}>
                <div className="column" style={{width:'30%'}}>
                  <img src={props.g_user.picture} alt="User pic" style={{height:'80px',width:'80px',borderRadius:'50%'}}></img>
                </div>
                <div className="column" style={{width:'70%', display:'flex', flexDirection:'column', justifyContent:'flex-end'}}>
                  <p style={{fontSize:'17px', marginBottom:'0'}} >{props.g_user.name}</p>
                  <p style={{fontSize:'13px', marginTop:'0'}}>{props.g_user.email}</p>
                </div>
               </div>
               :<></>
              }
                
              <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
                
                <li className="nav-item" data-bs-dismiss="offcanvas">
                  <a className="nav-link" href="https://kodewreckpractice.contest.codeforces.com" target="_blank" rel="noopener noreferrer">Kodewreck Practice</a>
                </li>
                <li className="nav-item" data-bs-dismiss="offcanvas">
                  <Link className="nav-link" to="/" >Leaderboard</Link>
                </li>
                 <li className="nav-item" data-bs-dismiss="offcanvas">
                  {
                    (props.g_user&&props.isAdmin)?
                    <Link className="nav-link" to="/adminpage">Admin page</Link>
                    :<></>
                  }
                  </li>
                  <li className="nav-item">
                  {
                    props.g_user?
                    <a className="nav-link" onClick={googleAuthOut} >Log Out</a>
                    :
                    <a className="nav-link" onClick={googleAuth} >Login</a>
                  }
                </li>
              </ul>
              
            </div>
          </div>
        </div>
      </nav>
       </>
    );
}
export default NavBar;