import React , {useEffect, useState} from 'react';
import Avatar from 'react-avatar';
import Drawer from '@mui/material/Drawer';
import ProgressReport from './Progress';

const Client = ({ username, socketRef, roomId, role, userRole }) => {
    
  const [open, setOpen] = React.useState(false); 

  useEffect(() => {},[]);

  const toggleDrawer = (value) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setOpen(value);
  };
    return (
        <div className="client">
          {
            (role === "Instructor")?
            (
          <Avatar name={username} onClick={toggleDrawer(true)} size={50} round="14px" style={{"cursor":"pointer", "border":"2px solid white"}} />

            ):
            <Avatar name={username} onClick={toggleDrawer(true)} size={50} round="14px" style={{"cursor":"pointer"}} />
          }
            <span className="userName">{(role === "Instructor")?`${username} (Instructor)`:username}</span>
            {
              (userRole == "Instructor")?
              (
              <Drawer
              anchor='right'
              open={open}
              onClose={toggleDrawer(false)}
              >
              <ProgressReport 
                        socketRef={socketRef}
                        roomId={roomId}
                        username ={username}>
              </ProgressReport>
              </Drawer>
              ):null
            }
        </div>
    );
};

export default Client;
