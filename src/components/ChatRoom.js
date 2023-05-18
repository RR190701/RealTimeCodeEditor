import React ,{useState, useEffect, useRef} from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import ScrollToBottom from "react-scroll-to-bottom";
import IconButton from '@material-ui/core/IconButton';
import SendIcon from '@mui/icons-material/Send';

const ChatRooom =({socketRef, roomId,username}) => {
  const [open, setOpen] = React.useState(false);   
  const currentUser = username;
  const [msg, setMsg] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function init() {
       console.log(roomId)
    }
    init();
}, []);

  useEffect(() => {
    if (socketRef.current) {
    socketRef.current.emit("B-join-chat-room", {roomId, username});
    socketRef.current.on("F-get-room-chat", (results) => {
     
      let msgs =[];
      results.forEach(({username, message}) => {
            msgs.push({
                sender : username,
                message
            })
        });
      console.log(results)
        //getting room chats
      setMsg(msg => [...msg, ...msgs]);
    });


      socketRef.current.on('F-receive-message', ({ message, sender }) => {
        setMsg((msgs) => [...msgs, { sender, message }]);
      }); 
    }
}, [socketRef.current, roomId]);

    //helper function
    const sendMessage = () => {
      console.log(roomId);
         if (message) {
           socketRef.current.emit('B-send-message', { roomId, message, sender: currentUser });
           setMessage("");
         }
   
     };
     const preventCopyPaste = (e: ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
    }

  const toggleDrawer = (value) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    

    setOpen(value);
  };

  const Chats = () => (
    <Box
      sx={{ width:300 }}
      role="presentation"
    >
<div className ="chat-room-div">

    {/* chat room contents */}
    <div className="chat-room-content">
      {/* part two */}
      <div className ="chat-area-div">
          <div className="chatting-area">
              {/* messsages */}
              <div className="chat-room-messages">
              <div className="all-chats">
              <ScrollToBottom>
{msg &&
          msg.map(({ sender, message }, idx) => {
              if (sender !== currentUser) {
                return (
                  <div className="member-message" key={idx}>
                    <span>{sender}</span>
                    <p>{message}</p>
                  </div>
                );
              } else {
                return (
                  <div className="my-message" key={idx}>
                    <span>{sender}</span>
                    <p>{message}</p>
                  </div>
                );
              }
            })}
</ScrollToBottom>
              </div>
              </div>

              {/* text message div */}
              <div className="chatroom-textbox-div">
<input placeholder="Enter your message" 
onPaste={(e) => preventCopyPaste(e)}
value={message}
onChange={e => setMessage(e.target.value)}
// onKeyPress={e => e.key==="Enter"?sendMessage(e):null}
>
</input>
<IconButton color="primary" 
aria-label="send"
onClick={sendMessage}
>
<SendIcon></SendIcon>
      </IconButton>
</div>

          </div>
      </div>
    </div>

        </div>
    </Box>
  );

  return (
    <div>
          <button className="btn leaveBtn" onClick={toggleDrawer(true)}>
                    Chat
                </button>
          <Drawer
            anchor='right'
            open={open}
           onClose={toggleDrawer(false)}
          >
            {Chats()}
          </Drawer>
    </div>
  );
}

export default ChatRooom;