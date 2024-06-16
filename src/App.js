import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css'
import { useEffect, useState } from 'react'
import './App.css'
import InputSearch from './components/InputSearch'

function App() {
  const apiKey = '6bcbcd09f2b4be0fcbedfacfe3112f38'
  const [mode, setMode] = useState(true)

  const handelMode = () => {
    setMode(() => !mode)
  }

  const [currenttCity, setCurrentCity] = useState('');
  const [dateTime, setDateTime] = useState(new Date());
  const [currentTemp, setCurrentTemp] = useState(0)

  
  const fetchCityName = async (latitude, longitude) => {
    const apiURL = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;
    try {
      const response = await axios.get(apiURL);
      setCurrentCity(response.data.name);
      setCurrentTemp(response.data.main.temp);
    } catch (error) {
      console.error('Error fetching city name:', error);
    }
  };

  const getCurrentPosition = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          fetchCityName(latitude, longitude);
        },
        error => {
          console.error('Error getting geolocation:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };
  const formatDateTime = date => {
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true,
    });
  };


  useEffect(() => {
    const updateDateTime = () => {
      setDateTime(new Date());
      setTimeout(updateDateTime, 1000);
    };

    updateDateTime();
    return () => clearTimeout(updateDateTime);
  }, []);


  useEffect(() => {
    getCurrentPosition();
  })

  return (
    <div className="col-12">
      <div className="wetherBg col-12">
        <h1 className="fw-bold text-center text-white py-3">Weather App</h1>
        <div className='mb-3'>
          <span className='fw-bold m-3 bg-white p-3 rounded-5'>Change Mode <button onClick={handelMode} className='btn btn-info text-white'>{mode ? 'White' : 'Dark'}</button></span>

        </div>
        <div className='text-end mb-5'>
          <span className=' shadow-lg'>
            <span className='fw-bold mb-1'>Current City: {currenttCity}</span>
            <br />
            <span>Current Temperature:{(currentTemp - 273.15).toFixed(2)}°C</span>
            <br />
            <span className='fw-bold'>Current Date and time: {formatDateTime(dateTime)}</span>
          </span>


        </div>
        <InputSearch mode={mode} />
      </div>

    </div>
  )
}

export default App
