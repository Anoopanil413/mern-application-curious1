import React from 'react'
import ReactDOM from "react-dom"
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './appStore/store.js'




ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>

        <App />

      </BrowserRouter>
    </Provider>

  </React.StrictMode>
  ,
  document.getElementById('root'),
)