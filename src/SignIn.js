import './CSS/signin.css';
import React,{ useState} from 'react';
import axios from 'axios';


function SignIn({ handleTabClick }) {
    const [email,setEmail] = useState('');
    const [emailError,setEmailError] = useState('');
    const [name,setName] = useState('');
    const [surname,setSurname] = useState('');
    const [nameError,setnameError] = useState('');
    const [number,setNumber] = useState('');
    const [numberError,setNumberError] = useState('');
    const [password,setPassword] = useState('');
    const [passError,setPassError] = useState('');
    const [agreementChecked, setAgreementChecked] = useState(false);
    const [commercialMessagesChecked, setCommercialMessagesChecked] = useState(false);
    const [checkboxErr,SetCheckboxErr] = useState('');
    const EmailTester =  (email) => {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
        
    };
    const NameTester =  (name) => {
        const nameRegex = /^[a-zA-Z]+$/;
        return nameRegex.test(name); 
    };
    const NumberTester = (num) => {
        const numberRegex = /^[0-9]{11}$/;//
        return numberRegex.test(num);
    }
    const PasswordTester = (pass) => {
        const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%.-]{8,}$/;
        return passRegex.test(pass);
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        setEmailError('');
        setnameError('');
        setNumberError('');
        setPassError('');
        let formIsValid = true;
        if (EmailTester(email)) {
          setEmailError('');
          axios.post('http://localhost:4000/checkEmail', { email })
            .then((response) => {
                //setEmailError(response.data.message)
                if (!response.data.value) 
                {
                    console.log("alooo :",response.data.message);
                    setEmailError(response.data.message)
                    formIsValid = false;
                }
            })
            .catch((error) => {
                console.error('Hata:', error);
                formIsValid = false;
            });
        } else { 
            setEmailError('Lütfen geçerli bir e-posta adresi girin.'); 
            formIsValid = false;
        }
        if (NameTester(name) && NameTester(surname)) setnameError('');
        else {
            setnameError('Ad-soyad sadece buyuk ve kucuk harflerden olusmali')
            formIsValid = false;
        }
        if (NumberTester(number)) setNumberError('');
        else {setNumberError('lutfen 11 rakamdan bir telefon numara giriniz')
        formIsValid = false;
        }
        
        if (PasswordTester(password)) setPassError('');
        else{ setPassError('sifreniz guclu degil lutfen degistiriniz')
        formIsValid = false;
        }
        if (!agreementChecked||!commercialMessagesChecked) {
            formIsValid = false;
            SetCheckboxErr('Lütfen kullanıcı sözleşmesini ve ticari elektronik mesajlari kabul edin.');
        }else{
            SetCheckboxErr('');
        }
        if (formIsValid) {
            console.log('hesap aciliyor!')
            const userData = {
                name:name,
                lastname: surname,
                phoneNum: number,
                email:email,
                userPassword:password
            };
            axios.post('http://localhost:4000/addUser', userData)
                .then((response) => {
                    console.log('Veri başarıyla eklendi:', response.data);
                    if (response) {
                        axios.post('http://localhost:4000/LogIn', { email,password })
                    .then((response) => {
                        if (response.data.value) {
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
                            handleTabClick('home');// alo@gmail.com
                            // window.location.reload();// Aa@2aloalo
                        }
                        console.log("alooo :",response.data);
                    })
                    .catch((error) => {
                        console.error('Hata:', error);
                    });
                    }
                    
                    setName('');
                    setSurname('');
                    setNumber('');
                    setEmail('');
                    setPassword('');
                    setAgreementChecked(false);
                    setCommercialMessagesChecked(false);
                    handleTabClick('home')
                    window.location.reload();
                })
                .catch((error) => {
                    console.error('Veri ekleme hatası:', error);
                });
        }
    };


    return (
        <div className='SignBody'>
            <div className='SignWind'>
                <p>Create An Account</p>
                <div className='info'>
                    <div className='emailInput'>
                        <input type='email' placeholder='Email Address'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        ></input>
                        <div className='email-message'>{emailError && <div style={{ color: 'red' }}>{emailError}</div>}</div>  
                    </div>
                    <div className='nameInputs'>
                        <input type='text' placeholder='Name' style={{marginRight:'8.2%'}}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        ></input>
                        <input type='text' placeholder='Surname' 
                        value={surname}
                        onChange={(e) => setSurname(e.target.value)}
                        ></input>
                        <div className='email-message'>{nameError && <div style={{ color: 'red' }}>{nameError}</div>}</div>
                    </div>
                    <div className='numberInput'>
                        <input type='number' placeholder='Phone Number'
                        value={number}
                        onChange={(e) => setNumber(e.target.value)}></input>
                        <div className='email-message'>{numberError && <div style={{ color: 'red' }}>{numberError}</div>}</div>
                    </div>
                    <div className='passwordInput'>
                        <input type='password' placeholder='Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}></input>
                        <div className='email-message'>{passError && <div style={{ color: 'red' }}>{passError}</div>}</div>
                    </div>
                </div>
                <div className='submits'> 
                    <div className='checkBox'>
                        <input type='checkbox'
                        checked={agreementChecked}
                        onChange={() => setAgreementChecked(!agreementChecked)}
                        ></input>
                        <span>I accept the Individual Account Agreement and its Annexes .</span>
                    </div>
                    <div className='checkBox'>
                        <input type='checkbox'
                        checked={commercialMessagesChecked}
                        onChange={() => setCommercialMessagesChecked(!commercialMessagesChecked)}
                        ></input>
                        <span>I allow commercial electronic messages containing campaigns, promotions and advertisements to be sent to my contact information, and for this purpose, I allow my personal data to be processed and shared with your suppliers.</span>
                    </div> 
                    <div className='errorM'>
                        <div className='email-message'>{checkboxErr && <div style={{ color: 'red' }}>{checkboxErr}</div>}</div>
                    </div>
                    <button onClick={handleSubmit}>Create Account</button>
                </div>
            </div>
        </div>
    );
};

export default SignIn;
 