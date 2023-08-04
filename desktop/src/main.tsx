import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import {BrowserRouter, Routes, Route } from "react-router-dom";
import "./style.css";
import Timer from './components/Timer/Timer';

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <BrowserRouter>
      <Routes>

      </Routes>
      <App reset={false}/>
    </BrowserRouter>
);
