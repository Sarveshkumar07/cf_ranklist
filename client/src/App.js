
import React, { useState, useEffect } from 'react';
import NavBar from "./components/NavBar";
import Mainpage from "./pages/Mainpage";
import Adminpage from "./pages/Adminpage";
import UrlNotFound from "./components/UrlNotFound";
import UnauthorizedAccess from './components/UnauthorizedAccess';
import axios from 'axios';
import {BrowserRouter as Router,Routes,Route} from "react-router-dom";
import {RingLoader,BeatLoader} from "react-spinners";

function App() {

  const [arr,setArr]=useState([]);
  const [g_user,setGUser]=useState(null);
  const [cf_user,setCFUser]=useState(null);
  const [adArr,setAdArr] = useState([]);
  const [isAdmin,setAdmin] = useState(false);
  const [loadingMain , setLoadingMain] = useState(true);
  const [loadingAdmin , setLoadingAdmin] = useState(true);

  const url=process.env.REACT_APP_API_URL
  
  const getArr = async () => {
    console.log("CALL")
    axios.get(`${url}/user/user_list`)
        .then(res => {
            // Work with the response...
            // arr=res.data
            setArr(res.data)
            setTimeout(() =>  setLoadingMain(false), 300);
           
        }).catch(err => {
            // Handle error
            console.log(err);
            setTimeout(() =>  setLoadingMain(false), 300);
        });
  };
  const getCFuser = async () =>{
    try {
			const { data } = await axios.get(`${url}/g_user/is_linked`, { withCredentials: true });
      setCFUser(data.user);
      console.log("CF user is")
      console.log(data.user)
		} catch (err) {
			console.log(err);
		}
  }
  const getAdArr = () => {
    axios.get(`${url}/admin/all_admins`)
        .then(res => {
            // Work with the response...
            setAdArr(res.data)
            console.log("admins")
            console.log(res.data)
            setTimeout(() =>  setLoadingAdmin(false), 300);
            
        }).catch(err => {
            // Handle error
            console.log(err);
            setTimeout(() =>  setLoadingAdmin(false), 300);
        });
  };
  const getIsAdmin = async ()=>{
    try {
      const { data } = await axios.get(`${url}/admin/is_admin`, { withCredentials: true });
      console.log("Are you Admin?",data)
      setAdmin(data)
    }
    catch (err) {
			console.log(err);
		}
  }
  useEffect(() => {
    	getArr();
      getCFuser();
      getAdArr();
      getIsAdmin();
      console.log("HEY")
    }, [g_user]);
  
  return (
    <Router>
    <div style={{height: '100vh',width: '100vw','boxSizing': 'border-box'}}>
    <div className="column" style={{height: '100%',width: '100%'}}>
      <div className="row" style={{height: '8%',margin: '0',padding: '0'}}>
        <NavBar g_user={g_user} setGUser={setGUser} isAdmin={isAdmin} setAdmin={setAdmin}/>
      </div>
      <div className="row" style={{height : '92%',margin: '0',padding: '0'}}>
      <Routes>
          <Route path="*" element={<UrlNotFound/>}/>
          <Route path="/" element={ 
                             loadingMain?
                               <RingLoader color="#0d9bb8" size={200} cssOverride={{ marginTop: "15%",marginLeft: "45%"}}/>
                             : <Mainpage  list={arr} g_user={g_user} setGUser={setGUser} cf_user={cf_user} setCFUser={setCFUser} getArr={getArr} setArr={setArr} isAdmin={isAdmin} setAdmin={setAdmin}/>}/>
          
          <Route path="/adminpage" element={
            loadingAdmin?
             <BeatLoader color="orange" size={30} cssOverride={{marginTop: "15%",marginLeft: "45%",marginRight: "auto",}}/>
            : ((g_user&&isAdmin)?<Adminpage list={adArr} setAdArr={setAdArr} g_user={g_user} isAdmin={isAdmin} setAdmin={setAdmin}/>:<UnauthorizedAccess/>)}/>
         
      </Routes>
      </div>
      
    </div>
    </div>
    </Router>
    
  );
}

export default App;
