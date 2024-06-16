import React, { useState } from 'react';
import axios from 'axios';

const InputSearch = ({mode}) => {
    const [inputCity, setInputCity] = useState('');
    const [cityList, setCityList] = useState([]);
    const [weatherData, setWeatherData] = useState([]);
  
    const apiKey = '6bcbcd09f2b4be0fcbedfacfe3112f38'

    const handleChangeInput = e => {
        setInputCity(e.target.value);
    };

    const handleKeyDown = e => {
        if (e.key === 'Enter') {
            setCityList(prevList => [...new Set([...prevList, inputCity])]);
            setInputCity(''); // Clear the input field after adding to the list
        }
    };

    const handleRemoveItem = index => {
        setCityList(prevList => prevList.filter((_, i) => i !== index));
    };

    const getWeatherDetails = async () => {
        const promises = cityList.map(city => {
            const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
            return axios.get(apiURL)
                .then(res => res.data)
                .catch(err => {
                    console.error(`Error fetching weather for ${city}:`, err);
                    return null;
                });
        });

        const results = await Promise.all(promises);
        setWeatherData(results.filter(data => data !== null));
    };

    return (
        <div>
            <div className='col-12 row gap-1 col-lg-6 m-auto'>
                <input
                    type="search"
                    className='p-3 rounded-3 col-9 m-auto'
                    placeholder='enter your city name and press enter'
                    value={inputCity}
                    onChange={handleChangeInput}
                    onKeyDown={handleKeyDown}
                />
                <button className='col-2 py-0 m-auto btn btn-success' onClick={getWeatherDetails}>Get</button>

            </div>

            <ul className='bg-white m-3 py-3'>
                {cityList.map((city, index) => (
                    <li className='btn btn-outline-dark m-1' key={index} onClick={() => handleRemoveItem(index)}>
                        {city} x
                    </li>
                ))}
            </ul>
            <div className='row col-12 gap-3'>
                {weatherData.map((data, index) => (
                    <div  className={`col-11 col-md-5 col-lg-3 m-auto border rounded-5 p-3 text-nowrap shadow-lg mb-5  ${mode?'text-white':'text-dark'} ${mode?'bg-dark':'bg-white'}`} key={index}>
                        <img
                            className="weathorIcon m-auto col-6"
                            alt="weather-icon"
                            src="https://i.pinimg.com/originals/77/0b/80/770b805d5c99c7931366c2e84e88f251.png"
                        />
                        <h3 className='text-center'>{data.name}</h3>
                        <hr />
                        <p>{data.weather[0].description}</p>
                        <hr />
                        <p>Temperature: {(data?.main?.temp - 273.15).toFixed(2)}°C</p>
                        <hr />
                        <p >
                            Humidity: {data?.main?.humidity}%
                        </p>
                        <hr />
                        <p>
                            Pressure: {data?.main?.pressure} hPa
                        </p>
                        <hr />
                        <p>
                            Cloud Cover: {data?.clouds?.all}%
                        </p>
                        <hr />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default InputSearch;
