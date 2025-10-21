import './CSS/App.css';
import Nav from './NavBar.js'
import Home from './Home.js';
import Login from './LogIn.js';
import SignIn from './SignIn.js';
import Cell from './Cell.js';
import { useEffect, useState } from 'react';

function App() {
  const [content,setContent] = useState(<Home/>);
  const [activeTab,setActiveTab] = useState('home');
  const [search, setSearch] = useState(localStorage.getItem('search') || '');

  const contentChange = (c) => {
    setActiveTab(c.content);
    //console.log(c)
    //console.log(c.content)
  };
  const searchChange = (s) => {
    setSearch(s);
    //console.log(s);
    //localStorage.setItem('search', s);
  };
    
  useEffect(() => {
    //console.log(activeTab);
    switch (activeTab) {
      case 'home':
        setContent(<Home search={search}/>)
          break;
      case 'Login':
          setContent(<Login OnContentChange={contentChange}/>)
          break; 
      case 'SignIn':
          setContent(<SignIn/>)
          break;
      case 'Cell':
      setContent(<Cell/>)
      break;
      default:
          setContent(<Home search={search}/>)
      console.log(content) 
    }   
  },[activeTab,search]) 
    
  return (
    <div className="App">
      <Nav OnContentChange={contentChange} OnSetSearch={searchChange}></Nav>
      {content}
    </div>
  );//<Home></Home> 
}

export default App;
