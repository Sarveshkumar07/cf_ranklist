import favicon from "./cancel.png";
function Rank(props){
    function toTitleCase(str) {
      if(!str)
       return "-"
        return str.toLowerCase().split(' ').map(function (word) {
          return (word.charAt(0).toUpperCase() + word.slice(1));
        }).join(' ');
      }
      function set_color(rating) {
        if (rating == 0) return "black";
        else if (rating < 1200) return "gray";
        else if (rating < 1400) return "#008000";
        else if (rating < 1600) return "#03a89e";
        else if (rating < 1900) return "blue";
        else if (rating < 2100) return "#a0a";
        else if (rating < 2300) return "#ff8c00";
        else if (rating < 2400) return "#ff8c00";
        else if (rating < 2600) return "#ff0000";
        else if (rating < 3000) return "#ff0000";
        else return "#ff0000";
      }
    return(
       <tr style={{backgroundColor : (props.g_user?props.g_user.email:" ")==props.value.email?'#DDEEFF':''}}> 
              <th scope="row">{(props.id+1)}</th>
              <td><a href={"https://codeforces.com/profile/"+props.value.cf_handle}  target="_blank" rel="noopener noreferrer" style={{fontFamily: "helvetica neue,Helvetica,Arial,sans-serif",fontWeight: (props.value.rating!=0)?"700":"300",fontSize: '0.9rem',textDecoration : 'none',color : set_color(props.value.rating)}}>
                        {<>{<span style={{color : props.value.rating>=3000?"black":""}}>{props.value.cf_handle[0]}</span>}{props.value.cf_handle.substr(1,props.value.cf_handle.length-1)}</>}
              </a></td>
              <td>{props.value.name}</td>
              <td style={{fontFamily: (props.value.rating!=0)?"helvetica neue,Helvetica,Arial,sans-serif":"",fontWeight: (props.value.rating!=0)?"700":"300",color : set_color(props.value.maxRating?props.value.maxRating:0)}}>{props.value.maxRating?props.value.maxRating:"-"}</td>
              <td>{toTitleCase(props.value.rank)}</td>
              <td colSpan="2" style={{'textAlign': 'right' , 'paddingRight' : '1em'}}>{props.value.rating}</td>
              {
                props.isAdmin?
                <td><img src={favicon} alt="delete button" style={{width: "1.5rem", height: "1.5rem",}} id={props.id} onClick={props.onSmash}/></td>
                :<></>
              }
       </tr>
    );
}
export default Rank;