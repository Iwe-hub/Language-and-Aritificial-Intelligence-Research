<<<<<<< HEAD
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import About from './pages/About/About';
// import Sustainability from './pages/Sustainability/Sustainability';
// import Fleet from './pages/Fleet/Fleet';
// import Contact from './pages/Contact/Contact';
// import Storage from './pages/Storage/Storage';



function AppRoutes() {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/About" element={<About />} />
          {/* <Route path="/Sustainability" element={<Sustainability />} />
          <Route path="/Fleet" element={<Fleet />} />
          <Route path="/Contact" element={<Contact />} />
          <Route path="/Storage" element={<Storage />} /> */}
        </Routes>
      </Router>
    );
  }
  
  export default AppRoutes;
=======
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import About from './pages/About/About';
// import Sustainability from './pages/Sustainability/Sustainability';
// import Fleet from './pages/Fleet/Fleet';
// import Contact from './pages/Contact/Contact';
// import Storage from './pages/Storage/Storage';



function AppRoutes() {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/About" element={<About />} />
          {/* <Route path="/Sustainability" element={<Sustainability />} />
          <Route path="/Fleet" element={<Fleet />} />
          <Route path="/Contact" element={<Contact />} />
          <Route path="/Storage" element={<Storage />} /> */}
        </Routes>
      </Router>
    );
  }
  
  export default AppRoutes;
>>>>>>> 45d090d0dae1ede3f649e76f90a1db8867123bc7
  