import React from 'react';
import "./Footer.css"
const Footer = () => {
    return(
        <footer className="footer-main">
            <div className="footer-content">
                <div className="footer-icons">
                    <a href="https://www.instagram.com/varundutia_/"><i className="fab fa-instagram icon"></i></a>
                    <a href="https://github.com/varundutia"><i className="fab fa-github icon"></i></a>
                    <a href="https://www.linkedin.com/in/varun-dutia-a735a2153/"><i className="fab fa-linkedin icon"></i></a>
                </div>
                &copy; {new Date().getFullYear()} | Varun Dutia | All Rights Reserved 
            </div>
        </footer>
    )
}
export default Footer;