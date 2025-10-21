import React, { useEffect,useState } from 'react';
import './CSS/NavBar.css';
// import SignIn from './SignIn';
// import Login from './LogIn';
// import Home from './Home';
// import Cell from './Cell'; 
//import { search } from '../../backEnd/routes/uploadRoutes';

function NavBar({OnContentChange,OnSetSearch}) {

    const [islogedIn, setIslogedIn] = useState(0);
    
        useEffect(() => {
            const loginData = localStorage.getItem('Login'); 
            if (loginData) {
                try {
                    const userData = JSON.parse(localStorage.getItem('Login')); 
                    setIslogedIn(userData.logedin);
                } catch (error) { 
                    console.error('JSON parse hatası:', error);
                }
            }
        }, []);


 

    
    const logOut = () =>{
        localStorage.setItem('Login', JSON.stringify({
            logedin: 0, 
            name: '',
            surname: '',
        })); 
        console.log("log out")
        window.location.reload();
    }
    const searching = (searchWord) => {
        localStorage.setItem('search',searchWord)
        //console.log(searchWord)
    };

    return (
        <>
            <div className='NavBody'>
                <div className="Nav">
                    <div className='AppName' onClick={() => window.location.reload()}>alooo</div>
                    <div className='Search' onChange={(e) => OnSetSearch(e.target.value)}>
                        <input type='search'></input>
                        <div className='searchIcon'>
                            <span className="material-symbols-outlined">
                            search
                            </span>
                        </div>
                    </div>
                    <div className='login-signin'>
                    {islogedIn ? ( 
                            <button className='settings' onClick={() => logOut()}>My Account</button> 
                        ) : (
                            <><button onClick={() => OnContentChange({content:'Login'})}>log in</button> 
                            |
                            <button onClick={() => OnContentChange({content:'SignIn'})}>sign in</button> </>
                        )}
                        
                    </div> 
                    <div className='AddNew' onClick={() => OnContentChange({content:'Cell'})}>
                            <span className="material-symbols-outlined">
                            add_Circle
                            </span>
                    </div>
                    <div className='settings'>
                            <span className="material-symbols-outlined">
                            settings
                            </span>
                    </div>
                </div>
                <footer className='footer'>
                <div className='AppName' onClick={() => window.location.reload()}>alooo</div>
                    <div className='AddNew' onClick={() => OnContentChange({content:'Cell'})}>
                            <span className="material-symbols-outlined">
                            add_Circle
                            </span>
                    </div>
                    <div className='settings'>
                            <span className="material-symbols-outlined">
                            settings
                            </span>
                    </div>
                </footer>
            </div>
            
        </>
    );
}//{content}

export default NavBar;
