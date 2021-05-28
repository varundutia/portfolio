import React from 'react';
import "./About.css";
import Typical from 'react-typical';

const About = () => {
    return (
        <div className="about-main">
            <h1>Varun Dutia</h1>
            <Typical
                steps={['A', 1000, 'A Developer!', 500]}
                loop={1}
                wrapper="h1"
            />
        </div>
    )
}
export default About;