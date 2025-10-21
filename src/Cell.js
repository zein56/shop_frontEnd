import './CSS/Cell.css'
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Cell({ handleTabClick }) {
    const [userInfo,setUserInfo] = useState('');
    const [makes, setMakes] = useState([]);
    const [make,setMake] = useState(0);
    const [models,setModels] = useState([]); 
    const [model,setModel] = useState(0); 
    const [year,setYear] = useState(0); 
    const [fuel,setFuel] = useState(0);
    const [gear,setGear] = useState(0);
    const [color,setColor] = useState(0);
    const [warranty,setWarranty] = useState(0);
    const [condition,setCondition] = useState(0);
    const [tradeIn,setTradeIn] = useState(0);
    const [km,setKm] = useState(0);
    const [power,setPower] = useState(0);
    const [celler,setCeller] = useState('');
    const [phoneNum,setPhoneNum] = useState(0);
    const [address,setAddress] = useState('');
    const [price,setPrice] = useState(0);
    const [CarsInfo,setCarsInfo] = useState([]);
    const [description,setDescription] = useState('');
    const [images,setImages] = useState([]);

    const CarsInfoSelections = () => {  
        axios.get(`${process.env.REACT_APP_API_URL}/CarsInfoSelections`)
        .then((response) => {
            setCarsInfo(response.data);
            //console.log(response.data);
        }).catch((error)=>{ 
            console.error('!!!',error);
        });
    }
     
    const AddNew = async () => {
        let canAdd = 1;
        let newCarId = 0;
    
        // Kontrolleri yap
        if (!make || !model || !year || !fuel || !gear || !color || !power || !address || !price) {
            console.log('Please complete the car info!');
            canAdd = 0;
        }
    
        const info = {
            date: new Date(),
            makeId: make,
            ModelId: model,
            yearId: year,
            fuelId: fuel,
            gearId: gear,
            color: color,
            KM: km,
            enginePower: power,
            warranty: warranty,
            condition: condition,
            tradeIn: tradeIn,
            description: description,
            userId: userInfo.id,
            celler: celler,
            phoneNumber: phoneNum,
            address: address,
            price: price,
        };
    
        // Eğer araba bilgileri doğru girildiyse
        if (canAdd) {
            try {
                // Araba bilgilerini ekle
                const response = await axios.post(`${process.env.REACT_APP_API_URL}/addCarToCell`, info);
                //console.log('The car was added to cell!', response.data);
                newCarId = response.data.id; // Arabaya ait ID'yi al
     
                // Resimler varsa, resimleri ekle
                if (images.length !== 0) { 
                    const formData = new FormData(); 
                    formData.append('carId', newCarId); // Araba ID'si
                    images.forEach((image) => {
                    //console.log("img: ",image)
                    formData.append('images', image); // Resimleri formData'ya ekle
                    });

                    // Resimleri gönder
                    try {
                        const res = await axios.post(`${process.env.REACT_APP_API_URL}/upload`, formData, {
                            headers: {
                                'Content-Type': 'multipart/form-data',  // Dosya gönderirken gerekli header
                            },
                        });
    
                        //console.log(res.data.message); // Resim yükleme sonucu
                    } catch (error) {
                        console.error('Resimler yüklenirken hata oluştu:', error);
                    }
                }
                //handleTabClick('Home');
                window.location.reload()
            } catch (error) {
                console.error('Araba eklenirken hata oluştu:', error.response?.data || error.message);
            }
        }
    };
    

    const getSelection = (table,column,id) => { 
        if (!table) {
         table = 'makes'    
        }
        let Data = {   
            table: table, 
            column: column,    
            id: id
        };     
        axios.post(`${process.env.REACT_APP_API_URL}/carsMake-model`, Data)  
        .then((response) => {  
            if (table === 'makes') setMakes(response.data);
            if (table === 'models') setModels(response.data);  
        }) 
        .catch((error) => {
            console.error(error.response?.data || error.message); 
        })
    };
    useEffect(() => {
        let loginInfo = JSON.parse(localStorage.getItem('Login'));
        if (!loginInfo.logedin) {
            console.log('you need to log in first!');
            handleTabClick('Login');
        }

        let id = loginInfo.id; 
        axios.post(`${process.env.REACT_APP_API_URL}/user`,{id})     
        .then((response) => {
            setUserInfo(response.data);
            setCeller(response.data.name+' '+response.data.lastName);
            setPhoneNum(Number(response.data.phoneNumber));
            setAddress(response.data.address); 
        }).catch((error)=>{     
            console.error('!!!',error); 
        });
        CarsInfoSelections();
        getSelection(); 
        //console.log('alo')
    },[]);
    const handleMakeChange = async (e) => { 
        getSelection('models', 'make_id', e.target.value);
    };
    const yearsArr = []; 
    for (let year = 2025; year >= 1950; year--) {
        yearsArr.push(Number(year)); 
    }
    const switchToggle = (id,value) => {
        const colors = ['red','green'];
        const element = document.getElementById(id);
        const innerDiv = element.querySelector('div');
        //console.log(value);
        element.style.boxShadow = '1px 1px 20px '+colors[value];
        if (value) innerDiv.style.left = '39px';
        else innerDiv.style.left = '0px';
        innerDiv.style.backgroundColor = colors[value];
    };
    const handleImageChange = (e) => {
        const files = e.target.files;
        if (files.length > 10) {
            alert('En fazla 10 resim yükleyebilirsiniz.');
            return;
        }else{
            setImages(Array.from(files)); 
        }
    }; 
    return (
        <div className='CellBody'> 
            <div className='carForm'> 
                <h1>Select Your Car Info.</h1>  
                <div className='selects'>
                    <div className='select'>
                        <select id='makeSelect' value={make}onChange={(e) => {setMake(Number(e.target.value)); handleMakeChange(e)}}>
                            <option>select Make</option>
                        {makes && makes.data && makes.data.map((item, index) => {
                            return <option key={index} value={item.make_id}>{item.name}</option>;
                            })}
                        </select> 
                    </div> 
                    <div className='select'>
                        <select id='modelSelect' value={model}onChange={(e) => setModel(Number(e.target.value))}>  
                        <option>select Modle</option>
                        {models && models.data && models.data.map((item, index) => {
                                return <option key={index} value={item.model_id}>{item.name}</option>;
                            })}
                        </select> 
                    </div>
                    <div className='select'>
                        <select id='yearSelect' value={year} onChange={(e) => setYear(Number(e.target.value))}>
                        <option>select Year</option>
                        {yearsArr.map((year) => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>  
                    </div> 
                    <div className='select'>
                        <select value={fuel} onChange={(e) => setFuel(Number(e.target.value))}>
                        <option>select Fuel</option>
                        {CarsInfo.fuel && CarsInfo.fuel.map((fuel, index) => {
                                return <option key={index} value={fuel.id}>{fuel.fuelType}</option>;
                            })}
                        </select>
                    </div>
                    <div className='select'>
                        <select value={gear} onChange={(e) => setGear(Number(e.target.value))}>
                        <option>select Gear</option>
                        {CarsInfo.gear && CarsInfo.gear.map((gear, index) => {
                                return <option key={index} value={gear.id}>{gear.gearType}</option>;
                            })}
                        </select>
                    </div>
                    <div className='select'>
                        <select value={color} onChange={(e) => setColor(Number(e.target.value))}> 
                        <option>select Color</option>
                        {CarsInfo.colors && CarsInfo.colors.map((color, index) => {
                                return <option key={index} value={color.id}>{color.colorName}</option>;
                            })}
                        </select>
                    </div>
                </div>
                <div className='inputs'>
                    <div className='input'>
                        <label>KM:</label>
                        <input type='number' placeholder='0' value={km || ''} onChange={(e) => {
                            let inputValue = e.target.value;
                            if(inputValue[0]==='0'&&inputValue.length === 2)e.target.value = inputValue[1]
                            setKm(Number(inputValue))}}/>
                    </div>
                    <div className='input'>
                        <label>pawer:</label> 
                        <input type='number' value={power || ''} onChange={(e) => {
                            let inputValue = e.target.value;
                            if(inputValue[0]==='0'&&inputValue.length === 2)e.target.value = inputValue[1]
                            setPower(Number(inputValue))}}/>
                    </div>
                </div>
                <div className='toggles'>
                    <div className='toggle'>
                        <label>Guarantee:</label>
                        <div className='border' id='warranty'onClick={() => {
                            setWarranty((prev) => {
                                const newValue = prev === 1 ? 0 : 1;
                                switchToggle('warranty',newValue);
                                return newValue;
                            });
                        }}>
                            <div className='button'></div>
                        </div>
                    </div>
                    <div className='toggle'>
                        <label>new Car:</label>
                        <div className='border' id='condition'onClick={() => {
                            setCondition((prev) => {
                                const newValue = prev === 1 ? 0 : 1;
                                switchToggle('condition',newValue);
                                return newValue;
                            });
                        }}>
                            <div className='button'></div>
                        </div>
                    </div>
                    <div className='toggle'> 
                        <label>trade in:</label>
                        <div className='border' id='tradeIn'onClick={() => {
                            setTradeIn((prev) => {
                                const newValue = prev === 1 ? 0 : 1;
                                switchToggle('tradeIn',newValue);
                                return newValue;
                            });
                        }}>
                            <div className='button'></div>
                        </div>
                    </div>
                </div>
                <div className='img-des'>
                    <div className='images'>
                        <input className='input' type='file' multiple  onChange={handleImageChange}/>
                        <div className='selectedImages'>
                        {images.map((image, index) => {
                            //console.log('img: ',image);
                            <img key={index} src={image.name} alt={`preview-${index}`} />
                        })}
                        </div>
                    </div>
                    <div className='description'>
                        <textarea type='text' value={description} onChange={(e) => setDescription(e.target.value)}/>
                    </div> 
                </div> 
                <div className='CellerInfo'> 
                        <div className='name'>
                            <label>name:</label>
                            <input type='text' value={celler || ''} onChange={(e) => setCeller(e.target.value)}/>
                        </div>
                        <div className='phoneNum'>
                            <label>phone Number:</label>
                            <input type='tel' value={phoneNum || ''} onChange={(e) => setPhoneNum(e.target.value)}/>
                        </div>
                        <div className='address'>
                            <label>address:</label>
                            <input type='text' value={address || ''} onChange={(e) => setAddress(e.target.value)}/>
                        </div>
                        <div className='price'>
                            <label>price:</label>
                            <input type='number' value={price || ''} onChange={(e) => {
                            let inputValue = e.target.value;
                            if(inputValue[0]==='0'&&inputValue.length === 2)e.target.value = inputValue[1]
                            setPrice(Number(inputValue))}}/> 
                        </div>
                        <div>
                            <button onClick={() => AddNew()}>submit</button> 
                        </div>
                </div>  
                
            </div>          
        </div> 
    );
}

export default Cell; 


/***
 * {years && years.data && years.data.map((item, index) => (
                            <option key={index} value={item.year_id}>{item.year}</option>
                        ))}
 */