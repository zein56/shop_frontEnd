import './CSS/login.css';
import React,{useState} from 'react';
import axios from 'axios';

function Login({ OnContentChange }) {
    const [email, setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [result, setResult] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.post('http://localhost:4000/LogIn', { email,password })
            .then((response) => {
                if (response.data.value) {
                    setResult(response.data.message);
                    let userinfo = response.data.userInfo
                    console.log(userinfo)
                    localStorage.setItem('Login', JSON.stringify({
                        logedin: 1,
                        id:userinfo.id,
                        email:userinfo.Email, 
                        address:userinfo.address,
                        name:userinfo.name,
                        surname:userinfo.lastName,
                        phoneNum:userinfo.phoneNumber,
                    }));
                    OnContentChange({content:'home'});// alo@gmail.com
                    window.location.reload();// Aa@2aloalo
                } else {
                    setResult(response.data.message);
                }
                console.log("alooo :",response.data);
            })
            .catch((error) => {
                console.error('Hata:', error);
                setResult('Bir hata oluştu.');
            });
    };
  return (
    <div className='LogBody'>
        <form className='LogWind' onSubmit={handleSubmit}>
            <p>Log in</p>
            <div className='info'>
                <input type='email' placeholder='Email Address'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required></input>
                <input type='password' placeholder='Password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                ></input>
            </div>
            <div className='submits'>
                {result && <div className="result-message">{result}</div>}
                <button type='submit'>log in</button>
            </div>
        </form>
    </div>
  );
};

export default Login;
