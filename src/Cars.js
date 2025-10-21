import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CSS/Cars.css";

function Cars({ handleTabClick, search }) {
    const [Cars, setCars] = useState([]);
    const [searchedCars, setSearchedCars] = useState([]);
    const [carsimages, setCarsImages] = useState([]);

    const getCarImages = (id) => {
        let data = { carId: id };
        axios
            .post(`${process.env.REACT_APP_API_URL}/carImages`, data)
            .then((response) => {
                setCarsImages((prevImages) => [
                    ...prevImages,
                    ...response.data.images,
                ]);
            })
            .catch((error) => {
                console.error("!!!", error);
            });
    };

    const getAllCars = () => {
        axios
            .get(`${process.env.REACT_APP_API_URL}/getAllCars`)
            .then((response) => {
                setCars(response.data);
                response.data.forEach((car) => getCarImages(car.id));
            })
            .catch((error) => {
                console.error("!!!", error);
            });
    };
    const highlightText = (text, query) => {
        if (!query) return text;
    
        const parts = text.split(new RegExp(`(${query})`, "gi"));
        return parts.map((part, index) =>
            part.toLowerCase() === query.toLowerCase() ? (
                <span key={index} style={{ color: "yellow" }}>
                    {part}
                </span>
            ) : (
                part
            )
        );
    };
    
    const searchTo = () => {
        if (String(search).length > 0) {
            const searchUpper = String(search).toUpperCase();
            const filteredCars = Cars.filter(
                (car) =>
                    car.makeName.toUpperCase().includes(searchUpper) ||
                    car.modelName.toUpperCase().includes(searchUpper) ||
                    String(car.yearId).includes(searchUpper)
            );
            setSearchedCars(filteredCars);
        } else {
            setSearchedCars([]);
        }
    };

    useEffect(() => {
        getAllCars();
    }, []);

    useEffect(() => {
        searchTo();
    }, [search, Cars]);

    const renderCars = () => {
        const matchedCars = Cars.filter((car) =>
            searchedCars.some((searchedCar) => searchedCar.id === car.id)
        );
        const remainingCars = Cars.filter((car) =>
            !searchedCars.some((searchedCar) => searchedCar.id === car.id)
        );

        const allCars = [...matchedCars, ...remainingCars];

        return allCars.map((car) => {
            const carImg = carsimages.find((carImg) => carImg.carId === car.id);
            return (
                <div
                    className="car"
                    key={car.id}
                    onClick={() => {
                        localStorage.setItem("selected-car", car.id);
                        handleTabClick("SelectedCar");
                    }}
                >
                    {carImg ? (
                        <div className="image" key={carImg.id}>
                            <img
                                src={`${process.env.REACT_APP_API_URL}/uploads/${carImg.imageurl}`}
                                alt="Car"
                            />
                        </div>
                    ) : (
                        <div>Resim bulunamadı</div>
                    )}
                    <div className="name">
                        {highlightText(`${car.makeName} ${car.modelName} ${car.yearId}`, search)}
                    </div>
                </div>
            );
        });
    };

    return (
        <div className="CarsBody">
            <div className="fillterBar"> 
                <select
                    onChange={(e) => {
                        const sortKey = e.target.value;
                        const sortedCars = [...Cars].sort((a, b) => {
                            switch (sortKey) {
                                case "date":
                                    return new Date(a.date) - new Date(b.date);
                                case "date2":
                                    return new Date(b.date) - new Date(a.date);
                                case "name":
                                    return a.makeName.localeCompare(b.makeName);
                                case "name2":
                                    return b.makeName.localeCompare(a.makeName);
                                case "price":
                                    return a.price - b.price;
                                case "price2":
                                    return b.price - a.price;
                                default:
                                    return 0;
                            }
                        });
                        setCars(sortedCars);
                    }}
                >
                    <option value={"date"}>date: Newest-Oldest</option>
                    <option value={"date2"}>date: Oldest-Newest</option>
                    <option value={"name"}>name: A-Z</option>
                    <option value={"name2"}>name: Z-A</option>
                    <option value={"price"}>price: lowest-highest </option>
                    <option value={"price2"}>price: highest-lowest</option>
                </select>
            </div>

            <div className="cars">
                {Cars.length ? renderCars() : <div>loading...</div>}
            </div>
        </div>
    );
}

export default Cars;
