import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
// import MainHeader from './Components/MainHeader/MainHeader';
import "./App.css";
import AppRoutes from "./routes";

function App() {
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    fetch("/v1")
    .then((res) => res.json())
    .then((data) => setData(data));
  }, []);
  return (
    <>
      <Header />
      <AppRoutes />
      <Footer />
    </>
  );
}

export default App;
