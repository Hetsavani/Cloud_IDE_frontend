import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import Layout from "./Layouts/Layout";
import Login from "./Pages/Login";
import { BrowserRouter, Route, Routes} from "react-router-dom";
import CodeVortexDashboard from "./Pages/Dashboard";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <>
  <BrowserRouter>
    <Routes>
      <Route path = "/" element = {<CodeVortexDashboard/>}></Route>
      <Route path = "/login" element = {<Login/>}></Route>
      <Route path = "/dashboard" element = {<Layout/>}></Route>
    </Routes>
  </BrowserRouter>
  </>
);
