import React, { Component } from 'react';
import axios from 'axios';

import { weatherAPI, scale } from './utilities/config.js'
import Loader from './components/Loader';

class App extends Component {
  constructor() {
    super();

    this.state = {
      city: '',
      country: '',
      temp: null,
      weather: {},
      currentScale: scale.c,
    }

    this.getWeatherData = this.getWeatherData.bind(this);
    this.convert = this.convert.bind(this);
  }

  componentDidMount() {
    this.getWeatherData()
  }

  convert() {
    const { currentScale, temp } = this.state;
    this.setState({
      temp: currentScale === scale.c
        ? temp * 9 / 5 + 32
        : (temp - 32) * 5 / 9,
      currentScale: currentScale === scale.c
        ? scale.f
        : scale.c,
    })
  }

  getWeatherData() {
    navigator.geolocation.getCurrentPosition(
      pos =>
        axios.get(weatherAPI(pos.coords.longitude, pos.coords.latitude))
        .then(response => {
          this.setState({
            city: response.data.name,
            country: response.data.sys.country,
            temp: response.data.main.temp,
            weather: response.data.weather,
          })
        })
        .catch(error => console.log(error))
    )
  }

  render() {
    const { city, country, temp, weather, currentScale } = this.state;
    return (
      <div className="App">
        {this.state.temp
          ? <div>
            <div>{city}, {country}</div>
            <div>
              {parseInt(temp)} {currentScale}
            </div>
            <button onClick={this.convert}>
              convert
            </button>
            <img src={weather[0].icon} />
          </div>
          : <Loader />}
      </div>
    );
  }
}

export default App;
