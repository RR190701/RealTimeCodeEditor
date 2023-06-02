import React, { useEffect, useState } from 'react';
import ProgressCard from './ProgressCard';
import CopyPasteCode from './CopyPasteCode';
const ProgressReport = ({username, socketRef, roomId}) => {
    const [studentProg, setStudentProg] = useState([]);
    const [studentCopyPasteData, setStudentCopyPasteData] = useState([]);
    const [lastActiveTime, setLastActiveTime] = useState('');

    useEffect(() => {
        if (socketRef.current) {
            socketRef.current.emit("join-student-progress-report", {roomId, username});
            socketRef.current.on("get-student-progress-report", (result) => {
             
                let studentProgressData =[];
                result.forEach(({username, roomId,status, compileTime}) => {
                    studentProgressData.push({
                        username,
                        roomId,
                        status,
                        compileTime
                    })
                });
        
                console.log(studentProgressData);
                setStudentProg(studentProg => [...studentProg, ...studentProgressData]);
            });

            //get student activity
            socketRef.current.on("F-get-student-activity", (result) => {
                   console.log("student activity",result);
                   setLastActiveTime(result.lastActiveTime);
            });

            //copy paste
            socketRef.current.emit("join-student-copy-paste-code", {roomId, username});
            socketRef.current.on("get-student-copy-paste-code", (result) => {
             
                let CopyPasteData =[];
                result.forEach(({username, roomId,compileTime, copiedData}) => {
                    CopyPasteData.push({
                        username,
                        roomId,
                        compileTime,
                        copiedData
                    })
                });
        
                //getting room chats
                setStudentCopyPasteData(studentCopyPasteData => [...studentCopyPasteData, ...CopyPasteData]);
            });
            }
        },[socketRef.current, roomId]);
        const lastseen = new Date(lastActiveTime);
    return (<div className='progress-div'>
        <div className=" progress-heading leaveBtn">Progress Report</div>
        <h4 style={{"margin":".5rem auto", "textTransform":"capitalize"}}>{username}</h4 >
        {(lastActiveTime)?
                <h4>Last seen at: {`${lastseen.getHours() % 12}:${lastseen.getMinutes()} ${(lastseen.getHours() > 12 )?'PM':'AM'} (${lastseen.getDay()}/${lastseen.getMonth()+1}/${lastseen.getFullYear()})`}</h4>
:
null
        }
        <h4 style={{"marginBottom":"3px"}}>Code Compilation</h4 >
        <span>Code Compiled {studentProg && studentProg.length} Times</span>
        <div className='code-compilation-div'>
            {studentProg.map(({username, roomId,status, compileTime}) => (
            <ProgressCard
            key ={compileTime}
            username ={username}
            roomId = {roomId}
            status ={status}
            compileTime ={compileTime}
            ></ProgressCard>))}
        </div>
        <h4 style={{"marginBottom":"3px"}}>Copy Pasted Code</h4>
        <span>Code Copy Pasted {studentCopyPasteData.length} Times</span>
        <div className='code-compilation-div'>
        {studentCopyPasteData.map(({username, roomId,copiedData, compileTime}) => (
            <CopyPasteCode
            key ={compileTime}
            username ={username}
            roomId = {roomId}
            copiedData ={copiedData}
            compileTime ={compileTime}
            ></CopyPasteCode>
            ))}

        </div>
    </div>  );
}
 
export default ProgressReport;