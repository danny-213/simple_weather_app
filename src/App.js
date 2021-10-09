// USER STORY
// the site should be responsive to viewport size
// from user input, show 5 top match options for user to select from
// retrieve location's weather info from an api with city name
// report if not found 
// show location name, date, tempt, weather, change background 

import { useState } from 'react';

function App() {
  const api = {
    key:"9168607ecb0ef359fec85f8482b821c5",
    baseUrl:"https://api.openweathermap.org/data/2.5/weather?"
  }

  //getting cityname from user input
  const [cityname,setcityname] = useState("");
  function handleInput (e) {
    setcityname(e.target.value)
  }

  
  const reqUrl = `${api.baseUrl}q=${cityname}&units=metric&appid=${api.key}`;

  
  // on submit, retrieve temp, weather description to state
  // render on the screen 
  const [currentTemp,setTemp] = useState();
  const [currentDescription, setDescription] = useState ("");
  const [currentLocation, setLocation] = useState("");
  const [currentDate, setDate] = useState("");




  function handleSubmit (e) {
    e.preventDefault();
    if (cityname !== "") {
      
      getWeather(reqUrl);
    }
  }

  const getWeather = function (url) {
    
    fetch(url)
    .then(function(response) {
      response.json()
      .then( function (json) {
        
        setTemp(Math.round(json.main.temp));
        setDescription(json.weather[0].description);
        setLocation(`${json.name}, ${json.sys.country}` );
        
        // CACULATE DATE, TIME OF SEARCHED LOCATION by
        // local time + timezone offset from UTC in milisecond 
        // (for example GMT +7 (SGN) is +25.200.000 milisecond from UTC)
        // then add timezone offset of the destination
        // (for example GMT -5 (Chicago) is -18.000.000 milisecond from UTC)
        
        const localTime = new Date().getTime(); 
        // obtain local UTC offset and convert to msec
        //getTimezoneOffset() return the offSet in minutes
        const localOffset = new Date().getTimezoneOffset() * 60000;
        const utc = localTime + localOffset;
        const offset = json.timezone*1000;  

        const d = new Date((utc) + offset);

        //convert to custom format date, time (AM/PM)
        const date = d.toString().slice(0,15);
        const time = d.toLocaleString(
          'en-US', 
          { hour: 'numeric',
          minute: 'numeric', 
          hour12: true });


        setDate(`${date}, ${time}`);
        setcityname("");
        
      }).catch((e) => {
        setLocation("Can't find this city name");
      });})
  };


  //change the background according to temparature
  // above 15 Deg Celc. use warm background
  // otherwise cold background
  var bgImage;
  if (currentTemp < 15) {
    bgImage = "cold";
  } else bgImage = "warm";
  
  return (
    
    <div className = {"background " + bgImage} >
      <form className="search-pane" onSubmit={handleSubmit}>
        <input 
        type="text" 
        placeholder="Search city name ..."
        onChange={handleInput}
        value={cityname}
        ></input>
      </form>
      <main>
        <h1 className="location">{currentLocation}</h1>
        <h2 className="date">{currentDate}</h2>
        <div className="tempt">{currentTemp} °C</div>
        <div className="weather-type">{currentDescription}</div>

      </main>
    </div>
    

  );
}

export default App;
