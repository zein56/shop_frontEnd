import axios from 'axios';
import './CSS/SelectedCar.css'
import { useEffect, useState } from 'react';

function SelectedCar({ handleTabClick }){
    const [carInfo,setCarInfo] = useState({});
    const [carImages,setCarImages] = useState([]);
    const [selectedImg,setSelectedImg] = useState('uploads/noImg.png');
    const [isCarCeller,setIsCarCeller] = useState(0);
    let carId = { carId:Number(localStorage.getItem('selected-car'))};
    useEffect(() => { 
        axios.post("http://localhost:4000/getCar",carId)
        .then((response) => {
            setCarInfo(response.data.carInfo); 
            setCarImages(response.data.carImages);
            setSelectedImg(`http://localhost:4000/uploads/${response.data.carImages[0]}`);
            //console.log(response.data);
            if (JSON.parse(localStorage.getItem('Login')).id ===  response.data.carInfo.cellerId)  {
                //console.log("aloooo ",JSON.parse(localStorage.getItem('Login')).id, " - ", response.data.carInfo.id )
                setIsCarCeller(1)
            }
        }).catch((error)=>{  
            console.error('!!!',error);
        });
        
    },[])
    const deleteCar = () => {
        let carId = { carId:Number(localStorage.getItem('selected-car'))};
        ///console.log(carId)
        axios
            .delete("http://localhost:4000/deleteCar",{data:carId})
            .then((response) => {
                window.location.reload();
            })
            .catch((error) => { 
                console.error(error.response.data.message || "Silme işlemi başarısız.");
            });
    };
    return(
        <>
        <div className='CarBody'>
            <div className='Car'>
                <div className='img-des'>
        <div className='images'>
                        <div className='selectedImg'>
                            <img key={-1} src={selectedImg} alt="Car" />
                        </div>
                            <div className='allImgs'>
                            {carImages.map((img,index) => {
                                    return(
                                        <img key={index} src={`http://localhost:4000/uploads/${img}`} alt="Car" onClick={()=>{
                                            setSelectedImg(`http://localhost:4000/uploads/${img}`);
                                        }} />
                                    )
                                })}
                            </div>
                    </div>
                    <div className='description'>
                        {carInfo.description}
                    </div>
                </div>
                <div className='info'>
                    <div className='keys'>
                        <div>make:</div>
                        <div>model:</div>
                        <div>year:</div>
                        <div>fuel:</div>
                        <div>gear:</div>
                        <div>color:</div>
                        <div>KM:</div>
                        <div>engine power:</div>
                        <div>new car:</div>
                        <div>guarantee:</div>
                        <div>trad in:</div>
                    </div>
                    <div className='values'>
                        <div>{carInfo.makeName}</div>
                        <div>{carInfo.modelName}</div>
                        <div>{carInfo.yearId}</div>
                        <div>{carInfo.fuelType}</div>
                        <div>{carInfo.gearType}</div>
                        <div>{carInfo.color}</div>
                        <div>{carInfo.KM}</div>
                        <div>{carInfo.enginePower}</div>
                        <div>{carInfo.condition}</div>
                        <div>{carInfo.warranty}</div>
                        <div>{carInfo.tradeIn}</div>
                    </div>
                </div> 
                <div className='Celler'>
                    
                {isCarCeller ? (
                    <div className='carSettings'>
                        <button className='edit' onClick={() =>{deleteCar()}} ><p>delete</p></button> 
                        <button className='delete' ><p>edit</p></button> 
                        <button onClick= {() => handleTabClick('Cars')}><p>X</p></button>
                    </div>    
                ) : ( 
                    <div className='carSettings'>
                        <button onClick= {() => handleTabClick('Cars')}><p>X</p></button>
                    </div>
                )}
                        <div className='CellerInfo'>
                            <h2>{carInfo.celler}</h2> 
                            <p>tel: {carInfo.phoneNumber}</p>
                            <button>Send email</button>
                        </div>
                </div>
            </div>
        </div>
        </>
    );
} 

export default SelectedCar;