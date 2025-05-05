<<<<<<< HEAD
import React, { useState, useEffect } from "react";
=======
import React from "react";
>>>>>>> 45d090d0dae1ede3f649e76f90a1db8867123bc7
import ReactDOM from "react-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
// import MainHeader from './Components/MainHeader/MainHeader';
import "./App.css";
import AppRoutes from "./routes";

function App() {
<<<<<<< HEAD
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    fetch("/v1")
    .then((res) => res.json())
    .then((data) => setData(data));
  }, []);
=======
>>>>>>> 45d090d0dae1ede3f649e76f90a1db8867123bc7
  return (
    <>
      <Header />
      <AppRoutes />
      <Footer />
    </>
  );
}

export default App;
