import React, { useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import sunnyIcon from './icons/sunny.png';
import rainyIcon from './icons/rainy.png';
import cloudyIcon from './icons/cloudy.png';
import snowyIcon from './icons/snowy.png';
import windyIcon from './icons/windy.png';

import './App.css'; 

function App() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchedCity, setSearchedCity] = useState('');
  const [cityCoordinates, setCityCoordinates] = useState('');
  const apiKey = '717a9780e3b44e17787f4c4010876d12';

  const getWeatherData = async () => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`
      );
      setWeatherData(response.data);
      setSearchedCity(response.data.city.name);
      setCityCoordinates(
        `Lat: ${response.data.city.coord.lat}, Lon: ${response.data.city.coord.lon}`
      );
    } catch (error) {
      console.error('Error fetching weather data:', error);
      alert(`City "${city}" not found. Please enter a valid city.`);
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString();
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const getWeatherIcon = (weatherCondition) => {
    switch (weatherCondition) {
      case 'Clear':
        return sunnyIcon;
      case 'Rain':
        return rainyIcon;
      case 'Clouds':
        return cloudyIcon;
      case 'Snow':
        return snowyIcon;
      case 'Wind':
        return windyIcon;
      default:
        return null;
    }
  };
  const getWeatherCondition = (weatherCondition) => {
    switch (weatherCondition) {
      case 'Clear':
        return 'Sunny';
      case 'Rain':
        return 'Rainy';
      case 'Clouds':
        return 'Cloudy';
      case 'Snow':
        return 'Snowy';
      case 'Wind':
        return 'Windy';
      default:
        return 'Unknown';
    }
  };
  const WeatherHeadings = () => (
    <div className="weather-card headings">
      <div className="date-section">
        <h3>Date</h3>
      </div>
      <div className="weather-icon">
        <p>Condition</p>
      </div>
      <div className="card-section">
        <p>High Temp</p>
      </div>
      <div className="card-section">
        <p>Low Temp</p>
      </div>
      <div className="card-section">
        <p>Geo Coordinates</p>
      </div>
      <div className="card-section">
        <p>Humidity</p>
      </div>
      <div className="card-section">
        <p>Sunrise</p>
      </div>
      <div className="card-section">
        <p>Sunset</p>
      </div>
    </div>
  );

  const uniqueDays = [];
  const filteredWeatherData = weatherData
    ? weatherData.list.filter((item) => {
        const itemDate = new Date(item.dt_txt).toLocaleDateString();
        if (!uniqueDays.includes(itemDate) && uniqueDays.length < 5) {
          uniqueDays.push(itemDate);
          return true;
        }
        return false;
      })
    : [];

    return (
      <div>
        <div className="header">
          <div className="hl">
            <h2>Weather99</h2>
          </div>
          <div className="br">
            <button onClick={() => window.location.reload()} className="refresh-button">
              Refresh
            </button>
          </div>
        </div>
        <div className="App">
          <div className="search-bar">
            <div className="search-section">
              <input
                type="text"
                placeholder="Enter city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
              <DatePicker selected={selectedDate} onChange={handleDateChange} />
              <button onClick={getWeatherData}>Search</button>
            </div>
          </div>
          {searchedCity && (
            <div className="city-info">
              <h2>{searchedCity}</h2>
              <p>{cityCoordinates}</p>
            </div>
          )}
          {filteredWeatherData.length > 0 && (
            <div className="weather-cards">
              <WeatherHeadings />
              {filteredWeatherData.map((item) => (
                <div key={item.dt} className="weather-card">
                  <h3>{new Date(item.dt_txt).toLocaleDateString()}</h3>
                  <div className="date-section">
                    <div className="weather-icon">
                      <img src={getWeatherIcon(item.weather[0].main)} alt="Weather Icon" />
                      <p>{getWeatherCondition(item.weather[0].main)}</p>
                    </div>
                    <div className="card-section">
                      {item.main.temp_max} K
                    </div>
                    <div className="card-section">
                      {item.main.temp_min} K
                    </div>
                    <div className="card-section">
                      {weatherData.city.coord.lat}, {weatherData.city.coord.lon}
                    </div>
                    <div className="card-section">
                      {item.main.humidity}%
                    </div>
                    <div className="card-section">
                      {formatDate(weatherData.city.sunrise)}
                    </div>
                    <div className="card-section">
                      {formatDate(weatherData.city.sunset)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };
  
  export default App;