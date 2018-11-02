import React, { Component } from 'react'
import './App.css'
import Navbar from './Navbar';
import OnlineList from './OnlineList';
class Home extends Component {
  render() {
    return (
      <div className="container clearfix">
        <Navbar />
        <OnlineList />
      </div>
    )
  }
}

export default Home
