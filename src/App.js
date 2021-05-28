import React from 'react';
import './App.css';
import About from './Components/About/About';
import Footer from './Components/Footer/Footer';
import Navbar from "./Components/Navbar/Navbar";
import Skills from './Components/Skills/Skills';
import Form from "./Components/Forms/Form";
import Repositories from "./Components/Repositories/Repositories";
import Industry from './Components/Industry/Industry';
function App() {
  return (
    <div className="App">
          <Navbar/>
          <About/>
          <Skills/>
          <Repositories/>
          <Industry/>
          <Form/>
          <Footer/>
    </div>
  );
}

export default App;
