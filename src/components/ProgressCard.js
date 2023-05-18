import React from 'react';
const ProgressCard = ({username, roomId,status, compileTime}) => {
    const date = new Date(compileTime);
         console.log(status);
    return ( 
        <div className='progress-card'>
            <div><b>Time of execution :</b>{`${date.getDay()}/${date.getMonth()+1}/${date.getFullYear()} (${date.getHours()%12}:${date.getMinutes()}) ${(date.getHours() >=12)?"PM":"AM"}`}</div>
            <div><b>Status :</b> {status}</div>
        </div>
     );
}
 
export default ProgressCard;