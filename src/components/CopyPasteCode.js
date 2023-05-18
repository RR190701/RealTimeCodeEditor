import React from 'react';
const CopyPasteCode = ({username, roomId,copiedData, compileTime}) => {
    const date = new Date(compileTime);
    
    return ( 
        <div className='copy-paste-card'>
            <div><b>Data copied at :</b>{`${date.getDay()}/${date.getMonth()+1}/${date.getFullYear()} (${date.getHours()%12}:${date.getMinutes()}) ${(date.getHours() >= 12)?"PM":"AM"}`}</div>
            <div><b>Copied data :</b> {copiedData}</div>
        </div>
     );
}
 
export default CopyPasteCode;