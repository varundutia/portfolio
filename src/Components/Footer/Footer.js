import React from 'react';
import "./Footer.css"
const Footer = () => {
    return (
        <section id="contact">
            <footer className="footer-main">
                <div className="footer-content">
                    <h2>Contact Me</h2>
                8220618104 | <a href="mailto:varundutia.h@gmail.com">varundutia.h@gmail.com</a>
                    <div className="footer-icons">
                        <a href="https://www.instagram.com/varundutia_/"><i className="fab fa-instagram icon"></i></a>
                        <a href="https://github.com/varundutia"><i className="fab fa-github icon"></i></a>
                        <a href="https://www.linkedin.com/in/varun-dutia-a735a2153/"><i className="fab fa-linkedin icon"></i></a>
                    </div>
                &copy; {new Date().getFullYear()} | Varun Dutia | All Rights Reserved
            </div>
            </footer>
        </section>
    )
}
export default Footer;