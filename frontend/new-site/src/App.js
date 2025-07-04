import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import "./App.css";
import AppRoutes from "./routes";

function App() {
  useEffect(() => {
  <link rel="icon" type="image/x-icon" href="favicon.ico"></link>
    // Use relative path for production, full URL for development
    const apiUrl = process.env.NODE_ENV === 'development' 
      ? 'http://localhost:9000/v1' 
      : '/v1';

    fetch(apiUrl)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        console.log("Backend connection successful:", data);
      })
      .catch((err) => {
        console.error("Backend connection failed:", err.message);
      });
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
