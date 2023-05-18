import React, { useEffect, useState } from 'react';
import ProgressCard from './ProgressCard';
import CopyPasteCode from './CopyPasteCode';
const ProgressReport = ({username, socketRef, roomId}) => {
    const [studentProg, setStudentProg] = useState([]);
    const [studentCopyPasteData, setStudentCopyPasteData] = useState([]);

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
        
                //getting room chats
                console.log(studentProgressData);
                setStudentProg(studentProg => [...studentProg, ...studentProgressData]);
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
        },[socketRef.current, roomId])
    return (<div className='progress-div'>
        <div className=" progress-heading leaveBtn">Progress Report</div>
        <h4 style={{"marginBottom":"3px"}}>Code Compilation</h4 >
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