import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import Signup from './Signup';
import Notes from './Notes';
import CrearNota from './CrearNota';
import reportWebVitals from './reportWebVitals';
import './styles/global.css';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/iniciar_sesion" element={<Login />} />
        <Route exact path="/registrarse" element={<Signup />} />
        <Route exact path="/notas/:userId" element={<Notes />} />
        <Route exact path="/crear_nota" element={<CrearNota />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
