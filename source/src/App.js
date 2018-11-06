import React from 'react'
import { Provider } from 'react-redux'
import Home from './components/Home'
import configureStore from './firebase/store'
import './css/App.css'
const initialState = window.__INITIAL_STATE__ // set initial state here
const store = configureStore(initialState)

export default () => (
  <Provider store={store}>
    <Home />
  </Provider>
)
