import Leaderboard from "../components/Leaderboard";
import Sideinfo from "../components/Sideinfo";
import './Mainpage.css'

function Mainpage(props){
    
    return (
        <>
        <div className="row" style={{'height': '100%' ,width: '100%',margin: '0',padding: '0'}}>
            <div className="column" style={{'height': '100%',width: '78.5%' ,background :'white','overflowY' : 'scroll'}}>
                <Leaderboard {...props}/>
            </div>
            <div className="column" style={{'height': '100%',width: '21.5%' , background : 'white'}}>
                 <Sideinfo {...props}/>
            </div>
        </div>
        </>
    );
}
export default Mainpage;