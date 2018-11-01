import React, { Component } from 'react'
import './App.css'
import logo from './logo.svg';
import Navbar from './Navbar';
class Home extends Component {
  render() {
    return (
      <div className='App'>
        <div className='App-header'>
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Welcome
          </p>
          <Navbar />
        </div>
      </div>
    )
  }
}

export default Home
