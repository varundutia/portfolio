import React from 'react';
import './App.css';
import About from './Components/About/About';
import Footer from './Components/Footer/Footer';
import Navbar from "./Components/Navbar/Navbar";
import Skills from './Components/Skills/Skills';
import Form from "./Components/Forms/Form";
function App() {
  return (
    <div className="App">
          <Navbar/>
          <About/>
          <Skills/>
          {/* <Repositories/> */}
          <Form/>
          <Footer/>
    </div>
  );
}

export default App;
