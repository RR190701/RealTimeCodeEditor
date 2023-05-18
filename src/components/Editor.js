import React, { useEffect, useRef , useState} from 'react';
import Codemirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import ACTIONS from '../Actions';
import "./style.css";
import axios from "axios";
import OutputDetails from './OutputDetails';
import toast from 'react-hot-toast';
import OutputWindow from './OutputWindow';
import ChatRoom from './ChatRoom';
import { languageOptions } from '../constant/languagesOption';
import LanguagesDropdown from './LanguageDropdown';
const javascriptDefault = "";

const Editor = ({ socketRef, roomId, onCodeChange , username}) => {
    const [code, setCode] = useState(javascriptDefault);
    const [customInput, setCustomInput] = useState("");
    const [outputDetails, setOutputDetails] = useState(null);
    const [processing, setProcessing] = useState(null);
    const [language, setLanguage] = useState(languageOptions[0]);
    const editorRef = useRef(null);
    
    const onSelectChange = (sl) => {
      console.log("selected Option...", sl);
      setLanguage(sl);
    };

    useEffect(() => {
        async function init() {
            editorRef.current = Codemirror.fromTextArea(
                document.getElementById('realtimeEditor'),
                {
                    mode: { name: 'javascript', json: true },
                    theme: 'dracula',
                    autoCloseTags: true,
                    autoCloseBrackets: true,
                    lineNumbers: true,
                }
            );

            editorRef.current.on('change', (instance, changes) => {
                const { origin } = changes;
                const code = instance.getValue();
                onCodeChange(code);
                setCode(code);
                if (origin !== 'setValue') {
                    socketRef.current.emit(ACTIONS.CODE_CHANGE, {
                        roomId,
                        code,
                    });
                }
            });
        }
        init();
    }, []);

    useEffect(() => {
        if (socketRef.current) {
          socketRef.current.on("F-get-room-code", (results) => {

            //getting room chats
            console.log(results.code);
            editorRef.current.setValue(results.code);
        });
    
            socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
                if (code !== null) {
                    editorRef.current.setValue(code);
                }
            });
        }

        return () => {
            socketRef.current.off(ACTIONS.CODE_CHANGE);
        };
    }, [socketRef.current]);
    useEffect(() => {
      const handlePasteAnywhere = event => {
        if (socketRef.current) {
          socketRef.current.emit("copy-pasted-code", {
            username,
            roomId,
            compileTime: new Date(),
            copiedData: event.clipboardData.getData('text'),
        });
      }
      };
    
      window.addEventListener('paste', handlePasteAnywhere);
    
      return () => {
        window.removeEventListener('paste', handlePasteAnywhere);
      };
    }, []);
    
    const checkStatus = async (token) => {
        const options = {
          method: "GET",
          url: process.env.REACT_APP_RAPID_API_URL + "/" + token,
          params: { base64_encoded: "true", fields: "*" },
          headers: {
            "X-RapidAPI-Host": process.env.REACT_APP_RAPID_API_HOST,
            "X-RapidAPI-Key": process.env.REACT_APP_RAPID_API_KEY,
          },
        };
        try {
          let response = await axios.request(options);
          let statusId = response.data.status?.id;
    
          // Processed - we have a result
          if (statusId === 1 || statusId === 2) {
            // still processing
            setTimeout(() => {
              checkStatus(token);
            }, 2000);
            return;
          } else {
            setProcessing(false);
            console.log("chnaging deatils")
            setOutputDetails(response.data);
            toast.success('Compiled Successfully');
            console.log("response.data", response.data);
            if (socketRef.current) {
              socketRef.current.emit("code-compiled", {
                username,
                roomId,
                compileTime: new Date(),
                status:response.data.status.description,
            });
            }
            return;
          }
        } catch (err) {
          console.log("err", err);
          if (socketRef.current) {
            socketRef.current.emit("code-compiled", {
              username,
              roomId,
              compileTime: new Date(),
              status:"Error occured",
          });
          }
          
          setProcessing(false);
          toast.error();
        }
      };
    const handleCompile = () => {
      if(code === ""){
        
        toast.error('No code written');
        return;
      }
        setProcessing(true);
        const formData = {
          language_id:language.id,
          // encode source code in base64
          source_code: btoa(code),
          stdin: btoa(customInput),
        };
        const options = {
          method: "POST",
          url: process.env.REACT_APP_RAPID_API_URL,
          params: { base64_encoded: "true", fields: "*" },
          headers: {
            "content-type": "application/json",
            "Content-Type": "application/json",
            "X-RapidAPI-Host": process.env.REACT_APP_RAPID_API_HOST,
            "X-RapidAPI-Key": process.env.REACT_APP_RAPID_API_KEY,
          },
          data: formData,
        };
        
        axios
          .request(options)
          .then(function (response) {
            console.log("res.data", response.data);
            const token = response.data.token;
            checkStatus(token);

          })
          .catch((err) => {
            let error = err.response ? err.response.data : err;
            
            // get error status
            let status = err.response.status;
            console.log("status", status);
            if (socketRef.current) {
              socketRef.current.emit("code-compiled", {
                username,
                roomId,
                compileTime: new Date(),
                status,
            });
            }
            if (status === 429) {           
            toast.error('Quota of 100 requests exceeded for the Day! Please read the blog on freeCodeCamp to learn how to setup your own RAPID API Judge0!');
            }
            setProcessing(false);
            console.log("catch block...", error);
          });
      };
      const handlePaste = event => {
        console.log(event.clipboardData.getData('text'));
      };

      
    return( 
    <div  className="code-editor">
        <textarea onPaste ={handlePaste} className='realtime-editor'  id="realtimeEditor"></textarea>
        <div className='code-output'>
          
        <ChatRoom username ={username} socketRef ={socketRef} roomId ={roomId}></ChatRoom>
        
        <div className="language-dropdown">
          <LanguagesDropdown onSelectChange={onSelectChange} />
        </div>
        <OutputWindow outputDetails={outputDetails} />
            <div> {outputDetails && <OutputDetails outputDetails={outputDetails}></OutputDetails>}</div>
        <button className='compile-button' onClick={handleCompile}>
              {processing ? "Processing..." : "Compile and Execute"}</button></div>
        </div>);
};

export default Editor;
