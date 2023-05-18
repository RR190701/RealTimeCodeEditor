require('dotenv').config({path : "./config.env"});
const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');
const ACTIONS = require('./src/Actions');
const connectDB = require('./config/db');
const Message = require('./models/chat');
const LabCode = require('./models/labCode');
const CodeCompileData = require('./models/codeCompile');
const CodeCopyPasteData = require('./models/codeCopyPaste');


//connect DB
connectDB();

const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('build'));
app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const userSocketMap = {};
function getAllConnectedClients(roomId) {
    // Map
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
        (socketId) => {
            return {
                socketId,
                username: userSocketMap[socketId].username,
                role:userSocketMap[socketId].role
            };
        }
    );
}

io.on('connection', (socket) => {
   // console.log('socket connected', socket.id);

    socket.on(ACTIONS.JOIN, ({ roomId, username, role }) => {
        
        userSocketMap[socket.id] ={ username, role};
        socket.join(roomId);
        const clients = getAllConnectedClients(roomId);
        clients.forEach(({ socketId }) => {
            io.to(socketId).emit(ACTIONS.JOINED, {
                clients,
                username,
                role,
                socketId: socket.id,
            });
        });

        LabCode.findOne({roomId}).then((result) => {
            socket.emit("F-get-room-code", result);
        });
      

    });

    socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
        LabCode.updateOne({
            roomId
          }, {
            $set: {
                code
            }
          },
          {upsert:true}).then((res) =>{
            socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });
          })
    });

    socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
        console.log("sync",code);
        io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
    });

    socket.on('disconnecting', () => {
        const rooms = [...socket.rooms];
        rooms.forEach((roomId) => {
            socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
                socketId: socket.id,
                username: userSocketMap[socket.id],
            });
        });
        delete userSocketMap[socket.id];
        socket.leave();
    });

    //sending message to others
    socket.on('B-join-chat-room', ({roomId, username}) => {  
        //sending chats
        Message.find({roomId}).then((result) => {
            socket.emit("F-get-room-chat", result);
        });      
      });

  socket.on('B-send-message', ({ roomId, message, sender }) => {
    const setNewMessage = new Message({roomId, message, username : sender});
    setNewMessage.save().then(() => {
        io.sockets.in(roomId).emit('F-receive-message', { message, sender });
    })
 
  });

  socket.on('code-compiled', ({ roomId, username, compileTime, status }) => {
    const newCodeCompilation = new CodeCompileData({roomId, username, compileTime, status});
    newCodeCompilation.save().then(() => {

    })
  });


  socket.on('join-student-progress-report', ({roomId, username}) => {  
    CodeCompileData.find({roomId,username}).then((result) => {
        socket.emit("get-student-progress-report", result);
    }); 
  })  

  socket.on('copy-pasted-code', ({ roomId, username, compileTime, copiedData }) => {
    if(!copiedData){
        return;
    }
    const newCopiedCode = new CodeCopyPasteData({roomId, username, compileTime, copiedData});
    newCopiedCode.save().then(() => {
    })
  });
  
  socket.on('join-student-copy-paste-code', ({roomId, username}) => {  
    CodeCopyPasteData.find({roomId,username}).then((result) => {
        socket.emit("get-student-copy-paste-code", result);
    }); 
  }); 

});


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
