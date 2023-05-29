import React,{useState} from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom'
import './login.css';


function Login(props) {
    const [username, setUserame] = useState("");
    const [password, setPassword] = useState("");

    let navigate = useNavigate();

    const ValidateLogin = async (event) => {
        event.preventDefault();
        if (!username || !password) {
            window.alert("Enter all required fields");
            return 0;
        }
        try {
            const res = await axios.post('http://localhost:8000/admin/login', {
                username: username,
                password: password
            }, {
                headers: {
                    "Content-Type": "application/json"
                },
            })
            if (res.data.token) {
                props.setToken(res.data.token);
                navigate('/home', { replace: true });
            } else {
                window.alert("Login Failed");
            }
            
        } catch (err) {
            console.log(err);
            window.alert("Login Failed");
        }
        
    };

    
    return (
        <>
            <div className='login-container'>
                <div className="login-header">
                    <h1 className="fs-1">INVENTORY MODULE</h1>
                    <h2 className="fs-4">ENTER LOGIN CREDENTIALS</h2>
                </div>
                <form className="">
                    <label >Username</label>
                    <br></br>
                    <br></br>
                    <input value={username}
                        onChange={(text) => setUserame(text.target.value)}
                        type="text"
                        username="username"
                        placeholder='Enter Username' />
                    <br></br>
                    <br></br>
                    <label >Password</label>
                    <br></br>
                    <input value={password}
                        onChange={(text) => setPassword(text.target.value)}
                        type="password"
                        name="pswd"
                        placeholder='Enter Password' />
                    <br></br>
                    <br></br>
                    <br></br>
                    <button className='loginbutton' onClick={ValidateLogin}>Submit</button>
                </form>
            </div>
        </>
    );
}

export default Login;