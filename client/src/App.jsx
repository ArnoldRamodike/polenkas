import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { socket } from './index';


function App() {

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on('message', (msg) => {
      setMessages(messages => [...messages, msg])
    });

    return () => {
      socket.off(`message`)
    }
  }, [message])

  const submit = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:8000/api/message",{
      message
    });
    setMessages(messages =>[...messages, message])
    setMessage('');

  }

 
  

  console.log(messages);
  

  return (
    <div className="container">
      <div className="row vh-100">
        <div className="col-3">
        <div class="d-flex flex-column flex-shrink-0 p-3 bg-body-tertiary" >
    <a href="/" class="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none">
      <span class="fs-4">John Doe</span>
    </a>
    <hr/>
    <ul class="nav nav-pills flex-column mb-auto">
      <li class="nav-item">
        <a href="#" class="nav-link active" aria-current="page">

          last message: {message}
        </a>
      </li>
    </ul>
 
  </div>
        </div>
        <div className="col-9 border">
          <div id="head" className="py-3 lh-sm border-bottom">
            <strong classNam="mb-1">Memebers: ricco, smith</strong>
          </div>

          <div id="converation" >
            {messages.map(m => (
              <div className="row pt-2">
              <div className="col-6">
                <div className="alert d-inline-block alert-primary" role="alert">
                  {m}
                </div>
              </div>
              <div className="col-6">
                
              </div>
            </div>
            ))}
            

            {/* <div className="row pt-2">
              <div className="col-6">
               
              </div>
              <div className="col-6">
              <div className="alert d-inline-block alert-success" role="alert">
                  Hello buddy
                </div>
              </div>
            </div> */}
          </div>

          <form id="reply" className="p-3 w-100" onSubmit={submit}>
            <div className="input-group">
              <input className="form-control" placeholder="Write a message" onChange={e => setMessage(e.target.value)}/>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}

export default App;
