import React, { useEffect } from "react";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import "./App.css";
import AppRoutes from "./routes";

function App() {

  useEffect(() => {
    fetch("http://localhost:9000/v1")
      .then((res) => res.json())
      .then((data) => {
        console.log("Backend response:", data);
      })
      .catch((err) => console.error("Fetch error:", err));
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
