import React from 'react';
import "./About.css";
import Typical from 'react-typical';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';

const About = () => {
    return (
        <>
            <div className="about-container">
                <div className="about-main">
                    <div className="code-background"></div>
                    <div className="about-heading">
                        <span className='hello'>Hello 👋 </span>
                        <span className='hero-heading'>I am <span className="name">Varun Dutia</span></span>
                        <Typical
                            steps={[
                                'Senior Software Developer', 2000,
                                'Frontend Developer', 2000,
                                'Backend Developer', 2000,
                                'App Developer', 2000,
                                'Full Stack Engineer', 2000,
                                'Cloud & DevOps Learner', 2000
                            ]}
                            loop={Infinity}
                            wrapper="h2"
                            className="hero-typical"
                        />
                    </div>

                    <div className="socials">
                        <a href="https://github.com/varundutia" target="_blank" rel="noreferrer">
                            <GitHubIcon fontSize="large" className="icon" />
                        </a>
                        <a href="https://www.linkedin.com/in/varun-dutia" target="_blank" rel="noreferrer">
                            <LinkedInIcon fontSize="large" className="icon" />
                        </a>
                        <a href="mailto:varundutia.hameer@gmail.com" target="_blank" rel="noreferrer">
                            <EmailIcon fontSize="large" className="icon" />
                        </a>
                    </div>
                </div>
            </div>
        </>
    )
}
export default About;