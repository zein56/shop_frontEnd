import React, { useEffect, useState } from 'react';
import Cars from './Cars.js';
import SelectedCar from './SelectedCar.js';

function Home({search}) {
    const [islogedIn,setIslogedIn] = useState(false);
    const [userName, setUserName] = useState('');
    const [activeTab, setActiveTab] = useState('Cars');

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };
    let content;
    //const SetContent = () => {
        switch (activeTab) {
            case 'Cars':
                content = <Cars handleTabClick={handleTabClick} search={search} />;
                break;
            case 'SelectedCar':
                content = <SelectedCar handleTabClick={handleTabClick} />;
                break;
            default:
                content = <Cars handleTabClick={handleTabClick} search={search} />;
        } 
    //};
    useEffect(() => {
        const loginData = localStorage.getItem('Login'); 
        if (loginData) {
            try {
                const parsedData = JSON.parse(loginData); 
                if (parsedData.logedin) { 
                    setIslogedIn(true);
                    setUserName(parsedData.name); 
                }else{
                    setIslogedIn(false);
                }
            } catch (error) { 
                console.error('JSON parse hatası:', error);
            }
        }
    }, [search]);

    return (
        <>
        {content}
        </>
    );
}

export default Home;
